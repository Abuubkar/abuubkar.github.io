"use client";

import { TelemetryPanel, fill, type TelemetryRow } from "@/features/lab-panel";
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
const status = siteConfig.labs.voice.ui.status;

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

function describeLastRun(state: TtsState): string {
  if (!state.timing) return t.none;
  return fill(t.lastRun, {
    audio: state.timing.audioSecs,
    firstSound: state.timing.firstSoundSecs,
    gaps: describeGaps(state.timing.underruns),
  });
}

function describeStatus(state: TtsState): string {
  switch (state.phase) {
    case "loading":
      return status.loading;
    case "synthesizing":
      return status.synthesizing;
    case "buffering":
      return fill(t.headStart, { seconds: state.headStartSecs });
    case "speaking":
      return status.speaking;
    case "ready":
      return state.timing
        ? fill(status.done, { summary: describeLastRun(state) })
        : "";
    default:
      return "";
  }
}

/** What the model is and how it is doing: the honest half of the showcase. */
export function Telemetry({ state }: { state: TtsState }) {
  const rows: TelemetryRow[] = [
    [t.rows.model, `${MODEL_LABEL} ${MODEL_VERSION} · ${MODEL_LICENSE}`],
    [t.rows.weights, `${MODEL_SIZE_MB} MB · ${MODEL_DTYPE} quantized`],
    [t.rows.backend, describeTier(state)],
    [
      t.rows.threads,
      `${state.threads} · ${state.threads > 1 ? t.isolated : t.notIsolated}`,
    ],
    [t.rows.lastRun, describeLastRun(state)],
  ];

  return (
    <TelemetryPanel
      heading={t.heading}
      rows={rows}
      status={describeStatus(state)}
      progress={state.phase === "loading" ? state.progress : undefined}
      progressLabel={t.downloading}
    >
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
    </TelemetryPanel>
  );
}
