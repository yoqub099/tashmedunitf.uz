#!/usr/bin/env bash
set -uo pipefail
IMG="banners/1/image/photo_2026-06-05_22-26-22.webp"
echo "=== 1) raw storage file accessible? ==="
echo "GET /storage/$IMG -> $(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://127.0.0.1/storage/$IMG")"
echo "=== 2) file on disk ==="
ls -la "/var/www/tmtu-termiz/apps/api/storage/app/public/banners/1/image/" 2>/dev/null || echo "(dir missing)"
echo "=== 3) public/storage symlink ==="
ls -ld "/var/www/tmtu-termiz/apps/api/public/storage" 2>/dev/null || echo "(no symlink)"
echo "=== 4) Next image optimizer for that banner ==="
ENC=$(python3 -c "import urllib.parse;print(urllib.parse.quote('http://40.47.1.223/storage/$IMG'))")
echo "/_next/image -> $(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "http://127.0.0.1/_next/image?url=$ENC&w=1080&q=75")"
echo "=== 5) homepage SSR includes the banner image url? ==="
echo "count in /uz HTML: $(curl -s -L --max-time 25 http://127.0.0.1/uz | grep -c 'banners/1/image')"
echo "BANNERCHECK_DONE_OK"
