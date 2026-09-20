"use client";

import {
  MODEL_LABEL,
  MODEL_SIZE_MB,
  MODEL_VERSION,
  type TtsState,
} from "../engine";

function describeBackend(state: TtsState): string {
  if (state.tier === "web-speech") return "browser voice (fallback)";
  if (state.tier) return `${state.tier} · on-device`;
  return "— not loaded";
}

/** What the model is and how it is doing: the honest half of the showcase. */
export function Telemetry({ state }: { state: TtsState }) {
  const rows: [string, string][] = [
    ["model", `${MODEL_LABEL} ${MODEL_VERSION} · Apache-2.0`],
    ["weights", `${MODEL_SIZE_MB} MB · q8 quantized`],
    ["backend", describeBackend(state)],
    [
      "threads",
      state.threads > 1
        ? `${state.threads} · cross-origin isolated`
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
    <div
      aria-live="polite"
      className="bracket-corners flex flex-col gap-3 rounded-lg border border-outline bg-surface-container-lowest p-5"
    >
      <p className="text-label-caps text-on-surface-variant">
        <span className="text-primary">{"//"}</span> telemetry
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
  );
}
