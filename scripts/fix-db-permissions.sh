#!/bin/bash

# Script to fix PostgreSQL permissions for Prisma migrations

echo "🔧 Fixing PostgreSQL permissions..."
echo ""

# Check if database exists
DB_NAME="ai_agents_db"
DB_USER="akash"

echo "📋 Database: $DB_NAME"
echo "📋 User: $DB_USER"
echo ""

# Option 1: Grant permissions as postgres superuser
echo "Option 1: Granting permissions as postgres user..."
echo "Run these commands as postgres superuser:"
echo ""
echo "psql -U postgres -c \"GRANT ALL ON SCHEMA public TO $DB_USER;\""
echo "psql -U postgres -c \"GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;\""
echo "psql -U postgres -d $DB_NAME -c \"GRANT ALL ON SCHEMA public TO $DB_USER;\""
echo ""

# Option 2: Recreate database with proper ownership
echo "Option 2: Recreate database with proper ownership:"
echo ""
echo "psql -U postgres -c \"DROP DATABASE IF EXISTS $DB_NAME;\""
echo "psql -U postgres -c \"CREATE DATABASE $DB_NAME OWNER $DB_USER;\""
echo "psql -U postgres -d $DB_NAME -c \"GRANT ALL ON SCHEMA public TO $DB_USER;\""
echo ""

echo "After running one of the options above, try:"
echo "  npx prisma migrate dev --name init"

