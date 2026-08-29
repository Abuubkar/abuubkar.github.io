/**
 * ============================================================
 *  SITE CONFIG — single source of truth for all content.
 *  Edit values here to update the whole site. No need to touch
 *  any component. Icons are referenced by name (strings) from
 *  the lucide-react set; see the iconMap in each component for
 *  the available names.
 * ============================================================
 */

import avatar from "@/assets/abubakar-theme.webp";
import askimamShot from "@/assets/projects/askimam.webp";
import convoShot from "@/assets/projects/convo.webp";
import fixalertShot from "@/assets/projects/fixalert.webp";
import landitShot from "@/assets/projects/landit.webp";

export type NavItem = { id: string; label: string };
export type Tech = { name: string; icon: string };
export type Experience = {
  title: string;
  company: string;
  location?: string;
  period: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  tags: string[];
};
export type Education = {
  degree: string;
  school: string;
  period: string;
  detail: string;
  tags: string[];
};
export type Project = {
  title: string;
  meta: string;
  blurb: string;
  tags: string[];
  featured?: boolean;
  /** Deployed and reachable — shows a "Live" badge + a "Visit" link. */
  live?: boolean;
  href: string;
  /** Public source repo — adds a "Source" link. */
  repo?: string;
  /** Screenshot URL (bundled from src/assets/projects); falls back to an initial. */
  image?: string;
};
export type ContactDetail = { label: string; value: string; icon: string; href: string };
export type Certification = { name: string; issuer: string; date: string };

/** Canonical production origin — used for metadataBase, sitemap, robots, and JSON-LD. */
export const siteUrl = "https://abuubkar.github.io";

