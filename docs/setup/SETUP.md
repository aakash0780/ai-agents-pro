# Setup Instructions for AI Agents Pro

## Prerequisites

- Node.js 20+
- pnpm (v10.4.1+)
- PostgreSQL database
- Docker Desktop or Docker Engine if you want the containerized stack

## Installation Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Setup

1. Create a PostgreSQL database:
```bash
createdb ai_agents_db
```

2. Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_agents_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
FRONTEND_URL="http://localhost:5173"
VITE_API_URL="/api"
VITE_SOCKET_URL=""
```

3. Generate Prisma Client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Frontend Proxy Settings

Keep `VITE_API_URL="/api"` for both local development and Docker. Vite proxies `/api` and `/socket.io` to `http://localhost:3001` during local development. Docker/nginx proxies the same paths to the backend container.

### 4. Running the Application

#### Option 1: Run Frontend and Backend Separately

Terminal 1 - Backend Server:
```bash
pnpm dev:server
```

Terminal 2 - Frontend:
```bash
pnpm dev
```

#### Option 2: Run Both Together
```bash
pnpm dev:all
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API direct: http://localhost:3001/api
- Frontend-proxied API in browser: http://localhost:5173/api
- Docker frontend/API: http://localhost and http://localhost/api

## Core Features

- Marketing website with Services, Pricing, About, Blog, Contact, and Get Started routes
- User signup/login with email/password, OAuth, OTP, magic link, and password reset flows
- Protected dashboard, profile, client profit dashboard, blog editor, and admin visitor dashboard
- Get Started lead intake with company, tools, goals, and automation challenge fields
- Static public blog content under `/api/blog/posts`
- Prisma-backed authenticated post management under `/api/posts`
- Newsletter, contact, visitor tracking, and CTA event APIs

## Important API Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request reset link
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)
- `POST /api/contact` - Submit contact form
- `POST /api/leads` - Submit Get Started lead intake
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/blog/posts` - Public blog list
- `GET /api/blog/posts/:slug` - Public blog post
- `GET /api/posts` - Prisma-backed posts
- `POST /api/posts` - Create post (admin)
- `GET /api/health` - Health check

## Database Schema

Primary Prisma models:

- `User`: auth, OAuth IDs, profile, role, and post relation
- `Post`: Prisma-backed editable posts
- `PasswordResetToken`: password reset state
- `Contact`: contact form submissions
- `Lead`: Get Started intake submissions
- `Service`: service metadata for future use

