# Abubakar Khawaja
## Senior Frontend Engineer

abubakarrkhawaj@gmail.com  ·  +923349858841
LinkedIn  ·  GitHub  ·  Portfolio

---

## Professional Summary
Senior frontend engineer with 5+ years in React, Next.js and TypeScript, focused on frontend architecture and AI product screens. Looking for a senior role where I own performance, accessibility and shared UI components end to end.

---

## Core Skills
**Languages:** JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
**Frontend:** React, Next.js (App Router, Server Components), Redux Toolkit, Zustand, TanStack Query, GraphQL, React Hook Form, Tailwind CSS, Material UI
**AI/ML:** Streaming Chat UIs (Vercel AI SDK), Agent & Tool-Call UIs, Human-in-the-Loop Review Flows, RAG & Embeddings (pgvector), Structured Outputs (Zod), LangChain, Model Context Protocol (MCP), OpenAI & Anthropic APIs
**Frontend Engineering:** Performance Profiling, Core Web Vitals, Code Splitting, Vite, Accessibility (WCAG), Responsive Design, Design Systems, Web Security (XSS, CSP), A/B Testing & Feature Flags
**Testing & Quality:** Jest, React Testing Library, Cypress, Playwright, Vitest, Storybook, ESLint, Sentry
**Backend:** Node.js (NestJS, Express), Django REST Framework, REST APIs, JWT auth
**AI Development:** Claude Code, Cursor, GitHub Copilot

---

## Experience

### Codeupnow - Senior Software Engineer
*Mar 2026 - Present*

- Design the legal intake assistant's conversation flow and prompts, turning an open-ended client chat into structured case records checked in code, so incomplete or broken cases are stopped before they reach the firm.
- Implement LLM tool calling in the legal intake assistant so the model can take actions during the chat, like booking consultations and sending case details to the firm's case management system, with no manual data entry.
- Make the assistant answer from each firm's own FAQs and practice-area documents using pgvector search, instead of general knowledge.
- Create a shared Storybook library of 30+ components used across 4 projects, replacing about 80 overlapping old and new components.

### Arbisoft - Senior Software Engineer
*Jul 2021 - Mar 2026*

- Led framework upgrades with other teams (Material UI v4 to v5, React Router v4 to v5) and set up shared Storybook component libraries so the UI looks the same everywhere.
- Restructured the React frontend with memoization, code splitting and cleaner state management; re-renders dropped 30% and pages loaded 20-30% faster.
- Shipped nested filtering across analytics, property management and role-based views for FixAlert, a maintenance platform, and fixed the filters so changing one no longer reset the others.
- Added SSR, SSG and ISR in Next.js, which improved Core Web Vitals, accessibility, SEO and page speed.
- Raised automated test coverage from 10% to over 60% with Jest, Cypress, and Vitest, plus ESLint and Husky as quality gates; production bugs fell by 25%.
- Owned Sentry monitoring to lower production errors, using session replay, release and performance tracking, and Slack and GitHub alerts, and encrypted personal data so it never showed up in error reports.

---

## Selected Projects

**Landit, Career Platform** · *React + Next.js + TypeScript*
- Developed a streaming RAG chat on pgvector embeddings that shows the model's answer word by word as it's written.
- Rebuilt onboarding around a playbook that showed users one next step at a time, after session recordings showed new users getting stuck on a busy home screen. More people finished their profiles.

**On-call Agent Workspace, Agentic AI Interface** · *Next.js + Vercel AI SDK + TypeScript*
- Put human-in-the-loop approval on agent actions. Ticket creation and channel posts pause on an Approve/Deny card, denials go back to the model with the reviewer's reason, and rules block restricted channels automatically.
- Wrote an eval suite that runs golden cases through the full agent loop and checks that the agent picks the right tool, waits for approval, retries after a denial and cites its sources, and fails CI if the score drops too low.

---

## Education
**B.S. Software Engineering** Punjab University College of Information & Technology (PUCIT)

## Certifications
- The AI Engineer Path & Prompt Engineering for Web Developers - Scrimba (July 2026)
