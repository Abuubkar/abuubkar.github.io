"use client";

import { siteConfig } from "@/config/site";
import {
  MODEL_DTYPE,
  MODEL_LABEL,
  MODEL_LICENSE,
  MODEL_SIZE_MB,
  MODEL_VERSION,
  type TtsState,
} from "../engine";

const t = siteConfig.labs.voice.ui.telemetry;

/** Fill `{name}` placeholders in a config string. */
const fill = (template: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );

/** Sentences that arrived too late to play seamlessly. Worth saying out
 *  loud either way: "no gaps" is the claim the head start is making. */
function describeGaps(underruns: number): string {
  if (underruns === 0) return t.noGaps;
  return underruns === 1 ? t.oneGap : fill(t.manyGaps, { count: underruns });
}

function describeTier(state: TtsState): string {
  if (state.tier === "web-speech") return t.browserVoice;
  if (state.tier) return `${state.tier} · ${t.onDevice}`;
  return t.notLoaded;
}

/** What the model is and how it is doing: the honest half of the showcase. */
export function Telemetry({ state }: { state: TtsState }) {
  const rows: [string, string][] = [
    [
      t.rows.model,
      `${MODEL_LABEL} ${MODEL_VERSION} · ${MODEL_LICENSE}`,
    ],
    [t.rows.weights, `${MODEL_SIZE_MB} MB · ${MODEL_DTYPE} quantized`],
    [t.rows.backend, describeTier(state)],
    [
      t.rows.threads,
      `${state.threads} · ${state.threads > 1 ? t.isolated : t.notIsolated}`,
    ],
    [
      t.rows.lastRun,
      state.timing
        ? fill(t.lastRun, {
            audio: state.timing.audioSecs,
            firstSound: state.timing.firstSoundSecs,
            gaps: describeGaps(state.timing.underruns),
          })
        : t.none,
    ],
  ];

  return (
    <div
      aria-live="polite"
      className="bracket-corners flex flex-col gap-3 rounded-lg border border-outline bg-surface-container-lowest p-5"
    >
      <p className="text-label-caps text-on-surface-variant">
        <span className="text-primary">{"//"}</span> {t.heading}
      </p>

      {rows.map(([label, value]) => (
        <div
          key={label}
          className="text-code-sm flex items-baseline justify-between gap-3 border-b border-outline-variant pb-2 last:border-0"
        >
          <span className="text-on-surface-variant">{label}</span>
          <span className="text-right text-on-surface">{value}</span>
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
            {fill(t.downloading, { percent: Math.round(state.progress) })}
          </p>
        </div>
      )}

      {state.phase === "buffering" && (
        <p className="text-code-sm text-on-surface-variant">
          {fill(t.headStart, { seconds: state.headStartSecs })}
        </p>
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
  );
}
