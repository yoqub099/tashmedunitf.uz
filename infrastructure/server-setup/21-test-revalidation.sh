#!/usr/bin/env bash
# TDTUTF — Stage 21: end-to-end revalidation test (admin update -> users see fresh). Restores data after.
set -uo pipefail
. /etc/tmtu/secrets.env
B=http://127.0.0.1
APP=/var/www/tmtu-termiz/apps/api

echo "=== Laravel config (cached) ==="
cd "$APP"
sudo -u tashmed php8.4 artisan tinker --execute="echo 'frontend_url='.config('app.frontend_url').'  secret_len='.strlen((string)config('app.revalidation_secret')).PHP_EOL;" 2>/dev/null

echo "=== webhook reachable + secret valid? ==="
echo "POST /api/revalidate {tags:[banners]} -> $(curl -s -o /dev/null -w '%{http_code}' -X POST "$B/api/revalidate" -H 'Content-Type: application/json' -d "{\"tags\":[\"banners\"],\"secret\":\"$REVALIDATION_SECRET\"}")"

echo "=== login ==="
TOKEN=$(curl -s -X POST "$B/api/v1/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"admin@tdtutf.uz\",\"password\":\"$ADMIN_PASSWORD\"}" | python3 -c "import json,sys;print(json.load(sys.stdin).get('data',{}).get('token',''))")
if [ -z "$TOKEN" ]; then echo "LOGIN FAILED"; exit 1; fi
echo "login OK (token len ${#TOKEN})"

ORIG=$(curl -s "$B/api/v1/banners" | python3 -c "import json,sys;d=json.load(sys.stdin)['data'];print(json.dumps(d[0]['title']))")
echo "original title.uz: $(echo "$ORIG" | python3 -c "import json,sys;print(json.load(sys.stdin).get('uz'))" 2>/dev/null)"
MARK="CACHE-TEST-MARKER-XYZ"

echo "=== UPDATE banner 1 title -> $MARK (simulates admin edit) ==="
curl -s -X PUT "$B/api/v1/banners/1" -H "Authorization: Bearer $TOKEN" -H "Accept: application/json" -H "Content-Type: application/json" \
  -d "{\"title\":{\"uz\":\"$MARK\",\"ru\":\"$MARK\",\"en\":\"$MARK\"}}" | python3 -c "import json,sys;r=json.load(sys.stdin);print('update success=',r.get('success'),'msg=',r.get('message'))" 2>/dev/null || echo "(update resp not JSON / failed)"
sleep 3

echo "=== API banner title after (Laravel Redis cache flushed by observer?) ==="
curl -s "$B/api/v1/banners" | python3 -c "import json,sys;d=json.load(sys.stdin)['data'];print('API title.uz =', d[0]['title'].get('uz'))"
echo "=== homepage after (Next ISR revalidated?) — marker should appear ==="
echo "marker count in /uz HTML: $(curl -s -L --max-time 25 $B/uz | grep -c "$MARK")"

echo "=== RESTORE original ==="
curl -s -X PUT "$B/api/v1/banners/1" -H "Authorization: Bearer $TOKEN" -H "Accept: application/json" -H "Content-Type: application/json" \
  -d "{\"title\":$ORIG}" >/dev/null && echo "restored"
sleep 2
echo "restored title.uz = $(curl -s "$B/api/v1/banners" | python3 -c "import json,sys;d=json.load(sys.stdin)['data'];print(d[0]['title'].get('uz'))")"
echo "REVALTEST_DONE_OK"
