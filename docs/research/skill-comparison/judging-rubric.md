# How the three builds get judged

Lead's rubric, weighted to match what Awwwards actually scores, not to what
each skill scores itself on. Each skill grades against its own doctrine, so
their self-reported scores are not comparable to each other. This is.

## Weighted, 100 points

**Design — 40**
- Does it look authored for this person, or category-interchangeable? (15)
- Typographic craft: real scale steps, measure, hierarchy under a squint test (10)
- Colour: a deliberate strategy, not an accent sprinkled on neutral (8)
- Detail finish: focus rings, selection, scrollbars, caret, tabular figures (7)

**Usability — 30**
- Mobile at 390 is designed, not ported (12)
- Keyboard path, focus visibility, target sizes, contrast measured not claimed (10)
- Can a recruiter find the work, the skills and the contact in under 15s? (8)

**Creativity — 20**
- Is Labs staged as the differentiator it is? (10)
- One authored moment that is memorable and not a scroll-reveal library (6)
- Does it avoid all four of impeccable's saturated AI clusters? (4)

**Content — 10**
- Every fact intact, nothing invented (5) — any invention is disqualifying, not deducted
- Copy earns its place; no filler, no banned labels (5)

## Hard gates — fail any and the build is not shippable

1. `pnpm build` and `pnpm lint` both pass.
2. No invented fact, metric, testimonial, logo, award or statistic. Immediate fail.
3. No pre-made template. Awwwards rejects on this.
4. No horizontal scroll at 320, 390, 768, 1024, 1440.
5. `public/cv/**` untouched.

## Measured facts to check their claims against

OKLCH of the current palette, computed here rather than guessed:

| token | hex | L | C | H |
|---|---|---|---|---|
| primary cobalt | `#2d4fe6` | 0.508 | 0.230 | **267.1°** |
| secondary coral | `#ef9d83` | 0.772 | 0.105 | 38.3° |
| paper | `#f1f0ed` | 0.955 | 0.004 | 91.4° |
| ink | `#1a1a17` | 0.217 | 0.006 | 106.9° |
| primary-container | `#dde3ff` | 0.920 | 0.039 | **276.0°** |
| on-primary-container | `#06119c` | 0.327 | 0.208 | 265.3° |

So: the cobalt clears taste-skill's banned 270–330° violet band by 2.9° — it is
blue, not violet. But `primary-container` at 276.0° sits **inside** it and would
be rotated to 255°. Any agent that reports "the palette is fine" without catching
the container, or that reports the cobalt itself as violet, has not measured.

## Tie-break

Awwwards trims the 3 outlier scores from 18 jurors. So prefer the build with the
fewest things anyone could object to over the build with the highest peak. If two
are close, the one whose 390px view is stronger wins — that is where the 30%
lives and where portfolios lose it.
