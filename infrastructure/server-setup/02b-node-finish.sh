#!/usr/bin/env bash
# TDTUTF server setup — Stage 2b: resolve node conflict + finish (composer/pnpm/certbot)
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

echo "==> purge old Ubuntu node 12 + libnode-dev (file conflict source)"
apt-get remove -y --purge libnode-dev libnode72 nodejs nodejs-doc >/dev/null 2>&1 || true
apt-get autoremove -y >/dev/null 2>&1 || true

echo "==> install Node.js 20 (NodeSource)"
apt-get install -y nodejs

echo "==> Composer"
curl -fsSL https://getcomposer.org/installer -o /tmp/composer-setup.php
php8.4 /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer
rm -f /tmp/composer-setup.php

echo "==> pnpm 10 + pm2 (global)"
npm install -g pnpm@10 pm2

echo "==> Certbot (nginx plugin)"
apt-get install -y certbot python3-certbot-nginx

echo "==> ---- versions ----"
echo "node $(node -v)"
echo "npm  $(npm -v)"
echo "pnpm $(pnpm -v)"
echo "pm2  $(pm2 -v 2>/dev/null || echo '?')"
composer --version 2>/dev/null | head -1
nginx -v 2>&1
echo "STAGE2B_DONE_OK"