export const siteConfig = {
  /* ---------------- Profile / hero ---------------- */
  profile: {
    name: "Abubakar Khawaja",
    firstName: "Abubakar",
    lastName: "Khawaja",
    brand: "Abubakar.dev",
    role: "Senior Full-Stack Engineer",
    location: "Lahore, Pakistan",
    // Structured variant of `location`, for JSON-LD.
    addressLocality: "Lahore",
    addressCountry: "PK",
    availability: "Available for work",
    // Bundled from src/assets. The resume repo's sync workflow owns
    // public/cv/ (and wipes it on every resume push); the rest of public/
    // belongs to this repo.
    avatar: avatar.src,
    greeting: "Hi, I'm",
    experience: "5+ years",
    // Mono stat line shown under the greeting in the hero.
    stats: "5+ years · 5 products shipped",
    // Hero pitch — problem first, then the resolution (rendered in the accent gradient).
    pitch:
      "Most codebases don't break overnight — they slow down, sprout edge cases, and turn shipping into guesswork.",
    pitchHighlight:
      "I trace the real bottlenecks, harden the foundations, and make releases boring again.",
    // Meta description — search engines truncate around 160 characters.
    metaDescription:
      "Senior Full-Stack Engineer with 5+ years shipping production software — React and Next.js frontends, Django/PostgreSQL backends, fast APIs, reliable CI/CD.",
    // OG/Twitter description — social previews truncate around 125 characters.
    socialDescription:
      "Senior Full-Stack Engineer — 5+ years shipping React/Next.js and Django/PostgreSQL products end to end.",
    // Long-form summary shown on the page itself.
    intro:
      "Full-Stack Engineer with 5+ years building and shipping production software across React and Next.js frontends and Django/PostgreSQL backends. I take features from idea to deployment and focus on fast queries, clean APIs, and reliable CI/CD. I cut API response times 30–70% through query tuning and indexing, scaled Celery pipelines for heavy workloads, raised automated test coverage 10%→60%+, and reduced deployment time by ~40% through CI optimization.",
    email: "abuubkar.dev@gmail.com",
    phone: "+92-334-9858841",
    resumeLabel: "CV",
    // public/cv/ is written by the resume repo's sync workflow on every
    // resume push — always the freshest build, never edited by hand here.
    resumeUrl: "/cv/resume.pdf",
    socials: {
      github: "https://github.com/Abuubkar",
      linkedin: "https://linkedin.com/in/abubakar-khawaja-008483183",
      website: siteUrl,
    },
  },

  /* ---------------- Navigation ---------------- */
  nav: [
    { id: "home", label: "Home" },
    { id: "arsenal", label: "Arsenal" },
    { id: "trajectory", label: "Trajectory" },
    { id: "featured", label: "Featured" },
    { id: "personal", label: "Personal" },
    { id: "contact", label: "Contact" },
  ] as NavItem[],

  /* ---------------- Technical Arsenal (tiles) ---------------- */
  arsenal: {
    num: "0x01",
    slug: "technical-arsenal",
    label: "Core technologies I reach for across the stack",
    title: "Technical Arsenal",
    items: [
      { name: "React", icon: "Atom" },
      { name: "Next.js", icon: "Triangle" },
      { name: "TypeScript", icon: "FileCode2" },
      { name: "JavaScript", icon: "Braces" },
      { name: "Tailwind CSS", icon: "Hash" },
      { name: "Python", icon: "Code2" },
      { name: "Django / DRF", icon: "Server" },
      { name: "PostgreSQL", icon: "Database" },
      { name: "Celery", icon: "Workflow" },
      { name: "React Query", icon: "Loader" },
      { name: "React Hook Form", icon: "List" },
      { name: "Redux Toolkit", icon: "Layers" },
      { name: "Docker", icon: "Container" },
      { name: "GitLab CI/CD", icon: "GitBranch" },
      { name: "Stripe", icon: "CreditCard" },
      { name: "AWS / GCP / Azure", icon: "Cloud" },
      { name: "Storybook", icon: "BookOpen" },
      { name: "LLM Engineering", icon: "Brain" },
      { name: "RAG", icon: "Sparkles" },
    ] as Tech[],
  },

  /* ---------------- Professional Trajectory ---------------- */
  trajectory: {
    num: "0x02",
    slug: "professional-trajectory",
    label: "Five years of end-to-end ownership and measurable impact",
    title: "Professional Trajectory",
    experience: [
      {
        title: "Senior Full-Stack Engineer",
        company: "Arbisoft",
        location: "Lahore",
        period: "2021 – 2026",
        current: true,
        summary:
          "Full-stack delivery across multiple production products — owning features from architecture through implementation, testing, and deployment while improving performance and developer workflows.",
        highlights: [
          "Cut API response times 30–70% by removing N+1 queries, reworking ORM patterns, and adding targeted DB indexes.",
          "Built and scaled Celery pipelines for heavy background workloads including bulk PDF generation and scheduled reporting.",
          "Built reporting and analytics systems managing 1000+ assets and surfaced operational metrics for internal teams and customers.",
          "Reduced deployment time ~40% by reworking GitLab CI/CD with parallel jobs, caching, and automation.",
          "Raised automated test coverage from ~10% to 60%+ with Jest, Cypress, and Vitest; enforced ESLint/Prettier/Husky quality gates.",
          "Refactored frontend architecture to reduce re-renders ~30% and improve load times 20–30% via memoization, code-splitting, and cleaner state management.",
          "Designed and maintained REST APIs in Django REST Framework with sensible serialization, pagination, and permission layers.",
          "Owned integrations end-to-end: Stripe, SendGrid, Google Analytics, Looker BI, and real-time WebSockets.",
          "Mentored engineers through code reviews and pairing; collaborated with product and design in Agile teams to ship reliably.",
        ],
        tags: ["React", "Next.js", "Django", "DRF", "PostgreSQL", "Celery", "GitLab CI/CD", "React Query"],
      },
    ] as Experience[],
    education: [
      {
        degree: "B.S. Software Engineering",
        school: "PUCIT — University of the Punjab",
        detail:
          "CGPA 3.08",
        tags: ["Algorithms", "System Design", "Databases"],
      },
    ] as Education[],
  },

  /* ---------------- Featured Projects ---------------- */
  projects: {
    num: "0x03",
    slug: "featured-projects",
    label: "Selected work across maintenance, productivity, and community platforms",
    title: "Featured Projects",
    items: [
      {
        title: "FixAlert",
        meta: "Full-Stack · React + Django",
        blurb:
          "A maintenance-management platform. Optimized APIs by eliminating N+1 queries, streamlined async workflows with Celery and email, added bulk PDF generation, integrated Stripe payments, and revamped the UI.",
        tags: ["React", "Django", "Material UI", "Celery", "Stripe", "PostgreSQL", "React Query", "Redux Toolkit"],
        href: "https://fixalert.io",
        image: fixalertShot.src,
      },
      {
        title: "Landit",
        meta: "Frontend · React + Next.js",
        blurb:
          "A career-pathing platform. Built responsive UIs, led library migrations (MUI v4→v5, React Router v4→v5), managed Storybook + testing, and built Looker BI visualizations with SendGrid email templates.",
        tags: ["React", "Next.js", "Material UI", "Jest", "Cypress", "Storybook", "Looker", "SendGrid"],
        href: "https://landit.com",
        image: landitShot.src,
      },
      {
        title: "AskImam",
        meta: "Full-Stack · React + Django",
        blurb:
          "Built features across the React frontend and Django backend, enhanced the admin dashboard, integrated Google Analytics, hardened auth security, and led the Django 2.x → 5.1 migration.",
        tags: ["React", "Django", "Material UI", "Redux", "Vite", "SQL"],
        href: "https://www.askimam.org/",
        image: askimamShot.src
      },
      {
        title: "Rumi",
        meta: "Full-Stack · React + Django",
        blurb:
          "Led frontend architectural refactoring and state optimization to reduce re-renders, authored Vitest tests, enforced ESLint/Prettier/pre-commit standards, and contributed to the GitLab CI pipeline.",
        tags: ["React", "Vite", "Vitest", "Redux Toolkit", "Django"],
        href: "#",
      },
      {
        title: "Taiga (Arbisoft)",
        meta: "Open-source · AngularJS + Django",
        blurb:
          "Built the Requestor and Feedback modules across frontend and backend — new Django models and REST endpoints with role-based access, plus reusable directives in a modular architecture.",
        tags: ["AngularJS", "Django", "SCSS", "CoffeeScript"],
        href: "#",
      },
    ] as Project[],
  },

  /* ---------------- Personal Projects ---------------- */
  personal: {
    num: "0x04",
    slug: "personal-projects",
    label: "Self-driven work — designed, built, and shipped end-to-end",
    title: "Personal Projects",
    items: [
      {
        title: "Convo",
        meta: "Personal · React + Django",
        blurb:
          "A real-time chat platform built end-to-end. A React + Vite SPA on the front, Django REST Framework on the back, with live messaging over Django Channels + Redis (WebSockets) — plus JWT auth, user management, avatar uploads, and a full CI/CD pipeline.",
        tags: [
          "React",
          "Vite",
          "TypeScript",
          "Django",
          "DRF",
          "Channels",
          "Redis",
          "WebSockets",
          "Tailwind CSS",
        ],
        live: true,
        href: "https://convo-arc.vercel.app/chat",
        repo: "https://github.com/hedonarc/convo",
        image: convoShot.src,
      },
    ] as Project[],
  },

  /* ---------------- Certifications ---------------- */
  certifications: {
    num: "0x05",
    slug: "certifications",
    label: "Continuous learning across AI and modern engineering practices",
    title: "Certifications",
    items: [
      {
        name: "The AI Engineer Path",
        issuer: "Scrimba",
        date: "July 2026",
      },
      {
        name: "Prompt Engineering for Web Developers",
        issuer: "Scrimba",
        date: "July 2026",
      },
    ] as Certification[],
  },

  /* ---------------- Contact ---------------- */
  contact: {
    num: "0x06",
    slug: "initiate-connection",
    label: "Open to senior full-stack roles, consulting, and partnerships",
    title: "Initiate Connection",
    blurb:
      "Have a product to build or a system to scale? Send a note — I read every message.",
    details: [
      { label: "Email", value: "abuubkar.dev@gmail.com", icon: "Mail", href: "mailto:abuubkar.dev@gmail.com" },
      { label: "Phone", value: "+92-334-9858841", icon: "Phone", href: "tel:+923349858841" },
      { label: "GitHub", value: "github.com/Abuubkar", icon: "Code2", href: "https://github.com/Abuubkar" },
      { label: "LinkedIn", value: "in/abubakar-khawaja", icon: "Briefcase", href: "https://linkedin.com/in/abubakar-khawaja-008483183" },
    ] as ContactDetail[],
  },

  /* ---------------- Footer ---------------- */
  footer: {
    copyright: "© 2026 Abubakar Khawaja. Built with precision.",
    socials: [
      { label: "GitHub", icon: "Code2", href: "https://github.com/Abuubkar" },
      { label: "LinkedIn", icon: "Briefcase", href: "https://linkedin.com/in/abubakar-khawaja-008483183" },
      { label: "Email", icon: "AtSign", href: "mailto:abuubkar.dev@gmail.com" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
