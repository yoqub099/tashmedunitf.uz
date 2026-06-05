# Architecture Overview

> High-level architecture of the TMTU Termiz monorepo.
> For specific decisions, see [ADRs](./ADR/).

## System Context (C4 Level 1)

```
┌──────────────┐         ┌──────────────┐
│  Public user │────────▶│   web (Next) │
│  (Uz/Ru/En)  │         │   :3000      │
└──────────────┘         └──────┬───────┘
                                │ REST
                                ▼
┌──────────────┐         ┌──────────────┐
│  Admin user  │────────▶│ admin (Next) │
│  (auth req'd)│         │  :3001       │
└──────────────┘         └──────┬───────┘
                                │ REST + Bearer
                                ▼
                         ┌──────────────┐
                         │ api (Laravel)│◀────┐
                         │  :8000       │     │
                         └──────┬───────┘     │
                                │             │ Cache invalidation
                  ┌─────────────┼─────────────┤ (Observer pattern)
                  ▼             ▼             ▼
            ┌──────────┐  ┌──────────┐  ┌──────────┐
            │ Postgres │  │  Redis   │  │  Storage │
            │  :5432   │  │  :6379   │  │  (media) │
            └──────────┘  └──────────┘  └──────────┘
```

## Container Diagram (C4 Level 2)

### Backend (`apps/api/`)
- **Laravel 12** (PHP 8.3 with JIT)
- **API Layer:** `/api/v1/*` (146 endpoints)
- **Service Layer Pattern:** Controller → FormRequest → Service → Model → Resource
- **Multilingual:** Spatie Translatable + PostgreSQL JSONB (`{uz, ru, en}`)
- **Media:** Spatie Media Library (18+ collections)
- **Auth:** Sanctum Bearer + Spatie Permission (3 roles, 30 permissions)
- **Cache:** Redis + Observer pattern (auto-invalidation on Eloquent events)

### Public Website (`apps/web/`)
- **Next.js 16** (App Router + Turbopack + React Compiler)
- **i18n:** URL-based routing `/[locale]/*` (uz/ru/en)
- **Rendering:** SSG + ISR (60s fallback) + on-demand revalidation
- **State:** Zustand (UI, language, a11y) + TanStack Query (server)
- **SEO:** Full JSON-LD (Organization, NewsArticle, FAQ, BreadcrumbList, Person, Course)
- **A11y:** WCAG 2.1 AA panel (font, colors, spacing, skip-to-content)

### Admin Panel (`apps/admin/`)
- **Same Next.js stack** + **Tiptap** rich editor
- **Inline-edit system:** `EditableWrapper` (hover overlay) + `EditModal` + `LanguageTabs`
- **20+ CRUDs:** News, Banner, Partner, Testimonial, Staff, Department, ...
- **ISR webhook:** Triggers `/api/revalidate` on save → frontend refreshes

### Shared Packages
- **`@tmtu/types`** — Domain entities (News, Faculty, Staff, ...) + API envelopes
- **`@tmtu/sdk`** — Typed API client (`TmtuApiClient`)
- **`@tmtu/ui`** — Design system (Storybook)
- **`@tmtu/utils`** — `cn()`, `t()`, `formatDate()`, `stripHtml()`
- **`@tmtu/i18n`** — Translation keys + locale helpers
- **`@tmtu/auth`** — Sanctum-compatible auth helpers + RBAC guards
- **`@tmtu/analytics`** — GA + Yandex Metrika adapters
- **`@tmtu/config`** — Shared eslint, tsconfig, prettier, tailwind

## Data Flow

### Request flow (read)

```
User → web → @tmtu/sdk → api → Redis cache (hit?) → DB
                                       │
                                       └── 60s ISR cache → Browser
```

### Request flow (admin write)

```
Admin → admin → @tmtu/sdk → api → DB
                                   │
                                   ├── Observer fires → Redis invalidate
                                   └── Response
                              ┌────┘
                              ▼
                    admin's /api/revalidate webhook
                              │
                              ▼
                    web's /api/revalidate (with secret)
                              │
                              ▼
                    revalidateTag(['news', ...]) + revalidatePath('/')
                              │
                              ▼
                    AutoRefresh polling (2s) detects version bump → router.refresh()
```

## Deployment

### Local (development)

```bash
pnpm dev   # Runs api + web + admin in parallel via Turborepo
```

### Docker (testing production-like)

```bash
pnpm docker:up   # Spins up 7 services: app, queue, scheduler, postgres, redis, web, admin
```

### Production

See [DEPLOYMENT.md](../guides/deployment.md) and the [runbook](../guides/runbook.md).

## Decisions

See [ADR index](./ADR/README.md).

## Diagrams

See [diagrams/](./diagrams/) for source PlantUML / Mermaid files.
