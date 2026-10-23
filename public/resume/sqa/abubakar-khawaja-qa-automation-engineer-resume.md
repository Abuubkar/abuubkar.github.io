# Abubakar Khawaja
## SDET | QA Automation Engineer | Cypress | Playwright | Pytest | Locust | CI/CD

abubakarrkhawaj@gmail.com  ·  [LinkedIn](https://www.linkedin.com/in/abubakar-khawaja-008483183/)  ·  [GitHub](https://github.com/Abuubkar)  ·  [Portfolio](https://abuubkar.github.io/)

---

## Professional Summary
Software engineer with 5+ years in test automation and full-stack development across Python, Django, React and TypeScript. I raised automated test coverage on a production codebase from 10% to over 60% with Jest, Cypress and Vitest, and production bugs dropped by 25%. I write pytest and Django API suites, Cypress end-to-end tests and Locust load tests, and run them as CI gates on GitHub Actions and GitLab CI so a failure stops the merge. I have built the systems I test, so I know they tend to break in payments, background jobs, access control and data migrations.

---

## Core Skills
**Test Automation:** Cypress, Playwright, Selenium, Jest, React Testing Library, Vitest, Pytest, Django Test Framework, Testcontainers
**API Testing:** Pytest with DRF APIClient, Postman, REST and GraphQL APIs, Schema Validation (Pydantic, Zod)
**Performance Testing:** Locust, Django Silk, SQL Query Profiling
**Languages:** Python, SQL, JavaScript, TypeScript
**CI/CD & DevOps:** GitHub Actions, GitLab CI, Jenkins, Docker, Kubernetes, AWS (ECS, RDS, S3)
**QA Process:** Test Planning & Strategy, Test Pyramid, Regression Testing, Exploratory Testing, Agile/Scrum, Jira
**Quality & Monitoring:** Sentry, ESLint, Husky, Code Review
**Security & Compliance:** HIPAA, Role-Based Access-Control Testing
**AI in Testing:** AI-Assisted Test Writing (Claude Code, Cursor, Copilot), LLM Output Validation

---

## Experience

### Senior Software Engineer | Codeupnow
*Sept 2025 - Present*

- Wrote unit and API tests for Django REST endpoints with pytest and the Django test framework, using fixtures and factories for test data, and ran them in CI before every merge.
- Reworked Python REST API code and cut response times by 40%, which also brought cloud costs down.
- Worked on a microservices system in Python and Django with a React frontend, and cut downtime by 30%.
- Mentored junior engineers through code review and drove Agile feature delivery alongside UX/UI designers and backend teams.

### Senior Software Engineer | Arbisoft
*July 2021 - Apr 2026*

- Raised automated test coverage from 10% to over 60% with Jest, Cypress, and Vitest, added ESLint and Husky as quality gates, and cut production bugs by 25%.
- Reworked GitLab CI/CD pipelines with parallel jobs and layer caching, reducing deployment times by 40%.
- Owned Sentry monitoring to cut production error volume, with error triage through session replay, release and performance tracking, Slack and GitHub integration, and PII-safe payload encryption that keeps sensitive data out of captured events.
- Cut API response times by 30 to 70% on core endpoints by fixing N+1 queries, reworking ORM access patterns, and adding PostgreSQL indexes.
- Used AI coding tools such as Cursor, Claude Code, Codex, GitHub Copilot, and ChatGPT for both autonomous multi-step tasks and hands-on pair-programming, applying them to PR review, architecture discussions, and custom internal tooling, while comparing model outputs using structured prompts.

---

## Selected Projects

**FixAlert, Maintenance Platform** · *React + Django + PostgreSQL*
- Wrote pytest and Django test suites for the REST API and Cypress end-to-end tests for the React frontend, and ran both in CI as gates that block a merge on failure.
- Load-tested the API with Locust and profiled requests with Django Silk to find redundant queries, then removed the N+1 lookups that slowed endpoints under heavy load.
- Made Stripe payment requests retry-safe using Stripe's idempotency key header, so a retried call could not create a duplicate charge.

**Landit, Career Platform** · *Django + React*
- Wrote component tests with Jest and React Testing Library and Cypress end-to-end tests for the Next.js frontend, plus pytest tests for the Django API behind it.
- Ran regression checks across the Formik to React Hook Form and App Router migrations, so existing forms and pages behaved the same after the switch.

**Telehealth Platform** · *Next.js + Django + PostgreSQL*
- Wrote pytest tests for the Django APIs, including access-control checks confirming each user role can reach only the patient data HIPAA allows it to see.
- Architected and maintained a HIPAA-compliant telehealth platform on Django, with PostgreSQL on AWS RDS.

**Meet Gabbi, AI Legal Intake Platform** · *React + Django*
- Validated the intake model's structured output against a schema in code, so malformed or incomplete case data was rejected before it reached the firm.
- Wrote pytest tests for the Django intake backend and ran them in the CI/CD pipeline that deploys to AWS ECS, so a failing test stops the release.

---

## Education
**B.S. Software Engineering** Punjab University College of Information & Technology (PUCIT)  ·  GPA: 3.08
