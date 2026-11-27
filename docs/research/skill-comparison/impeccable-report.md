# Impeccable build report

A redesign of abuubkar.github.io run entirely through Paul Bakaus's
`impeccable` skill (Apache-2.0), on branch `worktree-agent-a8eace95acd68b48f`.

**Disclosures, up front.** No human answered this session, and impeccable's
flow asks for answers at three points. I could not run `/impeccable <command>`
slash commands, so I read `SKILL.src.md` and the reference files and followed
them by hand, driving the deterministic engine through its CLI. The decision
page (`serve-question`) needs a person at a browser and there was none, so the
direction round ran unattended on the assigned direction, which `new-work.md`
permits with the assumptions stated. Every `[inferred]` line in `PRODUCT.md` is
a reading of repository evidence, not a confirmed answer. There is no image
generation in this session, so the build was **code-led**, which is the only
path available without one; the ambition lives in the direction contract's
FIRST VIEWPORT block instead of in an approved comp.

---

## 1. Mode

**Experience.** Chosen from the surface, not the product: `SKILL.src.md` names
"portfolios, galleries, showcases" as the mode's own example, and its rule is
that *the work itself leads from the first viewport*. That single line drove
the largest structural decision in this build — the live speech model moved out
of a teaser card near the bottom of the page and became the first viewport's
primary action.

Heuristics 7 and 10 are scored rather than marked `n/a`, because both genuinely
apply here.

## 2. Visual world, and why

### What the roll actually said

```
$ ./.claude/skills/impeccable/scripts/impeccable concept-seed --scope direction --mode experience

DIRECTION CONCEPT SEED (key: 9d5191afbe3a0be5a0b3520b8d477d2f; mode: experience;
source: api; approved pool: c3b204a1eed6; 306/564 human-approved)
ASSIGNED INDEX: 7
SEED REFERENCE: seed:dd144f55b341d178
```

The script refuses to roll without `PRODUCT.md` (`NO_PRODUCT_MD: the dice stay
in the cup until product truth exists`), so `PRODUCT.md` was written first from
`src/config/site.ts` and the repo.

**Assigned index 7 of 7** — the *least* resonant of my own ordered list, which
is the entire point of the mechanism: "your top-ranked direction is what every
run would ship, so the script decides which grounded direction gets built."

### The seven grounded candidates, ordered by resonance

Derived from the audience's cultural world — engineering's own graphic and
print traditions — spanning five material families, with exactly one candidate
spent on "tools the audience operates" (mode-persuade caps this at one for
Experience surfaces):

1. Flight-test report plate — lithographed plot plates, strip-chart traces, gridded measurement bands
2. Swiss railway departure board — SBB timetable sheets, vitreous enamel signage, tabular figures
3. Scientific instrument calibration certificate — tolerance bands, measured-vs-nominal columns
4. Ordnance Survey topographic sheet — sheet margin, legend block, bar scale, contour ink
5. NYCTA Graphics Standards Manual — Vignelli route discs, strict modular grid
6. Mastering studio console panel — scribble strips, anodised silkscreen *(the one tool candidate)*
7. **Jacquard punch card and loom deck** — punched grids as program, corner cut, interpreter print

**The rut, kept off the list:** the dark terminal portfolio (prompt, mono,
`//` comments) — which is exactly what this site already was — and its
predictable opposite, the cream broadsheet with an italic serif display and
small tracked kickers.

### The challenger hand, weighed before any borrowing

| # | Challenger | Audience identification | Product clarity | Verdict |
|---|---|---|---|---|
| 1 | Nixie laboratory counter | high | low — "quantities are the interface" would reduce a prose record to its numbers, which is craft-floor's banned hero-metric template | **competitive** |
| 2 | Normalled jackfield schedule | low — patch-bay normalling is audio-trade knowledge | high | **competitive** |
| 3 | Dong Ho woodblock on shell ground | low | low | declined |
| 4 | Elbow panel console (LCARS) | high as recognition, but it makes the page about the costume | low | declined |
| 5 | Indoor weather sun | low | low — amber duotone destroys the project screenshots' own colour | declined |
| 6 | Iridescent cloud edge | low | medium | declined |

No challenger won both axes, so the assigned direction built, **raised by the
disciplines the declined hand had and it lacked** (every raise is a named line
in the surface brief and is visible in the shipped result):

