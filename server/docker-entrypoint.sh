#!/bin/sh
set -e
cd /app
if [ -n "$DATABASE_URL" ]; then
  pnpm exec prisma migrate deploy
fi
exec node server/index.js
