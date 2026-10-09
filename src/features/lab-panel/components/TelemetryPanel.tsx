"use client";

import type { ReactNode } from "react";
import { fill } from "../lib/fill";

export type TelemetryRow = [label: string, value: string];

export type TelemetryPanelProps = {
  heading: string;
  rows: TelemetryRow[];
  /**
   * One sentence for screen readers, changing only when the phase does.
   * Percentages do not belong here: they re-announce several times a second
   * and drown everything else out.
   */
  status?: string;
  /** 0–100. Renders the bar when present, hides it when not. */
  progress?: number;
  /** Caption under the bar, with `{percent}` filled in. */
  progressLabel?: string;
  /** Anything the experiment wants below the rows — a level meter, an
   *  equalizer, a note about what it is waiting for. */
  children?: ReactNode;
};

/**
 * What a model is and how it is doing: the honest half of a Labs
 * experiment.
 *
 * Shared because the chrome is shared, not the content. Each experiment
 * decides its own rows — one reports voices and head start, another
 * language and realtime factor — and this only knows how to lay them out.
 */
export function TelemetryPanel({
  heading,
  rows,
  status,
  progress,
  progressLabel,
  children,
}: TelemetryPanelProps) {
  return (
    <div className="bracket-corners flex flex-col gap-3 rounded-lg border border-outline bg-surface-container-lowest p-5">
      {/* The only live region here. The rows below are read on demand, the
          way any other table is, rather than re-announced on every change. */}
      <p className="sr-only" role="status">
        {status ?? ""}
      </p>

      <p className="text-label-caps text-on-surface-variant">
        <span className="text-primary">{"//"}</span> {heading}
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

      {progress !== undefined && (
        <div>
          <div className="h-1 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progressLabel && (
            <p className="text-code-sm mt-2 text-on-surface-variant">
              {fill(progressLabel, { percent: Math.round(progress) })}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
