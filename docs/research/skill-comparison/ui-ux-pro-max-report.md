# ui-ux-pro-max build report

**Skill:** `ui-ux-pro-max` v2.15.0 by nextlevelbuilder (MIT)
**Installed:** `npx ui-ux-pro-max-cli init --ai claude`, project-scoped into this
worktree at `.claude/skills/` (git-excluded; it is tooling, not portfolio code).
Python 3.14.6 present, standard library only, no network calls from the scripts.
The installed `SKILL.md` was diffed against the reference clone and is identical.

**Method:** retrieval over recall. Every colour, type step, spacing value, motion
parameter and structural decision below traces to a row in the skill's committed
catalogue, or is explicitly labelled as a derivation with the measurement that
forced it. Where the catalogue was consulted and had nothing, that is stated
rather than papered over.

---

## 1. Every `search.py` invocation, and what it actually returned

**No search returned 0 results.** The failure mode encountered was different and
worth naming precisely: searches returned *off-topic* results that passed the
"found something" bar but failed the skill's own verification gate — *"Verify the
returned domain/category, top result identity, and fit for the user's product and
platform before applying it."* Those are flagged below. Raw output for every
query is in the session scratchpad; the decisive records are reproduced verbatim.

### Q1 — design system, first attempt → **MISROUTED**

```
search.py "developer portfolio AI experiments" --design-system \
  --variance 7 --motion 5 --density 3 -p "Abubakar Khawaja Portfolio"
```

| Field | Returned |
|---|---|
| PATTERN | **FAQ/Documentation Landing** — "Hero with search bar > Popular categories > FAQ accordion > Contact/support CTA" |
| STYLE | Dark Mode (OLED) — "Light not-recommended" |
| COLORS | `#1E293B` / accent `#22C55E` / bg `#0F172A` — "Code dark + run green" |
| TYPOGRAPHY | JetBrains Mono / IBM Plex Sans |
| MOTION | Stagger List (Standard), `back.out(1.4)` |

A portfolio is not a documentation site and has no FAQ accordion. **Rejected on
identity.** The query's "AI experiments" terms pulled the whole aggregate toward
developer-docs rows. Per the query contract, this earned exactly one retry.

### Q2 — design system, narrower retry → **PATTERN VERIFIED, STYLE AND TYPE REJECTED**

```
search.py "portfolio showcase personal brand" --design-system \
  --variance 7 --motion 5 --density 3 -p "Abubakar Khawaja Portfolio"
```

| Field | Returned | Verdict |
|---|---|---|
| PATTERN | **Scroll-Triggered Storytelling** — "Intro hook > Chapter 1 (problem) > Chapter 2 (journey) > Chapter 3 (solution) > Climax CTA" | **Accepted** |
| STYLE | **Brutalism** — "Raw, unpolished, stark… anti-design"; effects "No smooth transitions (instant), sharp corners (0px)" | Rejected as primary (see Q3) |
| COLORS | `#18181B` / `#3F3F46` / accent `#2563EB` / bg `#FAFAFA` / fg `#09090B` — "Monochrome + blue accent" | **Accepted**, then measured |
| TYPOGRAPHY | **Caveat / Quicksand** — "handwritten, personal, friendly, casual, warm, charming"; Best For: "Personal blogs, invitations, creative portfolios, lifestyle brands" | Rejected on fit |
| AVOID | "Corporate templates + Generic layouts" | Accepted |

Caveat is a handwriting face. This is a senior engineer's professional record, and
the pairing's own `Best For` field does not include it. Rejected on the skill's
own platform/product-fit gate, not on taste.

### Q3 — product type → **the authoritative row**

```
search.py "portfolio personal showcase work" --domain product --full -n 3
```

```
### Result 1
- **Product Type:** Portfolio/Personal
- **Keywords:** creative, personal, portfolio, projects, showcase, work
- **Primary Style Recommendation:** Motion-Driven + Minimalism & Swiss Style
- **Secondary Styles:** Brutalism , Aurora UI
- **Landing Page Pattern:** Storytelling-Driven
- **Dashboard Style (if applicable):** N/A - Personal branding
- **Color Palette Focus:** Brand primary + artistic interpretation
```

