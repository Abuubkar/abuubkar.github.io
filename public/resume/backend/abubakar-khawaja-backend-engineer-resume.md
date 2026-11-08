# Abubakar Khawaja
## Senior Backend Engineer

abubakarrkhawaj@gmail.com  ·  [LinkedIn](https://www.linkedin.com/in/abubakar-khawaja-008483183/)  ·  [GitHub](https://github.com/Abuubkar)  ·  [Portfolio](https://abuubkar.github.io/)

---

## Professional Summary
Senior backend engineer with 5+ years building production services in Python and Django, with Django REST Framework, PostgreSQL, Redis, and Celery. I've run those services on AWS with Kubernetes, EKS, and ECS, and I move heavy work onto background jobs so the API stays fast under load. I also build LLM features into backends. On a legal intake assistant I built the chat intake flow, fine-tuned its language models, and deployed its microservices to AWS ECS. At Landit I built a streaming retrieval chat over pgvector embeddings. I'm comfortable owning data modelling, API security, and background job throughput end to end.

---

## Core Skills
**Languages:** Python, SQL, JavaScript, TypeScript
**Backend:** Python (Django, Django REST Framework, FastAPI, Flask), Node.js (NestJS, Express), REST API design, GraphQL, webhooks, JWT & OAuth2 authentication, Celery & RabbitMQ (async jobs), WebSockets, Scrapy
**AI/ML:** LLM Application Architecture, AI Agents & Tool Calling (LangChain, LangGraph), RAG & Embeddings, Prompt & Context Engineering, Fine-Tuning, LLM Evals & Observability (Langfuse, LangSmith), Structured Outputs (Pydantic, Zod), Model Context Protocol (MCP), OpenAI / Anthropic / OpenRouter / Ollama
**Databases:** PostgreSQL, pgvector, MySQL, MongoDB, Redis, Supabase, Drizzle ORM & Django ORM, Database Indexing, Query Optimization, Caching
**Cloud & DevOps:** AWS (ECS, EKS, Lambda, S3, RDS, Cognito, API Gateway), Docker, Kubernetes, GitHub Actions, GitLab CI/CD, Datadog, Sentry, Nginx, Linux, Git
**Testing:** Pytest, Django Test Framework, Vitest, Testcontainers, Unit & Integration Testing, API Testing
**Integrations:** Stripe (payments), SendGrid & Resend (email), Firebase Auth, Google Maps, PostHog & Google Analytics, Google Looker (BI), Grafana
**AI Development:** ChatGPT, GitHub Copilot, Cursor, Claude Code, Codex, AI-Assisted Development
**Software Engineering:** Clean Code (SOLID, KISS, DRY, YAGNI), Design Patterns, Microservices, System Design, Performance Optimization, Code Review, Agile/Scrum, Jira & Confluence

---

## Experience

### Senior Software Engineer | Codeupnow
*Sept 2025 - Present*

- Mentored junior engineers through code review and drove Agile feature delivery alongside UX/UI designers and backend teams.
- Built LLM features into client products, including a chat intake assistant for law firms running on fine-tuned language models, and patient-insight features for a telehealth platform.
- Implemented LLM tool calling in the legal intake assistant so the model could act mid-conversation, booking consultations and pushing case details into the firm's case management system, with every extracted field validated before it was saved.
- Worked on a microservices system in Python and Django with a React frontend, and cut downtime by 30%.
- Reworked Python REST API code and cut response times by 40%, which also brought cloud costs down.
- Built real-time data pipelines and background job processing for work that runs asynchronously.
- Deployed and tuned services on AWS ECS/EKS and Lambda to support scaling, build performance, and deployment reliability.
- Added WebSockets for real-time updates in live data processing.

### Senior Software Engineer | Arbisoft
*July 2021 - Apr 2026*

- Architected asynchronous processing pipelines on Celery and Redis for bulk document generation, scheduled jobs, and reporting systems that handle 1,000+ assets.
- Designed secure REST APIs with Django REST Framework, implementing JWT authentication, authorization, and third-party integrations.
- Cut API response times by 30 to 70% on core endpoints by fixing N+1 queries, reworking ORM access patterns, and adding PostgreSQL indexes.
- Diagnosed a Celery task queue backlog and Redis memory bloat, then moved message routing onto RabbitMQ to stabilize background job throughput.
- Designed and maintained Django applications serving production workloads across multiple business domains.
- Used AI coding tools such as Cursor, Claude Code, Codex, GitHub Copilot, and ChatGPT for both autonomous multi-step tasks and hands-on pair-programming, applying them to PR review, architecture discussions, and custom internal tooling, while comparing model outputs using structured prompts.
- Raised automated test coverage from 10% to over 60% with Jest, Cypress, and Vitest, added ESLint and Husky as quality gates, and cut production bugs by 25%.
- Reworked GitLab CI/CD pipelines with parallel jobs and layer caching, reducing deployment times by 40%.
- Owned Sentry monitoring to cut production error volume, with error triage through session replay, release and performance tracking, Slack and GitHub integration, and PII-safe payload encryption that keeps sensitive data out of captured events.

---

## Selected Projects

**Meet Gabbi, AI Legal Intake Platform** · *React + Django*
- Built the LLM chat intake flow for a legal intake assistant, with prompts and conversation state that collect a client's case details and extract them as structured data for the firm.
- Prepared training data for and ran fine-tuning of the language models behind the intake assistant.
- Containerised the backend microservices with Docker and deployed them to AWS ECS through an automated CI/CD pipeline.

**Telehealth Platform** · *Django + PostgreSQL + Kubernetes*
- Architected and maintained a HIPAA-compliant telehealth platform on Django, with PostgreSQL on AWS RDS and Kubernetes for container orchestration.
- Built NLP features that surface patient insights for clinicians, and integrated the platform's predictive AI models into the Django APIs and Next.js clinician views.
- Optimized patient-provider matching workflows with SQL query tuning and Redis caching, and worked with data engineering on ETL pipelines for real-time data processing.

**Landit, Career Platform** · *Django + React*
- Built a streaming retrieval chat feature backed by pgvector embeddings, rendering model output token-by-token over semantically retrieved content.
- Owned the design and delivery of a complex analytics dashboard in Google Looker, giving stakeholders real-time visibility into platform metrics.

**FixAlert, Maintenance Platform** · *Django + PostgreSQL*
- Implemented Celery-based background processing, Stripe payment integration, and reporting services.
- Made Stripe payment requests retry-safe using Stripe's idempotency key header, so a retried call could not create a duplicate charge.
- Optimized backend performance by eliminating N+1 queries and improving database access patterns.

---

## Education
**B.S. Software Engineering** Punjab University College of Information & Technology (PUCIT)  ·  GPA: 3.08

## Certifications
- The AI Engineer Path & Prompt Engineering for Web Developers - Scrimba (July 2026)
