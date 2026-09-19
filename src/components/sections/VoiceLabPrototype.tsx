"use client";

/**
 * ============================================================
 *  PROTOTYPE — throwaway, do not ship.
 *  Three variants of the VoiceLab section on the real page,
 *  switchable via ?variant=A|B|C (floating bar, dev-only).
 *  State is FAKED (timed transitions + the browser's own voice)
 *  so the design can be judged without the 92 MB model.
 *  The winner gets rewritten properly as VoiceLab.tsx.
 * ============================================================
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Play, Square } from "lucide-react";
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
      u.onend = u.onerror = () =>
        setState((s) => ({ ...s, phase: "ready" }));
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

const busy = (p: TtsState["phase"]) =>
  p === "loading" || p === "synthesizing";

/* ----------------------- Variant A — terminal ----------------------- */

function statusLinesA(s: TtsState): string[] {
  const lines = [`▸ model: ${MODEL_LABEL} · q8 · ${MODEL_SIZE_MB} MB`];
  if (s.phase === "idle")
    lines.push("▸ nothing downloaded yet — synth to begin");
  if (s.phase === "loading")
    lines.push(
      `▸ downloading weights … ${Math.round(s.progress)}%  [${"█".repeat(Math.round(s.progress / 10)).padEnd(10, "░")}]`,
    );
  if (s.tier)
    lines.push(
      s.tier === "web-speech"
        ? "▸ backend: web-speech (fallback — browser voice, not the model)"
        : `▸ backend: ${s.tier} · on-device`,
    );
  if (s.phase === "synthesizing") lines.push("▸ running inference …");
  if (s.phase === "speaking") lines.push("▸ playing ▶");
  if (s.timing)
    lines.push(`✓ ${s.timing.audioSecs}s of audio in ${s.timing.genSecs}s`);
  return lines;
}

