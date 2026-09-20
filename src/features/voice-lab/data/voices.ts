/** The model this experiment runs, and the voices we offer from it. */

// Version is pinned as far as the stack allows: kokoro-js is exact-pinned in
// package.json and the model id names the v1.0 ONNX export. (kokoro-js does
// not forward a HF `revision`, so a re-upload under the same repo id is the
// residual risk.)
export const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
export const MODEL_LABEL = "kokoro-82M";
export const MODEL_VERSION = "v1.0";
export const MODEL_SIZE_MB = 92; // q8 weights — shown in the UI before download
export const MAX_TEXT_LENGTH = 300; // keep a phone's CPU out of trouble

/** Curated subset of the model's voices (the full set is mostly low-grade). */
export const VOICES = [
  { id: "af_heart", label: "Heart — US female" },
  { id: "af_bella", label: "Bella — US female" },
  { id: "af_nicole", label: "Nicole — US female" },
  { id: "am_michael", label: "Michael — US male" },
  { id: "bf_emma", label: "Emma — UK female" },
] as const;

export type VoiceId = (typeof VOICES)[number]["id"];
