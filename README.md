# Abubakar Khawaja — Portfolio

A senior full-stack engineer portfolio built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**. Design language: _Terminal Editorial_ — a light, editorial/technical system (warm off-white canvas, near-black ink, a single cobalt-blue accent, monospace "system chrome") documented in [`docs/DESIGN.md`](docs/DESIGN.md).

**Layout & interactions:** single-column reading column under a fixed top nav, numbered `0x__ // slug` section headers, and keyboard shortcuts (`j`/`k` to move between sections, `g`+letter to jump, `?` for the shortcut overlay).

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build   # production build
pnpm start   # serve the production build
pnpm lint    # eslint
```

## Design System (single source of truth)

**All site content lives in one place:** [`src/config/site.ts`](src/config/site.ts) — profile, photo, nav, tech stack, experience, education, projects, and contact details. Edit values there to update the whole site; no component needs to change. The profile photo is [`public/abubakar.jpg`](public/abubakar.jpg) and the Resume is [`public/abubakar-khawaja-resume.pdf`](public/abubakar-khawaja-resume.pdf).

All design tokens live in [`docs/DESIGN.md`](docs/DESIGN.md) and are mapped 1:1 into Tailwind in [`src/app/globals.css`](src/app/globals.css) via the `@theme` block. **Components must consume tokens, never raw hex values.**

| Concern | Token examples | Usage in JSX |
| --- | --- | --- |
| Surfaces (flat, hairline elevation) | `surface`, `surface-container`, `surface-container-high` | `bg-surface-container` |
| Primary (Cobalt Blue) | `primary`, `on-primary`, `primary-container` | `text-primary`, `bg-primary` |
| Secondary (Coral) | `secondary`, `secondary-container` | featured markers, dividers |
| Text | `on-surface`, `on-surface-variant` | `text-on-surface` |
| Borders | `outline`, `outline-variant` | `border-outline-variant` |
| Typography | `display-lg`, `headline-lg`, `body-md`, `code-sm`, `label-caps` | `className="text-headline-lg"` |

**Accent discipline:** cobalt blue leads actions/links/active states; coral is rare (featured markers, the occasional divider). The UI is flat and border-based — no gradients or glows. See the _Accent Usage Rules_ in `DESIGN.md`.

## Structure

```
src/
  app/
    layout.tsx          # fonts (Hanken Grotesk / Inter / JetBrains Mono) + top hairline
    globals.css         # token pipeline (@theme) + typography + bracket-corners utility
    page.tsx            # section assembly
  components/
    layout/             # TopNav, Footer
    interactions/       # KeyboardNav (j/k, g+letter, ? overlay)
    sections/           # Hero, TechnicalArsenal, ProfessionalTrajectory,
                        # FeaturedProjects, InitiateConnection
    ui/                 # Button, SectionHeading, Reveal (scroll animation)
  lib/
    useActiveSection.ts # scroll-spy hook shared by TopNav + KeyboardNav
  config/
    site.ts             # ⭐ ALL content/data — edit here to update the site
```

## Editing content

Open [`src/config/site.ts`](src/config/site.ts). It's a single JSON-like object:
- `profile` — name, role, headline, intro, photo, email, phone, socials, Resume link
- `nav`, `arsenal`, `trajectory` (experience + education), `projects`, `contact`, `footer`

Icons are referenced by **name** (e.g. `"Atom"`, `"Database"`) from [lucide](https://lucide.dev/icons); the available names are listed in each component's `iconMap`. To swap the photo, replace `public/abubakar.jpg` (or change `profile.avatar`).
