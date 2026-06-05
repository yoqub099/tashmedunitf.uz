# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Official website for **Toshkent Davlat Tibbiyot Universiteti (TMTU) Termiz Filiali**.

Production-grade **monorepo** managed with **Turborepo + pnpm workspaces**.

### Structure

```
tmtu-termiz/
├── apps/
│   ├── api/      → @tmtu/api      Laravel 12, PHP 8.3, Sanctum — port 8000
│   ├── web/      → @tmtu/web      Next.js 16, React 19, Tailwind v4 — port 3000
│   ├── admin/    → @tmtu/admin    Next.js 16 + Tiptap — port 3001
│   └── mobile/   → @tmtu/mobile   (placeholder)
├── packages/
│   ├── types/    → @tmtu/types       Domain TS types (SSOT)
│   ├── sdk/      → @tmtu/sdk         Typed API client
│   ├── ui/       → @tmtu/ui          Design system (skeleton)
│   ├── utils/    → @tmtu/utils       cn, t, formatDate, stripHtml
│   ├── i18n/     → @tmtu/i18n        Translation keys
│   ├── auth/     → @tmtu/auth        Sanctum + RBAC helpers
│   ├── analytics/ → @tmtu/analytics  GA + Yandex adapters
│   └── config/   → @tmtu/eslint-config, @tmtu/tsconfig, @tmtu/prettier-config, @tmtu/tailwind-config
├── e2e/                       → @tmtu/e2e (Playwright + Axe)
├── infrastructure/
│   ├── docker/{configs,images,compose}
│   ├── nginx/, kubernetes/, terraform/, ansible/, monitoring/
├── docs/{architecture/ADR,api,guides,security,changelog}
├── scripts/                   (deploy.sh, docker-safe.sh)
└── tooling/
```

Infrastructure: **PostgreSQL 16**, **Redis 7** (required for cache/session/queue).

## Build & Dev Commands

### Monorepo-wide (Turborepo + pnpm)

```bash
pnpm install                  # Install all workspace deps
pnpm dev                      # Run all apps in parallel
pnpm build                    # Build all apps (cached)
pnpm lint                     # Lint all workspaces
pnpm typecheck                # Type-check all
pnpm test                     # All tests
pnpm format                   # Prettier on everything
```

### Per-app shortcuts

```bash
pnpm dev:api                  # Just backend (:8000)
pnpm dev:web                  # Just public site (:3000)
pnpm dev:admin                # Just admin panel (:3001)
```

### Backend (apps/api/) — Laravel

```bash
cd apps/api
composer install
php artisan key:generate
php artisan storage:link      # Required on Windows after every clone (symlinks)
php artisan migrate
php artisan db:seed
php artisan serve --port=8000
php artisan test --parallel
```

### Frontend / Admin

```bash
pnpm --filter @tmtu/web dev   # or pnpm dev:web
pnpm --filter @tmtu/web build
pnpm --filter @tmtu/web lint
pnpm --filter @tmtu/web typecheck
```

### E2E

```bash
pnpm dev                      # Start all 3 services
pnpm test:e2e                 # In another terminal
```

### Docker (full stack)

```bash
pnpm docker:up                # docker compose -f infrastructure/docker/compose/compose.yml up -d
pnpm docker:logs              # tail -f logs
pnpm docker:down              # Stop all
```

Services: app (Laravel+Nginx), queue worker, scheduler, postgres, redis, web, admin.

## Architecture

### API Structure
- Base: `/api/v1/` — all routes in `apps/api/routes/api.php`
- Public endpoints: news, departments, staff, faculties, directions, FAQs, testimonials, partners, banners, pages, search, contact messages
- Protected endpoints: require Sanctum Bearer token (admin CRUD)
- Auth flow: `POST /api/v1/auth/login` → `{ token, user }`; use `Authorization: Bearer <token>`
- Global middleware: `ApiPerformance`, throttle (120 req/min)
- Controllers in `apps/api/app/Http/Controllers/Api/`
- **Service Layer Pattern:** Controller → FormRequest → Service → Model → Resource

### Backend Key Packages
- **Spatie Media Library** — file/image uploads on all content models
- **Spatie Translatable** — multi-language content (uz/ru/en) stored as JSONB columns
- **Spatie Permission** — role-based access control (3 roles, 30 permissions)
- **Spatie Sluggable** — auto-generated slugs
- **Spatie Query Builder** — filtering/sorting on API endpoints
- **Sanctum** — Bearer token auth

