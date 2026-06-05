#!/usr/bin/env bash
# TDTUTF deploy — Stage 9: pm2 (web/admin) + queue worker + scheduler
set -euo pipefail
APP=/var/www/tmtu-termiz

echo "==> pm2: web (:3000) + admin (:3001)"
sudo -u tashmed bash -lc "cd $APP/apps/web   && pm2 delete tmtu-web   2>/dev/null; PORT=3000 pm2 start pnpm --name tmtu-web   -- start"
sudo -u tashmed bash -lc "cd $APP/apps/admin && pm2 delete tmtu-admin 2>/dev/null; PORT=3001 pm2 start pnpm --name tmtu-admin -- start"
sudo -u tashmed bash -lc "pm2 save"

echo "==> pm2 startup on boot (systemd)"
pm2 startup systemd -u tashmed --hp /home/tashmed 2>/dev/null | grep -E '^sudo ' | bash || true
sudo -u tashmed bash -lc "pm2 save"

echo "==> Laravel queue worker (systemd)"
cat > /etc/systemd/system/tmtu-queue.service <<EOF
[Unit]
Description=TDTUTF Laravel queue worker (redis)
After=network.target redis-server.service postgresql.service
[Service]
User=tashmed
Group=www-data
WorkingDirectory=$APP/apps/api
ExecStart=/usr/bin/php8.4 artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
Restart=always
RestartSec=5
[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now tmtu-queue

echo "==> Laravel scheduler (cron, every minute)"
TMPC="$(mktemp)"
crontab -u tashmed -l 2>/dev/null > "$TMPC" || true
grep -q 'artisan schedule:run' "$TMPC" || echo "* * * * * cd $APP/apps/api && /usr/bin/php8.4 artisan schedule:run >/dev/null 2>&1" >> "$TMPC"
crontab -u tashmed "$TMPC"; rm -f "$TMPC"

echo "==> status"
sudo -u tashmed bash -lc "pm2 list"
systemctl is-active tmtu-queue
echo "SERVICES_DONE_OK"
