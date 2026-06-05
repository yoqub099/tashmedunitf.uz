#!/usr/bin/env bash
# TDTUTF server setup — Stage 1: base tools + package repositories
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

echo "==> [1/5] apt update + base tools"
apt-get update -y
apt-get install -y --no-install-recommends \
  curl wget ca-certificates gnupg lsb-release apt-transport-https \
  software-properties-common unzip acl

echo "==> [2/5] PHP repo (ppa:ondrej/php)"
add-apt-repository -y ppa:ondrej/php

echo "==> [3/5] PostgreSQL 16 repo (PGDG)"
install -d /usr/share/postgresql-common/pgdg
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc
CODENAME="$(lsb_release -cs)"
echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt ${CODENAME}-pgdg main" \
  > /etc/apt/sources.list.d/pgdg.list

echo "==> [4/5] Node.js 20 repo (NodeSource)"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

echo "==> [5/5] apt update (all repos)"
apt-get update -y

echo "STAGE1_DONE_OK"
