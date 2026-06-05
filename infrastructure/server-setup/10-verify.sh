#!/usr/bin/env bash
# TDTUTF deploy — Stage 10: end-to-end verification
set -uo pipefail
echo "=== services ==="
for s in postgresql redis-server php8.4-fpm nginx tmtu-queue; do printf "%s: " "$s"; systemctl is-active "$s"; done
echo "=== pm2 ==="
sudo -u tashmed bash -lc "pm2 list" 2>/dev/null | grep -E "tmtu-web|tmtu-admin" || echo "pm2: none"
echo "=== HTTP (localhost) ==="
echo "web   /uz            -> $(curl -s -o /dev/null -w '%{http_code}' --max-time 25 -L http://127.0.0.1/uz)"
echo "api   /api/health    -> $(curl -s -o /dev/null -w '%{http_code}' --max-time 10 http://127.0.0.1/api/health)"
echo "api   /api/v1/news   -> $(curl -s -o /dev/null -w '%{http_code}' --max-time 10 http://127.0.0.1/api/v1/news)"
echo "admin :8080 /login   -> $(curl -s -o /dev/null -w '%{http_code}' --max-time 25 -L http://127.0.0.1:8080/login)"
echo "=== faculty page title (regression of the original bug) ==="
curl -s --max-time 25 -L http://127.0.0.1/uz/abiturientlarga/bakalavriat/fakultet/1 | grep -oiE '<title>[^<]*</title>' | head -1
echo "VERIFY_DONE_OK"
