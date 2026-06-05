#!/bin/bash

# ============================================================
# PRODUCTION DEPLOY SCRIPT — TDTUTF
# ============================================================
#
# Ubuntu Server: 200GB RAM, 10TB disk
# Bu script serverni NOLDAN SOZLAYDI
#
# ISHLATISH:
#   chmod +x deploy-production.sh
#   sudo ./deploy-production.sh
#
# ============================================================

set -e  # Xatolik bo'lsa to'xtaydi

echo "============================================================"
echo "  TDTUTF — Production Server O'rnatish"
echo "  Server: Ubuntu, 200GB RAM, 10TB disk"
echo "============================================================"

# ---- O'ZGARUVCHILAR ----
APP_DIR="/var/www/tmtu-termiz"
DOMAIN="tdtutf.uz"
DB_NAME="tmtu_termiz"
DB_USER="postgres"
PHP_VERSION="8.3"

# ============================================================
# 1. SYSTEM YANGILASH
# ============================================================
echo ""
echo ">>> 1/10 Tizimni yangilash..."
apt update && apt upgrade -y

# ============================================================
# 2. KERAKLI DASTURLAR O'RNATISH
# ============================================================
echo ""
echo ">>> 2/10 Kerakli dasturlarni o'rnatish..."

# PHP 8.3 + kengaytmalar
apt install -y software-properties-common
add-apt-repository -y ppa:ondrej/php
apt update

apt install -y \
    php${PHP_VERSION}-fpm \
    php${PHP_VERSION}-pgsql \
    php${PHP_VERSION}-mbstring \
    php${PHP_VERSION}-xml \
    php${PHP_VERSION}-bcmath \
    php${PHP_VERSION}-curl \
    php${PHP_VERSION}-gd \
    php${PHP_VERSION}-imagick \
    php${PHP_VERSION}-intl \
    php${PHP_VERSION}-zip \
    php${PHP_VERSION}-redis \
    php${PHP_VERSION}-opcache

# Nginx
apt install -y nginx

# PostgreSQL 16+
apt install -y postgresql postgresql-contrib

# Redis (cache/queue uchun)
apt install -y redis-server

# Supervisor (queue worker uchun)
apt install -y supervisor

# Rasm optimizatsiya dasturlari
apt install -y jpegoptim optipng pngquant gifsicle webp libavif-bin

# Git
apt install -y git

# Certbot (SSL sertifikat)
apt install -y certbot python3-certbot-nginx

# Composer
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

echo "✅ Barcha dasturlar o'rnatildi"

# ============================================================
# 3. PHP-FPM SOZLASH (200GB RAM uchun)
# ============================================================
echo ""
echo ">>> 3/10 PHP-FPM sozlash..."

cat > /etc/php/${PHP_VERSION}/fpm/pool.d/www.conf << 'PHPFPM'
[www]
user = www-data
group = www-data
listen = /var/run/php/php8.3-fpm.sock
listen.owner = www-data
listen.group = www-data

; ---- PROCESS MANAGER ----
; static = belgilangan miqdorda worker
; dynamic = yuklamaga qarab o'zgaradi
pm = dynamic

; 200GB RAM uchun — 500 worker oson ko'taradi
pm.max_children = 500
pm.start_servers = 50
pm.min_spare_servers = 20
pm.max_spare_servers = 100
pm.max_requests = 1000          ; Memory leak oldini olish

; ---- TIMEOUT ----
request_terminate_timeout = 300  ; 5 daqiqa (katta video yuklash)

; ---- PHP SOZLAMALARI ----
php_admin_value[upload_max_filesize] = 500M
php_admin_value[post_max_size] = 500M
php_admin_value[max_execution_time] = 300
php_admin_value[memory_limit] = 512M
php_admin_value[max_input_time] = 300

; ---- OPcache (PHP KODINI CACHE QILADI — 10x tez) ----
php_admin_value[opcache.enable] = 1
php_admin_value[opcache.memory_consumption] = 512
php_admin_value[opcache.max_accelerated_files] = 20000
php_admin_value[opcache.validate_timestamps] = 0
php_admin_value[opcache.jit_buffer_size] = 256M
php_admin_value[opcache.jit] = 1255
PHPFPM

