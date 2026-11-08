"use client";

import { useEffect } from "react";
import { ensureIsolation } from "../lib/isolation";

/**
 * Renders nothing; makes sure this page ends up cross-origin isolated.
 *
 * Replaces loading the vendored script's browser half through next/script,
 * which preloaded a file the service worker then served from a different
 * world — a mismatch the browser warns about and a preload nobody used.
 * Only the service-worker half of that file is needed, and the browser
 * fetches it as a worker, not as a page script.
 */
export function IsolationGuard() {
  useEffect(ensureIsolation, []);
  return null;
}