This settles the style question. The generator surfaced **Brutalism**, which this
row lists under *Secondary Styles*. The **Primary Style Recommendation** is
*Motion-Driven + Minimalism & Swiss Style*. Shipped the primary.

### Q4 — the Motion-Driven half of the primary recommendation

```
search.py "motion-driven minimalism swiss" --domain style --full -n 2   # 1 result
```

```
- **Style ID:** motion-driven            - **Status:** active
- **Best For:** Portfolio sites, storytelling platforms, interactive experiences…
- **Effects & Animation:** Scroll anim (Intersection Observer), hover (300-400ms),
  entrance, parallax (3-5 layers), page transitions
- **Light Mode:** supported   - **Dark Mode:** supported
- **Accessibility:** risk:conditional|requires:contrast-text-4.5,keyboard,
  visible-focus,reduced-motion
- **Framework Compatibility:** gsap|framer-motion
- **Design System Variables:** --animation-duration: 300-400ms, --parallax-layers: 5…
```

`Framework Compatibility: gsap|framer-motion` is load-bearing — it is why
expressing the motion presets in framer-motion is inside the row, not a departure
from it. `parallax (3-5 layers)` was declined; see §5.

### Q5 — typography → **replaces the Q2 misroute**

```
search.py "developer technical precise" --domain typography --full -n 3
```

```
### Result 1
- **Font Pairing Name:** Developer Mono
- **Category:** Mono + Sans
- **Heading Font:** JetBrains Mono
- **Body Font:** IBM Plex Sans
- **Mood/Style Keywords:** code, developer, technical, precise, functional, hacker
- **Best For:** Developer tools, documentation, code editors, tech blogs, CLI apps
- **Notes:** JetBrains for code, IBM Plex for UI. Developer-focused.
```

Result 2 was *Dashboard Data* (Fira Code / Fira Sans); Result 3 *Modern Dark
Cinema* (single-family Inter). Shipped Result 1.

### Q6 — landing pattern identity check

```
search.py "storytelling narrative chapters" --domain landing --full -n 3
```

```
### Result 1
- **Pattern ID:** scroll-triggered-storytelling
- **Aliases:** Storytelling + Data|…|Storytelling-Driven|…
- **Section Order:** Intro hook > Chapter 1 (problem) > Chapter 2 (journey) >
  Chapter 3 (solution) > Climax CTA
- **Primary CTA Placement:** End of each chapter (mini) + Final climax CTA
- **Color Strategy:** Progressive reveal. Each chapter has distinct color.
  Building intensity.
- **Conversion Optimization:** Keep the narrative understandable without
  scroll-driven effects… Keep DOM reading order complete; disable parallax and
  scroll-scrub under reduced motion.
```

`Storytelling-Driven` from Q3 appears in this row's `Aliases`, so the product row
and the landing row are the same pattern. Identity verified rather than assumed.

**Result 3 was `hero-testimonials-cta`** — "Use a concise set of verified
testimonials with photo, name, and role." See §6: refused.

### Q7 — the Swiss half of the primary recommendation

```
search.py "minimalism swiss whitespace grid" --domain style --full -n 2   # 1 result
```

```
- **Style ID:** minimalism-and-swiss-style     - **Status:** active
- **Keywords:** Clean, simple, spacious, functional, white space, high contrast,
  geometric, sans-serif, grid-based, essential
- **Effects & Animation:** Subtle hover (200-250ms), smooth transitions…
- **Accessibility:** risk:low|requires:contrast-text-4.5,keyboard,visible-focus…
- **CSS/Technical Keywords:** display: grid, gap: 2rem… clean borders,
  no box-shadow unless necessary
- **Design System Variables:** --spacing: 2rem, --border-radius: 0px,
  --shadow: none, --accent-color: single primary only
```

`--shadow: none` and `--accent-color: single primary only` are why the build has
no shadow scale and why the old coral secondary was dropped.

### Q8 — colour

```
search.py "portfolio brand primary neutral" --domain color --full -n 3
```

