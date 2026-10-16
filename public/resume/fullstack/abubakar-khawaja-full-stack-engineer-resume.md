# Abubakar Khawaja
## Senior Full-Stack AI Engineer | React | Next.js | Python | Django | LLM Agents & RAG

abubakar-dev@hotmail.com  ·  +92-334-9858841
linkedin.com/in/abubakar-khawaja-008483183  ·  github.com/Abuubkar  ·  abuubkar.github.io

---

## Professional Summary
Senior full-stack engineer with 5+ years of experience in React, Next.js, Python, and Django, shipping production apps on PostgreSQL and AWS. Most of my recent work puts LLMs into real products. On a legal intake assistant I built the LLM chat intake flow and fine-tuned the models behind it, and at Landit I built a streaming retrieval chat over pgvector embeddings. I've owned features end to end, from the Django API and Celery jobs to the React screens they power, and I work directly with stakeholders to scope them.

---

## Core Skills
**Languages:** JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3/SCSS
**AI/ML:** LLM Application Architecture, AI Agents & Tool Calling (LangChain, LangGraph), RAG & Embeddings, Prompt & Context Engineering, Fine-Tuning, LLM Evals & Observability (Langfuse, LangSmith), NLP, Structured Outputs (Zod, Pydantic), Model Context Protocol (MCP), OpenAI / Anthropic / OpenRouter / Ollama
**Frontend:** React.js, Next.js (App Router, Pages Router), Redux Toolkit, TanStack Query, React Hook Form, Streaming Chat UIs (Vercel AI SDK), Tailwind CSS, Material UI, SCSS
**Backend:** Python (Django, Django REST Framework, FastAPI, Flask), Node.js (NestJS, Express), REST API design, GraphQL, webhooks, JWT & OAuth2 authentication, Celery & RabbitMQ (async jobs), WebSockets, Scrapy
**Databases:** PostgreSQL, pgvector, MySQL, MongoDB, Redis, Supabase, Drizzle ORM & Django ORM, Database Indexing, Query Optimization, Caching
**Cloud & DevOps:** AWS (ECS, EKS, Lambda, S3, RDS, Cognito, API Gateway), Docker, Kubernetes, GitHub Actions, GitLab CI/CD, Nginx, Linux, Git
**Testing:** Jest, Cypress, Vitest, React Testing Library, Pytest, Django Test Framework, Testcontainers, ESLint, Prettier, Husky
**AI Development:** ChatGPT, GitHub Copilot, Cursor, Claude Code, Codex, Prompt Engineering, AI-Assisted Development
**Software Engineering:** Object-Oriented Programming (OOP), Design Patterns, Microservices, System Design, Performance Optimization, Code Review, Agile/Scrum

---

## Experience

### Senior Software Engineer | Codeupnow
*Sept 2025 – Present*

- Mentored junior engineers through code review and drove Agile feature delivery alongside UX/UI designers and backend teams.
- Built LLM features into client products, including a chat intake assistant for law firms running on fine-tuned language models, and NLP patient-insight features for a telehealth platform.
- Implemented LLM tool calling in the legal intake assistant so the model could act mid-conversation, booking consultations and pushing case details into the firm's case management system, with every extracted field validated before it was saved.
- Worked on a microservices system in Python and Django with a React frontend, and cut downtime by 30%.
- Reworked Python REST API code and cut response times by 40%, which also brought cloud costs down.
- Built real-time data pipelines and background job processing for work that runs asynchronously.
- Deployed and tuned services on AWS ECS/EKS and Lambda to support scaling, build performance, and deployment reliability.
- Optimized frontend performance with lazy loading, code splitting, and image optimization.

### Senior Software Engineer | Arbisoft
*July 2021 – Apr 2026*

- Owned end-to-end third-party integrations across multiple production platforms, including Stripe for payments, SendGrid for transactional emails, and Looker for BI analytics.
- Used AI coding tools such as Cursor, Claude Code, Codex, GitHub Copilot, and ChatGPT for both autonomous multi-step tasks and hands-on pair-programming, applying them to PR review, architecture discussions, and custom internal tooling, while comparing model outputs using structured prompts.
- Designed secure REST APIs with Django REST Framework, implementing JWT authentication, authorization, and third-party integrations.
- Architected asynchronous processing pipelines on Celery and Redis for bulk document generation, scheduled jobs, and reporting systems that handle 1,000+ assets.
- Cut API response times by 30 to 70% on core endpoints by fixing N+1 queries, reworking ORM access patterns, and adding PostgreSQL indexes.
- Redesigned React frontend architecture, reducing unnecessary re-renders by 30% and improving page load times by 20-30% via memoization, code-splitting, and optimized state management.
- Raised automated test coverage from 10% to over 60% with Jest, Cypress, and Vitest, added ESLint and Husky as quality gates, and cut production bugs by 25%.
- Reworked GitLab CI/CD pipelines with parallel jobs and layer caching, reducing deployment times by 40%.
- Owned Sentry monitoring to cut production error volume: error triage with session replay, release and performance tracking, Slack and GitHub integration, and PII-safe payload encryption that keeps sensitive data out of captured events.

---

## Selected Projects

**Meet Gabbi, AI Legal Intake Platform** · *React + Django*
- Built the LLM chat intake flow for a legal intake assistant, with prompts and conversation state that collect a client's case details and extract them as structured data for the firm.
- Prepared training data for and ran fine-tuning of the language models behind the intake assistant.
- Containerised the backend microservices with Docker and deployed them to AWS ECS through an automated CI/CD pipeline.

**Landit, Career Platform** · *Django + React*
- Built a streaming retrieval chat feature backed by pgvector embeddings, rendering model output token-by-token over semantically retrieved content.
- Built a custom visualization layer for Looker in React after Looker's support team said it could not be done, hosting the built bundles and registering them through Looker config so they appeared in the standard visualization dropdown alongside the built-in charts.
- Built pages with React Server Components on the Next.js App Router, keeping data fetching on the server and reserving client components for the interactive parts of the page.

**Telehealth Platform** · *Next.js + Django + PostgreSQL*
- Architected and maintained a HIPAA-compliant telehealth platform on Django, with PostgreSQL on AWS RDS and Kubernetes for container orchestration.
- Built NLP features that surface patient insights for clinicians, and integrated the platform's predictive AI models into the Django APIs and Next.js clinician views.
- Optimized patient-provider matching workflows with SQL query tuning and Redis caching, and worked with data engineering on ETL pipelines for real-time data processing.

**FixAlert, Maintenance Platform** · *React + Django + PostgreSQL*
- Implemented Celery-based background processing, Stripe payment integration, and reporting services.
- Made Stripe payment requests retry-safe using Stripe's idempotency key header, so a retried call could not create a duplicate charge.
- Built reporting metric views and optimized frontend data fetching with React Query.

---

## Education
**B.S. Software Engineering** Punjab University College of Information & Technology (PUCIT)  ·  GPA: 3.08

## Certifications
- The AI Engineer Path & Prompt Engineering for Web Developers — Scrimba (July 2026)