### Frontend (apps/web/)
- **Next.js 16** App Router + Turbopack + React Compiler
- **i18n:** `[locale]` segment (uz/ru/en) in `apps/web/src/app/[locale]/`
- **Zustand** for client state (`src/store/`)
- **TanStack Query** for server state / API
- **React Hook Form** + **Zod** for forms
- **Framer Motion** for animations
- **Leaflet** for maps
- **isomorphic-dompurify** for XSS sanitization
- **SEO:** `seo.ts` (1183 lines), JSON-LD schemas, dynamic `sitemap.ts`/`robots.ts`
- Security headers (CSP, HSTS, X-Frame-Options) in `next.config.ts`

### Admin (apps/admin/)
- Same stack as frontend + **Tiptap** rich text editor
- **Inline-edit system:** EditableWrapper + EditModal + LanguageTabs (WordPress-style)
- 20+ CRUD interfaces for backend models
- Auth middleware in `src/middleware.ts` (cookie-based, `js-cookie`)
- Triggers frontend ISR via `/api/revalidate` webhook

### Shared Packages
- `@tmtu/types` — Single source of truth for entity TS types
- `@tmtu/sdk` — Typed API client (`TmtuApiClient`)
- `@tmtu/utils` — Helpers: `cn()`, `t()`, `formatDate()`, `stripHtml()`
- `@tmtu/auth` — `hasPermission()`, `hasRole()` guards
- `@tmtu/ui` — Design system (skeleton — to be built)
- `@tmtu/i18n` — Locale helpers
- `@tmtu/analytics` — GA + Yandex Metrika adapters

### Database
- **PostgreSQL 16** with 48 migrations in `apps/api/database/migrations/`
- 24 Eloquent models in `apps/api/app/Models/`
- 45 total tables (20 seeders, 11 factories)
- Translatable fields → JSONB (GIN-indexed for full-text search)
- BRIN indexes on `created_at` for time-series queries
- Pages support hierarchical tree structure
- Spatie media table for polymorphic file attachments

### Environment Variables
- **Root:** `.env` (shared dev config — never committed)
- **Backend:** `apps/api/.env` — DB, Redis, Sanctum stateful domains, mail
- **Web:** `apps/web/.env` — `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
- **Admin:** `apps/admin/.env` — `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` (note: includes `/v1`!)
- Copy from `.env.example` in each directory

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`):
1. **api** job: PostgreSQL + Redis services, composer install, Pint, PHPStan level 5, PHPUnit parallel tests
2. **frontend** job: pnpm install (workspace-aware), Turborepo lint/typecheck/build with cache
3. **e2e** job: Playwright (on `main` branch or `run-e2e` PR label)
4. **docker** job: Build api/web/admin images (verification on main)
5. **deploy** job: SSH deploy via `scripts/deploy.sh docker` (manual production approval gate)

## Critical Notes

- **Windows symlinks:** `php artisan storage:link` must be run after every clone. Without it, uploaded images won't display. Run as admin if it fails.
- **Redis is required:** Backend won't function without Redis (cache, sessions, queue).
- **API URL difference:** Web uses `/api`, admin uses `/api/v1` — check `.env.example` files.
- **Multilingual content:** All translatable fields store JSONB `{uz: "...", ru: "...", en: "..."}`. Use Spatie Translatable methods.
- **Path conventions in monorepo:**
  - Backend → `apps/api/`
  - Public website → `apps/web/`
  - Admin → `apps/admin/`
  - Shared libs → `packages/<name>/`
  - Docker configs → `infrastructure/docker/configs/`
  - Compose → `infrastructure/docker/compose/compose.yml`
  - Dockerfile → `infrastructure/docker/images/Dockerfile.api`
- **Conventional Commits required** (commitlint + husky enforce this)
- **pnpm workspace** — use `pnpm --filter @tmtu/<name>` to run scripts in specific app

## Architectural Decisions

See `docs/architecture/ADR/` for the reasoning behind major decisions:
- [ADR-0001](./docs/architecture/ADR/0001-monorepo-migration.md) — Monorepo migration with apps/ + packages/ structure
