"use client";

import { useEffect, useRef } from "react";
import { Loader2, Mic } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import {
  MODEL_SIZE_MB,
  runSample,
  startListening,
  stop,
  stopListening,
  type SttPhase,
  type SttState,
} from "../engine";
import { useStt } from "../hooks/useStt";
import { Telemetry } from "./Telemetry";

const listen = siteConfig.labs.listen;
const ui = listen.ui;

/** Working on it: the control spins and refuses new input. */
const busy = (phase: SttPhase) =>
  phase === "loading" || phase === "transcribing";

const ERROR_COPY: Record<NonNullable<SttState["error"]>, string> = {
  "load-failed": listen.errors.load,
  "mic-denied": listen.errors.denied,
  "mic-unavailable": listen.errors.unavailable,
  "mic-insecure": listen.errors.insecure,
  "transcribe-failed": listen.errors.run,
};

export function ListenLab() {
  const state = useStt();
  const recording = state.phase === "recording";

  // A pointer that goes down on the button and up anywhere else still ends
  // the clip: releasing outside the element is the normal way to cancel a
  // press, and leaving the microphone open would be the wrong reading.
  const held = useRef(false);
  useEffect(() => {
    const release = () => {
      if (!held.current) return;
      held.current = false;
      void stopListening();
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, []);

  const press = () => {
    if (busy(state.phase) || recording) return;
    held.current = true;
    void startListening();
  };

  const release = () => {
    if (!held.current) return;
    held.current = false;
    void stopListening();
  };

  /** Space and Enter hold the same way a pointer does, so the experiment is
   *  reachable without one. A button fires click on Space keyup, which would
   *  arrive after the key has already released the clip — these handlers run
   *  first and the button has no onClick to conflict with. */
  const isActivation = (key: string) => key === " " || key === "Enter";

  return (
    <section className="scroll-mt-24 py-20">
      <SectionHeading
        id={listen.slug}
        num={listen.num}
        slug={listen.slug}
        title={listen.title}
        subtitle={listen.label}
      />

      <Reveal>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4 rounded-lg border border-outline-variant bg-surface-container p-5">
            <p className="text-label-caps text-on-surface-variant">
              {ui.transcriptLabel}
            </p>

            {/* Selectable on purpose: a transcript nobody can copy is a
                picture of text. */}
            <div className="text-body-md min-h-32 w-full rounded-md border border-outline-variant bg-surface-container-lowest p-4 text-on-surface">
              {state.transcript || (
                <span className="text-on-surface-variant">{ui.empty}</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onPointerDown={press}
                onKeyDown={(event) => {
                  if (!isActivation(event.key) || event.repeat) return;
                  event.preventDefault();
                  press();
                }}
                onKeyUp={(event) => {
                  if (!isActivation(event.key)) return;
                  event.preventDefault();
                  release();
                }}
                disabled={busy(state.phase)}
                aria-pressed={recording}
                className={recording ? "animate-pulse" : ""}
              >
                {busy(state.phase) ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Mic className="size-4" aria-hidden />
                )}
                {!state.loaded
                  ? `${listen.cta.load} (${MODEL_SIZE_MB} MB)`
                  : recording
                    ? listen.cta.release
                    : listen.cta.hold}
              </Button>

              <Button
                variant="ghost"
                onClick={() => void runSample()}
                disabled={busy(state.phase) || recording}
              >
                {listen.cta.sample}
              </Button>

              {(recording || busy(state.phase)) && (
                <Button variant="ghost" onClick={stop}>
                  {listen.cta.stop}
                </Button>
              )}
            </div>

            <p className="text-code-sm text-on-surface-variant">
              {ui.sampleNote}
            </p>

            {state.error && (
              <p className="text-code-sm text-error" role="alert">
                {ERROR_COPY[state.error]}
              </p>
            )}
          </div>

          <Telemetry state={state} />
        </div>
      </Reveal>
    </section>
  );
}
