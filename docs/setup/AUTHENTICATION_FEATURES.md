# Authentication Features

## Overview
AI Agents Pro includes email/password auth, OAuth, OTP, magic-link login, password reset, profile management, and protected user/admin routes.

## What Was Added

### 1. Database Schema Updates
- `User` stores email, name, password hash, phone, company, role, OAuth IDs, avatar, timestamps, and post relation.
- `PasswordResetToken` stores reset tokens and expiry.
- `Post` ownership is tied to `User`.

### 2. Backend API Server (`server/index.js`)
- Express.js server with authentication endpoints
- Password hashing using bcryptjs
- JWT token-based authentication
- Endpoints:
  - `POST /api/auth/signup` - Create new account
  - `POST /api/auth/login` - Login
  - `POST /api/auth/send-otp` - Send one-time code
  - `POST /api/auth/verify-otp` - Verify one-time code
  - `POST /api/auth/magic-link` - Send magic link
  - `POST /api/auth/forgot-password` - Request password reset
  - `POST /api/auth/reset-password` - Reset password
  - `POST /api/auth/refresh` - Refresh token
  - `GET /api/auth/me` - Get current user
  - `PUT /api/auth/profile` - Update profile
  - OAuth provider routes for Google, Facebook, GitHub, Apple, and LinkedIn

### 3. Frontend Components

#### Pages
- **SignupPage** (`src/pages/SignupPage.jsx`)
  - Account creation with social sign-in options, password strength, and terms checkbox
  - Validation and error handling
  - Dark premium auth UI

- **LoginPage** (`src/pages/LoginPage.jsx`)
  - Email/password login
  - Magic link and OTP modes
  - Social sign-in options

- **ForgotPasswordPage** and **ResetPasswordPage**
  - Password reset request and token-based password update
  - Dark premium auth UI

#### Context & API
- **AuthContext** (`src/contexts/AuthContext.jsx`)
  - Global authentication state management
  - Provides signup, login, logout, OTP login, profile update, and current-user loading state
  - Auto-checks authentication on app load

- **API Utilities** (`src/lib/api.js`)
  - Centralized API request functions
  - Token management (localStorage)
  - Error handling

### 4. UI Updates
- **Navbar Component** includes:
  - Marketing navigation
  - Login and Get Started public CTAs
  - Account dropdown when authenticated
  - Dashboard, Client Profit Dashboard, Profile, and Logout links
  - Logout functionality
  - Mobile-responsive design

### 5. Routing
- Added `/login`, `/signup`, `/forgot-password`, `/reset-password`, and `/auth/callback` routes
- Added protected `/dashboard`, `/client-profit-dashboard`, `/profile`, `/blog/new`, `/blog/:slug/edit`, and `/admin/visitors` routes
- Integrated AuthProvider in App.jsx
- ProtectedRoute redirects unauthenticated users to `/login`

## How to Use

### Setup
1. Install dependencies: `pnpm install`
2. Set up PostgreSQL database (see SETUP.md)
3. Create `.env` file with database URL, JWT secret, `VITE_API_URL="/api"`, and optional OAuth settings
4. Run migrations: `npx prisma migrate dev`
5. Start backend: `pnpm dev:server`
6. Start frontend: `pnpm dev` (in another terminal)

### User Flow
1. User visits site and sees marketing nav plus Login/Get Started actions.
2. User can create an account on `/signup` or start an intake on `/get-started`.
3. User signs in with password, OTP, magic link, or OAuth.
4. Authenticated users see the account dropdown with Dashboard, Client Profit Dashboard, Profile, and Logout.
5. Admin users can access visitor analytics and blog creation tools.

## Security Features
- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens for session management
- Token stored in localStorage (can be upgraded to httpOnly cookies)
- Password validation and password strength feedback
- Email uniqueness validation
- Protected routes and role checks for admin-only areas

## Next Steps (Optional Enhancements)
- Move tokens to httpOnly secure cookies
- Add email verification
- Add "Remember Me" functionality
- Add richer admin user-management screens