```
### Result 1
- **Product Type:** Portfolio/Personal
- Primary #18181B / On Primary #FFFFFF / Secondary #3F3F46 / On Secondary #FFFFFF
- Accent #2563EB / On Accent #FFFFFF
- Background #FAFAFA / Foreground #09090B / Card #FFFFFF / Card Foreground #09090B
- Muted #E8ECF0 / Muted Foreground #475569 / Border #E4E4E7
- Destructive #DC2626 / On Destructive #FFFFFF / Ring #18181B
- **Notes:** Monochrome + blue accent
```

### Q9 — stack, with version verification

```
search.py "app router server components" --stack nextjs --full -n 4
```

All four results carried `Applies To: nextjs 16.2`, `Status: active`,
`Verified At: 2026-08-13`. The brief required confirming these are Next 16 rows
and not an older App Router shape, so the whole file was checked:

| File | Rows | Version tags |
|---|---|---|
| `stacks/nextjs.csv` | 60 | 59 × `nextjs 16.2`, 1 × `nextjs legacy` (deprecated) |
| `stacks/react.csv` | 61 | 59 × `react 19.2.x`, 2 × `react legacy` (deprecated) |

The deprecated rows are genuinely Next-16-aware: *"The middleware filename and
named export are deprecated in Next.js 16; use proxy.ts"* and *"forwardRef is
deprecated in React 19"*. Neither applies to this codebase. The catalogue is
targeting our exact versions (next 16.2.7 / react 19.2.4).

### Q10–Q14 — accessibility and typography outcomes

| Query | Top result (verbatim fields) |
|---|---|
| `"focus not obscured" --domain ux` | **Focus Not Obscured (Minimum)**, WCAG 2.2 AA, severity **High**. Do: *"Offset sticky UI with scroll-padding"*; Code good: `scroll-padding-top: var(--header-height)`. Also **Focus Appearance**: *"an indicator at least as large as a 2 CSS px perimeter with 3:1 state contrast"*. |
| `"target size pointer minimum" --domain ux` | **Target Size (Minimum)**, severity High: *"WCAG 2.2 AA requires 24 CSS px pointer targets"*; **Don't: *"Assume native 44pt or 48dp guidance defines web conformance."*** |
| `"reduced motion preference" --domain ux` | **Reduced Motion** (High); **Excessive Motion** (High): *"Animate 1-2 key elements per view maximum"*; **Motion Sensitivity** (High): *"Parallax/Scroll-jacking causes nausea… Don't: Force scroll effects"*, code-bad `ScrollTrigger.create()`. |
| `"line length reading measure" --domain ux` | **Line Length**: *"Limit to 65-75 characters per line"*; **Line Height**: *"Use 1.5-1.75 for body text"*; **Heading Line Balance**: `max-inline-size: 20ch; text-wrap: balance`. |
| `"dark mode contrast tokens" --domain ux` | **Color Contrast**: *"Minimum 4.5:1 ratio for normal text"*; **Contrast Readability** (High). |

### Q15 — motion presets

```
search.py "scroll reveal stagger" --domain gsap --full -n 3
```

Result 2, **Scroll Reveal (Subtle)**, is the one shipped:

```
- Trigger: scroll (viewport enter) | Duration: 300-400ms | Easing: power1.out
- Do: Keep the y offset small (8-16px) so it reads as a fade, not a slide
- Don't: Don't reveal below-the-fold content needed for SEO/crawlers as
  invisible-by-default without a no-JS fallback
```

Every row in `motion.csv` is written as GSAP. **GSAP was not added.** See §5.

### Q16 — icons

```
search.py "icon button accessible label" --domain icons --full -n 3
```

```
### Result 1
- **Icon Name:** icon-context-accessibility
- **Library:** Phosphor (primary) + Heroicons (fallback)
- **Usage:** …Keep one visual family per surface. Context is chosen by use: if
  decorative beside visible text, set aria-hidden="true"; if meaningful without
  equivalent visible text, provide a text alternative; if inside an interactive
  control, give the control an accessible name and expose applicable state…
```

The semantic half is applied in full. The library half is not — see §5.

### Q17 — persist

