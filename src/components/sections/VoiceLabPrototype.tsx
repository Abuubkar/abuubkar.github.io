"use client";

/**
 * ============================================================
 *  PROTOTYPE — throwaway, do not ship.
 *  Round 2: four experiments on the "Console split" (B) theme,
 *  switchable via ?variant=B1|B2|B3|B4 (floating bar, dev-only).
 *  Round 1 (Terminal / Console split / Player pill) lives in
 *  git history at ac7b57a.
 *  State is FAKED (timed transitions + the browser's own voice)
 *  so the design can be judged without the 92 MB model.
 *  The winner gets rewritten properly as VoiceLab.tsx.
 * ============================================================
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Play,
  Square,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  MAX_TEXT_LENGTH,
  MODEL_LABEL,
  MODEL_SIZE_MB,
  VOICES,
  type TtsState,
  type VoiceId,
} from "@/lib/tts";

const SAMPLE_TEXT =
  "Hi, I'm Abubakar's portfolio. Every word you hear is synthesized right now, on your device.";

/* ------------------------- fake engine driver ------------------------- */

function useFakeTts(failLoad: boolean) {
  const [state, setState] = useState<TtsState>({
    phase: "idle",
    progress: 0,
    tier: null,
    voice: VOICES[0].id,
    error: null,
    timing: null,
  });
  const timers = useRef<number[]>([]);
  const loaded = useRef(false);

  const clear = () => {
    timers.current.forEach((t) => window.clearInterval(t));
    timers.current = [];
  };

  const stop = useCallback(() => {
    clear();
    window.speechSynthesis?.cancel();
    setState((s) => ({ ...s, phase: loaded.current ? "ready" : "idle" }));
  }, []);

  const speakOut = useCallback((text: string) => {
    setState((s) => ({
      ...s,
      phase: "speaking",
      timing: s.tier === "wasm" ? { audioSecs: 6.2, genSecs: 1.4 } : null,
    }));
    if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.onend = u.onerror = () => setState((s) => ({ ...s, phase: "ready" }));
      window.speechSynthesis.speak(u);
    } else {
      timers.current.push(
        window.setTimeout(
          () => setState((s) => ({ ...s, phase: "ready" })),
          3000,
        ) as unknown as number,
      );
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      clear();
      window.speechSynthesis?.cancel();
      if (!loaded.current) {
        setState((s) => ({ ...s, phase: "loading", progress: 0 }));
        const iv = window.setInterval(() => {
          setState((s) => {
            const next = s.progress + 2 + Math.random() * 3;
            if (failLoad && next >= 61) {
              window.clearInterval(iv);
              loaded.current = true;
              // Simulated load failure → honest web-speech fallback tier.
              window.setTimeout(() => speakOut(text), 400);
              return { ...s, progress: 61, tier: "web-speech", phase: "ready" };
            }
            if (next >= 100) {
              window.clearInterval(iv);
              loaded.current = true;
              window.setTimeout(() => {
                setState((v) => ({ ...v, phase: "synthesizing" }));
                window.setTimeout(() => speakOut(text), 900);
              }, 150);
              return { ...s, progress: 100, tier: "wasm" };
            }
            return { ...s, progress: next };
          });
        }, 60);
        timers.current.push(iv);
      } else if (failLoad || state.tier === "web-speech") {
        speakOut(text);
      } else {
        setState((s) => ({ ...s, phase: "synthesizing" }));
        timers.current.push(
          window.setTimeout(() => speakOut(text), 900) as unknown as number,
        );
      }
    },
    [failLoad, speakOut, state.tier],
  );

  const setVoice = useCallback(
    (voice: VoiceId) => setState((s) => ({ ...s, voice })),
    [],
  );

  useEffect(() => () => clear(), []);
  return { state, speak, stop, setVoice };
}

type Driver = ReturnType<typeof useFakeTts>;

const busy = (p: TtsState["phase"]) => p === "loading" || p === "synthesizing";

const HEADING = {
  id: "voice-lab",
  num: "0x07",
  slug: "voice-lab",
  title: "Voice Lab",
  subtitle:
    "An 82M-parameter speech model, downloaded to this tab on demand and run on your hardware. Type anything — nothing is sent anywhere.",
};

const backendLabel = (s: TtsState) =>
  s.tier === "web-speech"
    ? "browser voice (fallback)"
    : s.tier
      ? `${s.tier} · on-device`
      : "— not loaded";

/* ------------- B1 — console split (round-1 baseline) ------------- */

