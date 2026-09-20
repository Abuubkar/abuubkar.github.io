/**
 * Plays generated sentences back to back through Web Audio.
 *
 * The caller hands over chunks as they are made and is told when sound
 * actually starts. *When* playback begins, and how far ahead of it the
 * queue runs, is this module's business alone.
 *
 * Why it waits before starting: synthesis runs at roughly 1.03x realtime on
 * an isolated page, so playback drains a little faster than generation
 * refills it and every sentence arrives slightly later than the last one
 * needed. Starting the moment the first sentence is ready therefore spends
 * that deficit as silence *between* sentences. Delaying the start by the
 * total expected deficit moves the same wait to the front, where it reads as
 * loading rather than stuttering, and the clip still finishes at the same
 * moment. Measurements: PR #2.
 */

/** Samples must sit in a plain ArrayBuffer: on a cross-origin isolated page
 *  a Float32Array can be backed by a SharedArrayBuffer, which Web Audio's
 *  copyToChannel refuses. */
export type AudioChunk = {
  samples: Float32Array<ArrayBuffer>;
  sampleRate: number;
  /** Characters of source text this chunk speaks, used to guess how much
   *  audio is still to come. */
  chars: number;
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
  /** Sentences that arrived too late to play seamlessly, heard as gaps. */
  readonly underruns: number;
  /** Seconds from this player's creation to the first sample being heard,
   *  cushion included. 0 until sound starts. */
  readonly firstSoundSecs: number;
};

export type PlayerOptions = {
  /** Length of the whole text, so the cushion can be sized to what remains. */
  totalChars?: number;
  /** Fires once, when the first sample actually reaches the speakers. */
  onFirstSound?: () => void;
  /** Fires when a cushion is being waited out, with its length in seconds. */
  onBuffering?: (seconds: number) => void;
};

/** Never delay the start by less than this when more audio is still coming. */
const MIN_CUSHION = 0.25;
/** A slow device would need an unusable cushion, so it gets gaps instead. */
const MAX_CUSHION = 2.5;
/** Sentences vary in how fast they generate; cover the average deficit twice. */
const SAFETY = 2;
/**
 * What to assume before anything has been measured. The first sentence is a
 * bad witness: it also pays for session setup and the first inference, so
 * deriving a rate from it swings wildly. This is what Kokoro-82M does on
 * multi-threaded WASM — a hair slower than realtime — and one completed run
 * replaces it with the truth for this device.
 */
const SEED_RATE = 1.03;

/** Seconds of work per second of audio, learned from completed runs in this
 *  session. More trustworthy than anything one chunk can tell us. */
let learnedRate: number | undefined;
/** Raised when a run underran anyway, so the next one hedges harder. */
let extraSafety = 1;

const clamp = (min: number, value: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** One context for the tab: browsers cap how many you may create. */
let sharedContext: AudioContext | null = null;

/**
 * Call this synchronously inside the click handler: creating and resuming the
 * context is what the browser's autoplay policy is watching for.
 */
export function ensureAudioContext(): AudioContext {
  sharedContext ??= new AudioContext({ sampleRate: 24000 });
  // A tab that went to the background may have suspended it.
  void sharedContext.resume();
  return sharedContext;
}

/** Create this when synthesis begins: its clock times generation, so it must
 *  not be started while the model is still downloading. */
export function createPlayer({
  totalChars = 0,
  onFirstSound,
  onBuffering,
}: PlayerOptions = {}): Player {
  const ctx = ensureAudioContext();
  // Inference blocks the main thread for seconds at a time, so anything timed
  // with performance.now() or setTimeout reports late. The audio clock keeps
  // running regardless, which makes it the only trustworthy one here.
  const ctxCreatedAt = ctx.currentTime;
  const sources: AudioBufferSourceNode[] = [];

  let nextStart = 0;
  let playbackStart = 0;
  let totalSecs = 0;
  let underruns = 0;
  let firstSoundSecs = 0;
  let announced = false;
  let scheduled = false;
  let stopped = false;
  let startTimer = 0;

  // Steady-state rate, measured from the second chunk onwards so that the
  // first one's setup cost stays out of it.
  let lastArrival = 0;
  let steadyWork = 0;
  let steadyAudio = 0;

  /** Tell the caller sound has begun, once. */
  function announce() {
    if (stopped || announced) return;
    announced = true;
    onFirstSound?.();
  }

  /** How far into the future the first sentence should start. */
  function cushionFor(chunkSecs: number, chunkChars: number): number {
    const secsPerChar = chunkChars > 0 ? chunkSecs / chunkChars : 0;
    const remainingSecs =
      Math.max(0, totalChars - chunkChars) * secsPerChar;
    // Nearly all of the text is in this chunk: nothing left to fall behind.
    if (remainingSecs < 0.5) return 0;

    const rate = learnedRate ?? SEED_RATE;
    const deficit = (rate - 1) * remainingSecs * SAFETY * extraSafety;
    return clamp(MIN_CUSHION, deficit, MAX_CUSHION);
  }

  return {
    get totalSecs() {
      return totalSecs;
    },
    get underruns() {
      return underruns;
    },
    get firstSoundSecs() {
      return firstSoundSecs;
    },

    enqueue(chunk) {
      if (stopped) return;
      const buffer = ctx.createBuffer(1, chunk.samples.length, chunk.sampleRate);
      buffer.copyToChannel(chunk.samples, 0);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const now = performance.now();
      if (!scheduled) {
        scheduled = true;
        const cushion = cushionFor(buffer.duration, chunk.chars);
        nextStart = ctx.currentTime + cushion;
        // Known the moment it is scheduled: the audio clock will honour it
        // even while the main thread is busy generating the rest.
        playbackStart = nextStart;
        firstSoundSecs = playbackStart - ctxCreatedAt;
        if (cushion > 0.05) {
          onBuffering?.(cushion);
          startTimer = window.setTimeout(announce, cushion * 1000);
        } else {
          announce();
        }
      } else {
        // Falling back to "now" means generation lost the race with playback,
        // which is what a listener hears as a gap.
        if (ctx.currentTime > nextStart + 0.01) underruns++;
        nextStart = Math.max(nextStart, ctx.currentTime);
        steadyWork += (now - lastArrival) / 1000;
        steadyAudio += buffer.duration;
        // The timer above may have been starved; the clock decides.
        if (ctx.currentTime >= playbackStart) announce();
      }
      lastArrival = now;

      source.start(nextStart);
      sources.push(source);
      nextStart += buffer.duration;
      totalSecs += buffer.duration;
    },

    finish() {
      if (stopped) return Promise.resolve();
      if (ctx.currentTime >= playbackStart) announce();
      // Teach the session what this device actually manages, so the next run
      // sizes its cushion from measurement rather than from one sentence.
      if (steadyAudio > 0) {
        learnedRate = steadyWork / steadyAudio;
        if (underruns > 0) extraSafety = Math.min(3, extraSafety * 1.5);
      }
      const remainingMs = Math.max(0, (nextStart - ctx.currentTime) * 1000);
      return new Promise((resolve) =>
        window.setTimeout(resolve, remainingMs + 100),
      );
    },

    stop() {
      stopped = true;
      window.clearTimeout(startTimer);
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
