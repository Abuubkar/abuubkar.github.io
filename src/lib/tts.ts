import { track } from "@/lib/track";

/**
 * ============================================================
 *  VoiceLab engine — the ONE module that touches kokoro-js.
 *  UI reads state via useTts() and calls speak()/stop()/setVoice().
 *  kokoro-js (and its ~92 MB model) is dynamic-imported on the
 *  first speak() so the initial bundle and page load carry zero
 *  extra bytes. Spec: github.com/Abuubkar/abuubkar.github.io/issues/1
 * ============================================================
 */

/** Compute paths, in order of preference. v1 ships "wasm" only: the model's
 *  WebGPU path needs the fp32 weights (325 MB vs q8's 92 MB — hostile to
 *  visitors) per the kokoro-js README, so WebGPU stays a follow-up switch
 *  inside this module. "web-speech" is the honest non-AI fallback. */
export type TtsTier = "webgpu" | "wasm" | "web-speech";

export type TtsPhase =
  | "idle" // nothing loaded; first click starts the download
  | "loading" // model downloading/compiling (see `progress`)
  | "ready" // model in memory, waiting for input
  | "synthesizing" // neural inference running
  | "speaking" // audio playing
  | "error"; // unrecoverable (not even web-speech available)

export type TtsState = {
  phase: TtsPhase;
  /** 0–100, meaningful while phase === "loading". */
  progress: number;
  tier: TtsTier | null;
  voice: VoiceId;
  error: TtsError | null;
  /** Last neural run: total audio produced + how fast the first sound came. */
  timing: { audioSecs: number; firstSoundSecs: number } | null;
};

// Version is pinned as far as the stack allows: kokoro-js is exact-pinned in
// package.json and the model id names the v1.0 ONNX export. (kokoro-js does
// not forward a HF `revision`, so a re-upload under the same repo id is the
// residual risk.)
export const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
export const MODEL_LABEL = "kokoro-82M";
export const MODEL_VERSION = "v1.0";
export const MODEL_SIZE_MB = 92; // q8 weights — shown in the UI before download
export const MAX_TEXT_LENGTH = 300; // keep a phone's CPU out of trouble

/** Machine-readable error codes; the UI owns the user-facing copy. */
export type TtsError = "load-failed" | "synthesis-failed";

/** Curated subset of the model's voices (the full set is mostly low-grade). */
export const VOICES = [
  { id: "af_heart", label: "Heart — US female" },
  { id: "af_bella", label: "Bella — US female" },
  { id: "af_nicole", label: "Nicole — US female" },
  { id: "am_michael", label: "Michael — US male" },
  { id: "bf_emma", label: "Emma — UK female" },
] as const;
export type VoiceId = (typeof VOICES)[number]["id"];

const INITIAL_STATE: TtsState = {
  phase: "idle",
  progress: 0,
  tier: null,
  voice: VOICES[0].id,
  error: null,
  timing: null,
};

let state: TtsState = INITIAL_STATE;
const listeners = new Set<() => void>();

function setState(patch: Partial<TtsState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState(): TtsState {
  return state;
}

/** Stable reference for useSyncExternalStore's server snapshot. */
export function getInitialState(): TtsState {
  return INITIAL_STATE;
}

/* ------------------------------------------------------------------ */

type Kokoro = Awaited<
  ReturnType<(typeof import("kokoro-js"))["KokoroTTS"]["from_pretrained"]>
>;

let modelPromise: Promise<Kokoro | null> | null = null;
let audioCtx: AudioContext | null = null;
let activeSources: AudioBufferSourceNode[] = [];
/** Bumped on every speak()/stop() so stale async callbacks can bail out. */
let run = 0;

/** Created in the synchronous part of a click so the autoplay gesture
 *  still applies; resumed on every speak in case the tab suspended it. */
function ensureAudioContext(): AudioContext {
  audioCtx ??= new AudioContext({ sampleRate: 24000 });
  void audioCtx.resume();
  return audioCtx;
}

async function loadModel(): Promise<Kokoro | null> {
  track("tts-load-start");
  setState({ phase: "loading", progress: 0 });
  try {
    const { KokoroTTS } = await import("kokoro-js");
    const model = await KokoroTTS.from_pretrained(MODEL_ID, {
      dtype: "q8",
      device: "wasm",
      progress_callback: (info) => {
        // Only the .onnx weights are worth a progress bar; the tokenizer
        // files are a few KB and would make the bar jump around.
        if (
          info.status === "progress" &&
          info.file.endsWith(".onnx") &&
          state.phase === "loading"
        ) {
          setState({ progress: Math.round(info.progress) });
        }
      },
    });
    setState({ tier: "wasm", progress: 100, error: null });
    track("tts-load-done");
    return model;
  } catch (err) {
    track("tts-load-error");
    // Don't cache the failure — the next click retries the download instead
    // of foreclosing the neural path for the rest of the page's life.
    modelPromise = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Honest fallback: the browser's own voice, surfaced in the UI.
      // getVoices() also primes Chrome's async voice list so the local-voice
      // preference has something to pick from by the time we speak.
      window.speechSynthesis.getVoices();
      setState({ tier: "web-speech", error: "load-failed" });
      return null;
    }
    setState({ phase: "error", tier: null, error: "load-failed" });
    throw err;
  }
}

