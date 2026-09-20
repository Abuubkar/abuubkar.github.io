/**
 * How many threads onnxruntime-web will give the model.
 *
 * It pins itself to 1 unless the document is cross-origin isolated, in which
 * case it takes min(4, cores/2). The /labs/ service worker is what makes the
 * page isolated; this module only reports the consequence, so the experiment
 * never has to know how isolation was arranged.
 */
export function wasmThreadCount(): number {
  if (typeof window === "undefined" || !window.crossOriginIsolated) return 1;
  return Math.min(4, Math.ceil((navigator.hardwareConcurrency || 1) / 2));
}
