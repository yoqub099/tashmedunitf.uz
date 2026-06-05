#!/usr/bin/env bash
# TDTUTF deploy — Stage 15: remove dev .env.local overrides + rebuild + restart
set -euo pipefail
APP=/var/www/tmtu-termiz

echo "==> remove dev .env.local (overrode prod URL with localhost:8000)"
rm -f "$APP/apps/web/.env.local" "$APP/apps/admin/.env.local"
echo "==> effective NEXT_PUBLIC_API_URL now:"
grep NEXT_PUBLIC_API_URL "$APP/apps/web/.env" "$APP/apps/admin/.env"

echo "==> clean rebuild (rebake correct URL)"
sudo -u tashmed bash -lc "cd $APP && rm -rf apps/web/.next apps/admin/.next && pnpm build"

echo "==> restart pm2 web + admin"
sudo -u tashmed bash -lc "pm2 restart tmtu-web tmtu-admin --update-env"
sleep 5

echo "==> verify faculty pages (should now show real titles)"
for u in bakalavriat/fakultet/1 bakalavriat/fakultet/2 ordinatura/fakultet/3 magistratura/fakultet/4; do
  printf "%s -> " "$u"
  curl -s -L --max-time 25 "http://127.0.0.1/uz/abiturientlarga/$u" | grep -oiE '<title>[^<]*</title>' | head -1
done
echo "FIX_REBUILD_DONE_OK"
