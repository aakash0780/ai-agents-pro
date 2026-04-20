# Quick Start Guide - Fixing Errors

## Current Errors and Solutions

### Error 1: Missing DATABASE_URL
**Error:** `PrismaConfigEnvError: Missing required environment variable: DATABASE_URL`

**Solution:** Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env

# Or create manually
cat > .env << EOF
DATABASE_URL="postgresql://username:password@localhost:5432/ai_agents_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
VITE_API_URL=http://localhost:3001/api
EOF
```

**Important:** Replace `username`, `password`, and `ai_agents_db` with your actual PostgreSQL credentials!

### Error 2: Prisma Client Not Generated
**Error:** `SyntaxError: Named export 'PrismaClient' not found`

**Solution:** Generate Prisma Client after setting up DATABASE_URL:

```bash
# 1. Make sure .env file exists with DATABASE_URL
# 2. Generate Prisma Client
npx prisma generate

# 3. Run migrations (creates database tables)
npx prisma migrate dev --name init
```

### Error 3: Peer Dependency Warnings
**Warning:** `react-day-picker` peer dependencies

**Solution:** These are warnings, not errors. The app will still work. To fix (optional):

```bash
# Option 1: Ignore (recommended - app works fine)
# Option 2: Update react-day-picker (if you use date pickers)
pnpm add react-day-picker@latest
```

## Step-by-Step Setup

### 1. Create .env File
```bash
# Create .env file
cat > .env << 'EOF'
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/ai_agents_db?schema=public"
JWT_SECRET="change-this-to-a-random-string-in-production"
PORT=3001
VITE_API_URL=http://localhost:3001/api
EOF

# Edit with your actual database credentials
nano .env  # or use your preferred editor
```

### 2. Set Up PostgreSQL Database
```bash
# Create database (if not exists)
createdb ai_agents_db

# Or using psql
psql -U postgres -c "CREATE DATABASE ai_agents_db;"
```

### 3. Generate Prisma Client and Run Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

### 4. Start the Application
```bash
# Terminal 1 - Backend Server
pnpm dev:server

# Terminal 2 - Frontend
pnpm dev
```

## Quick Setup Script

You can also use the setup script:

```bash
chmod +x setup-env.sh
./setup-env.sh
```

Then edit `.env` with your database credentials and continue with steps 2-4 above.

## Troubleshooting

### If DATABASE_URL is still not found:
- Make sure `.env` file is in the root directory (same level as `package.json`)
- Check that `.env` file doesn't have syntax errors
- Restart your terminal/IDE

### If Prisma Client still not found:
- Make sure `npx prisma generate` completed successfully
- Check that `node_modules/@prisma/client` exists
- Try deleting `node_modules` and running `pnpm install` again

### If database connection fails:
- Verify PostgreSQL is running: `sudo service postgresql status`
- Check database credentials in `.env`
- Test connection: `psql -U your_user -d ai_agents_db`

## Need Help?

Check the full setup guide in `SETUP.md` for more details.

