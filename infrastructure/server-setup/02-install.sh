#!/usr/bin/env bash
# TDTUTF server setup — Stage 2: install all runtime packages
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

echo "==> PHP 8.4 + extensions (FPM + CLI)"
apt-get install -y \
  php8.4-fpm php8.4-cli php8.4-pgsql php8.4-mbstring php8.4-xml php8.4-bcmath \
  php8.4-curl php8.4-gd php8.4-intl php8.4-zip php8.4-redis php8.4-opcache php8.4-readline

echo "==> PostgreSQL 16"
apt-get install -y postgresql-16 postgresql-client-16

echo "==> Redis"
apt-get install -y redis-server

echo "==> Nginx"
apt-get install -y nginx

echo "==> Node.js 20 (replaces old v12)"
apt-get install -y nodejs

echo "==> Composer"
curl -fsSL https://getcomposer.org/installer -o /tmp/composer-setup.php
php8.4 /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer
rm -f /tmp/composer-setup.php

echo "==> pnpm 10 + pm2 (global npm)"
npm install -g pnpm@10 pm2

echo "==> Certbot (nginx plugin)"
apt-get install -y certbot python3-certbot-nginx

echo "==> ---- versions ----"
php8.4 -v | head -1
psql --version
redis-server --version | head -1
nginx -v 2>&1
echo "node $(node -v)"
echo "pnpm $(pnpm -v)"
composer --version 2>/dev/null | head -1
echo "STAGE2_DONE_OK"
