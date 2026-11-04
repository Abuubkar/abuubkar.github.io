/**
 * The model, as seen from the main thread.
 *
 * The work happens in synth.worker.ts; this is the client. Keeping the same
 * shape as before — load with progress, then stream chunks — means nothing
 * upstream had to learn that a worker exists.
 */

import type { AudioChunk } from "./playback";
import type { VoiceId } from "../data/voices";
import type { FromWorker, ToWorker } from "./synth.worker";

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
const WORKER_URL = "/labs/synth-worker.js";

/** Built on first use: constructing it is what fetches the worker bundle,
 *  and with it kokoro-js, so neither touches the page until asked for. */
function ensureWorker(): Worker {
  worker ??= new Worker(WORKER_URL, { type: "module" });
  return worker;
}

const send = (message: ToWorker) => ensureWorker().postMessage(message);

/** Downloads and compiles the model. Throws if it can't; the caller decides
 *  what to fall back to. `onProgress` reports 0–100 for the weights only. */
export function loadModel(
  onProgress: (percent: number) => void,
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
    send({ type: "load" });
  });
}

/**
 * Yields one audio chunk per sentence, as soon as each is generated.
 *
 * Streaming rather than generating the whole clip: the wait for a full clip
 * is many seconds of silence, whereas this lets the first sentence play
 * while the rest is still being made. The first use of a voice also fetches
 * its ~500 KB embedding (the Cache API keeps it after).
 */
export async function* synthesize(
  text: string,
  voice: VoiceId,
): AsyncGenerator<AudioChunk> {
  const active = ensureWorker();
  const queue: AudioChunk[] = [];
  let failure: string | null = null;
  let finished = false;
  let wake: (() => void) | null = null;

  const onMessage = ({ data }: MessageEvent<FromWorker>) => {
    if (data.type === "chunk") {
      queue.push({
        samples: data.samples,
        sampleRate: data.sampleRate,
        chars: data.chars,
      });
    } else if (data.type === "done") {
      finished = true;
    } else if (data.type === "error") {
      failure = data.message;
      finished = true;
    } else {
      return;
    }
    wake?.();
  };

  active.addEventListener("message", onMessage);
  send({ type: "speak", text, voice });

  try {
    for (;;) {
      while (queue.length) yield queue.shift()!;
      if (failure) throw new Error(failure);
      if (finished) return;
      await new Promise<void>((resolve) => {
        wake = resolve;
      });
    }
  } finally {
    active.removeEventListener("message", onMessage);
    // Whether we were stopped or simply stopped reading, the worker should
    // not keep generating audio nobody will hear.
    if (!finished) send({ type: "cancel" });
  }
}
