/**
 * Plays generated sentences back to back through Web Audio.
 *
 * The caller hands over chunks as they are made and is told when sound
 * actually starts. *When* playback begins, and how far ahead of it the
 * queue runs, is this module's business alone — which is what lets the
 * start be delayed (buffered) without the orchestrator knowing.
 */

/** Samples must sit in a plain ArrayBuffer: on a cross-origin isolated page
 *  a Float32Array can be backed by a SharedArrayBuffer, which Web Audio's
 *  copyToChannel refuses. */
export type AudioChunk = {
  samples: Float32Array<ArrayBuffer>;
  sampleRate: number;
};

export type Player = {
  /** Queue one sentence. Safe to call while earlier ones are still playing. */
  enqueue(chunk: AudioChunk): void;
  /** No more chunks are coming; resolves once the queued audio has drained. */
  finish(): Promise<void>;
  /** Cut playback immediately and drop anything queued. */
  stop(): void;
  /** Seconds of audio queued so far. */
  readonly totalSecs: number;
};

export type PlayerOptions = {
  /** Fires once, when the first sample actually reaches the speakers. */
  onFirstSound?: () => void;
};

/** One context for the tab: browsers cap how many you may create. */
let sharedContext: AudioContext | null = null;

function ensureContext(): AudioContext {
  sharedContext ??= new AudioContext({ sampleRate: 24000 });
  // A tab that went to the background may have suspended it.
  void sharedContext.resume();
  return sharedContext;
}

/**
 * Call this synchronously inside the click handler: creating and resuming the
 * context is what the browser's autoplay policy is watching for.
 */
export function createPlayer({ onFirstSound }: PlayerOptions = {}): Player {
  const ctx = ensureContext();
  const sources: AudioBufferSourceNode[] = [];
  let nextStart = 0;
  let totalSecs = 0;
  let started = false;
  let stopped = false;

  return {
    get totalSecs() {
      return totalSecs;
    },

    enqueue(chunk) {
      if (stopped) return;
      const buffer = ctx.createBuffer(1, chunk.samples.length, chunk.sampleRate);
      buffer.copyToChannel(chunk.samples, 0);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      // Butt each sentence against the end of the previous one. Falling back
      // to "now" means generation lost the race with playback, which is what
      // a listener hears as a gap.
      const startAt = Math.max(nextStart, ctx.currentTime);
      source.start(startAt);
      sources.push(source);
      nextStart = startAt + buffer.duration;
      totalSecs += buffer.duration;

      if (!started) {
        started = true;
        onFirstSound?.();
      }
    },

    finish() {
      if (stopped) return Promise.resolve();
      const remainingMs = Math.max(0, (nextStart - ctx.currentTime) * 1000);
      return new Promise((resolve) =>
        window.setTimeout(resolve, remainingMs + 100),
      );
    },

    stop() {
      stopped = true;
      sources.forEach((source) => {
        try {
          source.stop();
        } catch {
          /* already finished */
        }
      });
      sources.length = 0;
    },
  };
}
