/**
 * Cross-origin isolation for /labs/ — the prerequisite for multi-threaded WASM.
 *
 * GitHub Pages can't send COOP/COEP headers, so a service worker adds them
 * (public/labs/coi-serviceworker.js). A service worker only controls
 * navigations that happen *after* it activates, which is why the home page
 * pre-registers it: by the time a visitor clicks through to /labs/, that
 * navigation is already isolated and nothing has to reload.
 */

/** Scoped to /labs/ by the script's own location — see the file's header. */
const SW_URL = "/labs/coi-serviceworker.js";

let requested = false;

/**
 * Registers the isolation worker ahead of a likely visit to /labs/.
 * Safe to call repeatedly; only the first call does anything.
 */
export function prewarmIsolation() {
  if (requested || typeof navigator === "undefined") return;
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
  requested = true;
  // Deliberately no reload here — this runs on the home page, which must
  // never flicker. The worker simply takes effect on the next navigation.
  navigator.serviceWorker.register(SW_URL).catch(() => {
    // Private mode, disabled workers, etc. — /labs/ still works, single-threaded.
  });
}
