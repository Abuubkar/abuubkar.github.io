/**
 * The experiment's observable state. Everything the UI renders comes from
 * here; nothing here knows how speech is produced.
 */

import { VOICES, type VoiceId } from "./voices";
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
  | "speaking" // audio playing
  | "error"; // unrecoverable (not even web-speech available)

/** Machine-readable error codes; the UI owns the user-facing copy. */
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
  /** Last neural run: total audio produced + how fast the first sound came. */
  timing: { audioSecs: number; firstSoundSecs: number } | null;
};

const INITIAL_STATE: TtsState = {
  phase: "idle",
  progress: 0,
  tier: null,
  voice: VOICES[0].id,
  error: null,
  threads: 1, // server-safe default; corrected on first subscribe
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