```
search.py "portfolio showcase personal brand" --design-system --persist \
  --variance 7 --motion 5 --density 3 -p "Abubakar Khawaja Portfolio" \
  --output-dir . --format markdown
→ ✅ Design system persisted to design-system/abubakar-khawaja-portfolio/
```

`--force` was never used. The only `MASTER.md` in this worktree is the one
written by this run; it was then hand-reconciled, with every edit logged inside
the file itself.

### Q18 — success/warning colours → **the catalogue genuinely has nothing**

```
search.py "success warning semantic state" --domain color --full -n 2
```

Returned 2 results (Coding Bootcamp, Fitness/Gym App). Both are *palettes*, not
state tokens. Direct inspection of the CSV header confirms why:

```
No,Product Type,Primary,On Primary,Secondary,On Secondary,Accent,On Accent,
Background,Foreground,Card,Card Foreground,Muted,Muted Foreground,Border,
Destructive,On Destructive,Ring,Notes
```

**`colors.csv` has no Success or Warning column at all.** This is the one place
where the catalogue could not answer the question asked. Rather than inventing a
green, the Accent of the two rows whose `Notes` say "success green" / "emerald
CTA" was used, each on the background type it is published against:

- dark `#22C55E` (Coding Bootcamp, used there on `#020617`) → 7.83:1 here
- light `#059669` (Micro SaaS, used there on `#F5F3FF`) → 3.61:1 here
  (`#22C55E` on light measures **2.18:1** and was rejected)

**`Warning` was deleted, not guessed.** No component used it.

### Non-search evidence

Direct reads of the catalogue, used to verify identity rather than to discover:
`products.csv` (grep for portfolio rows), `colors.csv` (header + the two green
rows), `stacks/nextjs.csv` and `stacks/react.csv` (version-tag census),
`scripts/design_system.py` (dial tiers, `_contrast_ratio`, `_derive_dark_palette`,
`_relative_luminance`).

---

## 2. The three dials

```
--variance 7   --motion 5   --density 3
```

**`--variance 7` — "Balanced / Modern", the top of the mid band.**
Awwwards weights Design 40% + Usability 30% against Creativity 20%, a minimum of
18 jurors score each site, and the three scores furthest from the mean are
discarded. That arithmetic punishes polarising work: a site nobody can fault beats
one two people love and two people hate. 8–10 biases the search toward Brutalism
and Bento Grids, which is exactly the kind of choice that produces a split jury.
7 keeps the structure deliberate and asymmetric without anti-design.

Worth noting honestly: **the dial did not fully take.** Variance 7 should bias
toward "modern, structured, balanced", yet Q2 still returned Brutalism, whose
keywords sit in the 8–10 tier. The dial biases the query; it does not constrain
the result.

**`--motion 5` — "Standard".**
Labs is the headline and motion is part of selling craft, but two constraints bite.
The catalogue's own "Excessive Motion" row caps animation at **1–2 key elements per
view**, and the 8–10 tier pulls Complex presets built on GSAP `SplitText` and
`ScrollTrigger` — GSAP is not a dependency here, and `SplitText` additionally
carries a licence the row tells you to review. 5 lands on presets expressible in
the framer-motion already installed.

**`--density 3` — "Spacious" (24/32/48/64/96).**
This is an editorial reading experience with a 68-character measure, not a
dashboard. 8–10 would compress to an 8–32px scale. 1–2 would be looser still, but
the Labs telemetry panels are genuinely dense content and would start to feel
unmoored. 3 is the top of the spacious band.

---

## 3. What was retrieved, and what shipped

| | Catalogue | Shipped | Same? |
|---|---|---|---|
| Product type | `Portfolio/Personal` | — | ✅ |
| Pattern | `scroll-triggered-storytelling` | Same order, Labs lifted to 2nd | ⚠️ owner-directed |
| Style | Motion-Driven + Minimalism & Swiss | Same, Brutalism as secondary influence | ✅ |
| Palette | `Portfolio/Personal`, "Monochrome + blue accent" | Same hexes + verified dark ramp + split border | ⚠️ 3 measured fixes |
| Type | Developer Mono (JetBrains Mono / IBM Plex Sans) | Same | ✅ |
| Motion | Scroll Reveal (Subtle), GSAP | Same parameters, framer-motion | ⚠️ no GSAP |
| Icons | Phosphor + Heroicons | lucide-react | ❌ declined |
| Parallax | 3–5 layers | none | ❌ declined |
| Social proof | `hero-testimonials-cta` | none | ❌ refused, no data |

