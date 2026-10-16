/**
 * The experiment's observable state. Everything the UI renders comes from
 * here; nothing here knows how audio is captured or transcribed.
 */

import { wasmThreadCount } from "@/lib/wasm-threads";

export type SttPhase =
  | "idle" // nothing loaded; first press starts the download
  | "loading" // model downloading/compiling (see `progress`)
  | "ready" // model in memory, waiting for audio
  | "recording" // microphone open, samples accumulating
  | "transcribing" // inference running
  | "error"; // unrecoverable

/**
 * Machine-readable error codes. The wording a visitor reads lives in
 * src/config/site.ts; components only choose which string to show.
 *
 * The microphone failures are kept apart because the remedy differs: a
 * refusal is undone in site settings, a missing device is not, and an
 * insecure page cannot ask at all.
 */
export type SttError =
  | "load-failed"
  | "mic-denied"
  | "mic-unavailable"
  | "mic-insecure"
  | "transcribe-failed";

export type SttState = {
  phase: SttPhase;
  /** 0–100, meaningful while phase === "loading". */
  progress: number;
  /** True once the weights are in memory, so the button can stop offering
   *  a download that already happened. */
  loaded: boolean;
  /** The last transcript. Kept across a new recording until that one
   *  returns, so the panel never blanks while someone is talking. */
  transcript: string;
  error: SttError | null;
  /** Threads onnxruntime-web will use; 1 unless the page is isolated. */
  threads: number;
  /** Microphone loudness, 0–1, while recording. Drives the level meter. */
  level: number;
  /** Seconds recorded so far, so the UI can count down to MAX_CLIP_SECS. */
  recordedSecs: number;
  /** Last run: how long the clip was and how long the model took on it.
   *  The ratio is the number worth showing — under 1 is faster than real time. */
  timing: { clipSecs: number; workSecs: number } | null;
};

const INITIAL_STATE: SttState = {
  phase: "idle",
  progress: 0,
  loaded: false,
  transcript: "",
  error: null,
  threads: 1, // server-safe default; corrected on first subscribe
  level: 0,
  recordedSecs: 0,
  timing: null,
};

let state: SttState = INITIAL_STATE;
const listeners = new Set<() => void>();

export function setState(patch: Partial<SttState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getState(): SttState {
  return state;
}

/** Stable reference for useSyncExternalStore's server snapshot. */
export function getInitialState(): SttState {
  return INITIAL_STATE;
}

let runtimeRead = false;

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // The server can't know whether this tab is cross-origin isolated, so the
  // thread count is read here, on the first client subscription. React then
  // re-reads the snapshot and renders the real number.
  if (!runtimeRead && typeof window !== "undefined") {
    runtimeRead = true;
    setState({ threads: wasmThreadCount() });
  }
  return () => listeners.delete(listener);
}
