/**
 * Voice Lab engine — entry point.
 *
 * Orchestration only: it decides *what* happens in what order (load, fall
 * back, synthesize, play, report) and delegates every *how* to a private
 * module. Deliberately free of React so it can be exercised without one.
 *
 * Spec: github.com/Abuubkar/abuubkar.github.io/issues/1
 */

import { track } from "@/lib/track";
import { getState, setState } from "./lib/store";
import { loadModel, synthesize, type KokoroModel } from "./lib/model";
import { createPlayer, type Player } from "./lib/playback";
import * as webSpeech from "./lib/web-speech";
import { MAX_TEXT_LENGTH, type VoiceId } from "./lib/voices";

export { subscribe, getState, getInitialState } from "./lib/store";
export type { TtsState, TtsPhase, TtsTier, TtsError } from "./lib/store";
export {
  VOICES,
  MODEL_LABEL,
  MODEL_VERSION,
  MODEL_SIZE_MB,
  MAX_TEXT_LENGTH,
} from "./lib/voices";
export type { VoiceId } from "./lib/voices";

/** Resolves to null when the model failed and web-speech took over. */
let modelPromise: Promise<KokoroModel | null> | null = null;
let player: Player | null = null;
/** Bumped on every speak()/stop() so stale async callbacks can bail out. */
let run = 0;

const round1 = (n: number) => Math.round(n * 10) / 10;

async function ensureModel(): Promise<KokoroModel | null> {
  track("tts-load-start");
  setState({ phase: "loading", progress: 0 });
  try {
    const model = await loadModel((percent) => {
      if (getState().phase === "loading") setState({ progress: percent });
    });
    setState({ tier: "wasm", progress: 100, error: null });
    track("tts-load-done");
    return model;
  } catch (err) {
    track("tts-load-error");
    // Don't cache the failure — the next click retries the download instead
    // of foreclosing the neural path for the rest of the page's life.
    modelPromise = null;
    if (webSpeech.isAvailable()) {
      webSpeech.primeVoices();
      setState({ tier: "web-speech", error: "load-failed" });
      return null;
    }
    setState({ phase: "error", tier: null, error: "load-failed" });
    throw err;
  }
}

function cancelCurrent() {
  player?.stop();
  player = null;
  webSpeech.cancel();
}

export function setVoice(voice: VoiceId) {
  setState({ voice });
}

export function stop() {
  run++;
  cancelCurrent();
  track("tts-stop");
  setState({ phase: modelPromise ? "ready" : "idle" });
}

export async function speak(rawText: string) {
  const text = rawText.trim().slice(0, MAX_TEXT_LENGTH);
  if (!text) return;
  const { phase } = getState();
  if (phase === "loading" || phase === "synthesizing") return;

  const myRun = ++run;
  cancelCurrent();

  // Measured from the start of synthesis, so the number means "how long until
  // it spoke", not "how long until the model finished downloading".
  let startedAt = performance.now();
  let firstSoundSecs = 0;

  // Built synchronously: creating the audio context inside the click is what
  // satisfies the browser's autoplay policy.
  const active = createPlayer({
    onFirstSound: () => {
      if (run !== myRun) return;
      firstSoundSecs = (performance.now() - startedAt) / 1000;
      setState({ phase: "speaking" });
      track(`tts-speak-${getState().tier}`);
    },
  });
  player = active;

  modelPromise ??= ensureModel();
  let model: KokoroModel | null;
  try {
    model = await modelPromise;
  } catch {
    return; // phase is already "error"
  }
  if (run !== myRun) return; // stopped, or spoken again, mid-load

  if (model === null) {
    setState({ phase: "speaking", timing: null });
    track("tts-speak-webspeech");
    webSpeech.speak(text, () => {
      if (run === myRun) setState({ phase: "ready" });
    });
    return;
  }

  setState({ phase: "synthesizing", error: null });
  try {
    startedAt = performance.now();
    for await (const chunk of synthesize(model, text, getState().voice)) {
      if (run !== myRun) return;
      active.enqueue(chunk);
    }
    if (run !== myRun) return;

    setState({
      timing: {
        audioSecs: round1(active.totalSecs),
        firstSoundSecs: round1(firstSoundSecs),
      },
    });
    await active.finish();
    if (run === myRun) setState({ phase: "ready" });
  } catch {
    if (run !== myRun) return;
    setState({ phase: "ready", error: "synthesis-failed" });
  }
}
