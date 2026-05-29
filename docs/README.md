# Documentation

This directory contains all project documentation organized by category.

## Directory Structure

### `/audits/`
Historical technical audits and review reports:
- `COMPREHENSIVE_PROJECT_REVIEW.md` - Full project analysis
- `TECHNICAL_UI_AUDIT.md` - React + Tailwind technical audit
- `UI_AUDIT_REPORT.md` - UI/UX audit report
- `UNUSED_FILES_REPORT.md` - Unused files cleanup report

### `/setup/`
Setup and configuration guides:
- `SETUP.md` - Main setup instructions
- `QUICK_START.md` - Quick start guide
- `AUTHENTICATION_FEATURES.md` - Authentication documentation
- `FIX_PERMISSIONS.md` - Permission fixing guide
- `TROUBLESHOOTING_SIGNUP.md` - Signup troubleshooting

### Root Documentation
- `AGENTS.md` - AI agent instructions
- `AI_AUTOMATION_BUSINESS_BLUEPRINT.md` - Business blueprint
- `README.md` - Main project README (in project root)
- `PROJECT_STRUCTURE.md` - Current file-system hierarchy (in project root)
- `DOCKER_AND_CI.md` - Docker, nginx proxy, and CI/CD notes (in project root)
- `BACKEND_OPTIMIZATION_SUMMARY.md` - Historical backend optimization summary (in project root)
- `FRONTEND_OPTIMIZATION_SUMMARY.md` - Historical frontend optimization summary (in project root)

---

## Quick Links

- Getting started: `setup/QUICK_START.md`
- Project setup: `setup/SETUP.md`
- File hierarchy: `../PROJECT_STRUCTURE.md`
- Docker and CI/CD: `../DOCKER_AND_CI.md`
- Technical audits: `audits/`
- Signup troubleshooting: `setup/TROUBLESHOOTING_SIGNUP.md`

## Current Operational Notes

- Frontend requests should use `VITE_API_URL="/api"`.
- Vite proxies `/api` and `/socket.io` to `http://localhost:3001` in local development.
- Docker/nginx proxies `/api` and `/socket.io` to the backend container.
- Public blog content is served from `server/data/blog-posts.json` through `/api/blog/posts`.
- Authenticated post management uses Prisma-backed `/api/posts` endpoints.
