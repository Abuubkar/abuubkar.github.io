/** The model this experiment runs, and the limits it imposes on input. */

// Pinned to the v1 ONNX export of openai/whisper-base. The onnx-community
// mirror declares no licence of its own; it is a conversion of a model
// published under Apache-2.0, which is what the telemetry panel reports.
export const MODEL_ID = "onnx-community/whisper-base";
export const MODEL_LABEL = "whisper-base";
export const MODEL_VERSION = "v1";
export const MODEL_LICENSE = "Apache-2.0";

/** Shown before the download starts. The real figure, read from the Hugging
 *  Face API: encoder_model_quantized (23.2 MB) + decoder_model_merged_quantized
 *  (53.7 MB). Keep it honest if MODEL_DTYPE changes — the suffix changes with
 *  it and so does the size. */
export const MODEL_SIZE_MB = 77;

/** Weight precision; q8 resolves to the `_quantized` ONNX files. Kept here so
 *  the UI and the worker cannot disagree about what is being downloaded. */
export const MODEL_DTYPE = "q8";

/** What Whisper's feature extractor expects. Audio arrives at whatever rate
 *  the device records at and is resampled to this before inference. */
export const TARGET_SAMPLE_RATE = 16000;

/**
 * Longest clip we will accept.
 *
 * Whisper's receptive field is 30 seconds: it pads anything shorter and
 * silently drops anything longer. Stopping at the boundary ourselves means
 * the visitor is told why rather than losing the end of a sentence.
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
