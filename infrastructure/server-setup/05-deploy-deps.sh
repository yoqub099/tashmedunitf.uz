#!/usr/bin/env bash
# TDTUTF deploy — Stage 5: extract source + install dependencies
set -euo pipefail
APP=/var/www/tmtu-termiz

echo "==> extract source to $APP"
mkdir -p "$APP"
tar xzf /tmp/tmtu-src.tgz -C "$APP"
chown -R tashmed:www-data "$APP"

echo "==> composer install (api, production)"
sudo -u tashmed bash -lc "cd $APP/apps/api && composer install --no-dev --optimize-autoloader --no-interaction"

echo "==> pnpm install (workspace, frozen lockfile)"
sudo -u tashmed bash -lc "cd $APP && pnpm install --frozen-lockfile"

echo "==> tree check"
ls -1 "$APP"
echo "vendor: $(test -d $APP/apps/api/vendor && echo OK || echo MISSING)"
echo "node_modules: $(test -d $APP/node_modules && echo OK || echo MISSING)"
echo "DEPS_DONE_OK"