# PHP.ini sozlash
cat >> /etc/php/${PHP_VERSION}/fpm/php.ini << 'PHPINI'

; ---- UPLOAD SOZLAMALARI ----
upload_max_filesize = 500M
post_max_size = 500M
max_execution_time = 300
max_input_time = 300
memory_limit = 512M

; ---- FILE ----
file_uploads = On
upload_tmp_dir = /tmp/php-uploads

; ---- REALPATH CACHE ----
realpath_cache_size = 4096k
realpath_cache_ttl = 600
PHPINI

echo "✅ PHP-FPM sozlandi"

# ============================================================
# 4. POSTGRESQL SOZLASH (200GB RAM UCHUN)
# ============================================================
echo ""
echo ">>> 4/10 PostgreSQL sozlash..."

PG_CONF="/etc/postgresql/16/main/postgresql.conf"

cat >> $PG_CONF << 'PGCONF'

# ============================================================
# TDTUTF PRODUCTION — 200GB RAM
# ============================================================

# MEMORY
shared_buffers = 50GB                  # 25% of RAM
effective_cache_size = 150GB           # 75% of RAM
work_mem = 256MB                       # Per operation
maintenance_work_mem = 4GB             # VACUUM, CREATE INDEX
wal_buffers = 1GB
huge_pages = try

# CHECKPOINT
checkpoint_completion_target = 0.9
max_wal_size = 8GB
min_wal_size = 2GB

# PLANNER
random_page_cost = 1.1                 # SSD uchun
effective_io_concurrency = 200         # SSD uchun
default_statistics_target = 200

# CONNECTIONS
max_connections = 500
superuser_reserved_connections = 5

# PARALLEL QUERY
max_worker_processes = 16
max_parallel_workers_per_gather = 8
max_parallel_workers = 16

# JIT
jit = on
jit_above_cost = 100000

# LOGGING
log_min_duration_statement = 1000      # 1s dan uzoq so'rovlarni log qil
log_checkpoints = on
log_connections = off
log_disconnections = off
PGCONF

echo "✅ PostgreSQL sozlandi (200GB RAM uchun)"

# ============================================================
# 5. REDIS SOZLASH (Cache uchun)
# ============================================================
echo ""
echo ">>> 5/10 Redis sozlash..."

cat > /etc/redis/redis.conf << 'REDISCONF'
bind 127.0.0.1
port 6379
daemonize yes
maxmemory 10gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
REDISCONF

echo "✅ Redis sozlandi (10GB cache)"

# ============================================================
# 6. LOYIHA JOYLASHTIRISH
# ============================================================
echo ""
echo ">>> 6/10 Loyihani joylashtirish..."

# Papka yaratish
mkdir -p $APP_DIR
mkdir -p $APP_DIR/storage/app/public/media
mkdir -p $APP_DIR/storage/app/temp
mkdir -p $APP_DIR/storage/app/backup
mkdir -p $APP_DIR/storage/framework/{cache,sessions,views}
mkdir -p $APP_DIR/storage/logs
mkdir -p /tmp/php-uploads

# Nginx cache papkasi
mkdir -p /var/cache/nginx/media

# Loyihani ko'chirish (yoki git clone)
# git clone git@github.com:username/tmtu-termiz.git $APP_DIR

# Ruxsatlar
chown -R www-data:www-data $APP_DIR
chmod -R 775 $APP_DIR/storage
chmod -R 775 $APP_DIR/bootstrap/cache

echo "✅ Papkalar yaratildi"

# ============================================================
# 7. LARAVEL SOZLASH
# ============================================================
echo ""
echo ">>> 7/10 Laravel sozlash..."

cd $APP_DIR

# Composer install (production mode — dev paketlar yo'q)
composer install --optimize-autoloader --no-dev

# .env fayl
cp .env.example .env
# .env faylni qo'lda sozlang!

# Key generatsiya
php artisan key:generate

# Storage symlink (ENG MUHIM!)
# public/storage → storage/app/public
php artisan storage:link

# Migration
php artisan migrate --force

# Cache (production uchun)
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan optimize

echo "✅ Laravel sozlandi"

# ============================================================
# 8. SUPERVISOR (Queue Worker)
# ============================================================
echo ""
echo ">>> 8/10 Queue Worker sozlash..."

