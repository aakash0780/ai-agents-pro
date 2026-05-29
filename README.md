# AI Agents Pro

AI Agents Pro is a full-stack web app for a dark-theme AI automation agency/SaaS experience.
It includes the marketing website, authentication, Get Started lead intake, contact/newsletter capture, visitor tracking, dashboards, and blog content.

## What This Project Includes

- React + Vite frontend with lazy-loaded routes and reusable UI components
- Express backend with JWT auth, OAuth, validation, rate limiting, visitor tracking, and Socket.IO alerts
- Prisma + PostgreSQL for users, contacts, leads, posts, and password reset tokens
- OAuth entry points for Google, GitHub, Facebook, and Apple
- Static blog API backed by `server/data/blog-posts.json`, plus authenticated Prisma-backed post management
- Docker setup for frontend, backend, Postgres, nginx API proxy, and Socket.IO proxy
- GitHub Actions CI/CD workflows

## Tech Stack

- Frontend: React 19, Vite 7, React Router 7
- Styling/UI: Tailwind CSS 4, Radix UI primitives, custom component library
- Backend: Node.js, Express, Passport, JWT, Zod
- Database: PostgreSQL + Prisma ORM
- Tooling: pnpm, ESLint, Docker, GitHub Actions

## Local Development

### Prerequisites

- Node.js 20+ recommended
- pnpm 10+
- PostgreSQL (local or cloud)

### 1. Create environment file

```bash
cp .env.example .env
```

Required minimum values for local development:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_agents_db"
JWT_SECRET="change-me-for-production"
PORT=3001
FRONTEND_URL="http://localhost:5173"
VITE_API_URL="/api"
```

Notes:

- `VITE_API_URL` should be `/api`. Vite proxies `/api` to `http://localhost:3001` during local development, and nginx proxies `/api` to the backend container in Docker.
- Leave `VITE_SOCKET_URL` empty for same-origin Socket.IO. Vite/nginx proxy `/socket.io` to the backend.
- Analytics and ad tracking are optional. Leave any vendor ID blank to disable that vendor.

Optional analytics/ad tracking:

```env
VITE_GA4_MEASUREMENT_ID="G-XXXXXXXXXX"
VITE_GOOGLE_SITE_VERIFICATION="your-google-search-console-verification-token"
VITE_CLARITY_PROJECT_ID="your-microsoft-clarity-project-id"
VITE_HOTJAR_SITE_ID="your-hotjar-site-id"
VITE_META_PIXEL_ID="your-meta-pixel-id"
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Prepare database

```bash
pnpm exec prisma generate
pnpm exec prisma db push
```

If you prefer migrations instead of `db push`:

```bash
pnpm exec prisma migrate dev
```

### 4. Start frontend + backend

```bash
pnpm dev:all
```

App URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001/api`
- Health check: `http://localhost:3001/api/health`

## Available Scripts

- `pnpm dev`: start Vite frontend
- `pnpm dev:server`: start Express backend
- `pnpm dev:all`: run frontend + backend concurrently
- `pnpm build`: production frontend build
- `pnpm lint`: lint project
- `pnpm preview`: preview built frontend
- `pnpm db:push`: run Prisma `db push` via dotenvx
- `pnpm db:studio`: open Prisma Studio via dotenvx

## Frontend Routes

Public routes:

- `/`
- `/about`
- `/services`
- `/pricing`
- `/contact`
- `/get-started`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/auth/callback`
- `/blog`
- `/blog/:slug`

Protected routes (auth required):

- `/dashboard`
- `/client-profit-dashboard`
- `/profile`
- `/blog/new`
- `/blog/:slug/edit`
- `/admin/visitors` (admin required)

## Backend API

Base URL: `/api`

Authentication:

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me` (Bearer token)
- `PUT /auth/profile` (Bearer token)

OAuth:

- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/github`
- `GET /auth/github/callback`
- `GET /auth/facebook`
- `GET /auth/facebook/callback`
- `GET /auth/apple`
- `POST /auth/apple/callback`

Contact + blog:

- `POST /contact`
- `POST /leads`
- `POST /newsletter/subscribe`
- `GET /blog/posts`
- `GET /blog/posts/:slug`
- `GET /posts`
- `GET /posts/:slug`
- `POST /posts` (admin only)
- `PUT /posts/:id` (author or admin)
- `DELETE /posts/:id` (author or admin)

Utility:

- `GET /health`
- `POST /visitors/track`
- `GET /visitors/stats` (admin)
- `GET /events/cta`
- `GET /` and `GET /api` for API info

## Auth and Permissions

- JWT token is expected in `Authorization: Bearer <token>`.
- `ProtectedRoute` in the frontend blocks unauthenticated users.
- Blog creation is restricted to `ADMIN`.
- Blog update/delete is allowed for the post author or `ADMIN`.

## Database Models (Prisma)

- `User`: local + social auth fields, profile details, role
- `Post`: blog content with author relation and publish timestamp
- `PasswordResetToken`: hashed reset token + expiry
- `Contact`: inbound lead/contact records
- `Lead`: Get Started company intake records
- `Service`: service metadata (defined in schema for future use)

## Docker

Run full stack with Docker Compose:

```bash
docker compose up -d --build --force-recreate
```

If UI changes are not visible after an update, rebuild cleanly:

```bash
docker compose down
docker compose up -d --build --force-recreate
```

Default behavior:

- Frontend serves on port `80`
- Backend serves on port `3001` internally
- Postgres serves on port `5432`
- Browser API calls use `http://localhost/api` through nginx, not `http://localhost:3001/api`
- Backend runs `prisma migrate deploy` on startup (`server/docker-entrypoint.sh`)

See [DOCKER_AND_CI.md](DOCKER_AND_CI.md) for CI/CD and container details.

## Environment Variables

Core backend:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS` (comma-separated additional CORS origins)

Frontend build/runtime:

- `VITE_API_URL`
- `VITE_SOCKET_URL`
- `VITE_UMAMI_SCRIPT_URL`
- `VITE_UMAMI_WEBSITE_ID`
- `VITE_GA4_MEASUREMENT_ID`
- `VITE_GOOGLE_SITE_VERIFICATION`
- `VITE_CLARITY_PROJECT_ID`
- `VITE_HOTJAR_SITE_ID`
- `VITE_HOTJAR_VERSION`
- `VITE_META_PIXEL_ID`

OAuth (optional):

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`
- `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`

## Documentation

- Setup guides: [`docs/setup`](docs/setup)
- Audits and technical reviews: [`docs/audits`](docs/audits)
- Project documentation index: [`docs/README.md`](docs/README.md)
