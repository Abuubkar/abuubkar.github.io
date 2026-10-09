/**
 * One interface, two models.
 *
 * Both are `style_text_to_speech_2` and take the same three inputs, so the
 * worker does not need to know which is loaded — only that it can ask for
 * a sentence and get samples back.
 *
 * What differs is how much comes in the box. kokoro-js arrives with text
 * normalisation, phonemisation, a tokenizer and a voice loader. KittenTTS
 * is the bare ONNX export, so the second backend supplies all of that
 * itself: phonemizer for the IPA, AutoTokenizer for the ids, and a plain
 * fetch for the style vector.
 */

import { KokoroTTS } from "kokoro-js";
import {
  AutoTokenizer,
  StyleTextToSpeech2Model,
  Tensor,
  type PreTrainedTokenizer,
} from "@huggingface/transformers";
import { phonemize } from "phonemizer";
import { MODELS, type TtsModelId } from "../data/models";

export type Clip = { samples: Float32Array<ArrayBuffer>; sampleRate: number };

export type Backend = {
  /** One sentence in, its audio out. */
  generate(text: string, voice: string): Promise<Clip>;
};

export type ProgressCallback = (percent: number) => void;

/**
 * Download progress across every weight file at once.
 *
 * Reporting whichever file fired last makes the bar jump backwards when a
 * model ships more than one. Files that are not weights are left out: they
 * are a few KB and would make the bar finish early.
 */
function trackProgress(onPercent: ProgressCallback) {
  const loaded = new Map<string, number>();
  const total = new Map<string, number>();
  return (info: {
    status: string;
    file?: string;
    loaded?: number;
    total?: number;
  }) => {
    if (info.status !== "progress" || !info.file?.endsWith(".onnx")) return;
    loaded.set(info.file, info.loaded ?? 0);
    total.set(info.file, info.total ?? 0);
    let done = 0;
    let all = 0;
    for (const n of loaded.values()) done += n;
    for (const n of total.values()) all += n;
    if (all > 0) onPercent(Math.min(100, Math.round((done / all) * 100)));
  };
}

/** kokoro-js narrows `voice` to its own union; the registry stores plain
 *  strings, so the crossing happens once, here. */
type KokoroVoice = NonNullable<Parameters<KokoroTTS["generate"]>[1]>["voice"];

async function loadKokoro(onProgress: ProgressCallback): Promise<Backend> {
  const spec = MODELS.kokoro;
  const tts = await KokoroTTS.from_pretrained(spec.repo, {
    dtype: spec.dtype,
    device: "wasm",
    progress_callback: trackProgress(onProgress),
  });
  return {
    async generate(text, voice) {
      const audio = await tts.generate(text, { voice: voice as KokoroVoice });
      return {
        samples: new Float32Array(audio.audio) as Float32Array<ArrayBuffer>,
        sampleRate: audio.sampling_rate,
      };
    },
  };
}

/** Style vectors, fetched once per voice. Kitten's are 1 KB — a single
 *  256-float vector, not Kokoro's table indexed by sentence length. */
const styles = new Map<string, Float32Array>();

async function styleFor(repo: string, voice: string): Promise<Float32Array> {
  const cached = styles.get(voice);
  if (cached) return cached;
  const url = `https://huggingface.co/${repo}/resolve/main/voices/${voice}.bin`;
  const response = await fetch(url);
  const bytes = await response.arrayBuffer();
  const vector = new Float32Array(bytes);
  styles.set(voice, vector);
  return vector;
}

async function loadKitten(onProgress: ProgressCallback): Promise<Backend> {
  const spec = MODELS.kitten;
  const [tokenizer, model] = await Promise.all([
    AutoTokenizer.from_pretrained(spec.repo),
    StyleTextToSpeech2Model.from_pretrained(spec.repo, {
      dtype: spec.dtype,
      device: "wasm",
      progress_callback: trackProgress(onProgress),
    }),
  ]);

  return {
    async generate(text, voice) {
      // The tokenizer's vocabulary is 175 IPA symbols, so raw text has to
      // become phonemes first — the step kokoro-js hides.
      const phonemes = (await phonemize(text, "en-us")).join(" ");
      const { input_ids } = (
        tokenizer as PreTrainedTokenizer
      )(phonemes, { truncation: true });
      const style = await styleFor(spec.repo, voice);
      const { waveform } = await model({
        input_ids,
        style: new Tensor("float32", style, [1, style.length]),
        speed: new Tensor("float32", [1], [1]),
      });
      return {
        samples: new Float32Array(
          waveform.data as Float32Array,
        ) as Float32Array<ArrayBuffer>,
        sampleRate: 24000,
      };
    },
  };
}

export function loadBackend(
  which: TtsModelId,
  onProgress: ProgressCallback,
): Promise<Backend> {
  return which === "kitten" ? loadKitten(onProgress) : loadKokoro(onProgress);
}