function pickLocalWebSpeechVoice(): SpeechSynthesisVoice | null {
  // Prefer a local English voice so no text leaves the device even here.
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.localService && v.lang.startsWith("en")) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null
  );
}

function speakWithWebSpeech(text: string, myRun: number) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickLocalWebSpeechVoice();
  if (voice) utterance.voice = voice;
  utterance.onend = utterance.onerror = () => {
    if (run === myRun) setState({ phase: "ready" });
  };
  setState({ phase: "speaking", timing: null });
  track("tts-speak-webspeech");
  window.speechSynthesis.speak(utterance);
}

function stopPlayback() {
  activeSources.forEach((src) => {
    try {
      src.stop();
    } catch {
      /* already stopped */
    }
  });
  activeSources = [];
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function setVoice(voice: VoiceId) {
  setState({ voice });
}

export function stop() {
  run++;
  stopPlayback();
  track("tts-stop");
  setState({ phase: modelPromise ? "ready" : "idle" });
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export async function speak(rawText: string) {
  const text = rawText.trim().slice(0, MAX_TEXT_LENGTH);
  if (!text) return;
  if (state.phase === "loading" || state.phase === "synthesizing") return;

  const myRun = ++run;
  stopPlayback();
  // Must happen before any await, while the click gesture is still live.
  const ctx = ensureAudioContext();

  modelPromise ??= loadModel();
  let model: Kokoro | null;
  try {
    model = await modelPromise;
  } catch {
    return; // phase already "error"
  }
  if (run !== myRun) return; // user clicked stop / re-spoke mid-load

  if (model === null) {
    speakWithWebSpeech(text, myRun);
    return;
  }

  setState({ phase: "synthesizing", error: null });
  try {
    const t0 = performance.now();
    // Stream sentence by sentence: on single-threaded WASM, generating the
    // whole clip up front means many seconds of silence — this way the first
    // sentence plays while the rest is still synthesizing. First use of a
    // voice also fetches its ~500 KB embedding (Cache API keeps it after).
    const { TextSplitterStream } = await import("kokoro-js");
    const splitter = new TextSplitterStream();
    splitter.push(text);
    splitter.close();

    let nextStart = 0;
    let totalSecs = 0;
    let firstSoundSecs = 0;
    for await (const { audio } of model.stream(splitter, {
      voice: state.voice,
    })) {
      if (run !== myRun) return;
      const buffer = ctx.createBuffer(
        1,
        audio.audio.length,
        audio.sampling_rate,
      );
      buffer.copyToChannel(new Float32Array(audio.audio), 0);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      const startAt = Math.max(nextStart, ctx.currentTime);
      source.start(startAt);
      nextStart = startAt + buffer.duration;
      totalSecs += buffer.duration;
      activeSources.push(source);
      if (!firstSoundSecs) {
        firstSoundSecs = (performance.now() - t0) / 1000;
        setState({ phase: "speaking" });
        track(`tts-speak-${state.tier}`);
      }
    }
    if (run !== myRun) return;

    setState({
      timing: {
        audioSecs: round1(totalSecs),
        firstSoundSecs: round1(firstSoundSecs),
      },
    });
    // The stream is done generating; flip to ready once playback drains.
    const remainingMs = Math.max(0, (nextStart - ctx.currentTime) * 1000);
    window.setTimeout(() => {
      if (run === myRun) setState({ phase: "ready" });
    }, remainingMs + 100);
  } catch {
    if (run !== myRun) return;
    setState({ phase: "ready", error: "synthesis-failed" });
  }
}
