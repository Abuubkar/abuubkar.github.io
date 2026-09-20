"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Loader2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import {
  MAX_TEXT_LENGTH,
  MODEL_LABEL,
  MODEL_SIZE_MB,
  MODEL_VERSION,
  VOICES,
  setVoice,
  speak,
  stop,
  type TtsPhase,
  type TtsState,
  type VoiceId,
} from "../engine";
import { useTts } from "./useTts";
import { wasmThreadCount } from "./threads";

/** Client-only read: the server can't know whether this tab is isolated.
 *  Isolation never changes during a document's life, so the "subscription"
 *  just nudges React once after hydration to swap in the real value. */
const notifyAfterHydration = (onChange: () => void) => {
  const id = window.setTimeout(onChange, 0);
  return () => window.clearTimeout(id);
};
const useWasmThreads = () =>
  useSyncExternalStore(notifyAfterHydration, wasmThreadCount, () => 1);

// Named voiceLab to avoid confusion with state.voice (the selected speaker).
const { voice: voiceLab } = siteConfig.labs;

const STAGES = ["text", "phonemes", MODEL_LABEL, "waveform", "audio out"];
// Named positions in STAGES, so the glow logic below reads as intent.
const STAGE = { text: 0, phonemes: 1, model: 2, waveform: 3, audioOut: 4 };

const busy = (p: TtsPhase) => p === "loading" || p === "synthesizing";

/**
 * Which pipeline chip glows. Phonemize → tokenize → model → vocode all run
 * inside one generate() call, so the strip time-slices that known internal
 * order rather than pretending to observe it.
 */
function useActiveStage(state: TtsState): number {
  const [active, setActive] = useState(-1);
  const { phase, tier } = state;
  useEffect(() => {
    const timers: number[] = [];
    const at = (value: number, ms: number) =>
      timers.push(window.setTimeout(() => setActive(value), ms));
    if (tier === "web-speech") {
      // Fallback skips the model pipeline entirely — only the endpoints glow.
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

type ChipState = "active" | "done" | "idle";

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

const CHIP_STYLES: Record<ChipState, string> = {
  active: "animate-pulse border-primary bg-primary/5 text-primary",
  done: "border-outline text-on-surface",
  idle: "border-outline-variant text-on-surface-variant",
};

export function VoiceLab() {
  const state = useTts();
  const [text, setText] = useState<string>(voiceLab.sampleText);
  const active = useActiveStage(state);
  const threads = useWasmThreads();

  const rows: [string, string][] = [
    ["model", `${MODEL_LABEL} ${MODEL_VERSION} · Apache-2.0`],
    ["weights", `${MODEL_SIZE_MB} MB · q8 quantized`],
    [
      "backend",
      state.tier === "web-speech"
        ? "browser voice (fallback)"
        : state.tier
          ? `${state.tier} · on-device`
          : "— not loaded",
    ],
    [
      "threads",
      threads > 1
        ? `${threads} · cross-origin isolated`
        : "1 · not isolated",
    ],
    [
      "last run",
      state.timing
        ? `${state.timing.audioSecs}s audio · sound in ${state.timing.firstSoundSecs}s`
        : "—",
    ],
  ];

  return (
    <section className="scroll-mt-24 py-20">
      <SectionHeading
        id={voiceLab.slug}
        num={voiceLab.num}
        slug={voiceLab.slug}
        title={voiceLab.title}
        subtitle={voiceLab.label}
      />

      <Reveal>
        {/* Pipeline strip — stage chips only; the numbers live in telemetry */}
        <div
          aria-hidden
          className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-outline-variant bg-surface-container p-4"
        >
          {STAGES.map((stage, i) => {
            const st = chipState(state, active, i);
            return (
              <span key={stage} className="flex items-center gap-2">
                {i > 0 && (
                  <span
                    className={`text-code-sm ${st === "idle" ? "text-outline" : "text-primary"}`}
                  >
                    →
                  </span>
                )}
                <span
                  className={`text-code-sm rounded-md border px-2.5 py-1.5 transition-colors ${CHIP_STYLES[st]}`}
                >
                  {stage}
                </span>
              </span>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Input panel */}
          <div className="flex flex-col gap-4 rounded-lg border border-outline-variant bg-surface-container p-5">
            <label
              htmlFor="voicelab-text"
              className="text-label-caps text-on-surface-variant"
            >
              input text
            </label>
            <textarea
              id="voicelab-text"
              value={text}
              maxLength={MAX_TEXT_LENGTH}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="text-body-md w-full resize-none rounded-md border border-outline-variant bg-surface-container-lowest p-4 text-on-surface outline-none focus:border-primary"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <select
                value={state.voice}
                onChange={(e) => setVoice(e.target.value as VoiceId)}
                disabled={state.tier === "web-speech"}
                aria-label="Voice"
                className="text-code-sm rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface outline-none focus:border-primary disabled:opacity-50"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
              <span className="text-code-sm text-on-surface-variant">
                {text.length}/{MAX_TEXT_LENGTH}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={() => speak(text)}
                disabled={
                  busy(state.phase) ||
                  state.phase === "speaking" ||
                  state.phase === "error" ||
                  !text.trim()
                }
              >
                {busy(state.phase) && (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                )}
                {state.phase === "idle"
                  ? `${voiceLab.cta.load} (${MODEL_SIZE_MB} MB)`
                  : voiceLab.cta.speak}
              </Button>
              {state.phase === "speaking" && (
                <Button variant="ghost" onClick={stop}>
                  {voiceLab.cta.stop}
                </Button>
              )}
            </div>
            {state.error && (
              <p className="text-code-sm text-error" role="alert">
                {state.phase === "error"
                  ? voiceLab.errors.fatal
                  : state.error === "load-failed"
                    ? voiceLab.errors.fallback
                    : voiceLab.errors.run}
              </p>
            )}
          </div>

          {/* Telemetry panel */}
          <div
            aria-live="polite"
            className="bracket-corners flex flex-col gap-3 rounded-lg border border-outline bg-surface-container-lowest p-5"
          >
            <p className="text-label-caps text-on-surface-variant">
              <span className="text-primary">{"//"}</span> telemetry
            </p>
            {rows.map(([k, v]) => (
              <div
                key={k}
                className="text-code-sm flex items-baseline justify-between gap-3 border-b border-outline-variant pb-2 last:border-0"
              >
                <span className="text-on-surface-variant">{k}</span>
                <span className="text-right text-on-surface">{v}</span>
              </div>
            ))}
            {state.phase === "loading" && (
              <div>
                <div className="h-1 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-150"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
                <p className="text-code-sm mt-2 text-on-surface-variant">
                  downloading {Math.round(state.progress)}%
                </p>
              </div>
            )}
            {state.phase === "speaking" && (
              <div className="flex h-6 items-end gap-1" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 animate-pulse rounded-full bg-primary"
                    style={{
                      height: `${[60, 100, 40, 80, 55][i]}%`,
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
