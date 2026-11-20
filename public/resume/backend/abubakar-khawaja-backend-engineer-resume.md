# Abubakar Khawaja
## Senior Backend Engineer

abubakarrkhawaj@gmail.com  ·  +923349858841
LinkedIn  ·  GitHub  ·  Portfolio

---

## Professional Summary
Senior backend engineer with 5+ years building Python and Django services on PostgreSQL, Redis, Celery and AWS, plus LLM features such as tool calling and retrieval over pgvector. Looking for a senior backend role where I own scalable APIs, data models and background jobs end to end.

---

## Core Skills
**Languages:** Python, SQL, JavaScript, TypeScript
**Backend:** Django, Django REST Framework, FastAPI, Node.js (NestJS, Express), REST API design, GraphQL, JWT & OAuth2 authentication, Celery (async jobs), Kafka, WebSockets
**AI/ML:** RAG & Embeddings (pgvector), AI Agents & Tool Calling (LangChain, LangGraph), Fine-Tuning, Structured Outputs (Pydantic, Zod), LLM Observability (LangSmith, Langfuse), Model Context Protocol (MCP), OpenAI & Anthropic APIs
**Databases:** PostgreSQL, pgvector, MongoDB, Redis, Django ORM, Indexing & Query Optimization
**Cloud & DevOps:** AWS (ECS, EKS, Lambda, S3, RDS), Docker, Kubernetes, Terraform, GitHub Actions, GitLab CI/CD, Linux
**Testing:** Pytest, Django Test Framework, Vitest, Unit & Integration Testing, API Testing
**AI Development:** Claude Code, Cursor, GitHub Copilot

---

## Experience

### Codeupnow - Senior Software Engineer
*Mar 2026 - Present*

- Design the legal intake assistant's conversation flow and prompts, turning an open-ended client chat into structured case records checked in code, so incomplete or broken cases are stopped before they reach the firm.
- Implement LLM tool calling in the legal intake assistant so the model can take actions during the chat, like booking consultations and sending case details to the firm's case management system, with no manual data entry.
- Make the assistant answer from each firm's own FAQs and practice-area documents using pgvector search, instead of general knowledge.
- Rework Python REST API code across 13 endpoints for 40% faster responses and smaller cloud bills.
- Work on a Python and Django microservices system with a React frontend, and reduced its downtime by 30%.

### Arbisoft - Senior Software Engineer
*Jul 2021 - Mar 2026*

- Built background job pipelines on Celery and Redis for bulk document generation, scheduled jobs and reports covering 1,000+ assets.
- Cut API response times by 30 to 70% on core endpoints by fixing N+1 queries, reworking ORM access patterns, and adding PostgreSQL indexes.
- Owned end-to-end third-party integrations across multiple production platforms, including Stripe for payments, SendGrid for transactional emails, and Looker for BI analytics.
- Designed the PostgreSQL schema and Django APIs behind a multi-tenant product, with data scoped per client organisation.
- Reworked GitLab CI/CD pipelines with parallel jobs and layer caching, reducing deployment times by 40%.

---

## Selected Projects

**FixAlert, Maintenance Platform** · *Django + PostgreSQL*
- Implemented Celery-based background processing, Stripe payment integration, and reporting services.
- Added Stripe's idempotency key header to payment requests, so a retried call could not create a duplicate charge.

**Landit, Career Platform** · *Django + React*
- Developed a streaming RAG chat on pgvector embeddings that shows the model's answer word by word as it's written.
- Integrated Looker dashboards and SendGrid email through Django APIs, and set up a headless Chrome PDF export so reports look the same in every browser.

**Ledgerline, AI Accounts-Payable Automation** · *FastAPI + Ollama · Personal Project*
- Created an invoice pipeline on FastAPI, Celery and RabbitMQ that extracts invoices with a local LLM and runs a 3-way match against purchase orders, with an agent proposing a credit memo or hold for a person to approve.
- Made invoice uploads safe to retry with idempotency keys, a transactional outbox and dead-letter queues; in a failure test with 15% of model calls failing and a worker shut down, none of 203 uploads were lost.

---

## Education
**B.S. Software Engineering** Punjab University College of Information & Technology (PUCIT)

## Certifications
- The AI Engineer Path & Prompt Engineering for Web Developers - Scrimba (July 2026)
