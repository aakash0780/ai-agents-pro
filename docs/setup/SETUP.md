# Setup Instructions for AI Agents Website with Authentication

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.4.1+)
- PostgreSQL database

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
```

3. Generate Prisma Client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Frontend Environment Variables

Create a `.env` file in the root directory (or add to existing one):
```env
VITE_API_URL=http://localhost:3001/api
```

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
- Backend API: http://localhost:3001

## Features Added

✅ User Signup with:
- Name, Email, Password (required)
- Phone, Company (optional)

✅ User Login
- Email and password authentication
- JWT token-based sessions

✅ User Profile
- View current user information
- Update profile details

✅ Protected Routes
- Authentication state management
- Automatic token validation

## API Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)
- `GET /api/health` - Health check

## Database Schema

The User model includes:
- id (String, unique)
- email (String, unique, required)
- name (String, optional)
- password (String, hashed)
- phone (String, optional)
- company (String, optional)
- role (Role enum: USER, ADMIN)
- createdAt, updatedAt (DateTime)

