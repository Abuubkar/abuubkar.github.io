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

/** Set once per tab so a failed reload can never become a loop. */
const RELOADED_KEY = "labs-isolation-reloaded";

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

/**
 * Called on /labs/ itself, for someone who arrived without the worker having
 * been pre-registered — a deep link, or a first visit straight to this URL.
 *
 * A worker cannot add headers to the navigation that installed it, so the
 * page has to be fetched once more before it is isolated. Reloading here
 * costs a moment; not reloading costs the visitor 4 threads.
 */
export function ensureIsolation() {
  if (typeof window === "undefined") return;
  // `undefined` means the browser has no notion of isolation, and no reload
  // will give it one. Only an explicit `false` is worth acting on.
  if (window.crossOriginIsolated !== false) return;
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
  if (sessionStorage.getItem(RELOADED_KEY)) return;

  void (async () => {
    try {
      await navigator.serviceWorker.register(SW_URL);
      // An active worker is the whole precondition: it intercepts the
      // navigation the reload is about to make. Not `controller` — the worker
      // claims this page on activation, but claiming adds no headers to a
      // document fetched before it existed, so "controlled" here never means
      // "isolated".
      await navigator.serviceWorker.ready;
      sessionStorage.setItem(RELOADED_KEY, "1");
      window.location.reload();
    } catch {
      // No worker, no isolation, one thread. The lab still works.
    }
  })();
}