- *from the iridescent cloud edge* — colour lives only at edges and in marks; the text field stays achromatic
- *from the normalled jackfield* — state is carried by form, never by hue alone
- *from the elbow panel console* — the frame is the layout grid; nothing sits in a card inside the card
- *from the indoor weather sun* — one vast horizontal move owns the composition
- *from the Dong Ho print* — a fixed layer order, the ink layer always topmost and opaque

### The world: "Deck"

A punched card is the only document ever written twice at once — the holes are
the machine's copy, the interpreter print along the top edge is the human's.
That is exactly this product: a hiring manager has two minutes and reads prose,
while every claim in the record carries an exact measurement.

So the site is **built as** a card rather than decorated like one. The opening
band is the real Hollerith code for the line printed under it, computed in
`src/lib/hollerith.ts` from the IBM 029 code table (zone 12/11/0 plus digit
rows 1–9), not drawn. The portrait sits in an **aperture** — a real punched card
that has to carry an image gets a rectangular window cut in it, so this is the
world's own answer rather than a mask invented to hold one. Buttons are
keypunch **keys**. Labels are the interpreter print. The scroll indicator is the
diagonal stripe inked across a deck's top edge.

### Obeying the Claude-specific prior

`new-work.md` carries a measured prior addressed to this model: *"warm, bookish,
family, and child-facing subjects come out as cream grounds, serif display with
italic accents, and lamplight… Treat that first palette as already spent."*

The incumbent site was precisely that — paper `#f1f0ed`, editorial hairlines,
mono kickers. The replacement takes the world's **saturated** materials instead:
a dyed green card stock at page scale (`#d8ecd1`), not manila, not cream, not
ivory. Measured: the detector's `is_cream_color` requires `r >= g >= b`, and the
stock has `g > r`, so it can never be read as cream by construction.

*(For the record: the incumbent `#f1f0ed` escaped `cream-palette` by two points
of 255 — the rule needs warmth `r - b >= 6` and it measured 4.)*

## 3. Refine or replace

**Replace.** `new-work.md`: redesign "treats the old look as evidence and
anti-reference… Never split the difference into polish on the discarded look."

Three pieces of evidence made this unambiguous:

