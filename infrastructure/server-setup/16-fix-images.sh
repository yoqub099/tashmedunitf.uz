#!/usr/bin/env bash
# TDTUTF deploy — Stage 16: allow server IP in Next image remotePatterns
set -euo pipefail
APP=/var/www/tmtu-termiz

echo "==> add 40.47.1.223 to image remotePatterns (web + admin)"
for cfg in apps/web/next.config.ts apps/admin/next.config.ts; do
  if ! grep -q '40.47.1.223' "$APP/$cfg"; then
    sed -i '/remotePatterns: \[/a\      { protocol: "http", hostname: "40.47.1.223", pathname: "/storage/**" },' "$APP/$cfg"
  fi
done
echo "==> verify inserted:"
grep -n "40.47.1.223" "$APP/apps/web/next.config.ts" "$APP/apps/admin/next.config.ts"

echo "==> rebuild + restart"
sudo -u tashmed bash -lc "cd $APP && rm -rf apps/web/.next apps/admin/.next && pnpm build" | tail -6
sudo -u tashmed bash -lc "pm2 restart tmtu-web tmtu-admin --update-env" | tail -2
sleep 5

echo "==> image optimizer test (a faculty image)"
IMG="/_next/image?url=$(python3 -c "import urllib.parse;print(urllib.parse.quote('http://40.47.1.223/storage/faculties/1/image/faculty-1.webp'))" 2>/dev/null || echo 'http%3A%2F%2F40.47.1.223%2Fstorage%2Ffaculties%2F1%2Fimage%2Ffaculty-1.webp')&w=1080&q=75"
echo "image opt -> $(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "http://127.0.0.1${IMG}")"
echo "FIX_IMAGES_DONE_OK"
