# Docker & CI/CD

This doc covers running the app with Docker and how CI/CD is set up. It aligns with [.env](.env) / [.env.example](.env.example), [BACKEND_OPTIMIZATION_SUMMARY.md](BACKEND_OPTIMIZATION_SUMMARY.md), and [FRONTEND_OPTIMIZATION_SUMMARY.md](FRONTEND_OPTIMIZATION_SUMMARY.md).

## Docker

### Files

| File | Purpose |
|------|--------|
| `Dockerfile.frontend` | Multi-stage: pnpm + Vite build → nginx serving `dist` and proxying `/api` to backend |
| `Dockerfile.backend` | Node 20, Prisma generate, entrypoint runs migrations then `node server/index.js` |
| `docker-compose.yml` | postgres, backend, frontend; backend uses `DATABASE_URL` from env / compose |
| `nginx.conf` | SPA fallback + `/api` → `http://backend:3001` |
| `.dockerignore` | Keeps build context small (excludes node_modules, .env, .git, etc.) |

### Environment for Docker

Compose uses:

- **Postgres**: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (defaults: `postgres`, `postgres`, `ai_agents_db`).
- **Backend**: `env_file: .env` plus compose-set `DATABASE_URL` (pointing at the `postgres` service). You must have `JWT_SECRET` and optionally `FRONTEND_URL` in `.env` (see [.env.example](.env.example)).

So in `.env` you can keep:

- `JWT_SECRET=...` (required in production)
- `FRONTEND_URL=http://localhost` (or your public URL when deployed)
- OAuth vars if you use Google/GitHub login

Compose overrides `DATABASE_URL` for the backend to `postgresql://postgres:postgres@postgres:5432/ai_agents_db` unless you set `POSTGRES_*` differently.

### Commands

```bash
# Build and start
docker compose up -d --build

# Logs
docker compose logs -f

# Stop and remove volumes
docker compose down -v
```

Frontend is at **http://localhost** (port 80). API is at **http://localhost/api** (proxied to backend). The frontend build uses `VITE_API_URL=/api` so the app calls the same origin.

### Backend entrypoint

`server/docker-entrypoint.sh` runs:

1. `prisma migrate deploy` (or `prisma db push` if no migrations).
2. `node server/index.js`.

So the database schema is applied automatically when the backend container starts.

---

## CI/CD (GitHub Actions)

### CI workflow (`.github/workflows/ci.yml`)

- **Triggers**: push / PR to `main` or `develop`.
- **Jobs**:
  1. **Lint**: pnpm install, `pnpm lint`.
  2. **Build frontend**: pnpm install, `pnpm build` with `VITE_API_URL=/api`.
  3. **Docker Compose smoke**: Creates a minimal `.env` with `DATABASE_URL` and `JWT_SECRET`, runs `docker compose build` and `docker compose up -d`, then checks:
     - `http://localhost:3001/api/health` (backend)
     - `http://localhost:80` (frontend returns 200).

No repository secrets are required; the smoke test uses a generated `.env`.

### CD workflow (`.github/workflows/cd.yml`)

- **Trigger**: push to `main`.
- **Action**: Builds backend and frontend images and pushes to **GitHub Container Registry**:
  - `ghcr.io/<owner>/<repo>/backend:latest` (and commit SHA tag)
  - `ghcr.io/<owner>/<repo>/frontend:latest` (and commit SHA tag)

Uses `GITHUB_TOKEN`; no extra secrets needed for public repos. For private repos, `GITHUB_TOKEN` still has `packages: write` when the workflow has `permissions: packages: write`.

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

- **Local/dev**: Use `.env` (see README and .env.example), then `pnpm dev:all` or `docker compose up -d --build`.
- **Docker**: Same `.env`; Compose wires Postgres and sets `DATABASE_URL` for the backend; frontend uses `VITE_API_URL=/api` in the image.
- **CI**: Lint, frontend build, and Docker Compose smoke test on push/PR to `main`/`develop`.
- **CD**: On push to `main`, backend and frontend images are built and pushed to `ghcr.io`.

For backend and frontend optimization details, see [BACKEND_OPTIMIZATION_SUMMARY.md](BACKEND_OPTIMIZATION_SUMMARY.md) and [FRONTEND_OPTIMIZATION_SUMMARY.md](FRONTEND_OPTIMIZATION_SUMMARY.md).
