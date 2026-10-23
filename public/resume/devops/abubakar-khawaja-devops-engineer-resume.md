# Abubakar Khawaja
## DevOps Engineer | AWS | Kubernetes | Docker | Terraform | CI/CD | Linux

abubakarrkhawaj@gmail.com  ·  [LinkedIn](https://www.linkedin.com/in/abubakar-khawaja-008483183/)  ·  [GitHub](https://github.com/Abuubkar)  ·  [Portfolio](https://abuubkar.github.io/)

---

## Professional Summary
Software engineer with 5+ years of experience building and running production systems on AWS. I've deployed services on ECS and on Kubernetes with EKS, with PostgreSQL on RDS and CloudFront in front of S3. I've built CI/CD pipelines on GitLab CI, GitHub Actions and Jenkins, and cut deployment times by 40% with parallel jobs and layer caching. I've also run apps on a Linux VPS with Docker and Nginx, and I watch production with Sentry, Grafana and CloudWatch.

---

## Core Skills
**Cloud & DevOps:** AWS (ECS, EKS, EC2, Lambda, RDS, S3, CloudFront), Docker, Kubernetes, Terraform, Nginx, Linux
**CI/CD & DevOps:** GitHub Actions, GitLab CI/CD, Jenkins, automated test gates (Pytest, Cypress, Jest)
**Quality & Monitoring:** Sentry, Grafana, AWS CloudWatch, Locust load testing, Django Silk
**Languages:** Python, SQL, JavaScript, TypeScript
**Backend:** Python (Django, Django REST Framework, FastAPI), Node.js (NestJS, Express), REST API design, GraphQL, JWT & OAuth2 authentication, Celery (async jobs)
**Databases:** PostgreSQL, Redis, MySQL, MongoDB, Database Indexing, Query Optimization, Caching

---

## Experience

### Senior Software Engineer | Codeupnow
*Sept 2025 - Present*

- Worked on a microservices system in Python and Django with a React frontend, and cut downtime by 30%.
- Reworked Python REST API code and cut response times by 40%, which also brought cloud costs down.
- Built real-time data pipelines and background job processing for work that runs asynchronously.
- Deployed and tuned services on AWS ECS/EKS and Lambda to support scaling, build performance, and deployment reliability.

### Senior Software Engineer | Arbisoft
*July 2021 - Apr 2026*

- Reworked GitLab CI/CD pipelines with parallel jobs and layer caching, reducing deployment times by 40%.
- Diagnosed a Celery task queue backlog and Redis memory bloat, then moved message routing onto RabbitMQ to stabilize background job throughput.
- Owned Sentry monitoring to cut production error volume, with error triage through session replay, release and performance tracking, Slack and GitHub integration, and PII-safe payload encryption that keeps sensitive data out of captured events.
- Built GitHub Actions automation to validate documentation integrity and prevent inconsistent generated documentation from reaching production.
- Raised automated test coverage from 10% to over 60% with Jest, Cypress, and Vitest, added ESLint and Husky as quality gates, and cut production bugs by 25%.

---

## Selected Projects

**Meet Gabbi, AI Legal Intake Platform** · *Django + Docker + AWS ECS/EKS · Codeupnow*
- Containerised the backend microservices with Docker and deployed them to AWS ECS through an automated CI/CD pipeline.
- Deployed the backend microservices to Kubernetes on AWS EKS.
- Wrote pytest tests for the Django intake backend and ran them in the CI/CD pipeline that deploys to AWS ECS, so a failing test stops the release.

**Landit, Career Platform** · *Next.js + AWS ECS + RDS + S3 + CloudFront*
- Deployed Landit's services on AWS ECS, with PostgreSQL on RDS, static assets in S3, and CloudFront in front for caching and delivery.

**FixAlert, Maintenance Platform** · *Django + Jenkins + Docker + Nginx*
- Built a Jenkins pipeline that tested, built and deployed FixAlert to a Linux VPS, where the app ran in Docker behind Nginx and Gunicorn, with SSL and scheduled backups.
- Load-tested the API with Locust and profiled requests with Django Silk to find redundant queries, then removed the N+1 lookups that slowed endpoints under heavy load.

**Telehealth Platform** · *Next.js + Django + PostgreSQL + Kubernetes*
- Architected and maintained a HIPAA-compliant telehealth platform on Django, with PostgreSQL on AWS RDS and Kubernetes for container orchestration.

---

## Education
**B.S. Software Engineering** Punjab University College of Information & Technology (PUCIT)  ·  GPA: 3.08

## Certifications
- The AI Engineer Path & Prompt Engineering for Web Developers - Scrimba (July 2026)
