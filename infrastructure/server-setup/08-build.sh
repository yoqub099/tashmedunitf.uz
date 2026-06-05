#!/usr/bin/env bash
# TDTUTF deploy — Stage 8: build web + admin (production)
set -euo pipefail
APP=/var/www/tmtu-termiz

echo "==> rebuild sharp (native binary; pnpm skipped its build script)"
sudo -u tashmed bash -lc "cd $APP && pnpm rebuild sharp" || true

echo "==> production build (web + admin)"
sudo -u tashmed bash -lc "cd $APP && pnpm build"

echo "==> outputs"
test -d "$APP/apps/web/.next"   && echo "web   .next OK" || { echo "web .next MISSING"; exit 1; }
test -d "$APP/apps/admin/.next" && echo "admin .next OK" || { echo "admin .next MISSING"; exit 1; }
echo "BUILD_DONE_OK"
