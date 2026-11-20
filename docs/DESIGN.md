---
name: Terminal Editorial
colors:
  background: '#f1f0ed'
  surface: '#f1f0ed'
  surface-dim: '#e7e6e1'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf9f6'
  surface-container: '#f6f5f2'
  surface-container-high: '#eceae5'
  surface-container-highest: '#e3e1db'
  surface-variant: '#e3e1db'
  on-background: '#1a1a17'
  on-surface: '#1a1a17'
  on-surface-variant: '#6c6b66'
  inverse-surface: '#1a1a17'
  inverse-on-surface: '#f1f0ed'
  outline: '#c8c7c1'
  outline-variant: '#dedcd6'
  surface-tint: '#2d4fe6'
  primary: '#2d4fe6'
  on-primary: '#ffffff'
  primary-container: '#dde3ff'
  on-primary-container: '#06119c'
  inverse-primary: '#aebcff'
  secondary: '#ef9d83'
  on-secondary: '#5a1c0a'
  secondary-container: '#ffdccf'
  on-secondary-container: '#3a1102'
  tertiary: '#1a1a17'
  on-tertiary: '#f1f0ed'
  tertiary-container: '#e3e1db'
  on-tertiary-container: '#1a1a17'
  error: '#b3261e'
  on-error: '#ffffff'
  error-container: '#f9dedc'
  on-error-container: '#410e0b'
  success: '#1f7a4d'
  on-success: '#ffffff'
  warning: '#9a6700'
  on-warning: '#ffffff'
  primary-fixed: '#dde3ff'
  primary-fixed-dim: '#aebcff'
  on-primary-fixed: '#00105c'
  on-primary-fixed-variant: '#06119c'
  secondary-fixed: '#ffdccf'
  secondary-fixed-dim: '#ffb59c'
  on-secondary-fixed: '#3a1102'
  on-secondary-fixed-variant: '#7a2c14'
  tertiary-fixed: '#e3e1db'
  tertiary-fixed-dim: '#c8c7c1'
  on-tertiary-fixed: '#1a1a17'
  on-tertiary-fixed-variant: '#3a3a35'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.05'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.15'
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1080px
  reading-max: 768px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 24px
  nav-height: 64px
---

## Brand & Style
The design system is engineered for a senior full-stack developer, emphasizing technical precision, editorial clarity, and confident restraint. The brand personality is authoritative yet approachable — an engineer who is also a careful communicator.

The visual style is **Editorial Terminal**: a bright, paper-like canvas treated with the discipline of a code editor. It is **light-first** — a warm off-white page, near-black type, and a single decisive accent — combined with monospace "system chrome" (`// comments`, `0x01` hex numbering) that frames human-readable content. Depth comes from **flat, hairline borders and generous whitespace**, never shadows or glassmorphism. The result reads like a well-typeset technical document that happens to be a website.

## Colors
The palette is intentionally minimal and high-contrast to keep technical information legible.

- **Canvas (Warm Off-White `#f1f0ed`):** The page base. Cards and raised surfaces climb toward pure white in small steps.
- **Ink (Near-Black `#1a1a17`):** Headings and body text. Muted gray (`#6c6b66`) carries metadata, captions, and the monospace system chrome.
- **Primary (Cobalt Blue `#2d4fe6`):** The single decisive accent — primary buttons, links, the active-nav underline, the top hairline, and the bracket-corner accents. Used with conviction but sparingly.
- **Secondary (Coral `#ef9d83`):** A warm decorative accent for dividers, "featured" markers, and the occasional highlight square. Never competes with the blue.
- **Outline (`#c8c7c1` / `#dedcd6`):** Hairline borders and dividers — the primary tool for separating content on a flat canvas.

Functional colors (Success `#1f7a4d`, Warning `#9a6700`, Error `#b3261e`) are standard, readable accents tuned for a light background.

