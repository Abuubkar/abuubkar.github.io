/**
 * The models this experiment can run, and the voices each one offers.
 *
 * Two on purpose. Kokoro-82M is the good one; KittenTTS nano is a quarter
 * of the download and a fraction of the parameters. Putting them side by
 * side lets a visitor hear what 68 MB of weights actually buys, which is a
 * better demonstration of on-device ML than either model alone.
 *
 * They share an architecture — both are `style_text_to_speech_2`, both take
 * `input_ids` + a 256-float style vector + `speed` — which is why one
 * worker can drive both. Where they differ is who does the text work:
 * kokoro-js ships its own normaliser, phonemiser and voice loader, while
 * KittenTTS is a bare ONNX export this package has to feed itself.
 */

export type TtsModelId = "kokoro" | "kitten";

export type TtsModel = {
  /** Hugging Face repo id. */
  readonly repo: string;
  readonly label: string;
  readonly version: string;
  readonly license: string;
  /** Download shown in the UI before anything is fetched. */
  readonly sizeMb: number;
  readonly dtype: "q8";
  readonly voices: ReadonlyArray<{ readonly id: string; readonly label: string }>;
};

export const MODELS = {
  kokoro: {
    repo: "onnx-community/Kokoro-82M-v1.0-ONNX",
    label: "kokoro-82M",
    version: "v1.0",
    license: "Apache-2.0",
    sizeMb: 92,
    dtype: "q8",
    // Curated subset; the full set is mostly low-grade.
    voices: [
      { id: "af_heart", label: "Heart — US female" },
      { id: "af_bella", label: "Bella — US female" },
      { id: "af_nicole", label: "Nicole — US female" },
      { id: "am_michael", label: "Michael — US male" },
      { id: "bf_emma", label: "Emma — UK female" },
    ],
  },
  kitten: {
    repo: "onnx-community/kitten-tts-nano-0.1-ONNX",
    label: "kitten-nano",
    version: "v0.1",
    license: "Apache-2.0",
    // 23.8 MB for onnx/model_quantized.onnx, read from the HF API. The
    // voice files are 1 KB each, against Kokoro's half a megabyte.
    sizeMb: 24,
    dtype: "q8",
    voices: [
      { id: "expr-voice-2-f", label: "Voice 2 — female" },
      { id: "expr-voice-2-m", label: "Voice 2 — male" },
      { id: "expr-voice-3-f", label: "Voice 3 — female" },
      { id: "expr-voice-4-f", label: "Voice 4 — female" },
      { id: "expr-voice-5-m", label: "Voice 5 — male" },
    ],
  },
} as const satisfies Record<TtsModelId, TtsModel>;

export const DEFAULT_MODEL: TtsModelId = "kokoro";

/** Every voice id across both models, so state can hold one of them. */
export type VoiceId =
  (typeof MODELS)[TtsModelId]["voices"][number]["id"];

export const MAX_TEXT_LENGTH = 300; // keep a phone's CPU out of trouble
