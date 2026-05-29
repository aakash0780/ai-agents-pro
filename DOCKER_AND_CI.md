# Docker & CI/CD

This doc covers running the app with Docker and how CI/CD is set up. It aligns with [.env](.env) / [.env.example](.env.example), [BACKEND_OPTIMIZATION_SUMMARY.md](BACKEND_OPTIMIZATION_SUMMARY.md), and [FRONTEND_OPTIMIZATION_SUMMARY.md](FRONTEND_OPTIMIZATION_SUMMARY.md).

## Docker

### Files

| File | Purpose |
|------|--------|
| `Dockerfile.frontend` | Multi-stage: pnpm + Vite build → nginx serving `dist` and proxying `/api` + `/socket.io` to backend |
| `Dockerfile.backend` | Node 20, Prisma generate, entrypoint runs migrations then `node server/index.js` |
| `docker-compose.yml` | postgres, backend, frontend; backend uses `DATABASE_URL` from env / compose |
| `nginx.conf` | SPA fallback + `/api` and `/socket.io` → `http://backend:3001` |
| `.dockerignore` | Keeps build context small (excludes node_modules, .env, .git, etc.) |

### Environment for Docker

Compose uses:

- **Postgres**: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (defaults: `postgres`, `postgres`, `ai_agents_db`).
- **Backend**: `env_file: .env` plus compose-set `DATABASE_URL` (pointing at the `postgres` service). You must have `JWT_SECRET` and optionally `FRONTEND_URL` in `.env` (see [.env.example](.env.example)).

So in `.env` you can keep:

- `JWT_SECRET=...` (required in production)
- `FRONTEND_URL=http://localhost` (or your public URL when deployed)
- OAuth vars if you use Google/GitHub login
- `VITE_API_URL=/api` for Docker and local Vite proxy usage
- `VITE_SOCKET_URL=` blank for same-origin Socket.IO proxying

Compose overrides `DATABASE_URL` for the backend to `postgresql://postgres:postgres@postgres:5432/ai_agents_db` unless you set `POSTGRES_*` differently.

### Commands

```bash
# Build and start
docker compose up -d --build --force-recreate

# Logs
docker compose logs -f

# Stop and remove volumes
docker compose down -v
```

Frontend is at **http://localhost** (port 80). API is at **http://localhost/api** (proxied to backend). Socket.IO uses **http://localhost/socket.io**. The frontend build uses `VITE_API_URL=/api` so the app calls the same origin.

### Backend entrypoint

`server/docker-entrypoint.sh` runs:

1. `prisma migrate deploy`.
2. `node server/index.js`.

So the backend now fails fast if required migrations have not been created or cannot be applied, instead of silently falling back to `db push`.

---

## CI/CD (GitHub Actions)

### CI workflow (`.github/workflows/ci.yml`)

- **Triggers**:
  - push on all branches
  - PR to `main` or `develop`
  - manual dispatch
- **Jobs**:
  1. **Lint**: pnpm install, `pnpm lint`.
  2. **Build frontend**: pnpm install, `pnpm build` with `VITE_API_URL=/api` and placeholder analytics build variables so CI matches the production build path.
  3. **Docker Compose smoke**: Creates a minimal `.env` with `DATABASE_URL`, `JWT_SECRET`, and the frontend build variables, runs `docker compose up -d --build --force-recreate`, then checks:
     - `http://localhost/api/health` (backend through nginx)
     - `http://localhost:80` (frontend returns 200).

No repository secrets are required; the smoke test uses a generated `.env`.

### CD workflow (`.github/workflows/cd.yml`)

- **Trigger**: automatic after **CI succeeds for a push to `main` or `develop`**, plus manual dispatch.
- **Action**: Builds backend and frontend images and pushes to **GitHub Container Registry**:
  - On `main`: `latest` + commit SHA tag
  - On `develop`: `develop-latest` + commit SHA tag
- Build cache scopes are separated per image (`backend` and `frontend`) to reduce cache cross-talk.
- Frontend image build receives `APP_BUILD_SHA` so every commit produces a distinct build revision label.

Uses `GITHUB_TOKEN`; no extra secrets needed for public repos. For private repos, `GITHUB_TOKEN` still has `packages: write` when the workflow has `permissions: packages: write`.

The frontend image build in CD also passes:

- `VITE_API_URL=/api`
- `VITE_SOCKET_URL=`
- `VITE_UMAMI_SCRIPT_URL`
- `VITE_UMAMI_WEBSITE_ID`
- `VITE_GA4_MEASUREMENT_ID`
- `VITE_GOOGLE_SITE_VERIFICATION`
- `VITE_CLARITY_PROJECT_ID`
- `VITE_HOTJAR_SITE_ID`
- `VITE_HOTJAR_VERSION`
- `VITE_META_PIXEL_ID`

Set the analytics values as **GitHub Actions repository variables** (`Settings -> Secrets and variables -> Actions -> Variables`) so published images are built with the correct tracking configuration. Leave unused vendor values blank.

### Using the images from CD

Example for a server or Kubernetes:

```bash
# Pull
docker pull ghcr.io/<owner>/<repo>/backend:latest
docker pull ghcr.io/<owner>/<repo>/frontend:latest

# Run with your own compose or orchestration; set DATABASE_URL, JWT_SECRET, FRONTEND_URL, and Postgres.
```

---

## Summary

- **Local/dev**: Use `.env` (see README and .env.example), then `pnpm dev:all` or `docker compose up -d --build`. Vite proxies `/api` and `/socket.io` to the backend.
- **Docker**: Same `.env`; Compose wires Postgres and sets `DATABASE_URL` for the backend; frontend uses `VITE_API_URL=/api` in the image.
- **CI**: Lint, frontend build, and Docker Compose smoke test on push/PR to `main`/`develop`.
- **CD**: After CI passes on `main`, backend and frontend images are built and pushed to `ghcr.io`.

For backend and frontend optimization details, see [BACKEND_OPTIMIZATION_SUMMARY.md](BACKEND_OPTIMIZATION_SUMMARY.md) and [FRONTEND_OPTIMIZATION_SUMMARY.md](FRONTEND_OPTIMIZATION_SUMMARY.md).
