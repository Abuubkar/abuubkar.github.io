# 1. Features are packages; there is no utils folder

Date: 2026-09-20

## Status

Accepted

## Context

Voice Lab arrived as eight files scattered across `src/lib/`,
`src/components/sections/`, `src/app/labs/`, and `public/`. Nothing in the
tree said they were one feature, and `src/lib/tts.ts` had grown into five
concerns in one file: state, model loading, playback scheduling, a fallback
adapter, and orchestration.

Two forces pulled on the fix. More experiments are coming, so whatever shape
we choose gets repeated. And the next change (adaptive buffering) is entirely
about *when* audio starts, which was tangled into the streaming loop.

## Decision

Each feature is a package under `src/features/`. A package's root files are
its entry points; everything in a subfolder is private. `pnpm lint` runs
dependency-cruiser, so a deep import fails the build rather than relying on
discipline.

Two packages today: `labs/` (the container) and `voice-lab/` (`EXP.01`). The
container may import experiments; an experiment may never import the
container, which is also an enforced rule. A future `EXP.02` is a new package
and one line in `LabsPage`.

We do **not** add a `src/utils/` folder. Code one feature needs lives in that
feature's `lib/`. Code two features need earns its own package with an entry
point. `src/lib/` keeps only what is genuinely cross-cutting (`track.ts`,
`useActiveSection.ts`).

Copy stays in `src/config/site.ts` rather than moving into the packages,
because the single-source-of-truth convention for content predates this and
is worth more on a site this size than feature-locality would be.

## Consequences

Phase 2's buffering work is a change to `playback.ts` alone, behind the
`enqueue` / `finish` / `stop` interface, and the orchestrator never learns
about scheduling.

A generic dumping ground can't appear by accident: there is nowhere to put
one, and the boundary rules would flag imports into it from both sides.

The cost is indirection. Reaching Voice Lab's internals means going through
an entry point, and adding a genuinely shared helper now takes a decision
(whose `lib/`? or its own package?) rather than a reflex.

Do not re-propose a `utils/` or `shared/` folder without new evidence: the
absence is deliberate.
