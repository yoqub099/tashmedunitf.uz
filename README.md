# TMTU Termiz Monorepo

> Toshkent Davlat Tibbiyot Universiteti **Termiz filiali** — rasmiy veb-sayt va admin panel.
> Official monorepo for Tashkent State Medical University, Termiz Branch.

[![CI](https://github.com/tmtu-termiz/monorepo/actions/workflows/ci.yml/badge.svg)](https://github.com/tmtu-termiz/monorepo/actions)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](./LICENSE)

🌐 **Production:** [https://tashmedunitf.uz](https://tashmedunitf.uz)

---

## 🏛 Architecture

This is a **production-grade monorepo** managed with **pnpm workspaces** + **Turborepo**.

```
tmtu-termiz/
├── apps/                  # Deployable applications
│   ├── api/               # Laravel 12 REST API           (port 8000)
│   ├── web/               # Next.js 16 public website     (port 3000)
│   ├── admin/             # Next.js 16 admin panel        (port 3001)
│   └── mobile/            # React Native / Expo (planned)
│
├── packages/              # Shared libraries
│   ├── types/             # TypeScript domain types (SSOT)
│   ├── sdk/               # Typed API client (Laravel → TS)
│   ├── ui/                # Design system (Storybook)
│   ├── utils/             # Shared utilities (cn, t, formatDate)
│   ├── i18n/              # Translations (uz/ru/en)
│   ├── auth/              # Auth helpers (Sanctum-compatible)
│   ├── analytics/         # GA + Yandex Metrika adapters
│   └── config/            # Shared eslint, tsconfig, prettier, tailwind
│
├── e2e/                   # Playwright end-to-end tests
│
├── infrastructure/        # Infrastructure as Code
│   ├── docker/            # Dockerfiles + compose files
│   ├── nginx/             # Reverse proxy configs
│   ├── kubernetes/        # K8s manifests (future)
│   ├── terraform/         # Cloud provisioning (future)
│   ├── ansible/           # VPS configuration (future)
│   └── monitoring/        # Prometheus + Grafana + Loki
│
├── docs/                  # Project documentation
│   ├── architecture/      # ADRs, C4 diagrams
│   ├── api/               # OpenAPI specs
│   ├── guides/            # Dev guides, deployment, runbook
│   └── security/          # Security policies
│
├── scripts/               # Build & deploy scripts
└── tooling/               # Build/dev tools
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20.0.0 (`.nvmrc`)
- **pnpm** ≥ 9.0.0
- **PHP** 8.3 with `pdo_pgsql`, `redis`, `gd`, `intl`, `bcmath`, `opcache`
- **Composer** 2.x
- **PostgreSQL** 16
- **Redis** 7

### Install

```bash
# 1. Install Node.js dependencies (all apps + packages)
pnpm install

# 2. Install PHP dependencies (backend)
cd apps/api && composer install && cd ../..

# 3. Copy environment templates
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env

# 4. Backend setup (Laravel)
cd apps/api
php artisan key:generate
php artisan storage:link
php artisan migrate
php artisan db:seed
cd ../..
```

### Development

```bash
# Run all apps in parallel (Turborepo)
pnpm dev

# Or individually:
pnpm dev:api       # Backend on :8000
pnpm dev:web       # Public site on :3000
pnpm dev:admin     # Admin panel on :3001
```

### Build

```bash
pnpm build         # Build all apps
pnpm lint          # Lint all packages
pnpm typecheck     # Type-check all packages
pnpm test          # Run all tests
```

### Docker

```bash
pnpm docker:up     # Start full stack
pnpm docker:logs   # Tail logs
pnpm docker:down   # Stop stack
```

---

## 📦 Workspaces

All apps and packages use the `@tmtu/` namespace:

| Workspace | Location | Purpose |
|-----------|----------|---------|
| `@tmtu/api` | `apps/api/` | Laravel REST API |
| `@tmtu/web` | `apps/web/` | Public Next.js site |
| `@tmtu/admin` | `apps/admin/` | Admin panel |
| `@tmtu/mobile` | `apps/mobile/` | Mobile (planned) |
| `@tmtu/types` | `packages/types/` | Shared TS types |
| `@tmtu/sdk` | `packages/sdk/` | API client |
| `@tmtu/ui` | `packages/ui/` | Design system |
| `@tmtu/utils` | `packages/utils/` | Shared utilities |
| `@tmtu/i18n` | `packages/i18n/` | Translations |
| `@tmtu/auth` | `packages/auth/` | Auth helpers |
| `@tmtu/analytics` | `packages/analytics/` | Tracking adapters |
| `@tmtu/e2e` | `e2e/` | Playwright tests |

---

## 🧪 Testing

```bash
# Unit + Feature tests (backend)
pnpm --filter @tmtu/api test

# Frontend type checking
pnpm --filter @tmtu/web typecheck

# E2E tests (requires all services running)
pnpm dev               # Start all services
pnpm test:e2e          # In another terminal
```

---

## 📚 Documentation

- [Architecture Overview](./docs/architecture/overview.md)
- [Architecture Decision Records](./docs/architecture/ADR/)
- [Deployment Guide](./docs/guides/deployment.md)
- [SEO Strategy](./docs/guides/seo-strategy.md)
- [Security Policy](./docs/security/security.md)
- [Contributing](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

---

## 🛠 Tech Stack

### Backend (`apps/api/`)
- **Laravel 12** + PHP 8.3 with JIT
- **PostgreSQL 16** (JSONB for translatable fields)
- **Redis 7** (cache, sessions, queue)
- **Spatie:** Permission, Media Library, Translatable, Sluggable, Query Builder
- **Sanctum** (Bearer token auth)

### Frontend (`apps/web/`, `apps/admin/`)
- **Next.js 16** App Router + Turbopack + React Compiler
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** (CSS-first)
- **Zustand** + **TanStack Query**
- **React Hook Form** + **Zod**
- **Framer Motion**
- **Leaflet** (maps)
- **Tiptap** (admin rich text)

### Infrastructure
- **Docker Compose** (7 services: app, queue, scheduler, postgres, redis, web, admin)
- **Nginx** (reverse proxy, static serving, gzip, 365-day immutable cache)
- **GitHub Actions** (CI/CD)
- **Supervisor** (PHP-FPM + Nginx in container)

---

## 🔐 Security

- ❌ **Never commit `.env` files** — use a secrets manager (Doppler/Vault)
- ❌ **Never commit database backups** — they contain PII
- ✅ Use **GitHub Secrets** for CI/CD
- ✅ Rotate credentials regularly
- ✅ Enable 2FA for admin accounts

See [SECURITY.md](./SECURITY.md) for the full policy and disclosure process.

---

## 📜 License

This project is **proprietary** — © 2024-2026 Toshkent Davlat Tibbiyot Universiteti Termiz filiali. All rights reserved.

---

## 🤝 Contributing

This is a private project for the official website. External contributions are not accepted.
For internal contributors, see [CONTRIBUTING.md](./CONTRIBUTING.md).
