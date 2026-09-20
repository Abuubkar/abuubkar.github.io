"use client";

import { useEffect, useState } from "react";
import { MODEL_LABEL, type TtsState } from "../engine";

const STAGES = ["text", "phonemes", MODEL_LABEL, "waveform", "audio out"];
// Named positions in STAGES, so the glow logic below reads as intent.
const STAGE = { text: 0, phonemes: 1, model: 2, waveform: 3, audioOut: 4 };

type ChipState = "active" | "done" | "idle";

const CHIP_STYLES: Record<ChipState, string> = {
  active: "animate-pulse border-primary bg-primary/5 text-primary",
  done: "border-outline text-on-surface",
  idle: "border-outline-variant text-on-surface-variant",
};

/**
 * Which chip glows. Phonemize, tokenize, infer and vocode all happen inside
 * one generate() call, so the strip time-slices that known internal order
 * rather than pretending to observe it.
 */
function useActiveStage(state: TtsState): number {
  const [active, setActive] = useState(-1);
  const { phase, tier } = state;

  useEffect(() => {
    const timers: number[] = [];
    const at = (value: number, ms: number) =>
      timers.push(window.setTimeout(() => setActive(value), ms));

    if (tier === "web-speech") {
      // The fallback skips the model entirely, so only the ends light up.
      at(phase === "speaking" ? STAGE.audioOut : -1, 0);
    } else if (phase === "loading") {
      at(STAGE.model, 0); // the weights belong to the model chip
    } else if (phase === "synthesizing") {
      at(STAGE.text, 0);
      at(STAGE.phonemes, 300);
      at(STAGE.model, 750);
    } else if (phase === "speaking") {
      at(STAGE.waveform, 0);
      at(STAGE.audioOut, 450);
    } else {
      at(-1, 0);
    }

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [phase, tier]);

  return active;
}

function chipState(state: TtsState, active: number, i: number): ChipState {
  // In the fallback, the model's middle stages never ran and never glow.
  const skipped =
    state.tier === "web-speech" && i > STAGE.text && i < STAGE.audioOut;
  if (state.phase === "loading") return i === STAGE.model ? "active" : "idle";
  if (active >= 0)
    return i === active ? "active" : i < active && !skipped ? "done" : "idle";
  if (state.phase === "ready" && state.timing) return "done";
  return "idle";
}

/** Decorative: the telemetry panel carries the same information as text. */
export function PipelineStrip({ state }: { state: TtsState }) {
  const active = useActiveStage(state);

  return (
    <div
      aria-hidden
      className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-outline-variant bg-surface-container p-4"
    >
      {STAGES.map((stage, i) => {
        const chip = chipState(state, active, i);
        return (
          <span key={stage} className="flex items-center gap-2">
            {i > 0 && (
              <span
                className={`text-code-sm ${chip === "idle" ? "text-outline" : "text-primary"}`}
              >
                →
              </span>
            )}
            <span
              className={`text-code-sm rounded-md border px-2.5 py-1.5 transition-colors ${CHIP_STYLES[chip]}`}
            >
              {stage}
            </span>
          </span>
        );
      })}
    </div>
  );
}
