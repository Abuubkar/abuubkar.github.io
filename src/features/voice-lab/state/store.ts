/**
 * The experiment's observable state. Everything the UI renders comes from
 * here; nothing here knows how speech is produced.
 */

import { VOICES, type VoiceId } from "../data/voices";
import { wasmThreadCount } from "./threads";

/** Compute paths, in order of preference. v1 ships "wasm" only: the model's
 *  WebGPU path needs the fp32 weights (325 MB vs q8's 92 MB — hostile to
 *  visitors) per the kokoro-js README, so WebGPU stays a follow-up switch
 *  inside this package. "web-speech" is the honest non-AI fallback. */
export type TtsTier = "webgpu" | "wasm" | "web-speech";

export type TtsPhase =
  | "idle" // nothing loaded; first click starts the download
  | "loading" // model downloading/compiling (see `progress`)
  | "ready" // model in memory, waiting for input
  | "synthesizing" // neural inference running
  | "buffering" // first sentence made, waiting out the head start
  | "speaking" // audio playing
  | "error"; // unrecoverable (not even web-speech available)

/** Machine-readable error codes. The wording a visitor reads lives in
 *  src/config/site.ts; components only choose which string to show. */
export type TtsError = "load-failed" | "synthesis-failed";

export type TtsState = {
  phase: TtsPhase;
  /** 0–100, meaningful while phase === "loading". */
  progress: number;
  tier: TtsTier | null;
  voice: VoiceId;
  error: TtsError | null;
  /** Threads onnxruntime-web will use; 1 unless the page is isolated. */
  threads: number;
  /** Seconds of head start currently being waited out, while buffering. */
  headStartSecs: number;
  /** Last neural run: audio produced, time to first sound, and how many
   *  sentences still arrived too late to play seamlessly. */
  timing: {
    audioSecs: number;
    firstSoundSecs: number;
    underruns: number;
  } | null;
};

const INITIAL_STATE: TtsState = {
  phase: "idle",
  progress: 0,
  tier: null,
  voice: VOICES[0].id,
  error: null,
  threads: 1, // server-safe default; corrected on first subscribe
  headStartSecs: 0,
  timing: null,
};

let state: TtsState = INITIAL_STATE;
const listeners = new Set<() => void>();

export function setState(patch: Partial<TtsState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getState(): TtsState {
  return state;
}

/** Stable reference for useSyncExternalStore's server snapshot. */
export function getInitialState(): TtsState {
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
