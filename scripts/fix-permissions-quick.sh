#!/bin/bash

# Quick script to fix PostgreSQL permissions
# Run this script to get the exact commands you need to run

echo "🔧 PostgreSQL Permissions Fix"
echo "=============================="
echo ""
echo "You need to run these commands as the postgres superuser."
echo ""
echo "Option 1: Using sudo (recommended)"
echo "-----------------------------------"
echo "sudo -u postgres psql << 'EOF'"
echo "GRANT ALL PRIVILEGES ON DATABASE ai_agents_db TO akash;"
echo "\\c ai_agents_db"
echo "GRANT ALL ON SCHEMA public TO akash;"
echo "GRANT CREATE ON SCHEMA public TO akash;"
echo "ALTER SCHEMA public OWNER TO akash;"
echo "EOF"
echo ""
echo "Option 2: One-line commands (if you have postgres password)"
echo "------------------------------------------------------------"
echo "psql -U postgres -c \"GRANT ALL PRIVILEGES ON DATABASE ai_agents_db TO akash;\""
echo "psql -U postgres -d ai_agents_db -c \"GRANT ALL ON SCHEMA public TO akash;\""
echo "psql -U postgres -d ai_agents_db -c \"GRANT CREATE ON SCHEMA public TO akash;\""
echo "psql -U postgres -d ai_agents_db -c \"ALTER SCHEMA public OWNER TO akash;\""
echo ""
echo "After running the commands above, try:"
echo "  npx prisma migrate dev --name init"

