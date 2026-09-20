"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import {
  MAX_TEXT_LENGTH,
  MODEL_SIZE_MB,
  VOICES,
  setVoice,
  speak,
  stop,
  type TtsPhase,
  type VoiceId,
} from "../engine";
import { useTts } from "../hooks/useTts";
import { PipelineStrip } from "./PipelineStrip";
import { Telemetry } from "./Telemetry";

// Named voiceLab to avoid confusion with state.voice (the selected speaker).
const { voice: voiceLab } = siteConfig.labs;

/** Working on it: the button spins and stays disabled. Buffering counts —
 *  audio exists by then, it just hasn't been released yet. */
const busy = (phase: TtsPhase) =>
  phase === "loading" || phase === "synthesizing" || phase === "buffering";

/** Everything from the first token to the last sample is worth a Stop:
 *  synthesis is the longest wait, so leaving it uncancellable strands people.
 *  The model download is the exception — it carries on and is cached, so a
 *  Stop there would be a lie. */
const cancellable = (phase: TtsPhase) =>
  phase === "synthesizing" || phase === "buffering" || phase === "speaking";

/** Which phases accept a new run. "error" is one of them on purpose: the
 *  download may have failed for a passing reason, so the button retries
 *  rather than sitting dead for the life of the page. */
const canSpeak = (phase: TtsPhase) =>
  phase === "idle" || phase === "ready" || phase === "error";

export function VoiceLab() {
  const state = useTts();
  const [text, setText] = useState<string>(voiceLab.sampleText);

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
        <PipelineStrip state={state} hasText={text.trim().length > 0} />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4 rounded-lg border border-outline-variant bg-surface-container p-5">
            <label
              htmlFor="voicelab-text"
              className="text-label-caps text-on-surface-variant"
            >
              {voiceLab.ui.inputLabel}
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
                aria-label={voiceLab.ui.voiceLabel}
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
                disabled={!canSpeak(state.phase) || !text.trim()}
              >
                {busy(state.phase) && (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                )}
                {state.tier === null
                  ? `${voiceLab.cta.load} (${MODEL_SIZE_MB} MB)`
                  : voiceLab.cta.speak}
              </Button>
              {cancellable(state.phase) && (
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

          <Telemetry state={state} />
        </div>
      </Reveal>
    </section>
  );
}