# Media konversiya worker (thumbnail yaratish)
cat > /etc/supervisor/conf.d/tmtu-worker.conf << 'SUPERVISOR'
[program:tmtu-media-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/tmtu-termiz/artisan queue:work database --queue=media-conversions --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/tmtu-termiz/storage/logs/worker.log
stopwaitsecs=3600

[program:tmtu-default-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/tmtu-termiz/artisan queue:work database --queue=default --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/tmtu-termiz/storage/logs/worker-default.log
stopwaitsecs=3600
SUPERVISOR

supervisorctl reread
supervisorctl update
supervisorctl start all

echo "✅ Queue Worker ishga tushdi (4 media + 2 default)"

# ============================================================
# 9. NGINX JOYLASHTIRISH
# ============================================================
echo ""
echo ">>> 9/10 Nginx sozlash..."

# Nginx config ko'chirish
cp $APP_DIR/nginx-production.conf /etc/nginx/sites-available/$DOMAIN
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Default config o'chirish
rm -f /etc/nginx/sites-enabled/default

# Nginx global config
cat > /etc/nginx/nginx.conf << 'NGINXMAIN'
user www-data;
worker_processes auto;
worker_rlimit_nofile 65536;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 4096;
    multi_accept on;
    use epoll;
}

http {
    # ---- ASOSIY ----
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # ---- LOGGING ----
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # ---- OPEN FILE CACHE ----
    # Fayl deskriptorlarni cache qiladi — disk I/O kamayadi
    open_file_cache max=200000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;

    # ---- GZIP ----
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # ---- PROXY CACHE ----
    proxy_cache_path /var/cache/nginx/media
        levels=1:2
        keys_zone=media_cache:100m
        max_size=50g
        inactive=30d
        use_temp_path=off;

    # ---- RATE LIMITING ----
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=upload:10m rate=5r/s;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
NGINXMAIN

# Nginx tekshirish
nginx -t

# Nginx qayta yuklash
systemctl reload nginx

echo "✅ Nginx sozlandi va ishga tushdi"

# ============================================================
# 10. SSL SERTIFIKAT (BEPUL — Let's Encrypt)
# ============================================================
echo ""
echo ">>> 10/10 SSL sertifikat olish..."

# Avval HTTP da ishlatib, keyin SSL olish
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

# Auto-yangilash (har 3 oyda yangilanadi)
echo "0 3 * * * certbot renew --quiet && systemctl reload nginx" | crontab -

echo "✅ SSL sertifikat o'rnatildi"

# ============================================================
# CRON JOBS
# ============================================================
echo ""
echo ">>> Cron jobs sozlash..."

# Laravel scheduler + temp cleanup
(crontab -l 2>/dev/null; echo "* * * * * cd $APP_DIR && php artisan schedule:run >> /dev/null 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 2 * * * cd $APP_DIR && php artisan media-library:clean >> /dev/null 2>&1") | crontab -

echo "✅ Cron jobs sozlandi"

# ============================================================
# XIZMATLARNI QAYTA YUKLASH
# ============================================================
systemctl restart php${PHP_VERSION}-fpm
systemctl restart nginx
systemctl restart redis-server
systemctl restart postgresql

echo ""
echo "============================================================"
echo "  ✅ TAYYOR! TDTUTF Production Server o'rnatildi!"
echo "============================================================"
echo ""
echo "  🌐 Sayt:     https://$DOMAIN"
echo "  📁 Loyiha:   $APP_DIR"
echo "  📸 Media:    $APP_DIR/storage/app/public/media/"
echo "  🗄️  Database: PostgreSQL — $DB_NAME"
echo "  ⚡ Cache:    Redis (10GB)"
echo "  🔧 PHP:      $PHP_VERSION-FPM (500 worker)"
echo "  🖥️  RAM:      200GB → PG 50GB + Redis 10GB + Nginx 50GB"
echo "  💾 Disk:     10TB → Media fayllar"
echo ""
echo "  KEYINGI QADAM:"
echo "  1. .env faylni sozlang: nano $APP_DIR/.env"
echo "  2. Database yarating: php artisan migrate --force"
echo "  3. Admin yarating: php artisan db:seed"
echo ""
echo "============================================================"
