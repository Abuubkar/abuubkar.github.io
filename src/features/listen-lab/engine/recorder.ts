/**
 * Captures the microphone as raw samples.
 *
 * An AudioWorklet rather than MediaRecorder: MediaRecorder hands back
 * encoded webm, which would have to be decoded again before the model could
 * see it, and it gives nothing to drive a level meter with. The worklet
 * gives plain Float32 blocks and a loudness figure on the way past.
 *
 * The processor is loaded from a blob URL, not a file. A worker script has
 * to live inside the service worker's scope to receive COEP (see
 * engine/model.ts), and sidestepping that question entirely is worth more
 * than the few lines of inlining it costs. Verified to load on a
 * cross-origin isolated page.
 */

import { MAX_CLIP_SECS } from "../data/model";

/**
 * Runs on the audio thread. Buffers roughly 50ms before posting: a raw
 * block is 128 samples, which at 48kHz would be 375 messages a second for
 * no benefit.
 */
const PROCESSOR = `
class Capture extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buf = [];
    this._n = 0;
    this._target = Math.round(sampleRate * 0.05);
    this._peak = 0;
  }
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel) return true;
    this._buf.push(new Float32Array(channel));
    this._n += channel.length;
    for (let i = 0; i < channel.length; i++) {
      const v = channel[i] < 0 ? -channel[i] : channel[i];
      if (v > this._peak) this._peak = v;
    }
    if (this._n >= this._target) {
      const out = new Float32Array(this._n);
      let o = 0;
      for (const b of this._buf) { out.set(b, o); o += b.length; }
      this.port.postMessage({ samples: out, peak: this._peak }, [out.buffer]);
      this._buf = []; this._n = 0; this._peak = 0;
    }
    return true;
  }
}
registerProcessor('capture', Capture);
`;

/** Why a recording could not start. Mapped to the store's error codes by
 *  the caller, which owns what the visitor reads. */
export type RecorderFailure = "denied" | "unavailable" | "insecure";

export class RecorderError extends Error {
  constructor(readonly reason: RecorderFailure) {
    super(reason);
  }
}

export type Recording = {
  /** Loudness 0–1, roughly every 50ms. */
  onLevel?: (level: number) => void;
  /** Seconds captured so far, roughly every 50ms. */
  onElapsed?: (seconds: number) => void;
  /** Fired once if the clip reaches MAX_CLIP_SECS, so the UI can say why
   *  it stopped rather than appearing to drop the end of a sentence. */
  onLimit?: () => void;
};

export type Captured = { chunks: Float32Array[]; sampleRate: number };

export type RecorderHandle = {
  /** Everything captured so far, without interrupting capture. The array is
   *  a copy, so the caller can resample it while more blocks arrive. */
  snapshot(): Captured;
  /** Releases the microphone and returns everything captured. */
  stop(): Captured;
};

/**
 * Opens the microphone and starts collecting.
 *
 * Throws RecorderError before anything is captured; after that it only
 * stops. Asking for permission is deferred to this call rather than page
 * load — nobody should get a microphone prompt for reading a page.
 */
export async function startRecording({
  onLevel,
  onElapsed,
  onLimit,
}: Recording = {}): Promise<RecorderHandle> {
  if (typeof window === "undefined" || !window.isSecureContext) {
    throw new RecorderError("insecure");
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new RecorderError("unavailable");
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      // Browser-side cleanup is welcome: the model does better on a clean
      // signal than on a room.
      audio: { echoCancellation: true, noiseSuppression: true },
    });
  } catch (err) {
    const name = err instanceof DOMException ? err.name : "";
    throw new RecorderError(
      name === "NotAllowedError" || name === "SecurityError"
        ? "denied"
        : "unavailable",
    );
  }

  const ctx = new AudioContext();
  const moduleUrl = URL.createObjectURL(
    new Blob([PROCESSOR], { type: "application/javascript" }),
  );
  try {
    await ctx.audioWorklet.addModule(moduleUrl);
  } finally {
    URL.revokeObjectURL(moduleUrl);
  }

  const source = ctx.createMediaStreamSource(stream);
  const node = new AudioWorkletNode(ctx, "capture");
  const chunks: Float32Array[] = [];
  let samples = 0;
  let stopped = false;
  let limitHit = false;

  node.port.onmessage = ({ data }) => {
    if (stopped) return;
    chunks.push(data.samples);
    samples += data.samples.length;
    onLevel?.(data.peak);
    onElapsed?.(samples / ctx.sampleRate);
    if (!limitHit && samples / ctx.sampleRate >= MAX_CLIP_SECS) {
      limitHit = true;
      onLimit?.();
    }
  };

  source.connect(node);
  // Not connected to the destination on purpose: routing the microphone to
  // the speakers is how you get feedback howl.

  return {
    snapshot() {
      return { chunks: chunks.slice(), sampleRate: ctx.sampleRate };
    },

    stop() {
      stopped = true;
      node.port.onmessage = null;
      node.disconnect();
      source.disconnect();
      stream.getTracks().forEach((track) => track.stop());
      void ctx.close();
      return { chunks, sampleRate: ctx.sampleRate };
    },
  };
}
