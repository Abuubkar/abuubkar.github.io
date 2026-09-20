import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Emit directory-style routes (out/labs/index.html) instead of out/labs.html.
  // A service worker's scope is its own directory, so /labs/coi-serviceworker.js
  // can only ever control URLs under "/labs/" — the lab page has to *be* that
  // URL for cross-origin isolation to reach it. Only "/" and "/labs/" are HTML
  // routes here, so nothing else changes shape.
  trailingSlash: true,
};

export default nextConfig;
