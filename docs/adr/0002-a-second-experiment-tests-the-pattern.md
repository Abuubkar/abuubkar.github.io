# 2. A second experiment tests the packages pattern

Date: 2026-10-09

## Status

Accepted. Extends ADR 0001.

## Context

ADR 0001 claimed that "a future `EXP.02` is a new package and one line in
`LabsPage`". Listen Lab is that EXP.02, so the claim is now testable rather
than aspirational.

It mostly held. The package dropped in, the boundary rules caught nothing,
and `LabsPage` did change by one line. Three things were singular, though,
and had to become plural before the second experiment could exist.

## Decision

**Worker builds take a list.** `scripts/build-worker.mjs` hardcoded one
entry point and one outfile. Both experiments need their worker inside
`/labs/` for the same COEP-scope reason, so the script now maps over a list.

**`wasmThreadCount()` moved to `src/lib/`.** It lived in
`voice-lab/state/threads.ts`, and the `experiments-may-not-depend-on-labs`
rule means a sibling cannot reach it, directly or through the container. It
is six lines describing the page's environment, the same character as
`track.ts`, which ADR 0001 already allows in `src/lib/`. Minting a package
for one function would have been ceremony.

**The telemetry panel became `features/lab-panel/`.** Two experiments need
the same chrome, which ADR 0001 says earns a package. Only the chrome is
shared: the panel takes `rows` and lays them out, and each experiment
decides what a row means. Voice Lab reports voices and head start, Listen
Lab language and realtime factor.

## Consequences

The container still composes experiments and experiments still know nothing
about each other, which was the part worth protecting.

`src/lib/` now holds three things, and the line between "cross-cutting
infrastructure" and "code two features happen to share" is a judgement each
time. The test applied here: does it describe the page's environment
(`src/lib/`), or does it do something for a feature (a package)?

A third experiment should need none of this. If it does, that is evidence
the pattern is leakier than ADR 0001 claimed, and worth another ADR rather
than another quiet widening.
