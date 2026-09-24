#!/bin/sh
set -e

echo "=================================================================="
echo " Starting LexiGuard AI Legal Intelligence Platform (Production)   "
echo "=================================================================="

# Ensure database and uploads directories exist with proper write permissions
mkdir -p /app/server/uploads /app/server/prisma 2>/dev/null || true
chmod 777 /app/server/uploads /app/server/prisma 2>/dev/null || true

# Run Prisma schema migration / push to ensure tables are ready
echo "[Entrypoint] Initializing SQLite database schema..."
npx --workspace=server prisma db push --schema=/app/server/prisma/schema.prisma --skip-generate --accept-data-loss || true

# Seed default pre-analyzed contract if database is empty
if [ ! -f "/app/server/prisma/dev.db" ] || [ ! -s "/app/server/prisma/dev.db" ]; then
  echo "[Entrypoint] Seeding initial legal repository documents..."
  npm --workspace=server run seed || true
fi

echo "[Entrypoint] Launching application on port ${PORT:-5000}..."
exec "$@"
