/// <reference lib="webworker" />

/**
 * Runs Whisper off the main thread.
 *
 * ONNX inference blocks whatever thread calls it. Voice Lab learned this the
 * expensive way: on the main thread a run froze the page outright, timers
 * included. Here the page stays alive while the model works, and the level
 * meter keeps animating.
 */

import {
  env,
  pipeline,
  type AutomaticSpeechRecognitionPipeline,
} from "@huggingface/transformers";
import { MODEL_DTYPE, MODEL_ID } from "../data/model";

const ctx = self as unknown as DedicatedWorkerGlobalScope;

export type ToWorker =
  | { type: "load"; threads: number }
  | { type: "transcribe"; samples: Float32Array<ArrayBuffer>; clipSecs: number };

export type FromWorker =
  | { type: "progress"; percent: number }
  | { type: "loaded" }
  | { type: "load-error"; message: string }
  | { type: "result"; text: string; clipSecs: number; workSecs: number }
  | { type: "error"; message: string };

let transcriber: AutomaticSpeechRecognitionPipeline | null = null;

const post = (message: FromWorker) => ctx.postMessage(message);

const describe = (err: unknown) =>
  err instanceof Error ? err.message : String(err);

/**
 * Download progress across every weight file at once.
 *
 * Whisper is two ONNX files, not one, and they download concurrently.
 * Reporting whichever fired last makes the bar jump backwards, so this keeps
 * a byte count per file and reports the total. Files smaller than the weights
 * (tokenizer, config) are left out: they are a few KB and would make the bar
 * finish early.
 */
function trackProgress(onPercent: (percent: number) => void) {
  const loaded = new Map<string, number>();
  const total = new Map<string, number>();

  return (info: { status: string; file?: string; loaded?: number; total?: number }) => {
    if (info.status !== "progress" || !info.file?.endsWith(".onnx")) return;
    loaded.set(info.file, info.loaded ?? 0);
    total.set(info.file, info.total ?? 0);

    let done = 0;
    let all = 0;
    for (const bytes of loaded.values()) done += bytes;
    for (const bytes of total.values()) all += bytes;
    if (all > 0) onPercent(Math.min(100, Math.round((done / all) * 100)));
  };
}

async function load(threads: number) {
  try {
    // Set before the session exists: onnxruntime-web reads this when it
    // creates the thread pool, and ignores it afterwards.
    const wasm = env.backends.onnx.wasm;
    if (wasm) wasm.numThreads = threads;
    transcriber = await pipeline<"automatic-speech-recognition">(
      "automatic-speech-recognition",
      MODEL_ID,
      {
        dtype: MODEL_DTYPE,
        device: "wasm",
        progress_callback: trackProgress((percent) =>
          post({ type: "progress", percent }),
        ),
      },
    );
    post({ type: "loaded" });
  } catch (err) {
    post({ type: "load-error", message: describe(err) });
  }
}

async function transcribe(samples: Float32Array<ArrayBuffer>, clipSecs: number) {
  if (!transcriber) return post({ type: "error", message: "model not loaded" });
  const started = performance.now();
  try {
    // Already at the model's rate: resampling happens on the capture side so
    // that the main thread hands over exactly what the model eats.
    const output = await transcriber(samples);
    const text = Array.isArray(output)
      ? output.map((o) => o.text).join(" ")
      : output.text;
    post({
      type: "result",
      text: text.trim(),
      clipSecs,
      workSecs: (performance.now() - started) / 1000,
    });
  } catch (err) {
    post({ type: "error", message: describe(err) });
  }
}

ctx.addEventListener("message", (event: MessageEvent<ToWorker>) => {
  const message = event.data;
  if (message.type === "load") void load(message.threads);
  else if (message.type === "transcribe")
    void transcribe(message.samples, message.clipSecs);
});
