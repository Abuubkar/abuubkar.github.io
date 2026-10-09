/// <reference lib="webworker" />

/**
 * Runs the model off the main thread.
 *
 * ONNX inference blocks whatever thread calls it, for seconds at a time. On
 * the main thread that froze the page for a whole run: no animation, no
 * responsive Stop, and every timer firing late in a clump once the work
 * finished. Here the page stays alive while the model works.
 */

import { TextSplitterStream } from "kokoro-js";
import { loadBackend, type Backend } from "./backends";
import type { TtsModelId } from "../data/models";

const ctx = self as unknown as DedicatedWorkerGlobalScope;

export type ToWorker =
  | { type: "load"; model: TtsModelId }
  | { type: "speak"; text: string; voice: string }
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

let backend: Backend | null = null;
let cancelled = false;

const post = (message: FromWorker, transfer?: Transferable[]) =>
  transfer ? ctx.postMessage(message, transfer) : ctx.postMessage(message);

const describe = (err: unknown) =>
  err instanceof Error ? err.message : String(err);

async function load(which: TtsModelId) {
  try {
    backend = await loadBackend(which, (percent) =>
      post({ type: "progress", percent }),
    );
    post({ type: "loaded" });
  } catch (err) {
    post({ type: "load-error", message: describe(err) });
  }
}

async function speak(text: string, voice: string) {
  if (!backend) return post({ type: "error", message: "model not loaded" });
  cancelled = false;
  try {
    // Split here rather than inside a model-specific stream helper: both
    // backends take one sentence at a time, so the sentence boundary is the
    // worker's business now, not kokoro-js's.
    const splitter = new TextSplitterStream();
    splitter.push(text);
    const sentences = [...splitter];

    for (const sentence of sentences) {
      if (cancelled) break;
      const { samples, sampleRate } = await backend.generate(sentence, voice);
      post(
        // Transferred, not copied: the samples leave this thread for good.
        { type: "chunk", samples, sampleRate, chars: sentence.length },
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
  if (message.type === "load") void load(message.model);
  else if (message.type === "speak") void speak(message.text, message.voice);
  else if (message.type === "cancel") cancelled = true;
});
