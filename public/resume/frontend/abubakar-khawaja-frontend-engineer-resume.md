# Abubakar Khawaja
## Senior Frontend Engineer

abubakarrkhawaj@gmail.com  ·  [LinkedIn](https://www.linkedin.com/in/abubakar-khawaja-008483183/)  ·  [GitHub](https://github.com/Abuubkar)  ·  [Portfolio](https://abuubkar.github.io/)

---

## Professional Summary
Senior frontend engineer with 5+ years of experience in React, Next.js, and TypeScript. Most of my recent work is building the frontend for AI products. At Landit I built a streaming chat that answers from retrieved content. On a legal intake assistant I built the chat flow where the model books consultations and files case details while the conversation is still going. I've also led framework migrations and built shared component libraries, and I work closely with designers and backend teams.

---

## Core Skills
**Languages:** JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
**Frontend:** React.js, Next.js (App Router, Pages Router, Server Components), React Hook Form, Framer Motion, Tailwind CSS, Material UI, SCSS
**State & Data:** Redux Toolkit, Zustand, Context API, TanStack Query, WebSockets, RESTful APIs
**AI/ML:** Streaming Chat UIs (Vercel AI SDK, SSE), Agent & Tool-Call UIs, Human-in-the-Loop Review Flows, RAG & Embeddings (pgvector), Prompt & Context Engineering, Structured Outputs (Zod), LLM Evals, Model Context Protocol (MCP), OpenAI / Anthropic APIs, In-Browser ML (Transformers.js, Whisper)
**AI Development:** ChatGPT, GitHub Copilot, Cursor, Claude Code, Codex, AI-Assisted Development
**Frontend Engineering:** Performance Profiling, Core Web Vitals, Code Splitting, Lazy Loading, Accessibility (WCAG), Responsive Design, Component Architecture, Design Systems, Figma Handoff
**Testing & Quality:** Jest, React Testing Library, Cypress, Vitest, Storybook, ESLint, Prettier, Husky (pre-commit hooks)
**Backend:** Python (Django, Django REST Framework, FastAPI), Node.js (NestJS, Express), REST API design, GraphQL, JWT & OAuth2 authentication, Celery (async jobs)
**Cloud & DevOps:** Vercel, Supabase, AWS (EC2, S3, RDS, ECS/EKS, Lambda), Docker, GitHub Actions, GitLab CI/CD, Sentry, Nginx, Linux, Git

---

## Experience

### Senior Software Engineer | Codeupnow
*Sept 2025 - Present*

- Built LLM features into client products, including a chat intake assistant for law firms running on fine-tuned language models, and patient-insight features for a telehealth platform.
- Implemented LLM tool calling in the legal intake assistant so the model could act mid-conversation, booking consultations and pushing case details into the firm's case management system, with every extracted field validated before it was saved.
- Built reusable component libraries with Storybook, keeping the UI consistent across several projects.
- Added WebSockets for real-time updates in live data processing.
- Optimized frontend performance with lazy loading, code splitting, and image optimization.
- Mentored junior engineers through code review and drove Agile feature delivery alongside UX/UI designers and backend teams.

### Senior Software Engineer | Arbisoft
*July 2021 - Apr 2026*

- Led cross-functional framework migrations (Material UI v4 to v5, React Router v4 to v5) and architected reusable Storybook component libraries to ensure design consistency.
- Redesigned React frontend architecture, reducing unnecessary re-renders by 30% and improving page load times by 20-30% via memoization, code-splitting, and optimized state management.
- Implemented SSR, SSG, and ISR using Next.js while improving Core Web Vitals, accessibility, SEO, and overall application responsiveness.
- Raised automated test coverage from 10% to over 60% with Jest, Cypress, and Vitest, added ESLint and Husky as quality gates, and cut production bugs by 25%.
- Used AI coding tools such as Cursor, Claude Code, Codex, GitHub Copilot, and ChatGPT for both autonomous multi-step tasks and hands-on pair-programming, applying them to PR review, architecture discussions, and custom internal tooling, while comparing model outputs using structured prompts.
- Owned Sentry monitoring to cut production error volume, with error triage through session replay, release and performance tracking, Slack and GitHub integration, and PII-safe payload encryption that keeps sensitive data out of captured events.

---

## Selected Projects

**Landit, Career Platform** · *React + Next.js + TypeScript*
- Built a streaming retrieval chat feature backed by pgvector embeddings, rendering model output token-by-token over semantically retrieved content.
- Built pages with React Server Components on the Next.js App Router, keeping data fetching on the server and reserving client components for the interactive parts of the page.
- Built a custom visualization layer for Looker in React after Looker's support team said it could not be done, hosting the built bundles and registering them through Looker config so they appeared in the standard visualization dropdown alongside the built-in charts.
- Rebuilt onboarding around a playbook that showed users one next step at a time, after session recordings showed new arrivals stalling on a home screen with five setup tasks competing for attention. The client had specified something more elaborate; the simpler flow is what shipped, and more people finished their profiles.

**Telehealth Platform** · *Next.js + Django + PostgreSQL*
- Built NLP features that surface patient insights for clinicians, and integrated the platform's predictive AI models into the Django APIs and Next.js clinician views.

**FixAlert, Maintenance Platform** · *React + TypeScript*
- Untangled a filter set where changing any one filter wiped the rest, so a change now only touches the filters that genuinely depend on it, and selections stay put.
- Built reporting metric views and optimized frontend data fetching with React Query.
- Revamped the UI of a computerized maintenance-management system in an Agile environment.

**On-call Agent Workspace, Agentic AI Interface** · *Next.js + Vercel AI SDK + TypeScript*
- Built human-in-the-loop approval for agent actions. Ticket creation and channel posts pause on an Approve/Deny card, denials go back to the model with the reviewer's reason, and a policy layer blocks restricted channels without asking anyone.
- Wrote an eval suite that runs golden cases through the full agent loop and grades tool selection, approval gating, retries after denial, and citation grounding, failing CI below a pass threshold.
- Built a tool-call timeline that renders each agent step with its live state, streams progress from long-running tools, and marks calls cut off by Stop.
- Rendered answers with numbered inline citations linked to a sources panel, flagging any citation to a document the agent never retrieved.

---

## Education
**B.S. Software Engineering** Punjab University College of Information & Technology (PUCIT)  ·  GPA: 3.08

## Certifications
- The AI Engineer Path & Prompt Engineering for Web Developers - Scrimba (July 2026)