function VariantB1({ state, speak, stop, setVoice }: Driver) {
  const [text, setText] = useState(SAMPLE_TEXT);
  const rows: [string, string][] = [
    ["model", `${MODEL_LABEL} · Apache-2.0`],
    ["weights", `${MODEL_SIZE_MB} MB · q8 quantized`],
    ["backend", backendLabel(state)],
    ["status", state.phase],
    [
      "last run",
      state.timing
        ? `${state.timing.audioSecs}s audio in ${state.timing.genSecs}s`
        : "—",
    ],
  ];
  return (
    <section className="scroll-mt-24 py-20">
      <SectionHeading {...HEADING} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
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
              aria-label="Voice"
              className="text-code-sm rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface outline-none focus:border-primary"
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
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => speak(text)}
              disabled={busy(state.phase) || state.phase === "speaking"}
            >
              {busy(state.phase) && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {state.phase === "idle"
                ? `Load model + speak (${MODEL_SIZE_MB} MB)`
                : "Synthesize speech"}
            </Button>
            {state.phase === "speaking" && (
              <Button variant="ghost" onClick={stop}>
                Stop
              </Button>
            )}
          </div>
        </div>
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
    </section>
  );
}

/* ---------------- B2 — pipeline stages across the top ---------------- */

const STAGES = ["text", "phonemes", "kokoro-82M", "waveform", "audio out"];

function stageState(s: TtsState, i: number): "idle" | "active" | "done" {
  if (s.phase === "loading") return i === 2 ? "active" : "idle";
  if (s.phase === "synthesizing")
    return i <= 1 ? "done" : i <= 3 ? "active" : "idle";
  if (s.phase === "speaking") return i === 4 ? "active" : "done";
  if (s.phase === "ready" && s.timing) return "done";
  return "idle";
}

