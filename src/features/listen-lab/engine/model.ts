/**
 * The model, as seen from the main thread.
 *
 * The work happens in transcribe.worker.ts; this is the client. Load with
 * progress, then hand over a clip and wait for text — nothing upstream has
 * to learn that a worker exists.
 */

import { MODEL_LABEL } from "../data/model";
import type { FromWorker, ToWorker } from "./transcribe.worker";

let worker: Worker | null = null;

/**
 * Where `pnpm build:worker` puts the bundled worker.
 *
 * Inside /labs/ on purpose. A cross-origin isolated page may only start a
 * worker whose *script* carries COEP, and a worker script is fetched by its
 * own URL rather than on behalf of the page — so, unlike every other asset
 * this page loads, it misses the service worker that adds that header
 * unless it sits in the same scope. Letting Next bundle it would put it
 * under /_next/, where the header never reaches it and the browser refuses
 * to start it.
 */
const WORKER_URL = "/labs/listen-worker.js";

/** Built on first use: constructing it is what fetches the worker bundle,
 *  and with it transformers.js, so neither touches the page until asked. */
function ensureWorker(): Worker {
  worker ??= new Worker(WORKER_URL, { type: "module" });
  return worker;
}

/** Downloads and compiles the model. Throws if it can't; the caller decides
 *  what to tell the visitor. `onProgress` reports 0–100 for the weights. */
export function loadModel(
  onProgress: (percent: number) => void,
  threads: number,
): Promise<void> {
  const active = ensureWorker();
  return new Promise((resolve, reject) => {
    const onMessage = ({ data }: MessageEvent<FromWorker>) => {
      if (data.type === "progress") return onProgress(data.percent);
      if (data.type !== "loaded" && data.type !== "load-error") return;
      active.removeEventListener("message", onMessage);
      if (data.type === "loaded") resolve();
      else reject(new Error(data.message));
    };
    active.addEventListener("message", onMessage);
    active.postMessage({ type: "load", threads } satisfies ToWorker);
  });
}

export type Transcription = {
  text: string;
  clipSecs: number;
  workSecs: number;
};

/**
 * Transcribes one clip. The samples must already be mono at the model's
 * rate — see engine/resample.ts.
 *
 * The buffer is transferred, not copied: a thirty-second clip is 1.9 MB of
 * Float32 and the caller has no use for it afterwards.
 */
export function transcribe(
  samples: Float32Array<ArrayBuffer>,
  clipSecs: number,
): Promise<Transcription> {
  const active = ensureWorker();
  return new Promise((resolve, reject) => {
    const onMessage = ({ data }: MessageEvent<FromWorker>) => {
      if (data.type !== "result" && data.type !== "error") return;
      active.removeEventListener("message", onMessage);
      if (data.type === "result") {
        resolve({
          text: data.text,
          clipSecs: data.clipSecs,
          workSecs: data.workSecs,
        });
      } else {
        reject(new Error(`${MODEL_LABEL}: ${data.message}`));
      }
    };
    active.addEventListener("message", onMessage);
    active.postMessage({ type: "transcribe", samples, clipSecs } satisfies ToWorker, [
      samples.buffer,
    ]);
  });
}