function VariantA({ state, speak, stop, setVoice }: Driver) {
  const [text, setText] = useState(SAMPLE_TEXT);
  return (
    <section className="scroll-mt-24 py-20">
      <SectionHeading
        id="voice-lab"
        num="0x07"
        slug="voice-lab"
        title="Voice Lab"
        subtitle="A neural text-to-speech model, running in your browser. No server, no API — your text never leaves this tab."
      />
      <div className="overflow-hidden rounded-lg border border-outline">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-outline bg-surface-container-high px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-error/60" aria-hidden />
          <span className="size-2.5 rounded-full bg-warning/60" aria-hidden />
          <span className="size-2.5 rounded-full bg-success/60" aria-hidden />
          <span className="text-code-sm ml-2 text-on-surface-variant">
            abubakar@portfolio:~/voice-lab
          </span>
        </div>
        {/* Dark terminal body */}
        <div className="bg-inverse-surface p-5 font-mono">
          <div aria-live="polite" className="text-code-sm flex min-h-28 flex-col gap-1.5 text-inverse-on-surface/80">
            {statusLinesA(state).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          {/* Voice flags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {VOICES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVoice(v.id)}
                className={`text-code-sm rounded border px-2 py-1 transition-colors ${
                  state.voice === v.id
                    ? "border-inverse-primary text-inverse-primary"
                    : "border-inverse-on-surface/20 text-inverse-on-surface/60 hover:text-inverse-on-surface"
                }`}
              >
                --voice {v.id}
              </button>
            ))}
          </div>
          {/* Prompt row */}
          <div className="mt-4 flex items-center gap-2 border-t border-inverse-on-surface/15 pt-4">
            <span className="text-inverse-primary" aria-hidden>
              $
            </span>
            <input
              value={text}
              maxLength={MAX_TEXT_LENGTH}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && speak(text)}
              aria-label="Text to speak"
              className="text-code-sm min-w-0 flex-1 bg-transparent text-inverse-on-surface outline-none placeholder:text-inverse-on-surface/40"
              placeholder="type something for the model to say…"
            />
            {state.phase === "speaking" ? (
              <button
                type="button"
                onClick={stop}
                className="text-code-sm rounded border border-inverse-on-surface/30 px-3 py-1 text-inverse-on-surface hover:border-inverse-primary hover:text-inverse-primary"
              >
                stop
              </button>
            ) : (
              <button
                type="button"
                onClick={() => speak(text)}
                disabled={busy(state.phase)}
                className="text-code-sm rounded border border-inverse-primary px-3 py-1 text-inverse-primary transition-opacity disabled:opacity-40"
              >
                {busy(state.phase) ? "…" : "synth ⏎"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Variant B — console split -------------------- */

function VariantB({ state, speak, stop, setVoice }: Driver) {
  const [text, setText] = useState(SAMPLE_TEXT);
  const rows: [string, string][] = [
    ["model", `${MODEL_LABEL} · Apache-2.0`],
    ["weights", `${MODEL_SIZE_MB} MB · q8 quantized`],
    [
      "backend",
      state.tier === "web-speech"
        ? "browser voice (fallback)"
        : state.tier
          ? `${state.tier} · on-device`
          : "— not loaded",
    ],
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
      <SectionHeading
        id="voice-lab"
        num="0x07"
        slug="voice-lab"
        title="Voice Lab"
        subtitle="An 82M-parameter speech model, downloaded to this tab on demand and run on your hardware. Type anything — nothing is sent anywhere."
      />
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
    </section>
  );
}

/* --------------------- Variant C — player pill --------------------- */

function statusLineC(s: TtsState): string {
  if (s.phase === "idle")
    return `// ${MODEL_LABEL} · ${MODEL_SIZE_MB} MB · downloads on first play`;
  if (s.phase === "loading") return `// downloading model … ${Math.round(s.progress)}%`;
  if (s.phase === "synthesizing") return "// synthesizing on your device …";
  if (s.tier === "web-speech")
    return "// fallback: your browser's voice (the model couldn't load)";
  if (s.timing)
    return `// ${s.timing.audioSecs}s of audio in ${s.timing.genSecs}s · ${s.tier} · on-device`;
  return `// ready · ${s.tier} · on-device`;
}

function VariantC({ state, speak, stop, setVoice }: Driver) {
  const [text, setText] = useState(SAMPLE_TEXT);
  const voiceIdx = VOICES.findIndex((v) => v.id === state.voice);
  const speaking = state.phase === "speaking";
  return (
    <section className="scroll-mt-24 py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <p className="text-code-sm text-on-surface-variant">
          <span className="text-primary">0x07</span>{" "}
          <span aria-hidden>{"//"}</span> voice-lab
        </p>
        <h2 className="text-headline-lg text-on-surface">
          Type it. My site says it.
        </h2>
        <p className="text-body-md max-w-md text-on-surface-variant">
          A neural voice model runs right here in your browser — your words
          never leave this tab.
        </p>
        <div className="flex w-full items-center gap-2 rounded-full border border-outline bg-surface-container-lowest p-2 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.15)]">
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
            onKeyDown={(e) => e.key === "Enter" && !busy(state.phase) && speak(text)}
            aria-label="Text to speak"
            className="text-body-md min-w-0 flex-1 bg-transparent text-on-surface outline-none placeholder:text-on-surface-variant"
            placeholder="Say something…"
          />
          <button
            type="button"
            onClick={() =>
              setVoice(VOICES[(voiceIdx + 1) % VOICES.length].id)
            }
            title="Change voice"
            className="text-code-sm shrink-0 rounded-full border border-outline-variant px-3 py-1.5 text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            {VOICES[voiceIdx].label.split(" — ")[0]} ↺
          </button>
        </div>
        {state.phase === "loading" && (
          <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        )}
        <p aria-live="polite" className="text-code-sm text-on-surface-variant">
          {statusLineC(state)}
        </p>
      </div>
    </section>
  );
}

/* --------------------------- switcher bar --------------------------- */

const VARIANTS = [
  { key: "A", name: "Terminal session" },
  { key: "B", name: "Console split" },
  { key: "C", name: "Player pill" },
] as const;

export function VoiceLabPrototype() {
  const [variant, setVariant] = useState("A");
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
      {variant === "A" && <VariantA {...driver} />}
      {variant === "B" && <VariantB {...driver} />}
      {variant === "C" && <VariantC {...driver} />}
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
