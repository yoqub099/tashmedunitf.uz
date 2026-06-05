#!/usr/bin/env bash
# TDTUTF server setup — Stage 3: configure & tune services for ~16GB RAM / 12 cores
set -euo pipefail

# ===== secrets (generate once, store 0600) =====
mkdir -p /etc/tmtu
if [ ! -f /etc/tmtu/secrets.env ]; then
  cat > /etc/tmtu/secrets.env <<EOF
DB_DATABASE=tmtu_termiz
DB_USERNAME=tmtu
DB_PASSWORD=$(openssl rand -hex 24)
REVALIDATION_SECRET=$(openssl rand -hex 32)
EOF
  chmod 600 /etc/tmtu/secrets.env
fi
# shellcheck disable=SC1091
. /etc/tmtu/secrets.env

# ===== PostgreSQL: role + database + extension =====
echo "==> PostgreSQL role/db"
sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USERNAME}'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE ROLE ${DB_USERNAME} LOGIN PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "ALTER ROLE ${DB_USERNAME} PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_DATABASE}'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE DATABASE ${DB_DATABASE} OWNER ${DB_USERNAME} ENCODING 'UTF8' TEMPLATE template0;"
sudo -u postgres psql -d "${DB_DATABASE}" -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"

# ===== PostgreSQL tuning (16GB / 12 cores) =====
echo "==> PostgreSQL tuning"
PG_MAIN="/etc/postgresql/16/main/postgresql.conf"
grep -q "include_dir = 'conf.d'" "$PG_MAIN" || echo "include_dir = 'conf.d'" >> "$PG_MAIN"
install -d /etc/postgresql/16/main/conf.d
cat > /etc/postgresql/16/main/conf.d/tmtu-tuning.conf <<'EOF'
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 32MB
maintenance_work_mem = 1GB
wal_buffers = 16MB
checkpoint_completion_target = 0.9
max_wal_size = 4GB
min_wal_size = 1GB
random_page_cost = 1.1
effective_io_concurrency = 200
default_statistics_target = 200
max_connections = 200
max_worker_processes = 12
max_parallel_workers_per_gather = 4
max_parallel_workers = 12
jit = on
EOF

# ===== Redis =====
echo "==> Redis tuning"
grep -q '^maxmemory ' /etc/redis/redis.conf || echo 'maxmemory 1gb' >> /etc/redis/redis.conf
grep -q '^maxmemory-policy ' /etc/redis/redis.conf || echo 'maxmemory-policy allkeys-lru' >> /etc/redis/redis.conf

# ===== PHP-FPM 8.4 tuning =====
echo "==> PHP-FPM tuning"
POOL="/etc/php/8.4/fpm/pool.d/www.conf"
sed -i 's/^pm = .*/pm = dynamic/' "$POOL"
sed -i 's/^pm.max_children = .*/pm.max_children = 40/' "$POOL"
sed -i 's/^pm.start_servers = .*/pm.start_servers = 8/' "$POOL"
sed -i 's/^pm.min_spare_servers = .*/pm.min_spare_servers = 4/' "$POOL"
sed -i 's/^pm.max_spare_servers = .*/pm.max_spare_servers = 12/' "$POOL"
PHPINI="/etc/php/8.4/fpm/php.ini"
sed -i 's/^upload_max_filesize = .*/upload_max_filesize = 200M/' "$PHPINI"
sed -i 's/^post_max_size = .*/post_max_size = 200M/' "$PHPINI"
sed -i 's/^memory_limit = .*/memory_limit = 512M/' "$PHPINI"

# ===== enable + (re)start services =====
echo "==> enable + restart services"
systemctl enable postgresql redis-server php8.4-fpm nginx >/dev/null 2>&1 || true
systemctl restart postgresql
systemctl restart redis-server
systemctl restart php8.4-fpm
systemctl restart nginx

echo "==> ---- status ----"
for s in postgresql redis-server php8.4-fpm nginx; do printf "%s: " "$s"; systemctl is-active "$s"; done
sudo -u postgres psql -tAc "SELECT version();" | head -1
echo "STAGE3_DONE_OK"
