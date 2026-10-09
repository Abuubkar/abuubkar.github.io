// Bundles each experiment's worker into public/labs/.
//
// Next is not asked to bundle these, deliberately. Its output lands under
// /_next/, and a worker script — unlike every other asset a page loads — is
// fetched by its own URL rather than on behalf of the page. It therefore
// misses the service worker that adds COEP to /labs/, and a cross-origin
// isolated page refuses to start a worker whose script lacks that header.
// Bundling them ourselves puts them at a URL inside that scope.
//
// Runs before `next build` (see the build script) so public/ already holds
// the results when Next copies public/ into the export.

import { build } from "esbuild";

/** Each experiment's worker entry point, and where /labs/ serves it from.
 *  The outfile name is what the matching engine/model.ts asks for. */
const WORKERS = [
  {
    entry: "src/features/voice-lab/engine/synth.worker.ts",
    outfile: "public/labs/synth-worker.js",
  },
  {
    entry: "src/features/listen-lab/engine/transcribe.worker.ts",
    outfile: "public/labs/listen-worker.js",
  },
];

await Promise.all(
  WORKERS.map(({ entry, outfile }) =>
    build({
      entryPoints: [entry],
      outfile,
      bundle: true,
      format: "esm",
      // kokoro-js declares `"browser": { "path": false, "fs/promises": false }`,
      // so its Node-only branches drop out under this platform. transformers.js
      // resolves its own browser build the same way.
      platform: "browser",
      target: "es2022",
      minify: true,
      legalComments: "none",
    }).then(() => console.log(`built ${outfile}`)),
  ),
);
