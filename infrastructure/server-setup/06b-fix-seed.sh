#!/usr/bin/env bash
# TDTUTF deploy — Stage 6b: install faker (seeders need it) + clean re-seed
set -euo pipefail
APP=/var/www/tmtu-termiz
cd "$APP/apps/api"

echo "==> install fakerphp/faker (seeders/factories require it)"
sudo -u tashmed composer require fakerphp/faker --no-interaction --no-scripts

echo "==> migrate:fresh --seed (clean slate)"
sudo -u tashmed php8.4 artisan migrate:fresh --seed --force

echo "==> storage:link + perms"
sudo -u tashmed php8.4 artisan storage:link 2>/dev/null || true
chgrp -R www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
command -v setfacl >/dev/null && { setfacl -R -m u:www-data:rwX storage bootstrap/cache; setfacl -R -d -m u:www-data:rwX storage bootstrap/cache; } || true

echo "==> optimize (config/route/event cache)"
sudo -u tashmed php8.4 artisan config:cache
sudo -u tashmed php8.4 artisan route:cache
sudo -u tashmed php8.4 artisan event:cache

echo "==> counts"
sudo -u postgres psql -d tmtu_termiz -tAc "SELECT 'users='||(SELECT count(*) FROM users)||' news='||(SELECT count(*) FROM news)||' faculties='||(SELECT count(*) FROM faculties)||' departments='||(SELECT count(*) FROM departments)||' directions='||(SELECT count(*) FROM directions);"
echo "SEED_FIX_DONE_OK"
