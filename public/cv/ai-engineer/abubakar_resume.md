# Abubakar Khawaja
## AI Engineer | LLM Applications | RAG | Agents | Python | TypeScript

abubakar-dev@hotmail.com  ·  +92-334-9858841
linkedin.com/in/abubakar-khawaja-008483183  ·  github.com/Abuubkar  ·  abuubkar.github.io

---

## Professional Summary
AI Engineer with 5+ years of software engineering experience, now building LLM applications on top of production Python and TypeScript systems. I have shipped streaming chat interfaces with the Vercel AI SDK, agentic tool calling where the model picks between a pgvector knowledge base and live web search, and RAG retrieval over embeddings I generate and index myself. I built an MCP server on Anthropic's Model Context Protocol SDK that exposes 12 zod-validated tools, enough for an agent to run a full workflow unattended. I am comfortable owning an AI feature from retrieval quality and context-window management through to the interface it renders in.

---

## Core Skills
**Languages:** JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3/SCSS
**AI/ML:** LLM Application Architecture, AI Agents, Tool/Function Calling, Structured Outputs (Zod, Pydantic), Model Context Protocol (MCP), RAG, Embeddings & Vector Databases (pgvector), Prompt & Context Engineering, OpenAI / OpenRouter / Ollama (local models), Vercel AI SDK
**AI Development:** ChatGPT, GitHub Copilot, Cursor, Claude Code, Codex, Prompt Engineering, AI-Assisted Development
**Backend:** Python (Django, Django REST Framework, FastAPI, Flask), Node.js (NestJS, Express), REST API design, GraphQL, webhooks, JWT & OAuth2 authentication, Celery & RabbitMQ (async jobs), WebSockets, Scrapy
**Frontend:** React.js, Next.js (App Router, Pages Router), Redux Toolkit, TanStack Query, React Hook Form, Tailwind CSS, Material UI, SCSS
**Databases:** PostgreSQL, pgvector, MySQL, MongoDB, Redis, Supabase, Drizzle ORM & Django ORM, Database Indexing, Query Optimization, Caching
**Cloud & DevOps:** Vercel, Supabase, AWS (EC2, S3, RDS, ECS/EKS, Lambda), Docker, GitHub Actions, GitLab CI/CD, Sentry, Nginx, Linux, Git
**Testing & Quality:** Jest, Cypress, Vitest, Storybook, ESLint, Prettier, Husky (pre-commit hooks)
**Integrations:** Stripe (payments), SendGrid & Resend (email), Firebase Auth, Google Maps, PostHog & Google Analytics, Google Looker (BI), JWT/OAuth2
**Foundations:** Data Structures & Algorithms, System Design, Performance Optimization, Agile/Scrum, Code Review, Mentoring

---

## Experience

### Senior Full-Stack Engineer | Arbisoft
*2021 – 2026*

- Architected asynchronous processing pipelines using Celery and Redis for bulk document generation, scheduled jobs, and reporting systems managing 1,000+ assets.
- Used AI coding tools such as Cursor, Claude Code, Codex, GitHub Copilot, and ChatGPT for both autonomous multi-step tasks and hands-on pair-programming, applying them to PR review, architecture discussions, and custom internal tooling, while comparing model outputs using structured prompts.
- Cut API response times by 30-70% across core endpoints by resolving N+1 queries, optimizing ORM access patterns, and implementing strategic PostgreSQL indexing.
- Designed secure REST APIs with Django REST Framework, implementing JWT authentication, authorization, and third-party integrations.
- Redesigned React frontend architecture, reducing unnecessary re-renders by 30% and improving page load times by 20-30% via memoization, code-splitting, and optimized state management.
- Deployed and tuned services on AWS ECS/EKS and Lambda to support scaling, build performance, and deployment reliability.
- Reworked GitLab CI/CD pipelines with parallel jobs and layer caching, reducing deployment times by 40%.
- Elevated automated test coverage from 10% to over 60% (Jest, Cypress, Vitest) and integrated quality gates (ESLint, Husky), reducing production bugs by 25%.
- Built Scrapy spiders to collect job listings from public sites, using tuned download delays and user-agent rotation to stay within source rate limits.
- Owned Sentry monitoring to cut production error volume: error triage with session replay, release and performance tracking, Slack and GitHub integration, and PII-safe payload encryption that keeps sensitive data out of captured events.
- Mentored junior engineers through regular code reviews and drove Agile feature delivery in tight collaboration with UX/UI designers and backend teams.

---

## Selected Projects

**Landit, Career Platform** · *React + Next.js + TypeScript*
- Built a streaming retrieval chat feature backed by pgvector embeddings, rendering model output token-by-token over semantically retrieved content.
- Built pages with React Server Components on the Next.js App Router, keeping data fetching on the server and reserving client components for the interactive parts of the page.
- Executed zero-downtime frontend framework migrations (Material UI v4 to v5, React Router v4 to v5).

**Telehealth Platform** · *Django + PostgreSQL + Kubernetes*
- Architected and maintained a secure, HIPAA-compliant telehealth platform using Django, PostgreSQL on AWS RDS, and Kubernetes for container orchestration.
- Optimized patient-provider matching workflows through SQL query tuning and Redis caching, collaborating with data engineering to streamline ETL pipelines for real-time data processing.

**Retrieval Chat, Agentic AI Assistant** · *Vercel AI SDK + OpenAI + Supabase pgvector · Personal Project*
- Implemented agentic tool calling where the model selects between a custom pgvector knowledge-base retriever and live web search, surfacing the chosen source alongside the answer.
- Built a streaming chat interface with the Vercel AI SDK, rendering model output token-by-token with markdown formatting and sanitised HTML.
- Managed context-window pressure by summarising older conversation turns while preserving recent history.
- Ran object detection client-side with Transformers.js, drawing confidence-filtered bounding boxes in the browser.

**Resume Toolkit, MCP Server & CV Tailoring Engine** · *Node.js + Model Context Protocol SDK · Open Source*
- Built a stdio MCP server on Anthropic's Model Context Protocol SDK, exposing 12 tools with zod-validated inputs that let an AI agent drive resume tailoring end to end.
- Enforced three tailoring modes at the tool boundary, rejecting any generated text that does not trace back to an approved entry.
- Added gap reporting that surfaces job requirements with no supporting evidence, aggregated across applications to show what is repeatedly missing.

---

## Education
**B.S. Software Engineering** Punjab University College of Information & Technology (PUCIT)  ·  GPA: 3.08

## Certifications
- The AI Engineer Path & Prompt Engineering for Web Developers — Scrimba (July 2026)
