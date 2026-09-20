"use client";

import { siteConfig } from "@/config/site";
import { MODEL_LABEL, type TtsState } from "../engine";

const labels = siteConfig.labs.voice.ui.stages;
// The model names itself; the rest are copy. Order is the pipeline's order.
const STAGES = [
  labels.text,
  labels.phonemes,
  MODEL_LABEL,
  labels.waveform,
  labels.audioOut,
];

type ChipState = "active" | "done" | "idle";

const CHIP_STYLES: Record<ChipState, string> = {
  active: "animate-pulse border-primary bg-primary/5 text-primary",
  done: "border-outline text-on-surface",
  idle: "border-outline-variant text-on-surface-variant",
};

/**
 * Reads the chips straight off engine state, so each one says something true
 * at the moment it is drawn. An earlier version animated them on a fixed
 * timeline, which broke twice over: inference blocked the main thread, so
 * the timers fired late and bunched up, and the early stages were already
 * past by the time anyone saw them.
 *
 * "done" is sticky where the work stays done — text you have typed, a model
 * already in memory — so the strip shows what is ready, not just what moved.
 */
function chipStates(state: TtsState, hasText: boolean): ChipState[] {
  const { phase, tier, timing } = state;
  const fallback = tier === "web-speech";
  const playing = phase === "buffering" || phase === "speaking";
  // `timing` lands exactly when the last chunk is generated, so before it
  // arrives the model is still working even if audio is already playing.
  const generating = phase === "synthesizing" || (playing && !timing);
  const producedAudio = playing || timing !== null;

  const staged = (): ChipState =>
    fallback ? "idle" : generating ? "active" : producedAudio ? "done" : "idle";

  return [
    hasText ? "done" : "idle",
    staged(),
    phase === "loading" ? "active" : tier && !fallback ? "done" : "idle",
    staged(),
    playing ? "active" : timing ? "done" : "idle",
  ];
}

/** Decorative: the telemetry panel carries the same information as text. */
export function PipelineStrip({
  state,
  hasText,
}: {
  state: TtsState;
  hasText: boolean;
}) {
  const chips = chipStates(state, hasText);

  return (
    <div
      aria-hidden
      className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-outline-variant bg-surface-container p-4"
    >
      {STAGES.map((stage, i) => (
        <span key={stage} className="flex items-center gap-2">
          {i > 0 && (
            <span
              className={`text-code-sm ${chips[i] === "idle" ? "text-outline" : "text-primary"}`}
            >
              →
            </span>
          )}
          <span
            className={`text-code-sm rounded-md border px-2.5 py-1.5 transition-colors ${CHIP_STYLES[chips[i]]}`}
          >
            {stage}
          </span>
        </span>
      ))}
    </div>
  );
}
