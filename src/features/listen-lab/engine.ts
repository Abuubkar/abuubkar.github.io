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
 *   stt-sample-run                 (the no-microphone path)
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

/** Where the no-microphone demo clip lives. Served from /labs/ beside the
 *  worker; it is Voice Lab's own output, which makes the round trip the
 *  page describes an actual round trip. */
const SAMPLE_URL = "/labs/sample.wav";

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
 * Shared by the microphone and the sample button: by the time audio reaches
 * here it is just samples, and where they came from stops mattering.
 */
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

/**
 * The no-microphone path: transcribe a bundled clip.
 *
 * Here for everyone who will not grant a microphone to a stranger's
 * portfolio, which is a reasonable position and should not leave them
 * looking at a dead button.
 */
export async function runSample(): Promise<void> {
  const myRun = ++run;
  if (!(await prepare()) || run !== myRun) return;

  track("stt-sample-run");
  setState({ phase: "transcribing", error: null });
  try {
    const response = await fetch(SAMPLE_URL);
    const encoded = await response.arrayBuffer();
    // A short-lived context purely to decode; nothing is played.
    const decoder = new AudioContext();
    const buffer = await decoder.decodeAudioData(encoded);
    void decoder.close();
    if (run !== myRun) return;
    await runClip(buffer);
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
  setState({ phase: "recording", error: null, level: 0, recordedSecs: 0 });
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
    setState({ phase: "ready", recordedSecs: 0 });
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
  });
}
