# Authentication Features Added

## Overview
Complete signup and login system with database storage for client details has been added to your AI Agents website.

## What Was Added

### 1. Database Schema Updates
- Updated Prisma schema to include `phone` and `company` fields in the User model
- User model now stores: id, email, name, password (hashed), phone, company, role, timestamps

### 2. Backend API Server (`server/index.js`)
- Express.js server with authentication endpoints
- Password hashing using bcryptjs
- JWT token-based authentication
- Endpoints:
  - `POST /api/auth/signup` - Create new account
  - `POST /api/auth/login` - Login
  - `GET /api/auth/me` - Get current user
  - `PUT /api/auth/profile` - Update profile

### 3. Frontend Components

#### Pages
- **SignupPage** (`src/pages/SignupPage.jsx`)
  - Form with: Name, Email, Phone, Company, Password, Confirm Password
  - Validation and error handling
  - Beautiful UI matching your site design

- **LoginPage** (`src/pages/LoginPage.jsx`)
  - Simple email/password login form
  - Error handling and loading states

#### Context & API
- **AuthContext** (`src/contexts/AuthContext.jsx`)
  - Global authentication state management
  - Provides: signup, login, logout, updateProfile functions
  - Auto-checks authentication on app load

- **API Utilities** (`src/lib/api.js`)
  - Centralized API request functions
  - Token management (localStorage)
  - Error handling

### 4. UI Updates
- **Header Component** updated with:
  - Login/Signup buttons (when not authenticated)
  - User dropdown menu with profile info (when authenticated)
  - Logout functionality
  - Mobile-responsive design

### 5. Routing
- Added `/login` and `/signup` routes
- Integrated AuthProvider in App.jsx
- Protected routes ready for future use

## How to Use

### Setup
1. Install dependencies: `pnpm install`
2. Set up PostgreSQL database (see SETUP.md)
3. Create `.env` file with database URL and JWT secret
4. Run migrations: `npx prisma migrate dev`
5. Start backend: `pnpm dev:server`
6. Start frontend: `pnpm dev` (in another terminal)

### User Flow
1. User visits site → sees "Log In" and "Sign Up" buttons in header
2. User clicks "Sign Up" → fills form with details → account created
3. User clicks "Log In" → enters credentials → logged in
4. When logged in → header shows user name/avatar with dropdown menu
5. User can logout from dropdown menu

## Security Features
- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens for session management
- Token stored in localStorage (can be upgraded to httpOnly cookies)
- Password validation (minimum 6 characters)
- Email uniqueness validation

## Next Steps (Optional Enhancements)
- Add password reset functionality
- Add email verification
- Add profile page for users to edit their details
- Add protected routes (dashboard, settings, etc.)
- Add role-based access control (admin features)
- Add "Remember Me" functionality
- Add social login (Google, GitHub, etc.)

