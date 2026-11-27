# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/abubakar-khawaja-portfolio/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Abubakar Khawaja Portfolio
**Generated:** 2026-11-08 by `ui-ux-pro-max` v2.15.0 (`search.py --design-system --persist`)
**Reconciled:** 2026-11-08 — see [§Reconciliation log](#reconciliation-log)
**Category:** Portfolio/Personal (`products.csv` row 11)
**Design Dials:** Variance 7/10 (Balanced / Modern) | Motion 5/10 (Standard) | Density 3/10 (Spacious)

> **This file is the Global Source of Truth for colour, type, spacing and motion.**
> `docs/DESIGN.md` is its narrative companion and defers to it on every number.
> `src/app/globals.css` is the executable copy; if the two disagree, the CSS is
> wrong.

---

## Reconciliation log

The generator aggregates four CSVs independently, and two of its picks failed
the skill's own verification gate ("Verify the returned domain/category, top
result identity, and fit for the user's product and platform before applying
it"). Both were replaced with rows retrieved by explicit single-domain
searches. Nothing below is from taste; every change cites a row.

| Field | Generator produced | Shipped | Why |
|---|---|---|---|
| Typography | Caveat / Quicksand — "handwritten, personal, friendly, casual, warm, charming" | **JetBrains Mono / IBM Plex Sans** ("Developer Mono") | The generated pairing's own `Best For` is "Personal blogs, invitations, creative portfolios, lifestyle brands". This is a senior backend/full-stack engineer's professional record. `--domain typography "developer technical precise"` returns Developer Mono as result 1, `Best For: Developer tools, documentation, code editors, tech blogs`. |
| Style | Brutalism | **Motion-Driven + Minimalism & Swiss Style**, with Brutalism's structural honesty (visible rules, 0px corners) as a secondary influence | `products.csv` row 11 `Portfolio/Personal` lists Brutalism under *Secondary Styles* and `Motion-Driven + Minimalism & Swiss Style` as the **Primary Style Recommendation**. The generator surfaced the secondary. Brutalism alone also loses an 18-juror trimmed mean — see the report. |
| Colour | Light-only, single `Border` token | Same hexes, plus a verified dark ramp and a split border | Three measured failures in the generated set; see [§Colour](#colour-palette). |
| Motion | GSAP `Stagger List` snippet | Same parameters in framer-motion | GSAP is not a dependency; see [§Motion](#motion). |
| Component specs | Raw hex, `box-shadow`, `cursor:pointer` on cards | Token-driven, flat, pointer only on real controls | The generated block contradicts its own anti-pattern list and the Swiss row's `--shadow: none`. |

**The generator also contradicts itself** and the contradiction is resolved by
the SKILL.md priority table. Its Style section says Brutalism's key effects are
"No smooth transitions (instant)"; its Anti-Patterns section says "❌ Instant
state changes — Always use transitions (150-300ms)". Touch & Interaction is
priority 2 (CRITICAL) and lists "Instant state changes (0ms)" as an
anti-pattern, while Style Selection is priority 4. **Transitions win:**
`--duration-state: 180ms`.

---

## Global Rules

### Colour palette

Source: `colors.csv` → `Portfolio/Personal` ("Monochrome + blue accent"). The
dark ramp is `design_system._derive_dark_palette()` — the skill's own function,
not a hand-mix. Every ratio below was measured with the skill's own
`_contrast_ratio()`; the reproducible sweep is in
`docs/design/ui-ux-pro-max-report.md`.

| Role | Light | Dark | CSS variable |
|---|---|---|---|
| Background | `#FAFAFA` | `#0F172A` | `--color-background` |
| Foreground | `#09090B` | `#F8FAFC` | `--color-foreground` |
| Card | `#FFFFFF` | `#111827` | `--color-card` |
| Muted (hover surface) | `#E8ECF0` | `#1E293B` | `--color-muted` |
| Muted foreground | `#475569` | `#CBD5E1` | `--color-muted-foreground` |
| Divider (decorative) | `#E4E4E7` | `#334155` | `--color-border` |
| **Control boundary** | `#71717A` | `#64748B` | `--color-outline` |
| Accent | `#2563EB` | `#60A5FA` | `--color-accent` / `--color-primary` |
| On accent | `#FFFFFF` | `#0F172A` | `--color-on-accent` |
| Ink (inverse field) | `#18181B` | `#F8FAFC` | `--color-tertiary` |
| On ink | `#FAFAFA` | `#0F172A` | `--color-on-tertiary` |
| Secondary | `#3F3F46` | `#94A3B8` | `--color-secondary` |
| Destructive | `#DC2626` | `#F87171` | `--color-destructive` |
| Success | `#059669` | `#22C55E` | `--color-success` |
| Ring | `#18181B` | `#60A5FA` | `--color-ring` |

**Three departures from the retrieved row, each because a measurement failed:**

1. **`Border` is split in two.** The catalogue's single `Border` (`#E4E4E7`)
   measures **1.22:1** on the page. That is fine for a decorative separator,
   which WCAG does not gate, but WCAG 1.4.11 wants **3:1** for the boundary of
   a control. One token cannot be both, so `--color-border` stays the hairline
   and `--color-outline` (`#71717A`, 4.63:1) carries control boundaries.
2. **Accent, Destructive and Primary are re-derived for dark.** On `#0F172A`
   the retrieved Accent is **3.45:1** (below AA for normal text), Destructive is
   **3.70:1**, and Primary `#18181B` is **1.01:1** — invisible. `_derive_dark_palette`
   keeps brand tokens verbatim, which is exactly how a near-black primary ends
   up on a near-black ground.
3. **Success is sourced, not invented.** `colors.csv` has **no Success or
   Warning column at all**. `#22C55E` is the `Accent` of the `Coding Bootcamp`
   row (note: "Terminal dark + success green") and is used there on a dark
   ground, where it measures 7.83:1; on light it is 2.18:1 and fails. Light
   mode therefore uses `#059669`, the `Micro SaaS` row's `Accent` ("emerald
   CTA"), which that row pairs with a light background. **`Warning` was deleted
   rather than guessed** — no component used it.

**Enforced rule:** accent *as text* may sit on `background` or `card` only. On
the `muted` hover surface it measures 4.35:1 in light — fine for an icon or a
border (1.4.11, 3:1), below AA for text. Card hover is therefore a **border**
change, not a fill change, which is also what the Swiss row's `--shadow: none`
implies.

### Token map

Components keep the repo's existing semantic names; `@theme inline` points them
at the catalogue roles. One value, two names, no second palette.

| Repo alias | Catalogue role |
|---|---|
| `surface`, `background` | Background |
| `surface-container{,-low,-lowest}` | Card |
| `surface-container-high{,est}`, `surface-variant`, `surface-dim` | Muted |
| `on-surface`, `on-background` | Foreground |
| `on-surface-variant` | Muted Foreground |
| `outline-variant` | Border (decorative hairline) |
| `outline` | **derived** control boundary (3:1) |
| `primary` | Accent |
| `tertiary` / `inverse-surface` | Primary (ink) |

### Typography

Source: `typography.csv` → **Developer Mono** (result 1 for
`--domain typography "developer technical precise"`).

- **Heading font:** JetBrains Mono
- **Body font:** IBM Plex Sans
- **Mood:** code, developer, technical, precise, functional, hacker
- **Best for:** Developer tools, documentation, code editors, tech blogs
- **Catalogue note:** "JetBrains for code, IBM Plex for UI. Developer-focused."

Loaded through `next/font/google` in `app/layout.tsx`, not the catalogue's
`@import` URL: the `nextjs` stack rows mark "Use next/font for fonts" active for
16.2, and a stylesheet `@import` is a render-blocking third-party request.

Scale — 12 / 14 / 16 / 18 / 24 / 32 plus a fluid display step:

| Utility | Size | Line-height | Notes |
|---|---|---|---|
| `.text-display-lg` | `clamp(32px, 56px)` | 1.04 | mono, `-0.04em`, `text-wrap: balance` |
| `.text-headline-lg` | `clamp(24px, 32px)` | 1.15 | mono, `-0.03em` |
| `.text-headline-md` | 24px | 1.25 | mono |
| `.text-body-lg` | 18px | 1.65 | |
| `.text-body-md` | 16px | 1.65 | mobile body floor |
| `.text-body-sm` | 14px | 1.6 | metadata only, never body copy |
| `.text-code-sm` | 14px | 1.55 | mono |
| `.text-label-caps` | 12px | 1.4 | mono, `0.1em`, uppercase |

Body line-height sits inside the catalogue's 1.5–1.75. Prose is capped at
`--reading-max: 68ch` (`.measure`), inside the 65–75 character band.

> `.text-body-sm` was **used but never defined** before this build
> (`Certifications.tsx`), so that line silently rendered at the inherited size.

### Spacing

*Density dial 3/10 — "Spacious". These are the dial's own values.*

| Token | Value | Usage |
|---|---|---|
| `--spacing-xs` | `4px` | Tight gaps |
| `--spacing-sm` | `8px` | Icon gaps, inline spacing |
| `--spacing-md` | `24px` | Standard padding |
| `--spacing-lg` | `32px` | Section padding |
| `--spacing-xl` | `48px` | Large gaps |
| `--spacing-2xl` | `64px` | Section margins |
| `--spacing-3xl` | `96px` | Hero padding |

Every section uses `py-2xl lg:py-3xl`. Container `1180px`.

### Target sizes

| Token | Value | Rule |
|---|---|---|
| `--spacing-target` | `24px` | WCAG 2.2 AA 2.5.8 **web** minimum |
| `--spacing-target-comfort` | `44px` | What buttons and header controls actually use |

`ux-guidelines.csv` → "Target Size (Minimum)" is explicit: *"Don't: Assume
native 44pt or 48dp guidance defines web conformance."* 24 CSS px is the
conformance floor; 44px is the house standard for anything thumb-operated. Do
not substitute native units.

### Elevation

`--shadow: none` (Swiss row's own design-system variable). Depth is hairlines
and the one ink field. There is no shadow scale, and the generated one was
dropped.

### Radius

Swiss specifies `0px`; Brutalism agrees ("sharp corners (0px)"). Shipped at
`2px` structural / `4px` large, a hair off zero so focus rings and image crops
do not read as clipped.

---

## Page pattern

Source: `landing.csv` → `scroll-triggered-storytelling`. `products.csv` row 11
names the pattern "Storytelling-Driven", which is an **alias** on that row —
identity verified, not assumed.

- **Section order (catalogue):** Intro hook > Chapter 1 (problem) > Chapter 2 (journey) > Chapter 3 (solution) > Climax CTA
- **CTA placement:** End of each chapter (mini) + final climax CTA
- **Colour strategy:** Progressive reveal. Each chapter has distinct colour. Building intensity.
- **Conversion:** "Keep the narrative understandable without scroll-driven effects… Keep DOM reading order complete; disable parallax and scroll-scrub under reduced motion."

**As shipped**, with one owner-directed change:

| # | Section | Chapter role |
|---|---|---|
| — | Hero | Intro hook |
| `0x02` | **Labs** | *promoted* — see below |
| `0x01` | Approach | Chapter 1 (problem + evidence) |
| `0x03` | Trajectory | Chapter 2 (journey) |
| `0x04` | Arsenal | Chapter 2 (journey) |
| `0x05` | Featured Projects | Chapter 3 (solution) |
| `0x06` | Personal Projects | Chapter 3 (solution) |
| `0x07` | Certifications | Chapter 3 (solution) |
| `0x08` | Contact | Climax CTA |

**Labs sits second, not in Chapter 3.** The owner directed that Labs be
promoted from a buried teaser to a headline experience. It is the only section
whose subject a visitor can operate, so it is also the only one rendered as a
full ink field — the catalogue's "distinct colour per chapter, building
intensity", spent once rather than smeared across eight sections.

**Social proof is deliberately absent.** `landing.csv`'s third result for this
query is `hero-testimonials-cta`, which requires "a concise set of verified
testimonials with photo, name, and role". No testimonial, rating, client logo,
award, press mention or user count exists in `src/config/site.ts`. None was
written. See the report's content-gap list.

---

## Motion

*Dial 5/10 — "Standard".* Source: `motion.csv`.

The catalogue ships every preset as GSAP. **GSAP is not a dependency here** and
is not being added to fade eight blocks. The *parameters* are honoured; the
implementation is framer-motion (`styles.csv` lists
`Framework Compatibility: gsap|framer-motion` for Motion-Driven, so this is
within the row).

| Parameter | Catalogue (Scroll Reveal, Subtle) | Shipped |
|---|---|---|
| Trigger | scroll, viewport enter | `whileInView`, `once: true` |
| Duration | 300–400ms | 360ms |
| Easing | `power1.out` | `cubic-bezier(.22,.61,.36,1)` |
| Offset | "8-16px so it reads as a fade, not a slide" | 12px |
| Stagger | 30–50ms | 60ms per card, capped per group |

**Animate `transform` and `opacity` only.** Never width/height/top/left.
Exit durations are 67% of enter (`--duration-exit: 240ms`).

**Parallax is not implemented**, although the Motion-Driven row asks for 3–5
layers and sets `--parallax-layers: 5`. `ux-guidelines.csv` → "Motion
Sensitivity" (severity High) says *"Parallax/Scroll-jacking causes nausea…
Don't: Force scroll effects"*, and "Excessive Motion" caps animation at **1–2
key elements per view**. Accessibility is priority 1 in the SKILL.md table and
Animation is priority 7, so accessibility wins. This is a deliberate,
documented refusal of a retrieved recommendation.

### Reduced motion

A blanket `transition-duration: 0.01ms !important` satisfies "Reduced Motion"
while breaking "Instant state changes (0ms)" — a CRITICAL anti-pattern. The
shipped rule stops all keyframe animation, smooth scrolling and transform
transitions, and keeps colour/opacity feedback at 120ms, by restricting
`transition-property` rather than zeroing duration. Less motion, not less
feedback.

`Reveal` also checks `useReducedMotion()` in JS, because the CSS whitelist
deliberately no longer flattens transforms for it.

---

## Component specs

Tokens only. No raw hex in components — that is an anti-pattern in the priority
table (§6) and the generated spec block violated it.

### Buttons

```css
.btn {
  min-height: 44px;              /* comfort target; 24px is the WCAG floor */
  padding-inline: 20px;
  border-radius: 2px;
  font: var(--text-label-caps);  /* 12px mono, 0.1em, uppercase */
  transition: color, background-color, border-color var(--duration-state);
}
.btn-primary   { background: var(--color-primary); color: var(--color-on-primary); }
.btn-secondary { border: 1px solid var(--color-outline); color: var(--color-on-surface); }
.btn-secondary:hover { border-color: var(--color-primary); color: var(--color-primary); }
```

Hover changes colour, never geometry — `pro-rules.md` "Stable Interaction
States": press feedback must not shift layout bounds.

### Cards

```css
.card {
  background: var(--color-card);
  border: 1px solid var(--color-outline-variant);  /* hairline */
  border-radius: 2px;
  transition: border-color var(--duration-state);
}
.card:hover { border-color: var(--color-outline); }  /* 1.22:1 -> 4.63:1 */
```

No `box-shadow` (Swiss `--shadow: none`). No `transform: translateY` on hover.
**No `cursor: pointer` on the card itself** — the generated spec put it there,
but a pointer cursor on a non-control is a lie about what is clickable; it
belongs on the link inside.

### Focus

One global rule, not per-component:

```css
:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; }
```

`ux-guidelines.csv` → "Focus Appearance": a 2 CSS px perimeter at 3:1 state
contrast. Measured 16.97:1 light / 7.02:1 dark.

```css
html { scroll-padding-top: calc(var(--spacing-nav-height) + 1.5rem); }
```

`ux-guidelines.csv` → "Focus Not Obscured (Minimum)", WCAG 2.2 AA, severity
High, whose code-good is literally `scroll-padding-top: var(--header-height)`.
The fixed 64px header previously covered anchor targets.

### Icons

`lucide-react`, one family, 16–20px, `aria-hidden="true"` when beside visible
text; icon-only controls carry an accessible name.

> `icons.csv` recommends **Phosphor (primary) + Heroicons (fallback)**. The repo
> is on lucide-react across ~40 call sites. The same row says "Keep one visual
> family per surface", and swapping families adds a dependency for no user-facing
> gain. The *semantic* half of that row is applied in full; the library half is
> not. Logged as a deviation.

---

## Anti-patterns (do NOT use)

From the catalogue, minus the mode-contradictory entries:

- ❌ Corporate templates, generic layouts
- ❌ **Emoji as icons** — SVG only
- ❌ **Raw hex in components** — semantic tokens only
- ❌ **Layout-shifting hovers** — colour/border only
- ❌ **Low contrast text** — 4.5:1 normal, 3:1 large and non-text
- ❌ **Instant state changes** — 150–300ms
- ❌ **Invisible focus states**
- ❌ **Parallax / scroll-jacking** — added here, over the Motion-Driven row
- ❌ **Invented social proof** — no testimonials, ratings, logos, awards or
  user counts exist in `site.ts`; none may be written

---

## Pre-delivery checklist

The canonical checklist in `references/pro-rules.md` is scoped, by its own
header, to native/mobile app UI. The web-applicable items, plus
`quick-reference.md` §1–§3, are ticked honestly in
`docs/design/ui-ux-pro-max-report.md` — including the ones that are **not**
ticked.

- [x] No emoji used as icons
- [x] One icon family (lucide-react)
- [x] Semantic theme tokens; no per-component hex
- [x] Hover/press feedback does not shift layout bounds
- [x] Text contrast ≥4.5:1 in **both** themes (54/54 gated pairs measured)
- [x] Focus visible, 2px at ≥3:1, both themes
- [x] `prefers-reduced-motion` respected without killing feedback
- [x] Breakpoints 375 / 768 / 1024 / 1440
- [x] No content hidden behind the fixed navbar (`scroll-padding-top`)
- [x] `transform`/`opacity` only; 1–2 animated elements per view
- [ ] Automated axe/Lighthouse audit — **not run**, see report
