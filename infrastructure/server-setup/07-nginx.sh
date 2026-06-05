#!/usr/bin/env bash
# TDTUTF deploy — Stage 7: nginx site (web+api+storage on :80, admin on :8080)
set -euo pipefail

cat > /etc/nginx/sites-available/tmtu <<'EOF'
upstream tmtu_web   { server 127.0.0.1:3000; keepalive 32; }
upstream tmtu_admin { server 127.0.0.1:3001; keepalive 32; }

# ===== web + Laravel API + storage (port 80) =====
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    root /var/www/tmtu-termiz/apps/api/public;
    index index.php;
    client_max_body_size 200M;
    server_tokens off;

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

# ===== admin (port 8080) =====
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

ln -sf /etc/nginx/sites-available/tmtu /etc/nginx/sites-enabled/tmtu
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> API reachability (Laravel via nginx+php-fpm)"
sleep 1
echo "via 127.0.0.1 : $(curl -s -o /dev/null -w '%{http_code}' --max-time 8 http://127.0.0.1/api/health)"
echo "via publicIP  : $(curl -s -o /dev/null -w '%{http_code}' --max-time 8 http://40.47.1.223/api/health)"
echo "health body: $(curl -s --max-time 8 http://127.0.0.1/api/health)"
echo "NGINX_DONE_OK"
