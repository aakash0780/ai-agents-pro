#!/bin/bash

# Setup script for AI Agents Website

echo "🚀 Setting up AI Agents Website..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_agents_db?schema=public"

# JWT Secret - Change this to a random string in production
JWT_SECRET="$(openssl rand -base64 32)"

# Server Port
PORT=3001

# Frontend API URL
VITE_API_URL=http://localhost:3001/api
EOF
    echo "✅ .env file created!"
    echo "⚠️  Please edit .env file and update DATABASE_URL with your PostgreSQL credentials"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if DATABASE_URL is set
if grep -q "postgresql://username:password" .env 2>/dev/null; then
    echo "⚠️  WARNING: DATABASE_URL still has placeholder values!"
    echo "   Please edit .env file and update DATABASE_URL before continuing"
    echo ""
fi

echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file and set your DATABASE_URL"
echo "2. Run: npx prisma generate"
echo "3. Run: npx prisma migrate dev --name init"
echo "4. Start server: pnpm dev:server"
echo "5. Start frontend: pnpm dev (in another terminal)"

