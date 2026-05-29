# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Agents Pro — a full-stack marketing/SaaS website for an AI automation services business. Frontend: React 19 + Vite + TailwindCSS v4 + shadcn/ui. Backend: Express.js (ESM) + Prisma ORM + PostgreSQL. Real-time visitor tracking via Socket.IO.

## Commands

```bash
# Install dependencies
pnpm install

# Development (both servers together — preferred)
pnpm dev:all

# Frontend only (Vite on :5173)
pnpm dev

# Backend only (Express on :3001)
pnpm dev:server

# Production build
pnpm build

# Lint
pnpm lint

# Database — push schema changes (uses dotenvx to load .env)
pnpm db:push

# Open Prisma Studio GUI
pnpm db:studio

# After editing prisma/schema.prisma, regenerate client
npx prisma generate
```

There are no automated tests; lint is the only CI check.

Docker Compose runs Postgres + backend + nginx-fronted frontend:
```bash
docker-compose up
```

## Architecture

### Frontend (`src/`)

- **`src/App.jsx`** — root component; wraps `ErrorBoundary → MotionConfig → ThemeProvider → AuthProvider → Router`. `AppShell` (inside `Router`) mounts `Navbar`, `Footer`, `Toaster`, and all routes. `useAnalyticsTracking` and `useVisitorTracking` are called at the shell level.
- **`src/lib/api.js`** — single API client. All fetch calls go through `apiRequest()`, which attaches the Bearer token from `localStorage` and normalizes `{ success, data, error }` responses. Export groups: `authAPI`, `blogAPI`, `contactAPI`, `leadsAPI`, `visitorsAPI`.
- **`src/contexts/AuthContext.jsx`** — provides `user`, `loading`, `isAuthenticated`, `isAdmin`, and action methods (`login`, `logout`, `signup`, `completeOAuth`, `updateProfile`). Consumed via `useAuth` hook (`src/hooks/useAuth.js`).
- **`src/components/ProtectedRoute.jsx`** — wraps routes requiring login; accepts `requireAdmin` prop for admin-only routes.
- **Path alias**: `@/` resolves to `src/` (configured in `vite.config.js` and `jsconfig.json`).
- **Theme**: CSS custom properties (`var(--bg)`, `var(--text)`, etc.) managed by `ThemeProvider`. Use `cn()` from `@/lib/utils` for className composition.
- **Static content** (pricing plans, services, integrations, team, site metadata) lives in `src/constants/`.

#### Pages & routes

All pages use **named exports** and are `React.lazy()`-loaded with `.then(m => ({ default: m.PageName }))`.

| Route | Component | Auth |
|---|---|---|
| `/` | `LandingHomePage` | public |
| `/services`, `/pricing`, `/about`, `/contact` | `ServicesPage`, `PricingPage`, `AboutPage`, `ContactPage` | public |
| `/blog`, `/blog/:slug` | `BlogPage`, `BlogPostPage` | public |
| `/blog/new`, `/blog/:slug/edit` | `NewPostPage` | login required |
| `/get-started` | `GetStartedPage` | public |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | auth pages | public |
| `/auth/callback` | `AuthCallbackPage` | public |
| `/dashboard`, `/profile` | `DashboardPage`, `ProfilePage` | login required |
| `/client-profit-dashboard` | `ClientProfitDashboardPage` | login required |
| `/admin/visitors` | `VisitorDashboard` (`src/pages/admin/`) | admin only |

Note: `/blog/new` is declared before `/blog/:slug` in the route tree so it isn't captured as a slug.

### Backend (`server/`)

- **`server/index.js`** — Express app entry. Registers middleware (Helmet, CORS, rate limiting, session, Passport), mounts route modules, and defines inline routes for auth endpoints (signup, login, forgot/reset-password, `/api/me`, `/api/posts` CRUD, `/api/contact`, `/api/leads`). Exits immediately if `DATABASE_URL` is missing; exits in production if `JWT_SECRET` is default/missing.
- **`server/routes/`** — modular routers: `auth.js` (JWT refresh, OTP, magic link, social OAuth callbacks), `blog.js`, `contact.js`, `newsletter.js`, `events.js`, `visitors.js`.
- **`server/validation.js`** — Zod schemas for all request bodies. Applied via `validate(schema)` middleware.
- **`server/config/passport.js`** — Passport strategy registration.
- **`server/services/visitorTracker.js`** + **`server/middleware/trackVisit.js`** — real-time visitor tracking emitted to Socket.IO `admin-room`.

### Dev proxy

Vite proxies `/api/*` and `/socket.io/*` to `http://localhost:3001` during development, so the frontend uses relative paths and CORS is not a concern locally.

### API response shape

All endpoints return:
```json
{ "success": true, "data": { ... }, "message": "..." }
// or on error:
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human message" } }
```

### Authentication flow

- **Email/password**: `POST /api/auth/signup` or `/api/auth/login` → JWT in response body → stored in `localStorage` as `authToken` + `token`.
- **Social OAuth**: `GET /api/auth/:provider` → redirect to provider → callback redirects to frontend `/auth/callback#token=<jwt>` → `AuthCallbackPage` calls `completeOAuth()`.
- JWT payload: `{ userId, email, role }`. Token lifetime: 7 days. Role values: `USER`, `ADMIN`.
- Supported providers: Google, GitHub, Facebook, Apple, LinkedIn. Strategies register only when their env vars are present.

### Database (Prisma + PostgreSQL)

Schema: `prisma/schema.prisma`. Models: `User`, `Post`, `PasswordResetToken`, `Contact`, `Service`, `Lead`.

For local dev, start Postgres with `docker-compose up postgres`, then set `DATABASE_URL` in `.env` and run `pnpm db:push`.

### Environment variables

Required:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — required in production; dev has an insecure fallback
- `FRONTEND_URL` — used for OAuth redirects and CORS (default `http://localhost:5173`)
- `VITE_API_URL` — frontend API base; defaults to `/api` (relative, proxied in dev)

Optional analytics (frontend, `VITE_*`):
- `VITE_GA4_MEASUREMENT_ID`, `VITE_UMAMI_WEBSITE_ID` / `VITE_UMAMI_SCRIPT_URL`
- `VITE_CLARITY_PROJECT_ID`, `VITE_HOTJAR_SITE_ID`, `VITE_META_PIXEL_ID`
- `VITE_GOOGLE_SITE_VERIFICATION` — injected into `<head>` by a Vite plugin in `vite.config.js`

Email / notifications:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- `ALERT_EMAIL` — admin notification inbox

See `.env.example` for OAuth callback URLs and all social provider credentials.
