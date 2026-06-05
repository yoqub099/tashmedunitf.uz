#!/usr/bin/env bash
# TDTUTF deploy — Stage 6: env files + key + migrate + seed + storage + perms
set -euo pipefail
APP=/var/www/tmtu-termiz
IP=40.47.1.223

# ensure ADMIN_PASSWORD secret exists
grep -q '^ADMIN_PASSWORD=' /etc/tmtu/secrets.env || \
  echo "ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -dc 'A-Za-z0-9' | head -c 16)" >> /etc/tmtu/secrets.env
# shellcheck disable=SC1091
. /etc/tmtu/secrets.env

echo "==> apps/api/.env"
cat > "$APP/apps/api/.env" <<EOF
APP_NAME=TDTUTF
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://${IP}
APP_VERSION=1.0.0
FRONTEND_URL=http://${IP}
ADMIN_URL=http://${IP}:8080
REVALIDATION_SECRET=${REVALIDATION_SECRET}
LOG_CHANNEL=stack
LOG_LEVEL=warning
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_PERSISTENT=true
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=null
CACHE_STORE=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120
QUEUE_CONNECTION=redis
FILESYSTEM_DISK=local
MEDIA_DISK=public
IMAGE_DRIVER=gd
MAIL_MAILER=log
MAIL_FROM_ADDRESS="info@tdtutf.uz"
MAIL_FROM_NAME="TDTUTF"
SANCTUM_STATEFUL_DOMAINS=${IP},${IP}:8080
ADMIN_PASSWORD=${ADMIN_PASSWORD}
EOF

echo "==> apps/web/.env"
printf 'NEXT_PUBLIC_API_URL=http://%s/api\nREVALIDATION_SECRET=%s\n' "$IP" "$REVALIDATION_SECRET" > "$APP/apps/web/.env"
echo "==> apps/admin/.env"
printf 'NEXT_PUBLIC_API_URL=http://%s/api/v1\nREVALIDATION_SECRET=%s\n' "$IP" "$REVALIDATION_SECRET" > "$APP/apps/admin/.env"

chown tashmed:www-data "$APP/apps/api/.env" "$APP/apps/web/.env" "$APP/apps/admin/.env"
chmod 640 "$APP/apps/api/.env"

cd "$APP/apps/api"
echo "==> key:generate"
sudo -u tashmed php8.4 artisan key:generate --force
echo "==> migrate --force"
sudo -u tashmed php8.4 artisan migrate --force
echo "==> db:seed --force"
sudo -u tashmed php8.4 artisan db:seed --force
echo "==> storage:link"
sudo -u tashmed php8.4 artisan storage:link

echo "==> storage perms for www-data"
chgrp -R www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
command -v setfacl >/dev/null && { setfacl -R -m u:www-data:rwX storage bootstrap/cache; setfacl -R -d -m u:www-data:rwX storage bootstrap/cache; } || true

echo "==> migration count + admin user"
sudo -u tashmed php8.4 artisan migrate:status | tail -3
sudo -u postgres psql -d "$DB_DATABASE" -tAc "SELECT 'users='||count(*) FROM users;"
echo "APP_CONFIG_DONE_OK"
