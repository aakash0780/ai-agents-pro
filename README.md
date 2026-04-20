# AI Agents Pro - Project Context for AI Assistants

## 🚀 Project Overview
**Current Objective**: Transform a standard agency website into a **SaaS Product Landing Page** 
**Goal**: Sell "Custom AI Chatbots" for businesses.
**Core Value Prop**: "Train ChatGPT on your data, embed on your site, support customers 24/7."

## 🧩 Current Features & Status

### 1. Frontend (React + Vite)
- **HomePage (`src/pages/HomePage.jsx`)**:
  - **Status**: ✅ SaaS Redesign Completed.
  - **Features**: Product Hero, 3-Step "How it Works" (Fetch -> Train -> Deploy), Feature Grid, Testimonials.
- **PricingPage (`src/pages/PricingPage.jsx`)**:
  - **Status**: ✅ Hybrid Model Implemented.
  - **Model**: Separated into **One-Time Setup** (Build fee) + **Monthly Platform** (Hosting) + **Usage** (Token costs).
  - **Interactive**: Includes a slider to estimate monthly token usage costs.
- **AboutPage (`src/pages/AboutPage.jsx`)**:
  - **Status**: ✅ Active.
  - **Features**: Includes "Nova" (AI Agent) as a team member alongside human staff.

### 2. Backend (Node.js + Express)
- **Location**: `/server`
- **Status**: ⚠️ Implementation pending full connection.
- **Database**: Prisma (PostgreSQL).
- **Issue**: Requires `dotenvx` to run scripts.

## 🛠️ Tech Stack
- **Framework**: React 19, Vite 7
- **Styling**: Tailwind CSS 4, Shadcn UI
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Package Manager**: PNPM

## 🚦 How to Run & Troubleshooting

### Prerequisites
- **PNPM** installed
- **PostgreSQL** (local, Docker, or a cloud DB like [Neon](https://neon.tech) / [Supabase](https://supabase.com))

### 1. Environment variables
A `.env` file is required so the backend can find `DATABASE_URL`. One was created from `.env.example`.

- **Edit `.env`** and set `DATABASE_URL` to your PostgreSQL connection string, for example:
  - Local: `postgresql://USER:PASSWORD@localhost:5432/ai_agents_db`
  - Create the database first: `createdb ai_agents_db` (or via your DB tool).
- Optionally set `JWT_SECRET` (required in production). OAuth keys are only needed for Google/GitHub login.

### 2. Install dependencies (if not done)
```bash
pnpm install
```

### 3. Prisma (database client & schema)
Allow Prisma build scripts (if pnpm warned about them), generate the client, and create tables:

```bash
pnpm approve-builds   # when prompted, approve @prisma/client, prisma
npx prisma generate
npx prisma db push    # or: npx prisma migrate dev
```

### 4. Start the app
```bash
pnpm dev:all
```
- **Frontend**: http://localhost:5173  
- **Backend**: http://localhost:3001 (see `PORT` in `.env`)

## 🐳 Docker & CI/CD

The project is set up for **Docker** and **GitHub Actions** CI/CD.

### Docker (local or deploy)

Use the same `.env` as above. Compose expects `POSTGRES_*` (or defaults) and `JWT_SECRET`, `FRONTEND_URL`:

```bash
# Optional: set Postgres and app env (or rely on .env)
export POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres POSTGRES_DB=ai_agents_db
docker compose up -d --build
```

- **App**: http://localhost (frontend on port 80; `/api` is proxied to the backend).
- **Backend** runs migrations on startup via `server/docker-entrypoint.sh`.

See [DOCKER_AND_CI.md](DOCKER_AND_CI.md) for details and production notes.

### CI/CD (GitHub Actions)

- **CI** (`.github/workflows/ci.yml`): on push/PR to `main` or `develop` — lint, frontend build, Docker Compose build + smoke test. No secrets required; smoke test uses a generated `.env` with `DATABASE_URL` and `JWT_SECRET`.
- **CD** (`.github/workflows/cd.yml`): on push to `main` — build and push backend + frontend images to GitHub Container Registry (`ghcr.io/<repo>/backend`, `ghcr.io/<repo>/frontend`). Uses `GITHUB_TOKEN`; no extra secrets needed for public repos.

## 🔮 Roadmap / "Best Concerns"
1.  **Trust**: Need Privacy Policy & Terms regarding AI training.
2.  **Dashboard**: Need a client portal for users to check their bot's chat history/analytics.
3.  **Onboarding**: Currently redirects to WhatsApp. Need a self-serve signup flow.
