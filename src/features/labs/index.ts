/**
 * Labs — the container for browser-run AI experiments.
 *
 * Public surface. Everything in a subfolder is private: import from here,
 * never from inside (enforced by .dependency-cruiser.cjs).
 *
 * Direction of dependency: the container may import experiments; an
 * experiment must never import the container. That is what lets a new
 * experiment drop in without touching anything here.
 */
export { LabsPage } from "./components/LabsPage";
export { LabsTeaser } from "./components/LabsTeaser";
export { prewarmIsolation } from "./lib/isolation";
