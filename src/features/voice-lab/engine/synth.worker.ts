/// <reference lib="webworker" />

/**
 * Runs the model off the main thread.
 *
 * ONNX inference blocks whatever thread calls it, for seconds at a time. On
 * the main thread that froze the page for a whole run: no animation, no
 * responsive Stop, and every timer firing late in a clump once the work
 * finished. Here the page stays alive while the model works.
 */

import { KokoroTTS, TextSplitterStream } from "kokoro-js";
import { MODEL_DTYPE, MODEL_ID, type VoiceId } from "../data/voices";

const ctx = self as unknown as DedicatedWorkerGlobalScope;

export type ToWorker =
  | { type: "load" }
  | { type: "speak"; text: string; voice: VoiceId }
  | { type: "cancel" };

export type FromWorker =
  | { type: "progress"; percent: number }
  | { type: "loaded" }
  | { type: "load-error"; message: string }
  | {
      type: "chunk";
      samples: Float32Array<ArrayBuffer>;
      sampleRate: number;
      chars: number;
    }
  | { type: "done" }
  | { type: "error"; message: string };

let model: KokoroTTS | null = null;
let cancelled = false;

const post = (message: FromWorker, transfer?: Transferable[]) =>
  transfer ? ctx.postMessage(message, transfer) : ctx.postMessage(message);

const describe = (err: unknown) =>
  err instanceof Error ? err.message : String(err);

async function load() {
  try {
    model = await KokoroTTS.from_pretrained(MODEL_ID, {
      dtype: MODEL_DTYPE,
      device: "wasm",
      progress_callback: (info) => {
        // Only the .onnx weights are worth a progress bar; the tokenizer
        // files are a few KB and would make the bar jump around.
        if (info.status === "progress" && info.file.endsWith(".onnx")) {
          post({ type: "progress", percent: Math.round(info.progress) });
        }
      },
    });
    post({ type: "loaded" });
  } catch (err) {
    post({ type: "load-error", message: describe(err) });
  }
}

async function speak(text: string, voice: VoiceId) {
  if (!model) return post({ type: "error", message: "model not loaded" });
  cancelled = false;
  try {
    const splitter = new TextSplitterStream();
    splitter.push(text);
    splitter.close();

    for await (const { text: sentence, audio } of model.stream(splitter, {
      voice,
    })) {
      if (cancelled) break;
      // Transferred, not copied: the samples leave this thread for good.
      const samples = new Float32Array(audio.audio);
      post(
        {
          type: "chunk",
          samples,
          sampleRate: audio.sampling_rate,
          chars: sentence.length,
        },
        [samples.buffer],
      );
    }
    post({ type: "done" });
  } catch (err) {
    post({ type: "error", message: describe(err) });
  }
}

ctx.addEventListener("message", (event: MessageEvent<ToWorker>) => {
  const message = event.data;
  if (message.type === "load") void load();
  else if (message.type === "speak") void speak(message.text, message.voice);
  else if (message.type === "cancel") cancelled = true;
});