### Colour: what was measured

Every pair a component can produce was measured with the skill's own
`_contrast_ratio()` from `design_system.py`. **54/54 gated checks pass in both
modes.** Three departures, each forced by a failed measurement:

| Problem | Measured | Fix |
|---|---|---|
| `Border #E4E4E7` as a control boundary | **1.22:1** light, **1.72:1** dark | Split into decorative hairline + `#71717A` / `#64748B` boundary (4.63:1 / 3.75:1) |
| `Accent #2563EB` as text on dark | **3.45:1** | `#60A5FA` (7.02:1) |
| `Destructive #DC2626` on dark | **3.70:1** | `#F87171` (6.45:1) |
| `Primary #18181B` on dark | **1.01:1** — invisible | Inverted to `#F8FAFC` (17.06:1) |

The last three come from `_derive_dark_palette()`, which by design *"keeps product
brand tokens while deriving accessible dark surfaces"* — which is precisely how a
near-black primary ends up on a near-black ground. The derivation is the skill's;
the measurement that caught it is the skill's; the correction is mine.

One enforced constraint falls out of the measurements: **accent as text may not
sit on the muted hover surface** (4.35:1 in light — fine for an icon or border at
the 3:1 non-text floor, short of AA for text). So cards signal hover by darkening
their boundary rather than filling, which also matches Swiss's `--shadow: none`.

### Brand marks measured against the dark surface

| Mark | On `#111827` | Action |
|---|---|---|
| `github` | **1.02:1** | → white variant |
| `apachekafka` | **1.09:1** | → white variant |
| `modelcontextprotocol` | **1.18:1** | → white variant |
| `ollama` | **1.18:1** | → white variant |
| `langchain` | **1.49:1** | → white variant |
| `opensearch` | 2.78:1 | left alone |
| `redux` | 2.94:1 | left alone |
| LinkedIn | 3.12:1 | left alone |

The last three sit under or near 3:1 but are plainly visible, and each is a
decorative icon beside a visible text label — recolouring a brand's own blue or
purple would be the larger error. The first five are not low-contrast, they are
invisible, and every one of those brands publishes a white monochrome variant for
dark backgrounds.

---

## 4. Pre-delivery checklist (`references/pro-rules.md`)

**Scope caveat, stated by the file itself:** *"everything below targets
native/mobile app UI. For web/desktop interaction patterns, use
`references/quick-reference.md` (stack-agnostic) instead — these tables assume
touch targets, safe areas, and platform gesture conventions that don't apply 1:1
to desktop web."* This is a static-export web app. Items are ticked where they
translate, marked **n/a** where they do not, and left **unticked** where they
translate and were not done.

### Process
- [x] Ran only searches relevant to the interface (18 queries, §1)
- [x] Reviewed `quick-reference.md` §1–§3 (CRITICAL + HIGH) as a final pass
- [x] Tested at 375px — and at 768 / 1024 / 1440, in both themes, by automated audit
- [ ] **Landscape orientation** — not tested
- [x] Verified behaviour with reduced motion enabled — and found it broken; see below
- [ ] **Dynamic Type / largest system text size** — not tested. Browser zoom and
      `rem`-based type make this likely fine, but "likely" is not "verified"
- [x] Checked dark-mode contrast independently (54 measured pairs, not inferred)
- [x] Confirmed touch targets and that no content hides behind the fixed nav

### Visual quality
- [x] No emoji as icons
- [x] One icon family (lucide-react) at consistent sizes
- [x] Official brand assets, correct proportions; only the *ink* of five
      monochrome marks changes with theme, never the path data
- [x] Pressed/hover visuals do not shift layout bounds (colour and border only)
- [x] Semantic tokens throughout; no per-component hex

