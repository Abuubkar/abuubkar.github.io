"use client";

import { TelemetryPanel, fill, type TelemetryRow } from "@/features/lab-panel";
import { siteConfig } from "@/config/site";
import {
  MAX_CLIP_SECS,
  MODEL_DTYPE,
  MODEL_LABEL,
  MODEL_LICENSE,
  MODEL_SIZE_MB,
  MODEL_VERSION,
  type SttState,
} from "../engine";

const ui = siteConfig.labs.listen.ui;
const t = ui.telemetry;

function describeLastRun(state: SttState): string {
  if (!state.timing) return t.none;
  const { clipSecs, workSecs } = state.timing;
  // The ratio is the number worth showing: under 1 means the model finished
  // sooner than the clip took to say.
  const speed = clipSecs > 0 ? Math.round((workSecs / clipSecs) * 100) / 100 : 0;
  return fill(t.lastRun, { clip: clipSecs, work: workSecs, speed });
}

function describeStatus(state: SttState): string {
  switch (state.phase) {
    case "loading":
      return ui.status.loading;
    case "recording":
      return ui.status.recording;
    case "transcribing":
      return ui.status.transcribing;
    case "ready":
      return state.transcript
        ? fill(ui.status.done, { text: state.transcript })
        : "";
    default:
      return "";
  }
}

/** What the model is and how it is doing: the honest half of the showcase. */
export function Telemetry({ state }: { state: SttState }) {
  const rows: TelemetryRow[] = [
    [t.rows.model, `${MODEL_LABEL} ${MODEL_VERSION} · ${MODEL_LICENSE}`],
    [t.rows.weights, `${MODEL_SIZE_MB} MB · ${MODEL_DTYPE} quantized`],
    [t.rows.backend, state.loaded ? `wasm · ${t.onDevice}` : t.notLoaded],
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
      {state.phase === "recording" && (
        <>
          <p className="text-code-sm text-on-surface-variant">
            {fill(ui.recording, {
              seconds: state.recordedSecs.toFixed(1),
              limit: MAX_CLIP_SECS,
            })}
          </p>
          {/* Loudness, so it is obvious the microphone is actually hearing
              something before anyone waits on a transcript. */}
          <div
            className="h-1 overflow-hidden rounded-full bg-surface-container-high"
            aria-hidden
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-75"
              style={{ width: `${Math.min(100, state.level * 140)}%` }}
            />
          </div>
        </>
      )}
    </TelemetryPanel>
  );
}
