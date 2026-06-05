#!/usr/bin/env bash
# TDTUTF deploy — Stage 11: UFW firewall (SSH allowed FIRST to avoid lockout)
set -euo pipefail
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP web/api'
ufw allow 8080/tcp comment 'admin panel'
ufw allow 443/tcp comment 'HTTPS (future SSL)'
ufw --force enable
echo "==> status (5432/6379/3000/3001 stay LOCAL-only) =="
ufw status verbose
echo "FIREWALL_DONE_OK"
