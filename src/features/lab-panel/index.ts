/**
 * Shared chrome for Labs experiments.
 *
 * Exists because two experiments need the same telemetry panel, which
 * ADR 0001 says earns a package rather than a copy or a home in one of
 * them. Presentational only: it knows how to lay out rows, never what a
 * row means.
 */
export { TelemetryPanel } from "./components/TelemetryPanel";
export type { TelemetryRow, TelemetryPanelProps } from "./components/TelemetryPanel";
export { fill } from "./lib/fill";
