// Bundles the Voice Lab synthesis worker into public/labs/.
//
// Next is not asked to bundle it, deliberately. Its output lands under
// /_next/, and a worker script — unlike every other asset a page loads — is
// fetched by its own URL rather than on behalf of the page. It therefore
// misses the service worker that adds COEP to /labs/, and a cross-origin
// isolated page refuses to start a worker whose script lacks that header.
// Bundling it ourselves puts it at a URL inside that scope.
//
// Runs before `next build` (see the build script) so public/ already holds
// the result when Next copies public/ into the export.

import { build } from "esbuild";

const outfile = "public/labs/synth-worker.js";

await build({
  entryPoints: ["src/features/voice-lab/engine/synth.worker.ts"],
  outfile,
  bundle: true,
  format: "esm",
  // kokoro-js declares `"browser": { "path": false, "fs/promises": false }`,
  // so its Node-only branches drop out under this platform.
  platform: "browser",
  target: "es2022",
  minify: true,
  legalComments: "none",
});

console.log(`built ${outfile}`);
