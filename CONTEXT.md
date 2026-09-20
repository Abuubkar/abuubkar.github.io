# Context

The words this codebase uses for its own parts. Use these names in code,
commits, and specs so everything lines up.

## Site

**Section** — a numbered block of the home page (`0x01` … `0x07`), rendered
from `src/config/site.ts`. All user-facing copy lives in that config; no
component hard-codes prose.

**Teaser** — a home-page section that summarises something living elsewhere
and links to it, rather than holding the thing itself.

## Labs

**Labs** — the container at `/labs/` for AI that runs in the visitor's
browser. Owns the page chrome and the isolation worker. Composes experiments;
never the other way round.

**Experiment** — one self-contained demo inside Labs, numbered `EXP.01`,
`EXP.02`, … Each is its own package and knows nothing about the container or
about its siblings.

**Voice Lab** — `EXP.01`. Neural text to speech running on the visitor's
hardware.

**Isolation** — making a page cross-origin isolated (COOP + COEP) so
`SharedArrayBuffer`, and therefore multi-threaded WASM, is available. GitHub
Pages can't send those headers, so a service worker scoped to `/labs/` adds
them. Without isolation onnxruntime-web pins itself to one thread.

**Prewarm** — registering that worker before it is needed, from the home
page, so the visit to `/labs/` is already isolated and nothing reloads.

## Voice Lab internals

**Engine** — the orchestrator (`features/voice-lab/engine.ts`). Decides what
happens in what order and delegates every *how*. Framework-free.

**Tier** — which machinery actually produced the sound: `wasm` (the model),
`webgpu` (unused for now), or `web-speech` (the browser's own voice, used
only when the model can't load).

**Player** — the audio queue (`engine/playback.ts`). Owns *when* sound starts,
so the head start stays private to it.

**Chunk** — one sentence of generated audio. The model yields chunks as it
makes them; the player queues them back to back.

**Head start** — the delay the player puts before the first chunk, sized to
the generation deficit it expects over the rest of the text. Call it a head
start everywhere; do not call it a cushion, a buffer or a lead. The engine is
in the `buffering` phase while it waits one out.

**Underrun** — a chunk not ready by the time the previous one finishes
playing. Heard as a gap mid-sentence, and what the head start exists to
prevent.

## Architecture

**Package** — a directory under `src/features/`. Its root files are its
**entry points** (public); everything in a subfolder is private. Enforced by
`.dependency-cruiser.cjs` via `pnpm lint`.

**Entry point** — a file at a package root, and the only thing outside code
may import. A package may expose several small ones rather than one barrel.

Inside a package, folders are named for the role their files play:
`components/` and `hooks/` are the React side; `engine/`, `state/` and
`data/` hold the parts that carry no React dependency, so they can be
exercised without rendering anything. `lib/` is the fallback name for a
package's private code when no sharper role fits, as in `labs/lib/`.
Dependencies run one way, from the React side inwards, and that direction is
enforced too.
