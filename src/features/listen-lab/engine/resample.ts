/**
 * Gets captured audio into the shape Whisper expects: mono, 16 kHz, Float32.
 *
 * Microphones hand back whatever the device runs at, usually 48 kHz, and
 * often in stereo. Dropping every third sample would be the obvious fix and
 * the wrong one: throwing samples away without filtering first folds
 * everything above 8 kHz back down into the speech band as aliasing noise,
 * which the model hears as grit.
 *
 * OfflineAudioContext already does this properly — the browser's resampler
 * filters before it decimates — so the work is handed to it rather than
 * reimplemented here badly.
 */

import { TARGET_SAMPLE_RATE } from "../data/model";

/**
 * Resamples and flattens to mono.
 *
 * Returns a plain-ArrayBuffer-backed array so it can be transferred to the
 * worker: on a cross-origin isolated page a Float32Array may be backed by a
 * SharedArrayBuffer, which is not transferable.
 */
export async function toMono16k(
  buffer: AudioBuffer,
): Promise<Float32Array<ArrayBuffer>> {
  const frames = Math.ceil(
    (buffer.duration * TARGET_SAMPLE_RATE * buffer.sampleRate) /
      buffer.sampleRate,
  );
  const offline = new OfflineAudioContext(1, frames, TARGET_SAMPLE_RATE);

  const source = offline.createBufferSource();
  source.buffer = buffer;
  // Connecting a multi-channel source to a mono destination makes the graph
  // downmix for us, by the spec's own rules.
  source.connect(offline.destination);
  source.start();

  const rendered = await offline.startRendering();

  // Copied rather than handed over directly: getChannelData returns a view
  // onto the rendered buffer, and the worker needs a buffer of its own.
  const out = new Float32Array(rendered.length);
  rendered.copyFromChannel(out, 0);
  return out as Float32Array<ArrayBuffer>;
}

/**
 * Builds an AudioBuffer from raw capture chunks.
 *
 * The recorder collects Float32 blocks as they arrive; this stitches them
 * into something toMono16k can resample.
 */
export function chunksToBuffer(
  chunks: Float32Array[],
  sampleRate: number,
): AudioBuffer {
  let length = 0;
  for (const chunk of chunks) length += chunk.length;

  // An AudioBuffer has to come from a context, but nothing is played through
  // this one — it exists only to hold the samples until they are resampled.
  const holder = new OfflineAudioContext(1, Math.max(1, length), sampleRate);
  const buffer = holder.createBuffer(1, Math.max(1, length), sampleRate);
  const channel = buffer.getChannelData(0);

  let offset = 0;
  for (const chunk of chunks) {
    channel.set(chunk, offset);
    offset += chunk.length;
  }
  return buffer;
}