### Interaction
- [x] All interactive elements have visible hover/focus feedback at 180ms
- [x] Targets: 44px for buttons, nav links, toggles and card links; **audit
      confirms zero targets under 24×24 CSS px** at all four breakpoints
- [x] Shared timing tokens (`--duration-state`, `--duration-enter`, `--duration-exit`)
- [x] Disabled states clear and non-interactive (lab controls)
- [x] Screen-reader order matches visual order — the hero's `order-*` classes were
      removed specifically for this
- [ ] **Gesture-conflict review** — n/a, no drag or swipe interactions

### Light/dark
- [x] Primary and secondary text ≥4.5:1 in both modes (measured)
- [x] Dividers and interaction states distinguishable in both modes
- [x] Scrim token measured against the real background, per mode
- [x] Both themes tested, not inferred — 40 screenshots, 2 themes × 2 viewports × 10 views

### Layout
- [ ] **Safe-area insets** — no `env(safe-area-inset-*)` handling was added. The
      fixed header and bottom controls were not verified on a notched device
- [x] Scroll content is not hidden behind the sticky header (`scroll-padding-top`)
- [x] Verified at 375 / 768 / 1024 / 1440; **audit confirms no horizontal overflow**
- [x] Gutters adapt by breakpoint
- [x] 8px rhythm maintained at component, section and page level
- [x] Long-form text capped at a 68-character measure

### Accessibility
- [x] Decorative icons beside visible text are `aria-hidden`
- [x] Meaningful icons have a text alternative
- [x] Icon controls have an accessible name; **audit confirms zero unnamed
      interactive elements**
- [ ] **Form fields** — n/a on the portfolio page (no forms). The lab controls
      carry labels but were not separately audited
- [x] Colour is not the only indicator (glyph changes alongside colour)
- [x] Reduced motion supported without layout breakage
- [x] Sticky UI does not obscure keyboard focus
- [ ] **Dragging alternatives** — n/a
- [ ] **Authentication** — n/a
- [ ] **Auto-rotating content** — n/a
- [ ] **Error summaries** — n/a

### What the audit actually found

Driving the built site over the DevTools Protocol at four breakpoints × two
themes caught two real failures that reading the code had not:

1. **Reduced motion did not work.** `Reveal` checks `useReducedMotion()`, but
   under media emulation `matchMedia` correctly reported `reduce` while all 41
   reveal blocks still rendered the animated branch — 39 of them at `opacity: 0`.
   A visitor who asked for less motion would have got a mostly blank page. Fixed
   in CSS, where it cannot lose the race.
2. **Card `Visit` / `Source` links measured 62 × 16.8 CSS px**, under the 24×24
   minimum. They are standalone links in a card footer, so the inline-target
   exception does not apply. Both now carry a 44px hit area.

Post-fix, all eight breakpoint/theme combinations report clean.

---

## 5. Retrieved recommendations deliberately declined

**Parallax, 3–5 layers.** The Motion-Driven row asks for it and sets
`--parallax-layers: 5`. `ux-guidelines.csv` → "Motion Sensitivity" (severity High)
says *"Parallax/Scroll-jacking causes nausea… Don't: Force scroll effects"*, and
"Excessive Motion" (High) caps animation at 1–2 elements per view. The SKILL.md
priority table puts Accessibility at **1** and Animation at **7**. Accessibility
wins. The catalogue contradicts itself here and its own table resolves it.

**GSAP.** Every `motion.csv` row is a GSAP snippet. GSAP is not a dependency, and
adding a ~70 KB animation engine to fade eight blocks would not survive a
performance review on a static site whose own stack rows flag bundle size. The
preset's *parameters* are honoured exactly; `styles.csv` lists
`Framework Compatibility: gsap|framer-motion`, so framer-motion is inside the row.

**Phosphor + Heroicons.** `icons.csv` names them primary and fallback. The repo
uses lucide-react across roughly forty call sites. The same row says *"Keep one
visual family per surface"*, and swapping families would add a dependency and
churn forty files for no user-facing gain. The row's semantic half — decorative
vs meaningful vs interactive, `aria-hidden`, accessible names, state exposure —
is applied in full.

