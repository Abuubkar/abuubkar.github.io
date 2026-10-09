/** The model this experiment runs, and the limits it imposes on input. */

// Moonshine rather than Whisper, on measurement. Both were run against the
// same four Kokoro-generated clips with exact reference text, four trials
// each, median of the warm three, one loaded model, tab kept awake:
//
//   clip     whisper-base   moonshine-base
//   6.8s        1.238s          0.333s
//   12.0s       1.479s          0.611s
//   17.9s       1.773s          1.084s
//   8.8s gaps   1.054s          0.336s
//
// Whisper's times are flat because its encoder always runs over a 30-second
// window; Moonshine's scale with the audio, which is the whole point of it.
// For press-and-talk, where clips are short, that is 2-4x less waiting.
//
// Unlike the mirror of Whisper, this repo declares its own licence.
export const MODEL_ID = "onnx-community/moonshine-base-ONNX";
export const MODEL_LABEL = "moonshine-base";
export const MODEL_VERSION = "v1";
export const MODEL_LICENSE = "MIT";

/** Shown before the download starts. The real figure, read from the Hugging
 *  Face API: encoder_model_quantized (20.5 MB) + decoder_model_merged_quantized
 *  (42.5 MB). Keep it honest if MODEL_DTYPE changes — the suffix changes with
 *  it and so does the size. */
export const MODEL_SIZE_MB = 63;

/** Weight precision; q8 resolves to the `_quantized` ONNX files. Kept here so
 *  the UI and the worker cannot disagree about what is being downloaded. */
export const MODEL_DTYPE = "q8";

/** What Whisper's feature extractor expects. Audio arrives at whatever rate
 *  the device records at and is resampled to this before inference. */
export const TARGET_SAMPLE_RATE = 16000;

/**
 * Longest clip we will accept.
 *
 * Moonshine has no fixed window to pad to — cost grows with the audio, which
 * is why it is here. The cap stays at 30 seconds anyway: that is the range
 * it was trained on, and a ceiling the visitor is told about beats one they
 * discover by losing the end of a sentence.
 */
export const MAX_CLIP_SECS = 30;

/**
 * Inference uses whatever threads the page has — see @/lib/wasm-threads.
 *
 * Worth stating because the first measurement said the opposite. Benchmarked
 * in a hidden browser pane, four threads looked 5x *slower* than one, which
 * reads like a plausible story about Whisper decoding one token at a time
 * and paying thread synchronisation on every step. It was background
 * throttling. With the tab kept awake, same clip, same machine:
 *
 *   1 thread   3.77, 3.18, 3.11 s
 *   4 threads  1.46, 1.15, 1.13 s   → 0.19x realtime
 *
 * A throttled tab is not a slow device, and timings taken in one say
 * nothing about the other.
 */
