#!/usr/bin/env bash
# ============================================================
# TMTU Termiz — Production deployment script
#
# Supports two deployment modes:
#   - bare:   bare-metal (PM2 + Supervisor + php-fpm + nginx)
#   - docker: containerized (docker compose)
#
# Usage:
#   ./scripts/deploy.sh [bare|docker]
#
# Default mode: bare (legacy compatibility)
# ============================================================

set -euo pipefail

# ----- Configuration -----
MODE="${1:-bare}"
PROJECT_DIR="${PROJECT_DIR:-/var/www/tmtu-termiz}"
API_DIR="$PROJECT_DIR/apps/api"
WEB_DIR="$PROJECT_DIR/apps/web"
ADMIN_DIR="$PROJECT_DIR/apps/admin"
LOG_FILE="$PROJECT_DIR/logs/deploy-$(date +%Y%m%d-%H%M%S).log"

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

# ----- Helpers -----
log()  { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"; }
ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
fail() { echo -e "${RED}✗${NC}  $*" >&2; exit 1; }

# ----- Pre-flight checks -----
[ -d "$PROJECT_DIR" ] || fail "Project directory not found: $PROJECT_DIR"
[ -d "$API_DIR" ] || fail "API directory not found: $API_DIR"
mkdir -p "$(dirname "$LOG_FILE")"
exec > >(tee -a "$LOG_FILE") 2>&1

cat <<EOF

╔══════════════════════════════════════════════════════════╗
║   TMTU DEPLOY — Mode: $MODE — $(date '+%Y-%m-%d %H:%M:%S')        ║
╚══════════════════════════════════════════════════════════╝

EOF

cd "$PROJECT_DIR"

# ============================================================
# 1. Git pull
# ============================================================
log "Pulling latest code..."
CURRENT_BRANCH=$(git branch --show-current)
git fetch origin
git pull origin "$CURRENT_BRANCH" --no-edit
ok "Code updated to $(git rev-parse --short HEAD) on $CURRENT_BRANCH"

# ============================================================
# 2. Deploy based on mode
# ============================================================
case "$MODE" in
  docker)
    log "Building Docker images..."
    docker compose -f infrastructure/docker/compose/compose.yml build --pull
    ok "Images built"

    log "Restarting services..."
    docker compose -f infrastructure/docker/compose/compose.yml up -d --remove-orphans
    ok "Services up"

    log "Running migrations..."
    docker compose -f infrastructure/docker/compose/compose.yml exec -T app php artisan migrate --force
    ok "Migrations applied"

    log "Warming Laravel caches..."
    docker compose -f infrastructure/docker/compose/compose.yml exec -T app sh -c \
      "php artisan config:cache && php artisan route:cache && php artisan view:cache"
    ok "Caches warm"

    log "Linking storage..."
    docker compose -f infrastructure/docker/compose/compose.yml exec -T app php artisan storage:link || true
    ok "Storage linked"
    ;;

  bare)
    # ----- 2a. Install dependencies -----
    log "Installing PHP dependencies..."
    cd "$API_DIR"
    composer install --no-dev --optimize-autoloader --no-interaction
    ok "Composer deps installed"

    log "Installing JS dependencies (workspace-aware)..."
    cd "$PROJECT_DIR"
    pnpm install --frozen-lockfile --prod=false
    ok "pnpm deps installed"

    # ----- 2b. Database migration -----
    log "Running database migrations..."
    cd "$API_DIR"
    php artisan migrate --force
    ok "Migrations applied"

    # ----- 2c. Build apps (parallel via Turborepo) -----
    log "Building web + admin (Turborepo parallel)..."
    cd "$PROJECT_DIR"
    pnpm turbo build --filter=@tmtu/web --filter=@tmtu/admin
    ok "Apps built"

    # ----- 2d. Laravel cache refresh -----
    log "Refreshing Laravel caches..."
    cd "$API_DIR"
    php artisan optimize:clear
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan storage:link 2>/dev/null || true
    ok "Caches refreshed"

    # ----- 2e. Restart processes -----
    log "Restarting services..."

    if command -v pm2 >/dev/null; then
      pm2 restart all --update-env
      ok "PM2 (Next.js) restarted"
    else
      warn "PM2 not found — skipping Next.js restart"
    fi

    if command -v supervisorctl >/dev/null; then
      sudo supervisorctl restart all
      ok "Supervisor (queue/scheduler) restarted"
    else
      warn "supervisorctl not found — skipping queue restart"
    fi

    if command -v nginx >/dev/null; then
      sudo nginx -t && sudo nginx -s reload
      ok "Nginx reloaded"
    else
      warn "nginx not found — skipping reload"
    fi

    if [ -f /var/run/php-fpm.pid ]; then
      sudo kill -USR2 "$(cat /var/run/php-fpm.pid)"
      ok "PHP-FPM gracefully reloaded (opcache cleared)"
    fi
    ;;

  *)
    fail "Unknown mode: $MODE (expected 'bare' or 'docker')"
    ;;
esac

# ============================================================
# 3. Health checks
# ============================================================
log "Running health checks..."

check_url() {
  local name=$1 url=$2 expected=${3:-200}
  local code
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$url" || echo "000")
  if [ "$code" = "$expected" ]; then
    ok "$name → $code"
  else
    warn "$name → $code (expected $expected)"
  fi
}

sleep 5
check_url "API health"      "http://localhost:8000/api/health"
check_url "Web home"        "http://localhost:3000/"
check_url "Admin login"     "http://localhost:3001/login"

# ============================================================
# 4. Summary
# ============================================================
cat <<EOF

╔══════════════════════════════════════════════════════════╗
║   DEPLOY COMPLETE — $(date '+%Y-%m-%d %H:%M:%S')                  ║
║   Mode: $MODE                                                 ║
║   Log:  $LOG_FILE                              ║
╚══════════════════════════════════════════════════════════╝

EOF
