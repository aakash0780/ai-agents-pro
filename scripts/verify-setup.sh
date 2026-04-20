#!/bin/bash

echo "🔍 Verifying setup..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "📝 Creating .env file template..."
    cat > .env << 'EOF'
DATABASE_URL="postgresql://username:password@localhost:5432/ai_agents_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
VITE_API_URL=http://localhost:3001/api
EOF
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and replace:"
    echo "   - username with your PostgreSQL username"
    echo "   - password with your PostgreSQL password"
    echo "   - ai_agents_db with your database name (or create it first)"
    echo ""
    echo "Then run this script again to verify."
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env; then
    echo "❌ DATABASE_URL not found in .env file!"
    exit 1
fi

# Check if still has placeholder
if grep -q "postgresql://username:password" .env; then
    echo "⚠️  WARNING: DATABASE_URL still has placeholder values!"
    echo "Please edit .env file and replace with your actual PostgreSQL credentials"
    exit 1
fi

echo "✅ .env file found and configured!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure PostgreSQL is running"
echo "2. Create database (if not exists): createdb ai_agents_db"
echo "3. Run: npx prisma migrate dev --name init"
echo "4. Start server: pnpm dev:server"

