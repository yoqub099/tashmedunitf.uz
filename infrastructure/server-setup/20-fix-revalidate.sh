#!/usr/bin/env bash
# TDTUTF — Stage 20: route the web app's own /api/revalidate* (Next) to :3000, not Laravel
set -euo pipefail
cat > /etc/nginx/sites-available/tmtu <<'EOF'
upstream tmtu_web   { server 127.0.0.1:3000; keepalive 32; }
upstream tmtu_admin { server 127.0.0.1:3001; keepalive 32; }

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    root /var/www/tmtu-termiz/apps/api/public;
    index index.php;
    client_max_body_size 200M;
    server_tokens off;

    # Next.js ISR routes (web's own /api/revalidate + /api/revalidate/stream SSE) -> Next, not Laravel
    location /api/revalidate {
        proxy_pass http://tmtu_web;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;          # SSE
        proxy_cache off;
        proxy_read_timeout 3600s;
    }

    location /api/     { try_files $uri /index.php?$query_string; }
    location /storage/ { expires 30d; access_log off; try_files $uri =404; }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_read_timeout 300;
    }

    location / {
        proxy_pass http://tmtu_web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 8080;
    listen [::]:8080;
    server_name _;
    client_max_body_size 200M;
    server_tokens off;
    add_header X-Robots-Tag "noindex, nofollow" always;
    location / {
        proxy_pass http://tmtu_admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
nginx -t && systemctl reload nginx
echo "==> verify routing"
echo "revalidate/stream : $(curl -s -o /dev/null -w '%{http_code}' --max-time 4 http://127.0.0.1/api/revalidate/stream)  (was 404 from Laravel)"
echo "laravel /api/v1/news : $(curl -s -o /dev/null -w '%{http_code}' --max-time 6 http://127.0.0.1/api/v1/news)"
echo "laravel /api/health  : $(curl -s -o /dev/null -w '%{http_code}' --max-time 6 http://127.0.0.1/api/health)"
echo "REVALIDATE_FIX_DONE_OK"
