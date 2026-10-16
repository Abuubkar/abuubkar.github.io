# Abubakar Khawaja
## Senior Backend Engineer | Python | Django | Node.js | PostgreSQL | AWS

abubakar-dev@hotmail.com  ·  +92-334-9858841
linkedin.com/in/abubakar-khawaja-008483183  ·  github.com/Abuubkar  ·  abuubkar.github.io

---

## Professional Summary
Backend Engineer with 5+ years building and running production services in Python and Django, with Django REST Framework, PostgreSQL, Redis, and Celery. I design REST APIs, tune database performance, and move heavy work onto asynchronous pipelines that stay stable under load. I have run services on AWS using ECS, EKS, and Lambda, with PostgreSQL on RDS and Kubernetes for orchestration, and I build Node.js APIs with NestJS and TypeScript alongside the Python work. I am comfortable owning data modelling, API security, and background job throughput end to end.

---

## Core Skills
**Languages:** Python, SQL, JavaScript, TypeScript
**Backend:** Python (Django, Django REST Framework, FastAPI, Flask), Node.js (NestJS, Express), REST API design, GraphQL, webhooks, JWT & OAuth2 authentication, Celery & RabbitMQ (async jobs), WebSockets, Scrapy
**Databases:** PostgreSQL, MongoDB, DynamoDB, Redis, Elasticsearch, MySQL, PostGIS, Database Indexing, Query Optimization, Caching
**Cloud & DevOps:** AWS (ECS, EKS, Lambda, S3, RDS), Google Cloud (Firebase), Docker, Kubernetes, GitHub Actions, GitLab CI/CD, Datadog, Sentry, Linux, Git
**Testing:** Pytest, Django Test Framework, Vitest, Testcontainers, Unit & Integration Testing, API Testing
**Software Engineering:** Clean Code (SOLID, KISS, DRY, YAGNI), Design Patterns, Microservices, System Design, Performance Optimization, Code Review, Agile/Scrum, Jira & Confluence
**Backend Integration:** REST APIs, GraphQL, API Design Collaboration
**Integrations:** Stripe (payments), SendGrid & Resend (email), Firebase Auth, Google Maps, PostHog & Google Analytics, Google Looker (BI), Grafana, JWT/OAuth2
**AI/ML:** LLM Application Architecture, AI Agents, Tool/Function Calling, Structured Outputs (Zod, Pydantic), Model Context Protocol (MCP), RAG, Embeddings & Vector Databases (pgvector), Prompt & Context Engineering, OpenAI / OpenRouter / Ollama (local models), Vercel AI SDK
**AI Development:** ChatGPT, GitHub Copilot, Cursor, Claude Code, Codex, Prompt Engineering, AI-Assisted Development

---

## Experience

### Senior Software Engineer | Codeupnow
*Sept 2025 – Present*

- Worked on a microservices system in Python and Django with a React frontend, and cut downtime by 30%.
- Reworked Python REST API code and cut response times by 40%, which also brought cloud costs down.
- Built real-time data pipelines and background job processing for work that runs asynchronously.
- Added WebSockets for real-time updates in live data processing.
- Deployed and tuned services on AWS ECS/EKS and Lambda to support scaling, build performance, and deployment reliability.
- Worked with other teams to pin down requirements and ship features on schedule.

### Senior Python Developer | Arbisoft
*July 2021 – Apr 2026*

- Designed and maintained Django applications serving production workloads across multiple business domains.
- Designed secure REST APIs with Django REST Framework, implementing JWT authentication, authorization, and third-party integrations.
- Diagnosed a Celery task queue backlog and Redis memory bloat, then moved message routing onto RabbitMQ to stabilize background job throughput.
- Improved code quality through automated testing, code reviews, and development best practices, increasing automated test coverage beyond 60%.
- Built and maintained CI/CD pipelines using GitLab CI and GitHub Actions while containerizing applications with Docker for reliable deployments.
- Built GitHub Actions automation to validate documentation integrity and prevent inconsistent generated documentation from reaching production.
- Owned Sentry monitoring to cut production error volume: error triage with session replay, release and performance tracking, Slack and GitHub integration, and PII-safe payload encryption that keeps sensitive data out of captured events.

---

## Selected Projects

**Telehealth Platform** · *Next.js + Django + PostgreSQL + Kubernetes · Codeupnow*
- Architected and maintained a HIPAA-compliant telehealth platform on Django, with PostgreSQL on AWS RDS and Kubernetes for container orchestration.
- Built the frontend on the Next.js App Router with React Server Components, keeping data fetching on the server.
- Optimized patient-provider matching workflows with SQL query tuning and Redis caching, and worked with data engineering on ETL pipelines for real-time data processing.

**FixAlert, Maintenance Platform** · *React + Django + PostgreSQL*
- Implemented Celery-based background processing, Stripe payment integration, and reporting services.
- Optimized backend performance by eliminating N+1 queries and improving database access patterns.
- Made Stripe payment requests retry-safe using Stripe's idempotency key header, so a retried call could not create a duplicate charge.

**Landit, Career Platform** · *Django + React*
- Owned the design and delivery of a complex analytics dashboard in Google Looker, giving stakeholders real-time visibility into platform metrics.
- Built transactional email workflows with SendGrid and optimized backend services.

**Foodio, Food Delivery Platform** · *NestJS + TypeScript + PostgreSQL/PostGIS · Personal Project*
- Architected a Node.js food-delivery API on NestJS and Express with feature-first modules for identity, ordering, billing, payments, and notifications, on PostgreSQL with PostGIS for geo-based restaurant discovery via Drizzle ORM.
- Designed order state as an append-only event log with derived status, and made order placement idempotent via a client-generated Idempotency-Key so a retried request could never create a duplicate order.
- Shared a Zod contract package between the backend and the React Native app for runtime-validated DTOs, and set up GitHub Actions CI running typecheck, lint, Vitest unit tests, and Testcontainers integration tests against real PostGIS, with Docker Compose and a production Dockerfile.

---

## Education
**B.S. Software Engineering** Punjab University College of Information & Technology (PUCIT)  ·  GPA: 3.08

## Certifications
- The AI Engineer Path & Prompt Engineering for Web Developers — Scrimba (July 2026)
