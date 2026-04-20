#!/bin/sh
set -e
cd /app
if [ -n "$DATABASE_URL" ]; then
  pnpm exec prisma migrate deploy 2>/dev/null || pnpm exec prisma db push --accept-data-loss 2>/dev/null || true
fi
exec node server/index.js
