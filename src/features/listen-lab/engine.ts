/**
 * Listen Lab engine — entry point.
 *
 * Orchestration only: it decides *what* happens in what order (load,
 * capture, resample, transcribe, report) and delegates every *how* to a
 * private module. Deliberately free of React so it can be exercised
 * without one.
 *
 * Spec: github.com/Abuubkar/abuubkar.github.io/issues/4
 *
 * Analytics events, as a funnel:
 *
 *   stt-load-start   → stt-load-done | stt-load-error
 *   stt-mic-request  → stt-mic-granted | stt-mic-denied
 *   stt-record-start → stt-transcribe-start → stt-transcribe-done
 *                                           | stt-transcribe-error
 *   stt-stop-<phase>               (where someone gave up)
 *
 * stt-transcribe-done means text reached the screen, never that a request
 * was made, so the drop between start and done is the wait people abandon.
 */

import { track } from "@/lib/track";
import { getState, setState } from "./state/store";
import { loadModel, transcribe } from "./engine/model";
import { chunksToBuffer, toMono16k } from "./engine/resample";
import {
  RecorderError,
  startRecording,
  type Captured,
  type RecorderHandle,
} from "./engine/recorder";
import { wasmThreadCount } from "@/lib/wasm-threads";

export { subscribe, getState, getInitialState } from "./state/store";
export type { SttState, SttPhase, SttError } from "./state/store";
export {
  MODEL_LABEL,
  MODEL_VERSION,
  MODEL_LICENSE,
  MODEL_DTYPE,
  MODEL_SIZE_MB,
  MAX_CLIP_SECS,
} from "./data/model";

/** Resolves once the weights are in memory. Null until the first attempt. */
let modelPromise: Promise<void> | null = null;
/** Bumped on every run so stale async work can bail out. */
let run = 0;

const round2 = (n: number) => Math.round(n * 100) / 100;

async function ensureModel(): Promise<void> {
  track("stt-load-start");
  // Clear any previous failure: this is a fresh attempt, including the
  // retry offered after an error.
  setState({ phase: "loading", progress: 0, error: null });
  try {
    await loadModel((percent) => {
      if (getState().phase === "loading") setState({ progress: percent });
    }, wasmThreadCount());
    setState({ loaded: true, progress: 100, error: null });
    track("stt-load-done");
  } catch (err) {
    track("stt-load-error");
    // Don't cache the failure — the next press retries the download rather
    // than foreclosing the experiment for the life of the page.
    modelPromise = null;
    setState({ phase: "error", error: "load-failed" });
    throw err;
  }
}

/** Downloads the model if it isn't already here. Safe to call repeatedly. */
export async function prepare(): Promise<boolean> {
  const myRun = run;
  modelPromise ??= ensureModel();
  try {
    await modelPromise;
  } catch {
    return false; // phase is already "error"
  }
  return run === myRun;
}

/**
 * Runs one clip through the model and publishes the transcript.
 *
 * Split out from the capture side on purpose: by the time audio reaches
 * here it is just samples, and where they came from stops mattering.
 */
/**
 * Transcribes what has been said so far, over and over, while the
 * microphone is open.
 *
 * Each pass reads the whole clip from the beginning and replaces the text
 * outright. That sounds wasteful next to a rolling window, and it is — but
 * it is also the reason there is nothing to reconcile: no overlapping
 * segments to stitch, no duplicated words at the seams, no drifting
 * timestamps. The transcript is always one model's opinion of one
 * recording.
 *
 * It only works because the model is cheap and scales with duration.
 * Measured: 0.33s for a 6.8s clip, 1.08s for 17.9s. Passes run back to
 * back rather than on a timer, so early text arrives in a third of a
 * second and the gap stretches as the clip grows — which is the right way
 * round, because by then there is already text on screen.
 *
 * Whisper could not do this. Its encoder runs the full 30-second window
 * every time, so the first pass would cost as much as the last.
 */