### Background Treatment
The background is a flat warm off-white — **no gradients, no glows, no aurora.** A 2px cobalt hairline runs across the very top of the viewport. Optional, very-low-opacity monospace glyphs or coral accent squares may be used as sparse decorative texture, but must never reduce text contrast.

## Typography
Three voices create a clear split between "human content" and "system chrome."

**Hanken Grotesk** — bold, geometric headings; the human, confident voice. **Inter** — body copy for readability. **JetBrains Mono** — the system voice: navigation, section numbering (`0x01 // slug`), labels, stat lines, and code tags. Mono is used prominently to set the technical, editor-like tone.

Mobile tightens line heights and reduces Display/Headline-LG sizes to avoid awkward wrapping.

## Layout & Spacing
A **single-column, centered** layout — not a dashboard. Content sits in a **1080px max-width** container beneath a fixed full-width **top navigation** (64px). The hero and grids use the full container width; text-heavy blocks (the trajectory timeline, section subtitles, hero pitch) are capped to a **768px reading measure** so line lengths stay comfortable. This mirrors codedgar.com's editorial flow.

On **desktop**, navigation links sit inline in the top bar (generously spaced, active item underlined in cobalt). On **mobile (<1024px)**, the links collapse into a **hamburger** that opens a **full-screen overlay** — a `// navigation` header with an ✕ close and large, centered lowercase links.

Spacing follows an 8px scale. Sections share **uniform vertical padding** so the gaps between them are identical (a consistent rhythm), each with a `50dvh` minimum height as a floor.

## Elevation & Depth
Depth is achieved through **flat layering and hairline borders**, never shadows.

1.  **Level 0 (Canvas):** `background` (#f1f0ed).
2.  **Level 1 (Cards):** `surface-container` / white with a 1px `outline-variant` border.
3.  **Level 2 (Hover/Raised):** border darkens toward `outline`; surface may lift toward white.
4.  **Level 3 (Overlays):** white panel with a 1px `outline` border and a soft, low-opacity neutral shadow (the one permitted shadow, kept subtle).

Accents are expressed through **borders and the blue/coral fills**, not glows.

## Shapes
"Soft-Technical." A consistent 0.25rem (4px) base radius on structural components (cards, inputs). Buttons and tags may use `rounded-md`/`rounded-lg`. The signature shape detail is the **bracket corner** — blue L-shaped corner marks on the secondary button and select framed elements, echoing a code selection/cursor.

## Components

### Top Navigation
A fixed, full-width bar over the canvas with a bottom `outline-variant` border and a 2px cobalt hairline on top. Left: wordmark. Right: lowercase monospace links; the active section is **underlined in cobalt** (driven by scroll position). On mobile the links become a compact, horizontally-scrollable row.

### Section Header
Each content section opens with a monospace kicker `0x01 // technical-arsenal` (hex index + `//` slug) in muted gray with a cobalt `0x01`. Below it sits the bold grotesk title, then an optional muted one-line description. A centered `0x__ // slug ↓` marker may signal transitions between sections.

### Buttons
- **Primary:** Solid cobalt fill, white label. No glow.
- **Secondary:** Transparent fill with a 1px outline and **blue bracket corners**; label in ink.
- **States:** Hover deepens the fill/border; focus shows a 2px cobalt ring.

### Cards (Tech tiles, Projects, Timeline)
White / `surface-container` fills with 1px `outline-variant` borders that darken to `outline` on hover. Monospace (`code-sm`) for tech tags, tinted with cobalt; a single coral marker may flag a "featured" item.

### Input Fields
`surface-container-low`/white backgrounds with a 1px `outline` border. On focus, the border switches to cobalt with a subtle inner ring. `label-caps` for field headers.

### Keyboard Navigation
Power-user shortcuts are part of the brand: `j`/`k` move between sections, `g`+letter jumps to a section, `?` opens a shortcuts overlay. A subtle `press ? for shortcuts` hint reinforces the editor metaphor. Shortcuts never fire while typing in a field.
