/**
 * Labs — the container for browser-run AI experiments.
 *
 * Public surface. Everything under lib/ is private: import from here, never
 * from a subfolder (enforced by .dependency-cruiser.cjs).
 *
 * Direction of dependency: the container may import experiments; an
 * experiment must never import the container. That is what lets a new
 * experiment drop in without touching anything here.
 */
export { LabsTeaser } from "./lib/LabsTeaser";
export { prewarmIsolation } from "./lib/isolation";