async function streamWhileOpen(myRun: number): Promise<void> {
  while (run === myRun && recorder) {
    const captured: Captured = recorder.snapshot();
    const samples = captured.chunks.reduce((n, c) => n + c.length, 0);
    // Nothing worth a pass yet; wait for the worklet to deliver some.
    if (samples / captured.sampleRate < 0.4) {
      await new Promise((r) => setTimeout(r, 150));
      continue;
    }
    try {
      const buffer = chunksToBuffer(captured.chunks, captured.sampleRate);
      const audio = await toMono16k(buffer);
      if (run !== myRun || !recorder) return;
      const result = await transcribe(audio, buffer.duration);
      if (run !== myRun || !recorder) return;
      if (result.text) setState({ transcript: result.text, partial: true });
    } catch {
      // A dropped pass costs nothing: the next one covers the same audio.
      return;
    }
  }
}

async function runClip(buffer: AudioBuffer): Promise<void> {
  const myRun = run;
  setState({ phase: "transcribing", error: null });
  track("stt-transcribe-start");
  try {
    const samples = await toMono16k(buffer);
    if (run !== myRun) return;

    const result = await transcribe(samples, buffer.duration);
    if (run !== myRun) return;

    setState({
      phase: "ready",
      transcript: result.text,
      partial: false,
      timing: {
        clipSecs: round2(result.clipSecs),
        workSecs: round2(result.workSecs),
      },
    });
    track("stt-transcribe-done");
  } catch {
    if (run !== myRun) return;
    track("stt-transcribe-error");
    setState({ phase: "ready", error: "transcribe-failed" });
  }
}

/** The open microphone, while one is open. */
let recorder: RecorderHandle | null = null;

const FAILURE_TO_ERROR = {
  denied: "mic-denied",
  unavailable: "mic-unavailable",
  insecure: "mic-insecure",
} as const;

/**
 * Downloads the model if needed, then opens the microphone.
 *
 * In that order deliberately: a visitor who grants the microphone and then
 * waits ninety seconds for a download has been recorded for ninety seconds
 * of nothing. The permission prompt comes when there is something ready to
 * use it.
 */
export async function startListening(): Promise<void> {
  const myRun = ++run;
  if (!(await prepare()) || run !== myRun) return;

  track("stt-mic-request");
  try {
    recorder = await startRecording({
      onLevel: (level) => {
        if (run === myRun) setState({ level });
      },
      onElapsed: (seconds) => {
        if (run === myRun) setState({ recordedSecs: Math.round(seconds * 10) / 10 });
      },
      // Whisper would silently drop everything past its window, so the clip
      // is closed here and the visitor keeps what they said.
      onLimit: () => {
        if (run === myRun) void stopListening();
      },
    });
  } catch (err) {
    track("stt-mic-denied");
    const reason = err instanceof RecorderError ? err.reason : "unavailable";
    setState({ phase: "ready", error: FAILURE_TO_ERROR[reason], level: 0 });
    return;
  }

  if (run !== myRun) return void recorder.stop();
  track("stt-mic-granted");
  track("stt-record-start");
  setState({
    phase: "recording",
    error: null,
    level: 0,
    recordedSecs: 0,
    transcript: "",
    partial: false,
  });
  void streamWhileOpen(myRun);
}

/** Closes the microphone and transcribes what was said. */
export async function stopListening(): Promise<void> {
  const active = recorder;
  recorder = null;
  if (!active) return;

  const { chunks, sampleRate } = active.stop();
  setState({ level: 0 });

  // Nothing audible: skip the model rather than show an empty transcript
  // and let the visitor wonder which part failed.
  const seconds = chunks.reduce((n, c) => n + c.length, 0) / sampleRate;
  if (seconds < 0.3) {
    setState({ phase: "ready", recordedSecs: 0, transcript: "", partial: false });
    return;
  }

  await runClip(chunksToBuffer(chunks, sampleRate));
  setState({ recordedSecs: 0 });
}

/** Abandon whatever is in flight, including an open microphone. */
export function stop() {
  const { phase } = getState();
  run++;
  recorder?.stop();
  recorder = null;
  track(`stt-stop-${phase}`);
  setState({
    phase: getState().loaded ? "ready" : "idle",
    level: 0,
    recordedSecs: 0,
    partial: false,
  });
}