function VariantB2({ state, speak, stop, setVoice }: Driver) {
  const [text, setText] = useState(SAMPLE_TEXT);
  return (
    <section className="scroll-mt-24 py-20">
      <SectionHeading {...HEADING} />
      {/* Pipeline strip */}
      <div
        aria-live="polite"
        className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-outline-variant bg-surface-container p-4"
      >
        {STAGES.map((stage, i) => {
          const st = stageState(state, i);
          return (
            <span key={stage} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className={`text-code-sm ${st === "idle" ? "text-outline" : "text-primary"}`}
                  aria-hidden
                >
                  →
                </span>
              )}
              <span
                className={`text-code-sm rounded-md border px-2.5 py-1.5 transition-colors ${
                  st === "active"
                    ? "animate-pulse border-primary bg-primary/5 text-primary"
                    : st === "done"
                      ? "border-outline text-on-surface"
                      : "border-outline-variant text-on-surface-variant"
                }`}
              >
                {stage}
              </span>
            </span>
          );
        })}
        <span className="text-code-sm ml-auto text-on-surface-variant">
          {state.phase === "loading"
            ? `downloading weights ${Math.round(state.progress)}%`
            : state.timing
              ? `✓ ${state.timing.audioSecs}s audio in ${state.timing.genSecs}s`
              : state.tier === "web-speech"
                ? "fallback: browser voice"
                : `${MODEL_SIZE_MB} MB · ${backendLabel(state)}`}
        </span>
      </div>
      {state.phase === "loading" && (
        <div className="mb-6 h-1 overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150"
            style={{ width: `${state.progress}%` }}
          />
        </div>
      )}
      {/* Input row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={text}
          maxLength={MAX_TEXT_LENGTH}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !busy(state.phase) && speak(text)}
          aria-label="Text to speak"
          className="text-body-md min-w-0 flex-1 rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:border-primary"
        />
        <select
          value={state.voice}
          onChange={(e) => setVoice(e.target.value as VoiceId)}
          aria-label="Voice"
          className="text-code-sm rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none focus:border-primary"
        >
          {VOICES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
        {state.phase === "speaking" ? (
          <Button variant="secondary" onClick={stop}>
            Stop
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => speak(text)}
            disabled={busy(state.phase)}
          >
            {busy(state.phase) && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            Run pipeline
          </Button>
        )}
      </div>
    </section>
  );
}

/* --------------- B3 — editor with an IDE status bar --------------- */

function VariantB3({ state, speak, stop, setVoice }: Driver) {
  const [text, setText] = useState(SAMPLE_TEXT);
  return (
    <section className="scroll-mt-24 py-20">
      <SectionHeading {...HEADING} />
      <div className="overflow-hidden rounded-lg border border-outline">
        {/* Editor tab bar */}
        <div className="flex items-center justify-between border-b border-outline bg-surface-container-high px-4 py-2">
          <span className="text-code-sm rounded-t border-b-2 border-primary px-2 py-1 text-on-surface">
            say-it.txt
          </span>
          <div className="flex items-center gap-2">
            <select
              value={state.voice}
              onChange={(e) => setVoice(e.target.value as VoiceId)}
              aria-label="Voice"
              className="text-code-sm rounded border border-outline-variant bg-surface-container-lowest px-2 py-1 text-on-surface outline-none focus:border-primary"
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
            {state.phase === "speaking" ? (
              <button
                type="button"
                onClick={stop}
                className="text-code-sm flex items-center gap-1.5 rounded bg-error px-3 py-1 text-on-error"
              >
                <Square className="size-3 fill-current" aria-hidden /> stop
              </button>
            ) : (
              <button
                type="button"
                onClick={() => speak(text)}
                disabled={busy(state.phase)}
                className="text-code-sm flex items-center gap-1.5 rounded bg-primary px-3 py-1 text-on-primary transition-opacity disabled:opacity-50"
              >
                {busy(state.phase) ? (
                  <Loader2 className="size-3 animate-spin" aria-hidden />
                ) : (
                  <Play className="size-3 fill-current" aria-hidden />
                )}
                run
              </button>
            )}
          </div>
        </div>
        {/* Editor body with line-number gutter */}
        <div className="flex bg-surface-container-lowest">
          <div
            className="text-code-sm select-none border-r border-outline-variant px-3 py-4 text-right text-on-surface-variant/60"
            aria-hidden
          >
            {[1, 2, 3].map((n) => (
              <div key={n} className="leading-7">
                {n}
              </div>
            ))}
          </div>
          <textarea
            value={text}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            aria-label="Text to speak"
            className="text-body-md w-full resize-none bg-transparent px-4 py-4 leading-7 text-on-surface outline-none"
          />
        </div>
        {/* Status bar */}
        <div
          aria-live="polite"
          className="text-code-sm flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-outline bg-inverse-surface px-4 py-2 text-inverse-on-surface/80"
        >
          <span className="text-inverse-primary">
            ⚡ {MODEL_LABEL} · q8 · {MODEL_SIZE_MB} MB
          </span>
          <span>{backendLabel(state)}</span>
          <span className="capitalize">
            {state.phase === "loading"
              ? `downloading ${Math.round(state.progress)}%`
              : state.phase}
          </span>
          <span className="ml-auto">
            {state.timing
              ? `${state.timing.audioSecs}s audio in ${state.timing.genSecs}s`
              : `${text.length}/${MAX_TEXT_LENGTH}`}
          </span>
        </div>
        {state.phase === "loading" && (
          <div className="h-0.5 bg-inverse-surface">
            <div
              className="h-full bg-inverse-primary transition-[width] duration-150"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

/* ----------------- B4 — waveform deck, audio-first ----------------- */

// Deterministic bar heights (no Math.random → no hydration mismatch).
const BARS = Array.from({ length: 48 }, (_, i) =>
  Math.round(24 + 70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))),
);

function VariantB4({ state, speak, stop, setVoice }: Driver) {
  const [text, setText] = useState(SAMPLE_TEXT);
  const speaking = state.phase === "speaking";
  return (
    <section className="scroll-mt-24 py-20">
      <SectionHeading {...HEADING} />
      <div className="bracket-corners rounded-lg border border-outline bg-surface-container-lowest p-6">
        {/* Waveform stage */}
        <div className="flex h-24 items-center gap-[3px]" aria-hidden>
          {BARS.map((h, i) => (
            <span
              key={i}
              className={`w-1 flex-1 rounded-full transition-colors duration-300 ${
                speaking
                  ? "animate-pulse bg-primary"
                  : state.phase === "loading" &&
                      i / BARS.length < state.progress / 100
                    ? "bg-primary/50"
                    : "bg-outline-variant"
              }`}
              style={{
                height: `${speaking ? h : state.phase === "loading" ? 30 : h * 0.45}%`,
                animationDelay: `${(i % 8) * 90}ms`,
              }}
            />
          ))}
        </div>
        <p
          aria-live="polite"
          className="text-code-sm mt-3 text-center text-on-surface-variant"
        >
          {state.phase === "idle" &&
            `${MODEL_LABEL} · ${MODEL_SIZE_MB} MB · downloads on first play`}
          {state.phase === "loading" &&
            `downloading weights … ${Math.round(state.progress)}%`}
          {state.phase === "synthesizing" && "synthesizing on your device …"}
          {speaking &&
            (state.timing
              ? `${state.timing.audioSecs}s of audio in ${state.timing.genSecs}s · ${backendLabel(state)}`
              : "playing — your browser's voice (fallback)")}
          {state.phase === "ready" &&
            (state.timing
              ? `done · ${state.timing.audioSecs}s in ${state.timing.genSecs}s · again?`
              : `ready · ${backendLabel(state)}`)}
          {state.phase === "error" && "couldn't start — try a reload"}
        </p>
        {/* Transport row */}
        <div className="mt-5 flex items-center gap-3 border-t border-outline-variant pt-5">
          <button
            type="button"
            onClick={() => (speaking ? stop() : speak(text))}
            disabled={busy(state.phase)}
            aria-label={speaking ? "Stop" : "Speak"}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-on-primary transition-all hover:brightness-110 disabled:opacity-60"
          >
            {busy(state.phase) ? (
              <Loader2 className="size-5 animate-spin" />
            ) : speaking ? (
              <Square className="size-4 fill-current" />
            ) : (
              <Play className="size-5 fill-current pl-0.5" />
            )}
          </button>
          <input
            value={text}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !busy(state.phase) && speak(text)
            }
            aria-label="Text to speak"
            className="text-body-md min-w-0 flex-1 rounded-md border border-outline-variant bg-surface-container px-4 py-3 text-on-surface outline-none focus:border-primary"
            placeholder="Type something for the model to say…"
          />
          <select
            value={state.voice}
            onChange={(e) => setVoice(e.target.value as VoiceId)}
            aria-label="Voice"
            className="text-code-sm shrink-0 rounded-md border border-outline-variant bg-surface-container px-3 py-3 text-on-surface outline-none focus:border-primary"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label.split(" — ")[0]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- switcher bar --------------------------- */

const VARIANTS = [
  { key: "B1", name: "Console split" },
  { key: "B2", name: "Pipeline" },
  { key: "B3", name: "Editor dock" },
  { key: "B4", name: "Waveform deck" },
] as const;

export function VoiceLabPrototype() {
  const [variant, setVariant] = useState("B1");
  const [failLoad, setFailLoad] = useState(false);
  const driver = useFakeTts(failLoad);

  // Sync from ?variant= after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("variant");
    if (v && VARIANTS.some((x) => x.key === v.toUpperCase()))
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prototype-only: one-time URL → state sync after hydration
      setVariant(v.toUpperCase());
  }, []);

  const cycle = useCallback((dir: 1 | -1) => {
    setVariant((cur) => {
      const idx = VARIANTS.findIndex((v) => v.key === cur);
      const next =
        VARIANTS[(idx + dir + VARIANTS.length) % VARIANTS.length].key;
      const url = new URL(window.location.href);
      url.searchParams.set("variant", next);
      window.history.replaceState(null, "", url);
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.isContentEditable
      )
        return;
      if (e.key === "ArrowLeft") cycle(-1);
      if (e.key === "ArrowRight") cycle(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycle]);

  // Never ship: the whole prototype renders nothing in production builds.
  if (process.env.NODE_ENV === "production") return null;

  const current = VARIANTS.find((v) => v.key === variant)!;
  return (
    <>
      {variant === "B1" && <VariantB1 {...driver} />}
      {variant === "B2" && <VariantB2 {...driver} />}
      {variant === "B3" && <VariantB3 {...driver} />}
      {variant === "B4" && <VariantB4 {...driver} />}
      <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full border border-outline bg-inverse-surface px-2 py-1.5 text-inverse-on-surface shadow-lg">
        <button
          type="button"
          onClick={() => cycle(-1)}
          aria-label="Previous variant"
          className="grid size-7 place-items-center rounded-full hover:bg-inverse-on-surface/10"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-code-sm min-w-40 text-center">
          {current.key} · {current.name}
        </span>
        <button
          type="button"
          onClick={() => cycle(1)}
          aria-label="Next variant"
          className="grid size-7 place-items-center rounded-full hover:bg-inverse-on-surface/10"
        >
          <ChevronRight className="size-4" />
        </button>
        <label className="text-code-sm ml-2 flex items-center gap-1.5 border-l border-inverse-on-surface/20 pl-2.5 pr-1">
          <input
            type="checkbox"
            checked={failLoad}
            onChange={(e) => setFailLoad(e.target.checked)}
          />
          fail load
        </label>
      </div>
    </>
  );
}
