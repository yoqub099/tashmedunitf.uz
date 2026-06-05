#!/bin/bash
# ╔══════════════════════════════════════════════════════════╗
# ║  XAVFSIZ Docker boshqaruv skripti                       ║
# ║  Bu skript docker compose down -v ni OLDINI OLADI       ║
# ║  va faqat xavfsiz amallarni bajaradi                    ║
# ╠══════════════════════════════════════════════════════════╣
# ║  Foydalanish:                                           ║
# ║    ./docker-safe.sh up       - Xizmatlarni ishga        ║
# ║    ./docker-safe.sh down     - Xizmatlarni to'xtatish   ║
# ║    ./docker-safe.sh restart  - Qayta ishga tushirish     ║
# ║    ./docker-safe.sh rebuild  - Qayta build qilish        ║
# ║    ./docker-safe.sh backup   - To'liq backup olish       ║
# ║    ./docker-safe.sh status   - Status ko'rish            ║
# ╚══════════════════════════════════════════════════════════╝

set -e

# Monorepo: always target the compose file under infrastructure/, regardless of CWD.
# Setting COMPOSE_FILE makes every `docker compose` call below resolve correctly.
export COMPOSE_FILE="$(cd "$(dirname "$0")/.." && pwd)/infrastructure/docker/compose/compose.yml"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

case "$1" in
    up)
        echo -e "${GREEN}🚀 Xizmatlar ishga tushirilmoqda...${NC}"
        docker compose up -d
        echo -e "${GREEN}✅ Barcha xizmatlar ishga tushdi${NC}"
        ;;
    down)
        echo -e "${YELLOW}⚠️  Xizmatlar to'xtatilmoqda (MA'LUMOTLAR SAQLANADI)${NC}"
        docker compose down
        echo -e "${GREEN}✅ Xizmatlar to'xtatildi. Volume lar xavfsiz.${NC}"
        ;;
    restart)
        echo -e "${YELLOW}🔄 Xizmatlar qayta ishga tushirilmoqda...${NC}"
        docker compose down
        docker compose up -d
        echo -e "${GREEN}✅ Qayta ishga tushdi${NC}"
        ;;
    rebuild)
        echo -e "${YELLOW}🔨 Qayta build qilinmoqda...${NC}"
        docker compose down
        docker compose build --no-cache
        docker compose up -d
        echo -e "${GREEN}✅ Qayta build va ishga tushdi${NC}"
        ;;
    backup)
        echo -e "${GREEN}📦 To'liq backup olinmoqda...${NC}"
        docker compose exec app php artisan backup:full
        echo -e "${GREEN}✅ Backup tayyor${NC}"
        ;;
    status)
        echo -e "${GREEN}📊 Xizmatlar holati:${NC}"
        docker compose ps
        echo ""
        echo -e "${GREEN}📀 Volume lar:${NC}"
        docker volume ls --filter name=tmtu
        ;;
    destroy-volumes)
        echo -e "${RED}╔══════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║  ⛔ XAVFLI AMAL! BARCHA MA'LUMOTLAR         ║${NC}"
        echo -e "${RED}║     O'CHIB KETADI!                          ║${NC}"
        echo -e "${RED}╚══════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${RED}Bu amalni bajarish uchun avval:${NC}"
        echo "  1. php artisan backup:full"
        echo "  2. Backup fayllarini tekshiring"
        echo ""
        read -p "DESTROY-ALL-DATA yozing: " confirm
        if [ "$confirm" = "DESTROY-ALL-DATA" ]; then
            docker compose down -v
            echo -e "${RED}⚠️  Barcha volume lar o'chirildi${NC}"
        else
            echo -e "${GREEN}❌ Bekor qilindi${NC}"
        fi
        ;;
    *)
        echo "Foydalanish: $0 {up|down|restart|rebuild|backup|status|destroy-volumes}"
        echo ""
        echo "  up              - Xizmatlarni ishga tushirish"
        echo "  down            - Xizmatlarni to'xtatish (volume lar saqlanadi)"
        echo "  restart         - Qayta ishga tushirish"
        echo "  rebuild         - Qayta build + ishga tushirish"
        echo "  backup          - To'liq backup olish"
        echo "  status          - Xizmatlar va volume holati"
        echo "  destroy-volumes - ⛔ XAVFLI: Barcha volume larni o'chirish"
        exit 1
        ;;
esac