1. Terminal Editorial is one of the four saturated clusters `new-work.md`
   names by hand ("broadsheet-editorial hairlines, italic display serif, and
   small tracked mono labels").
2. The owner released the palette, typography, layout and motion explicitly.
3. The incumbent accent `#2d4fe6` measures **`oklch(50.8% 0.2299 267.1)`**. The
   engine's `is_declared_purple` reads 250–320° as purple, so cobalt sits
   *inside* the purple band — and `ai-color-palette` was silent on the old site
   only because `docs/DESIGN.md` declared it, which switches the purple check
   off. The new signal is madder red at hue 28°, so the build does not lean on
   that exemption at all.

Nothing was polished. Fourteen components were deleted outright; the token
layer, the type system, the motion, the structure and the navigation are new.

## 4. What changed structurally

| Before | After |
|---|---|
| 8 sections, 7 nav items | 5 bands, **4** nav items (Working Memory Rule: ≤5) |
| `SectionHeading` with `0x01 // slug` kicker on every section | `Section` with a heading and nothing above it |
| `Reveal` wrapping every section (identical entrance ×20) | one authored moment: the read head crossing the band once |
| `ProjectCard` grid — identical same-size cards | registers and a gallery index; no cards anywhere |
| `Certifications` icon-tile card grid | rows in the record's register |
| Labs as a teaser card near the bottom | a live speech model as the first viewport's primary action, plus a full Labs band |
| light only | two composed surfaces (`card` / `reader`) with a pre-paint settle |
| global `prefers-reduced-motion` → `0.01ms !important` | an intentional alternative that keeps feedback |
| browser surfaces unaddressed | selection, caret, scrollbars, focus, underline offset, placeholder, marker, tabular numerals all themed |

Deleted: `SectionHeading`, `Reveal`, `ProjectCard`, `ProjectImage`, `Button`,
`TopNav`, `LabsTeaser`, and seven section components.
Added: `src/components/card/*` (8 primitives), `src/lib/hollerith.ts`,
`src/lib/measure.ts`, four sections, `LabsBand`, `SpeakKey`.

## 5. Checker output, verbatim

Served over HTTP from the real `next build` static export. A `file://` scan of
`out/labs/index.html` produced 13 `cramped-padding` findings and two colour
advisories that **do not reproduce over HTTP** — the absolute `/_next/...`
stylesheet path does not resolve from the filesystem, so the engine measures a
layout the browser never produced. The engine's own message says to scan a
served URL; these are the served runs.

```
$ npx impeccable detect src/

63 files scanned with regex matching only (.css, .ts, .tsx).
Rules that need a parsed page (tiny-text, low-contrast and other element rules) did not run on them; findings are an undercount, not a clean bill of health.
For the full check, scan the running dev server (npx impeccable detect http://localhost:PORT) or a static site's built .html.
exit: 0
```

```
$ npx impeccable detect http://localhost:4322/
exit: 0
```

```
$ npx impeccable detect http://localhost:4322/labs/
exit: 0
```

```
$ npx impeccable detect --json http://localhost:4322/ http://localhost:4322/labs/
[]
exit: 0
```

```
$ npx impeccable ignores list
Impeccable detector ignores
  shared file: .impeccable/config.json
  local file:  .impeccable/config.local.json

Merged:
  ignoreRules:  (none)
  ignoreFiles:  (none)
  ignoreValues: (none)
  designSystem: enabled
```

**Zero rules are suppressed.** No `ignoreRules`, no `ignoreFiles`, no
`ignoreValues`, no inline `impeccable-disable` comments anywhere in the source.

### What the detector caught during the build, and what it cost

These were real and are fixed; they are listed because the clean final run is
only meaningful next to them.

| Finding | Count | What it actually was | Fix |
|---|---|---|---|
| `all-caps-body` | 5 | `text-transform: uppercase` on runs of 84–126 characters — the tag and stack lists. Uppercasing them also turned "PostgreSQL" into "POSTGRESQL", a *visual* alteration of a real proper noun | Split the mono role in two: `t-print` (labels, uppercase) and `t-print-plain` (values, case preserved) |
| `line-length` | 1 | 86 characters on 3 of 5 rendered lines. `--spacing-measure: 68ch` resolved against Archivo's "0", which is wider than its average lowercase | Measured back down to `54ch` |
| `low-contrast` (advisory) | 2 | the dark surface's hover fill `#c94b3b` behind `#150504` = 4.3:1 | Split `signal-sunk` into `signal-press` (brightens on dark) and `signal-edge`; now 7.51:1 |
| `repeating-stripes-gradient` (advisory) | 1 | a `.field-rule` class written for a surface that never shipped | Deleted |
| `design-system-font` / `design-system-color` | 15 + 11 | `docs/DESIGN.md` still described Terminal Editorial | Rewritten from the built world, plus `.impeccable/design.json` |
| `pulsing-dot` | 1 *(baseline)* | the "Live" badge's `animate-pulse` dot | A static punch and a label |

### Measurements taken rather than assumed

- **27 of 27** foreground/background pairs pass WCAG AA across both surfaces, computed in OKLCH before any CSS was written (`4.50:1` minimum, body and large text).
- `document.scrollWidth === innerWidth` at 1440 — an earlier revision had **864px of horizontal overflow** from the read head, a full-width element translated a full width right. Clipped.
- **0** interactive controls under 24×24 CSS px (was 17).
- **0** images without alt text; **0** controls without an accessible name; **0** skipped heading levels across 33 headings.
- Smallest rendered functional text: **12px**, above the rule's 11px floor.
- Primary action sits **in the first viewport** at 1440×900 (`bottom: 771px`) — at an earlier display scale it was at 926px, below the fold.
- The surface control's computed accessible name is exactly one label in each scheme, verified through the engine rather than `textContent`.

## 6. Design Health Score — 33/40

Scored against `critique.md`'s own rubric. Honest, not generous: `critique.md`
says most real interfaces land 20–32.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Download shows a percentage, but synthesis — which the engine's own comment calls the longest wait — shows only an ellipsis |
| 2 | Match System / Real World | 3 | Task language is maximally plain ("Record / Work / Labs / Contact"), but the chrome is a 1960s data-processing metaphor; "Card stock" / "Light table" need decoding |
| 3 | User Control and Freedom | 4 | Esc everywhere, nothing modal that needn't be, every long operation cancellable except the cached download, which is disclosed rather than faked |
| 4 | Consistency and Standards | 4 | One key, one register, one focus treatment, one motion curve, one casing rule, applied without exception |
| 5 | Error Prevention | 3 | The 92 MB cost is stated before the press, but nothing confirms it on a metered connection |
| 6 | Recognition Rather Than Recall | 3 | Nothing is icon-only, but the surface control's label does not say it is a surface control |
| 7 | Flexibility and Efficiency | 3 | `j`/`k`, `g`-chords, `?`, theme, copy buttons — good, not "multiple paths and power features" |
| 8 | Aesthetic and Minimalist Design | 3 | No decorative chrome survives, but the home page is **15,803px tall at 390px wide**, and Work alone is 48% of it |
| 9 | Error Recovery | 4 | Lab errors name the problem and the recovery, carry `role="alert"`, and preserve the visitor's text |
| 10 | Help and Documentation | 3 | A shortcut sheet plus contextual notes; no searchable help, which a portfolio does not need |
| **Total** | | **33/40** | **Good** |

**Cognitive load:** 1 of 8 checklist items fails — *progressive disclosure*. The
Work section shows all thirteen projects fully expanded. 0–1 failures is "low
cognitive load", so this passes, narrowly, and only because the alternative
(hiding real work behind a click on a portfolio) is worse.

**Working Memory Rule:** 4 nav items (≤5 ✓). Contact reduced from 4 channels ×
2 controls = 8 options to one primary key plus a quiet register (≤4 ✓). The
gallery index asks one question: which piece to open (✓).

**Persona red flags**

- **Jordan (first-timer):** may not know what the punched band *is*. The interpreter print sits directly under the columns it encodes, which is the only mitigation; there is no sentence explaining it, because writing one would be inventing copy. Real exposure.
- **Casey (distracted mobile):** 15,803px is roughly nineteen phone screens. The primary action is above the fold and the nav is four items, but the record is a long scroll and no amount of craft shortens it. Measured breakdown in §12.
- **Sam (accessibility-dependent):** no finding I can reproduce — but see §9, this was never tested with a real screen reader.

## 7. Audit Health Score — 17/20

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | 3 | Every mechanical check passes in both surfaces; never exercised with a real screen reader |
| 2 | Performance | 3 | Static, lazy, opt-in models, transform-only animation, no `will-change`; but 13 full-size WebP screenshots ship unoptimised (`images: { unoptimized: true }` is forced by static export) and no LCP/CLS was measured |
| 3 | Theming | 4 | Full token system, two composed surfaces, pre-paint settle, zero hard-coded colours — the detector's own `design-system-color` rule is silent |
| 4 | Responsive Design | 3 | No overflow, no undersized targets, fluid type, a narrower encode on phones; 768/1024 untested and the touch gesture unexercised |
| 5 | Implementation Integrity | 4 | Detector clean on both routes; the system is not interchangeable with any other product |
| **Total** | | **17/20** | **Good** |

**Implementation Integrity verdict: pass.** The Hollerith encoding is computed
from the real code table and is verifiable by hand. The aperture is a real
artifact type. The deck edge is a real filing feature. None of it would make
sense on another product, which is the test.

## 8. Rules waived or interpreted, with reasons

No rule was suppressed. Three were *interpreted*, and each is disclosed:

1. **`numbered-section-labels` / craft-floor's ban on section numbers.** All
   seven hex page indices (`0x01`–`0x07`) are gone. `EXP.01` and `EXP.02`
   remain on the two lab experiments. They are the owner's own names for those
   experiments in `site.ts`, the lab genuinely has an ordered pair, and the
   craft floor's exemption is "unless the sequence itself carries information
   the reader needs". Judgement call, open to reversal.

2. **`skill-reflex-mono-as-technical`.** Azeret Mono sets every label and every
   number. The craft floor bans mono "as a costume for 'technical' rather than
   for code, data, or measurement" — here it is literally the machine's own
   print, carrying labels, readings and tabular figures, and prose is Archivo
   throughout. Earned, not worn.

3. **`hard-offset-shadow` (advisory).** The key's `0 2px 0 0` edge is a visible
   unblurred offset shadow. It did not fire — the rule's threshold is 4px — but
   it is adjacent, and it is not a neobrutalist costume: it is the side of a key
   cap, and it collapses to `0 0 0 0` on `:active` while the key translates
   down. Declared as a shadow token in `.impeccable/design.json`.

One **craft-floor rule the build consciously bends**: "nested cards are always
wrong" and the ban on identical card grids left no container vocabulary at all,
so the system has none. The `Section` renders a `<section>` with a top rule and
no box. That is a stricter reading than the rule requires, taken deliberately.

## 9. Copy changes — every one

No fact was altered, abbreviated or removed. Every role summary, highlight
bullet, project blurb, tag, date, metric, URL, error string and lab label is
**verbatim** from `src/config/site.ts`.

### Section titles renamed (titles carry no facts)

| Field | Before | After |
|---|---|---|
| `arsenal.title` | Technical Arsenal | Stack |
| `trajectory.title` | Professional Trajectory | The record |
| `projects.title` | Featured Projects | The work |
| `personal.title` | Personal Projects | Built on my own |
| `certifications.title` | Certifications | Coursework |
| `contact.title` | Initiate Connection | Get in touch |

Reason: `PRODUCT.md` records the voice as "plain, specific, numeric,
understated". "Technical Arsenal" and "Initiate Connection" are the discarded
world's voice, not the product's, and craft-floor requires "the product's own
language".

### Structural fields changed

- `nav` reduced from 7 items to 4 (`Record`, `Work`, `Labs`, `Contact`); `openingId: "opening"` added. First letters stay unique, which the `g`-chord shortcuts depend on.
- Slugs retargeted: `technical-arsenal` → `stack`, `professional-trajectory` → `record`, `featured-projects` → `work`, `initiate-connection` → `contact`.
- All seven `num: "0xNN"` fields removed. `EXP.01` / `EXP.02` kept.
- Added sub-heading labels: `trajectory.experienceTitle` ("Experience"), `trajectory.educationTitle` ("Education"), `projects.shippedTitle` ("Shipped for clients").

### New UI copy authored (labels only, no claims)

Added under a new `opening` block in `site.ts` and inline in components:
"Hear this page", "Hear it again", "Stop", "Loading the voice", the speech
error line, the 82M-parameter note, "Index", "Close", "Light table", "Card
stock", "Top of deck", "Shortcuts", "Visit {project}", "Source", "Live",
"Current", "Task", "Model", "Weights", "Licence", "Run {experiment}", "text to
speech", "speech to text", "Other ways to send it", "Copy", "Copied", "No mail
app opened", "Compose in Gmail", "Compose in Outlook", "Copy the address".

Every one names an action or a field. None asserts anything about the person,
the work, or the product.

### One non-copy transform worth disclosing

`src/lib/measure.ts` sets measurement runs inside sentences in Azeret Mono.
It is **presentational and lossless** — concatenating the parts it returns
reproduces the input character for character, which was checked against all 345
string literals in `site.ts` (0 roundtrip failures) and against 13 real record
sentences by hand. No word of the record can be changed by passing it through.

## 10. Content gaps refused

- **Four client projects carry `href: "#"`** (Meet Gabbi, Telehealth Platform, Rumi, Taiga) because they are not public. **No link is rendered for them, and no sentence explains the absence.** A disabled control or a "client work, private" line would both be something the record does not say.
- **`education[0]` has no `period`.** No dates are rendered for education. The type declares the field; the data omits it.
- **No project has `featured: true`.** The old "Featured" badge rendered for nothing. It was removed rather than marking projects featured.
- **There are no testimonials, client quotes, star ratings, client logos, awards, press mentions, user counts, download counts, revenue or traffic statistics anywhere in the record.** None were created. Nothing on the page implies any exist.
- The only numbers on the site are the ones already in `site.ts`, plus the model weights and sizes, which are read from the engines' own constants (`MODEL_SIZE_MB`, `MODEL_VERSION`, `MODEL_LICENSE`) rather than typed.

**No new image assets were generated.** Every raster is a pre-existing committed
asset: the portrait and thirteen project screenshots. Nothing needs sign-off.

## 11. What I could not verify

Listed plainly, because a check not run is not a check passed.

1. **No screen reader.** Mechanical a11y checks all pass; VoiceOver and NVDA were never opened. The lab telemetry's `role="status"` behaviour under a real reader is the specific unknown.
2. **No real touch device, and no synthesized touch.** The hold-to-talk control is pointer-event based with `pointerup`/`pointercancel` on `window`, which is the right implementation, but the gesture was never exercised. `audit.md` is explicit that an emulated viewport proves layout, not the gesture.
3. **The models were never loaded.** Pressing the key downloads 92 MB (Kokoro) or 77 MB (Whisper). The engines were not modified, their entry points and constants are imported and rendered, and the controls wire to the same functions the old build used — but the end-to-end speak and transcribe paths were not run in this session.
4. **No performance measurement.** No Lighthouse, no LCP, no CLS, no bundle analysis. The claims in §7 are structural (lazy, opt-in, transform-only, no `will-change`), not measured.
5. **Chrome only.** `text-wrap: balance` / `pretty`, `color-mix()`, `font-stretch` on a variable axis, and the regex lookbehind in `measure.ts` are all widely supported, and none was checked in Safari or Firefox.
6. **`/labs/` cannot be scanned at its real URL.** Its cross-origin-isolation service worker reloads the page to pick up COOP/COEP, which defeats the detector's 30-second navigation — this is pre-existing behaviour, not introduced here. The clean `/labs/` scan ran against a copy of the real build with `coi-serviceworker.js` removed, which changes the WASM thread count and no pixel.
7. **Only 390 and 1440 were inspected.** 768 and 1024 were not.
8. **The Awwwards read in §12 is a judgement, not a measurement.**

Two capture failures were found and fixed during this run, and are recorded
because `impeccable`'s capture-validity rule exists for exactly them: `serve -s`
rewrote `/labs/` to the home page, so an early "clean" labs scan had actually
scanned `/`; and full-page screenshots at `deviceScaleFactor: 2` exceeded the
renderer's 16,384px texture limit on a 16,584px page and silently repeated the
top of the document instead of failing.

## 12. Would this clear 6.5 across 18 jurors?

**Honestly: probably not, and the reason is length, not craft.**

Where it is strong. Design is 40% and Usability 30%, so craft beats concept,
and the craft here is measured rather than asserted: 27/27 contrast pairs, zero
detector findings on both routes, zero undersized targets, zero unnamed
controls, a real token system with two composed surfaces, and a browser-surface
pass most sites skip entirely. Creativity is 20% and the concept is genuinely
original and genuinely *computed* — the headline is real Hollerith code, not a
pattern that looks like one, and the Developer Award jury is the audience most
likely to check. The on-device speech model in the first viewport is something
almost no portfolio can show.

Where it loses. The scoring method is the problem: 18 jurors, the three scores
furthest from the mean discarded, so **a site nobody can fault beats one two
people love**. This site has one thing a careful juror can fault without
arguing about taste — its length on a phone — and mobile is where portfolios
lose. A juror scoring Usability on a phone will feel that before they feel
anything else.

I attempted the fix rather than only recommending it, and then measured where
the height actually goes:

| Section | 390px | share | 1440px | share |
|---|---|---|---|---|
| Opening | 1,270px | 8.0% | 907px | 7.9% |
| Record | 4,360px | 27.6% | 3,395px | 29.5% |
| **Work** | **7,601px** | **48.1%** | **5,086px** | **44.2%** |
| Labs | 1,341px | 8.5% | 793px | 6.9% |
| Contact | 681px | 4.3% | 655px | 5.7% |
| **Document** | **15,803px** | | **11,514px** | |

A density pass on the mobile register — shallower apertures on phones, tighter
row padding, tighter section gaps — took **781px (4.7%)** off, from 16,584px.
That is all a layout change can give. The thirteen project entries are
**7,249px on their own**, averaging 558px each, and that 558px is an image, a
title, a stack line, a five-line blurb, a tag run and two links. Every one of
those except the image is a fact in `src/config/site.ts`.

So the honest statement is: **further reduction requires hiding facts behind a
disclosure control, or the owner agreeing to shorten the project blurbs.**
Neither is mine to decide, and I will not fake the number by collapsing real
work into a tooltip that does not open on touch. The length is the cost of
showing a complete record, and it is the build's main exposure.

The concept carries a second, softer risk: if the punched band reads as
decorative pattern rather than as encoding in the first two seconds, the
strongest idea on the page becomes an unexplained texture, and I could not add
a sentence explaining it without inventing copy.

My read: **Design 7, Creativity 7–7.5, Usability 6–6.5, Content 7.** That
averages near the bar and could fall either side of it. Honorable Mention is
reachable; Site of the Day is not, on this build.

What would move it, in order of effect:

1. **Decide the Work section's disclosure, with the owner.** The only lever left on the 15,803px mobile page that does not cost a fact. Options worth putting to them: show the six personal projects as a compact index with the aperture on the first two only; or shorten the four longest blurbs (Shelfsense, Pagerwise, LedgerLine and Telehealth run 60+ words each). Layout alone is exhausted — I already took the 781px it had.
2. **Run the models end to end** and fix whatever the real 92 MB path shows. Right now the site's best asset is untested in this build.
3. **A screen reader pass**, which is the only way the Usability score stops being a structural estimate.
4. **Give synthesis a percentage**, the one Visibility-of-System-Status gap I know about. The engine already reports phase; it does not report synthesis progress, so this is an engine change, not a UI one.
5. **Author one honest line** — with the owner — that tells a first-timer the band is their name in Hollerith code. One sentence, owner-approved, would retire the concept's biggest risk.
