# Product

<!-- impeccable:product-schema 1 -->

> Provenance note: this record was written from the repository's own
> owner-approved content source (`src/config/site.ts`, 657 lines), the repo
> docs, and the explicit written brief for this build. No structured question
> tool was available in this session and no human answered, so the facts below
> are *derived*, not interviewed. Every line marked `[inferred]` is a reading
> of repository evidence rather than a confirmed user answer and should be
> confirmed before it is treated as settled. Nothing here was invented.

## Platform

web

## Users

Primary: engineering leads, hiring managers and technical recruiters
evaluating Abubakar Khawaja as a senior full-stack candidate. `[inferred]`
Secondary, stated in the content itself: people with "a product to build or a
system to scale" — consulting and partnership enquiries
(`contact.label`: "Open to senior full-stack roles, consulting, and
partnerships").

Situation `[inferred]`: arriving from a CV link, a GitHub profile or a
LinkedIn profile, with minutes rather than hours, frequently on a phone, and
skimming for seniority signals and specifics before deciding whether to make
contact.

## Product Purpose

A personal portfolio that presents one engineer's professional record so an
evaluator can judge seniority quickly and then make contact. Success is a
message, a call, or a CV download — the three actions the contact section
exposes.

## Positioning

Two things here a neighbouring portfolio cannot truthfully copy:

1. **Measured outcomes, not adjectives.** Every performance claim in the
   record carries its own number: API response times cut 30–70%; deployment
   time reduced ~40%; automated test coverage raised from ~10% to 60%+;
   re-renders reduced ~30%; load times improved 20–30%; downtime cut 30%;
   reporting over 1000+ assets.
2. **A working demonstration, not a screenshot.** `/labs` runs two real
   speech models in the visitor's own browser with no server behind them:
   Kokoro-82M text-to-speech (92 MB) and Whisper-base speech-to-text (77 MB),
   on WASM, multi-threaded where cross-origin isolation is available, each
   reporting its own telemetry (weights, backend, thread count, realtime
   factor). ~1,400 lines of engine code under
   `src/features/{listen-lab,voice-lab,labs,lab-panel}`.

## Operating Context

- Deployed as a static export to GitHub Pages at `https://abuubkar.github.io`.
  No server runtime, no database, no API.
- `/labs/` must be a directory-style route: a service worker's scope is its own
  directory, and `public/labs/coi-serviceworker.js` is what grants the page the
  COOP/COEP headers WASM threads need.
- `public/cv/**` is owned and wiped by a separate resume-sync action in another
  repository. The CV PDF under `public/resume/` is likewise written by that
  sync, never by hand here.
- Privacy-friendly page stats via a self-hosted copy of the Umami script
  (`public/stats.js`); events post to `gateway.umami.is`.
- Google Search Console ownership is asserted by a meta tag, not a file,
  because the file method would need `public/`.

## Capabilities and Constraints

- Next.js 16.2.7 / React 19.2.4, `output: "export"`, `trailingSlash: true`,
  `images: { unoptimized: true }`. Tailwind CSS v4 with `@theme` tokens. pnpm.
- `AGENTS.md` imposes a hard project rule: this Next.js version has breaking
  changes, and the relevant guide in `node_modules/next/dist/docs/` must be
  read before writing code.
- `src/config/site.ts` is the single source of truth for every word of content.
  Facts in it may be re-ordered, re-grouped and re-typeset; they may not be
  invented, embellished or deleted.
- `.dependency-cruiser.cjs` enforces deep-module boundaries over
  `src/features/`: a package's root files are its public entry points and
  anything in a subfolder is private; `engine/`, `state/` and `data/` must run
  without React or a DOM; an experiment must never import the `labs/`
  container.
- `pnpm lint` is `eslint` plus `depcruise src`. `pnpm build` runs
  `scripts/build-worker.mjs` then `next build`.
- No authentication, no forms that post anywhere, no user accounts. The contact
  section's actions are `mailto:`, `tel:`, copy-to-clipboard and outbound
  profile links.
- Keyboard navigation exists: `j`/`k` between sections, `g`+initial to jump,
  `?` for a shortcut sheet, `Esc` to close.

## Brand Commitments

- The person's name, **Abubakar Khawaja**, and the wordmark string
  **Abubakar.dev**.
- Real assets that must survive: the portrait (`src/assets/abubakar-theme.webp`)
  and thirteen real project screenshots under `src/assets/projects/`.
- Voice, as evidenced in the approved copy: plain, specific, numeric,
  understated. It says what a thing does and what it measured. It does not
  sell.
- The owner has explicitly released the previous visual world ("Terminal
  Editorial": cream paper `#f1f0ed`, cobalt `#2d4fe6`, coral `#ef9d83`, Hanken
  Grotesk / Inter / JetBrains Mono) and the previous layout, palette,
  typography and motion. These are **not** brand commitments.

## Evidence on Hand

Real and usable:

- 13 project screenshots (`src/assets/projects/*.webp`) covering FixAlert,
  Landit, AskImam, Meet Gabbi, Telehealth, Rumi, Taiga, No More Mafia, Foodio,
  Convo, LedgerLine, Pagerwise, Shelfsense.
- One portrait photograph.
- Three live, reachable URLs: `https://fixalert.io`, `https://landit.com`,
  `https://www.askimam.org/`, plus two live personal deployments
  (No More Mafia, Convo) and four public repos.
- A CV PDF at `/resume/abubakar-khawaja-full-stack-engineer-resume.pdf`.
- Two working on-device models, which are the strongest demonstration asset on
  the site because they run rather than claim.
- Named, dated certifications: Anthropic "Claude Certified Architect –
  Foundations" (in progress), Scrimba "The AI Engineer Path" (July 2026),
  Scrimba "Prompt Engineering for Web Developers" (July 2026).

**Absences future work must not fabricate.** There are no testimonials, no
client quotes, no star ratings, no client logos, no awards, no press mentions,
no user or download counts, and no revenue or traffic statistics anywhere in
the record. Four featured projects have `href: "#"` because they are client
work with no public URL, and two education fields (`period`) are absent from
the source. None of these gaps may be filled by invention.

## Product Principles

1. **Every claim carries its measurement.** The record's credibility is its
   numbers; nothing should be restated in a way that drops them.
2. **Demonstrate before describing.** The thing that runs outranks the thing
   that is described. Labs is the strongest asset and should lead, not sit in a
   teaser card.
3. **The visitor has minutes, often on a phone.** Seniority must be legible in
   the first viewport and the whole record skimmable below it.
4. **No server, ever.** Any surface must survive as a static export with its
   assets, and `/labs/` must keep its isolation boundary.
5. **One content source.** Content lives in `src/config/site.ts`; components
   render it and never hold copy of their own.

## Accessibility & Inclusion

No formal standard was stated by the owner. The incumbent build shows a
deliberate accessibility effort worth preserving: `aria-current` on the active
nav item, `aria-label` on every icon-only control, `role="status"` live regions
confined to one sentence per phase in the lab telemetry panels (explicitly so
screen readers are not flooded by download percentages), `aria-pressed` on the
hold-to-talk control, keyboard activation for the pointer-held microphone
button, and `role="alert"` on experiment errors. WCAG 2.2 AA is the working
bar for this build. `[inferred]`