**Brutalism as the primary style.** `products.csv` lists it as *secondary* for
this product type; the generator surfaced it as primary. Its effects also include
*"No smooth transitions (instant)"*, which directly contradicts the generator's
own anti-pattern list (*"Instant state changes — always use transitions
(150-300ms)"*) and the CRITICAL Touch & Interaction category. Its structural
honesty — visible rules, square corners, no ornament — is kept.

**The generated component specs.** The generator emitted raw hex, a `box-shadow`
scale, `cursor: pointer` on non-interactive cards, and `.card { background:
#FAFAFA }` against a `#FAFAFA` page background (an invisible card). Raw hex in
components is an anti-pattern in the priority table's own §6, and Swiss specifies
`--shadow: none`. Rewritten token-driven and flat.

**`next/font` over the catalogue's `@import` URL.** `typography.csv` ships a
Google Fonts `@import`. The `nextjs` stack rows mark *"Use next/font for fonts"*
active for 16.2, and a stylesheet `@import` is a render-blocking third-party
request that also leaks visitor IPs to Google. Stack guidance wins over the
typography row's convenience field.

---

## 6. Content: every change, and every gap refused

`src/config/site.ts` is the single source of truth. Nothing in it was invented,
embellished or deleted.

### Facts re-staged (previously present but rendered nowhere)

| Field | Was | Now |
|---|---|---|
| `profile.intro` | in config, **rendered nowhere** | the Approach section's body, **verbatim** |
| `profile.availability` | in config, unrendered | hero status line |
| `profile.location` | in config, unrendered | hero status line |
| `profile.stats` | **commented out** in Hero | hero meta line |
| `role.location` | in config, unrendered | trajectory metadata rail |

### New copy written (structural only — no factual claims)

| String | Provenance |
|---|---|
| Section title **"Where The Time Goes"** | Derived from `profile.pitchHighlight`: *"I find where the time goes and fix it there"* |
| Section label **"How the work actually gets done, and what it moved"** | New connective copy. Makes no claim. |
| Nav item **"Approach"** | Navigation label for the new section |
| Figure labels: "API response times cut", "automated test coverage raised", "deployment time reduced", "shipping production software" | Each is a reduction of a clause of `profile.intro`; the clause is stored beside it in the `source` field so the two cannot drift |

### Figures: every number traced

All four come from `profile.intro`, which reads in part: *"I cut API response
times 30–70% through query tuning and indexing, scaled Celery pipelines for heavy
workloads, raised automated test coverage 10%→60%+, and reduced deployment time by
~40% through CI optimization."*

| Shown | Source clause |
|---|---|
| `30–70%` | "I cut API response times 30–70% through query tuning and indexing" |
| `10% → 60%+` | "raised automated test coverage 10%→60%+" |
| `~40%` | "reduced deployment time by ~40% through CI optimization" |
| `5+ years` | "Full-Stack Engineer with 5+ years building and shipping production software" |

This is the one place where the brief's warning about stat rows applies most
sharply. These figures exist and are owner-approved; re-typesetting them is
re-staging, which the brief permits. **No figure here is absent from
`profile.intro`.** If the owner would rather they stayed inside the paragraph,
deleting the `figures` array in `site.ts` removes the block and nothing else.

### Structural metadata changed

Section hex indices renumbered to the new narrative order (`approach` 0x01,
`labs` 0x02, `trajectory` 0x03, `arsenal` 0x04, `featured` 0x05, `personal` 0x06,
`certifications` 0x07, `contact` 0x08) and `nav` reordered to match. No section's
content changed.

### Content gaps refused

| The pattern asked for | Status |
|---|---|
| **Testimonials** with photo, name and role (`hero-testimonials-cta`) | **None exist in `site.ts`. None written.** |
| **Client logo wall** | No client logos exist. None written. |
| **Ratings / review counts** | None exist. None written. |
| **Awards / press mentions** | None exist. None written. |
| **User counts, revenue, traffic figures** | None exist. None written. |
| **Education `period`** | The `Education` type declares `period`, but the single education entry has no such field — it is `undefined` at runtime. The component renders nothing rather than guessing a date range. |
| **Project dates / durations** | Not in `site.ts` for any project. Not written. |
| **Case studies** for the three `href: "#"` projects | Those projects have no public URL. No link was fabricated; they render without a Visit action. |

No image assets were generated. The only visual assets are the ones already in
`src/assets/`.

`public/cv/**` was not touched.

---

## 7. What could not be verified

- **No automated axe-core or Lighthouse run.** The audit in §4 is purpose-written
  and covers overflow, target size, accessible names, alt text, heading order and
  reveal state. It is not a substitute for a full rule engine, and it does not
  compute contrast against *rendered* pixels — contrast was verified against the
  token set instead, which misses any place a token is overridden locally.
- **No real screen-reader pass.** Names and semantics were checked
  programmatically; nobody listened to it.
- **No real-device testing.** Everything is headless Chrome with device metrics
  emulation. Safari and Firefox were not opened. iOS safe-area behaviour behind
  the fixed header is unverified.
- **Landscape orientation and OS-level large-text settings** were not tested.
- **Labs was not functionally exercised.** The restyle did not touch the ~1,400
  lines of engine code, and `pnpm build` passes, but no model was actually
  downloaded and run in this session. Cross-origin isolation still reports
  `threads 4 · cross-origin isolated` in the telemetry panel of the captured
  screenshots, which is a good sign but not a functional test.
- **Dial efficacy.** `--variance 7` did not prevent Brutalism from being returned.
  How much the dials actually constrain results, versus merely nudging keyword
  weighting, was not established.
- **The build depends on network access to `fonts.gstatic.com` on a cold cache.**
  One build failed mid-session with `Module not found:
  '@vercel/turbopack-next/internal/font/google/font'` after `.next` was cleared,
  and succeeded on retry. This is inherent to `next/font/google` rather than
  something this build introduced, but adding a second font family widens the
  surface.

---

## 8. Honest read: would this clear 6.5 across 18 jurors?

**Probably not on its own. My estimate is mid-5s to low-6s — a plausible
Honorable Mention contender only after the gap below is closed.**

Where it is strong. Usability (30%) is the most defensible part of this build,
and it is defensible with numbers rather than assertions: 54 measured contrast
pairs passing in both themes, zero sub-24px targets, zero unnamed controls, zero
horizontal overflow at four breakpoints, a reduced-motion path that was broken and
is now verified. Content (10%) is real, specific and unusually concrete for a
portfolio. Design (40%) is competent — the type system is coherent, the grid is
disciplined, the dark mode is genuinely designed rather than inverted, and the
monospace display voice gives it a point of view.

Where it falls short, and this is the honest part. **Awwwards' Design 40% is
substantially about ambition, and this build is restrained by construction.** The
method that makes it defensible — retrieval over recall, a trimmed-mean-friendly
variance of 7, accessibility outranking style — is the same method that keeps it
from being memorable. Jurors scoring 8+ on Design are usually rewarding a single
audacious idea executed flawlessly. This site has craft without that idea. A
well-set editorial page with one ink block is a 6 on Design from most jurors, not
an 8.

**Creativity (20%) is where the real gap is, and it is a missed opportunity
rather than a limitation.** Labs is a genuinely remarkable asset — two speech
models that download and run on the visitor's own hardware, with live telemetry —
and it was promoted from seventh position to second. But it is still *described*
on the home page and only *operable* one click away. The single highest-leverage
change available is to make the hero itself operable: let a visitor hear the page
speak, or speak to it, without leaving the first screen. That is the thing a juror
would remember, and it is the thing that would be written up. Everything needed
for it already exists in `src/features/`.

Two smaller gaps. There is **no custom imagery or motion signature** — no
generative element, no interactive diagram, nothing a visitor could screenshot.
And the **Developer Award jury is a separate track** that this build is well
positioned for and does not currently court: the cross-origin isolation work, the
web-worker threading and the dependency-cruiser deep-module boundaries are
genuinely interesting engineering that the site never mentions.

So: as submitted, this is a strong Usability score dragging a merely good Design
score, with Creativity underweighted relative to the asset actually available.
Close the Labs-in-hero gap and it becomes a real Honorable Mention candidate. Ship
it as-is and it is a very good portfolio that will not win anything.
