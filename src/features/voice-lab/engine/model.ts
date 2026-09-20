/**
 * The kokoro-js adapter: the only file in the codebase that imports the
 * library. Both entry points here are dynamic-imported, so neither kokoro-js
 * nor its ~92 MB of weights touch the page until someone asks for speech.
 */

import type { AudioChunk } from "./playback";
import { MODEL_DTYPE, MODEL_ID, type VoiceId } from "../data/voices";

export type KokoroModel = Awaited<
  ReturnType<(typeof import("kokoro-js"))["KokoroTTS"]["from_pretrained"]>
>;

/** Downloads and compiles the model. Throws if it can't; the caller decides
 *  what to fall back to. `onProgress` reports 0–100 for the weights only. */
export async function loadModel(
  onProgress: (percent: number) => void,
): Promise<KokoroModel> {
  const { KokoroTTS } = await import("kokoro-js");
  return KokoroTTS.from_pretrained(MODEL_ID, {
    dtype: MODEL_DTYPE,
    device: "wasm",
    progress_callback: (info) => {
      // Only the .onnx weights are worth a progress bar; the tokenizer files
      // are a few KB and would make the bar jump around.
      if (info.status === "progress" && info.file.endsWith(".onnx")) {
        onProgress(Math.round(info.progress));
      }
    },
  });
}

/**
 * Yields one audio chunk per sentence, as soon as each is generated.
 *
 * Streaming rather than generating the whole clip: on single-threaded WASM
 * the wait for a full clip is many seconds of silence, whereas this lets the
 * first sentence play while the rest is still being made. The first use of a
 * voice also fetches its ~500 KB embedding (the Cache API keeps it after).
 */
export async function* synthesize(
  model: KokoroModel,
  text: string,
  voice: VoiceId,
): AsyncGenerator<AudioChunk> {
  const { TextSplitterStream } = await import("kokoro-js");
  const splitter = new TextSplitterStream();
  splitter.push(text);
  splitter.close();

  for await (const { text: sentence, audio } of model.stream(splitter, {
    voice,
  })) {
    yield {
      samples: new Float32Array(audio.audio),
      sampleRate: audio.sampling_rate,
      chars: sentence.length,
    };
  }
}
