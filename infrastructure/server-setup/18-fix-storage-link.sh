#!/usr/bin/env bash
# TDTUTF deploy — Stage 18: fix public/storage (was a stale dir, must be a symlink)
set -euo pipefail
API=/var/www/tmtu-termiz/apps/api

echo "=== REAL store (storage/app/public) contents ==="
ls -1 "$API/storage/app/public/" | head -40
echo "=== guard: real store has the uploaded banner? ==="
test -f "$API/storage/app/public/banners/1/image/photo_2026-06-05_22-26-22.webp" \
  && echo "banner file present in real store OK" \
  || { echo "ABORT: banner not in real store"; exit 1; }

echo "==> replace stale public/storage dir with proper symlink"
rm -rf "$API/public/storage"
sudo -u tashmed php8.4 "$API/artisan" storage:link
ls -ld "$API/public/storage"

echo "==> clear Next image optimizer cache (had cached the 404) + restart web"
rm -rf /var/www/tmtu-termiz/apps/web/.next/cache/images 2>/dev/null || true
sudo -u tashmed bash -lc "pm2 restart tmtu-web" >/dev/null
sleep 4

echo "=== verify (should be 200 now) ==="
echo "raw banner    : $(curl -s -o /dev/null -w '%{http_code}' --max-time 10 http://127.0.0.1/storage/banners/1/image/photo_2026-06-05_22-26-22.webp)"
echo "raw faculty1  : $(curl -s -o /dev/null -w '%{http_code}' --max-time 10 http://127.0.0.1/storage/faculties/1/image/faculty-1.webp)"
ENC=$(python3 -c "import urllib.parse;print(urllib.parse.quote('http://40.47.1.223/storage/banners/1/image/photo_2026-06-05_22-26-22.webp'))")
echo "banner via opt: $(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "http://127.0.0.1/_next/image?url=$ENC&w=1080&q=75")"
echo "STORAGELINK_DONE_OK"
