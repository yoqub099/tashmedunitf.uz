#!/usr/bin/env bash
# TDTUTF server setup — Stage 4: verify the environment
set -uo pipefail
. /etc/tmtu/secrets.env
echo "=== services ==="
for s in postgresql redis-server php8.4-fpm nginx; do printf "%s: " "$s"; systemctl is-active "$s"; done
echo "=== PostgreSQL settings (tuning loaded?) ==="
sudo -u postgres psql -tAc "SELECT name||' = '||setting||' '||COALESCE(unit,'') FROM pg_settings WHERE name IN ('shared_buffers','effective_cache_size','max_connections','work_mem','jit');"
echo "=== app DB user connects (over TCP)? ==="
PGPASSWORD="$DB_PASSWORD" psql -h 127.0.0.1 -U "$DB_USERNAME" -d "$DB_DATABASE" -tAc "SELECT 'CONNECT_OK user='||current_user||' db='||current_database();"
echo "=== PHP 8.4 key extensions ==="
php8.4 -m | grep -iE "^(pdo_pgsql|pgsql|mbstring|gd|intl|redis|curl|zip|bcmath|openssl|fileinfo|tokenizer)$" | tr '\n' ' '; echo
echo "=== redis ping ==="
redis-cli ping
echo "=== resources ==="
df -h | grep -vE "tmpfs|udev|loop|squashfs"
free -h | head -2
echo "VERIFY_DONE_OK"
