# Getting Started

> First-time setup for the TMTU Termiz monorepo.

## Prerequisites

| Tool | Version | Purpose | Install |
|------|---------|---------|---------|
| **Node.js** | ≥ 20.0.0 | Runtime | [nvm](https://github.com/nvm-sh/nvm) → `nvm install 20` |
| **pnpm** | ≥ 10.0.0 | Package manager | `npm i -g pnpm@10` |
| **PHP** | 8.3 | Backend runtime | `brew install php@8.3` / `winget install php` |
| **Composer** | 2.x | PHP package manager | [Download](https://getcomposer.org/) |
| **PostgreSQL** | 16 | Database | `brew install postgresql@16` / Docker |
| **Redis** | 7 | Cache + queue + sessions | `brew install redis` / Docker |
| **Git** | ≥ 2.40 | VCS | OS package manager |

### PHP extensions

```bash
# Required PHP extensions
pdo_pgsql, pgsql, gd, zip, intl, bcmath, opcache, exif, pcntl, redis, imagick
```

Verify: `php -m | grep -E 'pdo_pgsql|redis|gd|intl'`

## Quick start

```bash
# 1. Clone
git clone git@github.com:tmtu-termiz/monorepo.git tmtu-termiz
cd tmtu-termiz

# 2. Install Node deps (all workspaces in one go)
pnpm install

# 3. Install PHP deps (backend only)
cd apps/api && composer install && cd ../..

# 4. Copy environment templates
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env

# 5. Fill in real values (DB password, Redis password, REVALIDATION_SECRET)
# Edit the .env files in your IDE.

# 6. Database setup
cd apps/api
php artisan key:generate           # Generate APP_KEY
php artisan storage:link           # Create public/storage symlink (Windows: run as admin)
php artisan migrate                # Run all 40+ migrations
php artisan db:seed                # Seed initial data (roles, permissions, sample content)
cd ../..

# 7. Start everything (Turborepo will parallelize)
pnpm dev
```

You should now have:
- **API** running at http://localhost:8000
- **Web** running at http://localhost:3000
- **Admin** running at http://localhost:3001

Login to admin: `admin@tdtutf.uz` / (set during `db:seed`)

## Common commands

```bash
# Run individual apps
pnpm dev:api          # Just the backend
pnpm dev:web          # Just the public site
pnpm dev:admin        # Just the admin panel

# Build (parallel via Turborepo cache)
pnpm build

# Lint & typecheck
pnpm lint
pnpm typecheck

# Tests
pnpm test                                  # All tests
pnpm --filter @tmtu/api test               # Just backend
pnpm test:e2e                              # Playwright (requires services running)

# Format
pnpm format                                # Prettier on all files

# Docker (full stack)
pnpm docker:up
pnpm docker:logs
pnpm docker:down
```

## Working with workspaces

```bash
# Add a dep to a specific workspace
pnpm --filter @tmtu/web add lodash
pnpm --filter @tmtu/admin add -D @types/lodash

# Add a workspace dep (between packages)
pnpm --filter @tmtu/web add @tmtu/sdk@workspace:*

# Run a script in a specific workspace
pnpm --filter @tmtu/web dev
pnpm --filter @tmtu/api test
```

## Troubleshooting

### "Composer install fails on Windows"

Some PHP extensions (imagick, gd) require system libraries. On Windows:
```bash
# Use the Windows PHP installer that includes pre-built extensions:
# https://windows.php.net/download/
```

### "Storage symlink broken on Windows"

Git doesn't preserve symlinks on Windows. Re-run after every fresh clone:
```bash
cd apps/api
php artisan storage:link
```

Run as **administrator** if it fails.

### "Port already in use"

Backend wants :8000, web wants :3000, admin wants :3001. Check what's running:
```bash
# Windows
netstat -ano | findstr ":8000"

# Mac/Linux
lsof -i :8000
```

### "pnpm install hangs"

Try clearing the store: `pnpm store prune`, then `pnpm install --no-frozen-lockfile`.

### "DB connection refused"

Make sure PostgreSQL is running:
```bash
# Local install
pg_isready

# Or use Docker
docker run -d --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16-alpine
```

### "Redis errors"

Same — ensure Redis is up:
```bash
redis-cli ping   # Should reply PONG

# Or Docker:
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

## Next steps

- Read the [Architecture Overview](../architecture/overview.md)
- Read the [Contributing Guide](../../CONTRIBUTING.md)
- Browse [Architecture Decision Records](../architecture/ADR/)
- For deployment: [deployment guide](./deployment.md)
- For operations: [runbook](./runbook.md)
