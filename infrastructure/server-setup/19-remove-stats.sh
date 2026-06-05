#!/usr/bin/env bash
# TDTUTF — Stage 19: remove the "TdTUTF raqamlarda" StatsCounterSection (homepage)
set -euo pipefail
APP=/var/www/tmtu-termiz

echo "==> apply updated homepage (StatsCounterSection import + usage removed)"
cp /tmp/page.tsx "$APP/apps/web/src/app/[locale]/(main)/page.tsx"
chown tashmed:www-data "$APP/apps/web/src/app/[locale]/(main)/page.tsx"

echo "==> delete the component file"
rm -f "$APP/apps/web/src/components/home/StatsCounterSection.tsx"

echo "==> confirm no references remain"
if grep -rn "StatsCounterSection" "$APP/apps/web/src" 2>/dev/null; then
  echo "WARNING: references still present"; else echo "clean — no StatsCounterSection references"; fi

echo "==> rebuild web + restart"
sudo -u tashmed bash -lc "cd $APP && rm -rf apps/web/.next && pnpm build" | tail -5
sudo -u tashmed bash -lc "pm2 restart tmtu-web" >/dev/null
sleep 5

echo "==> verify section gone (raqamlarda should be 0 in homepage HTML)"
echo "raqamlarda count: $(curl -s -L --max-time 25 http://127.0.0.1/uz | grep -c 'raqamlarda')"
echo "REMOVESTATS_DONE_OK"
