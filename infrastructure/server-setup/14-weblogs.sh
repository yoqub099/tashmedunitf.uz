#!/usr/bin/env bash
set -uo pipefail
echo "==> trigger faculty page (SSR)"
curl -s -o /dev/null --max-time 25 -L "http://127.0.0.1/uz/abiturientlarga/bakalavriat/fakultet/1"
sleep 1
echo "==> tmtu-web error log (tail) =="
tail -n 30 /home/tashmed/.pm2/logs/tmtu-web-error.log 2>/dev/null || echo "(no error log)"
echo "==> tmtu-web out log (tail) =="
tail -n 25 /home/tashmed/.pm2/logs/tmtu-web-out.log 2>/dev/null || echo "(no out log)"
echo "WEBLOGS_DONE_OK"
