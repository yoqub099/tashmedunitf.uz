# TMTU Termiz — Project Deep Dive (verified 2026-06-05)

> Canonical, **monorepo-accurate** knowledge base produced from a 16-agent deep read of every
> app, package, infra config, CI job, doc and test, plus 3 cross-cutting synthesis passes.
> Unlike `ARCHITECTURE_STUDY.md` (written against the pre-migration `backend/`/`frontend/`/`admin/`
> layout), every path here matches the current `apps/`+`packages/` structure and was verified on disk.

---

## 1. What this is

Official website for **Toshkent Davlat Tibbiyot Universiteti (TMTU) — Termiz Filiali**.
A production-grade Turborepo + pnpm monorepo:

| App | Pkg | Stack | Port |
|-----|-----|-------|------|
| `apps/api` | `@tmtu/api` | Laravel 12, PHP 8.3, Sanctum, Spatie suite, PostgreSQL 16 + Redis 7 | 8000 |
| `apps/web` | `@tmtu/web` | Next.js 16 App Router, React 19, Tailwind v4, TanStack Query, Zustand | 3000 |
| `apps/admin` | `@tmtu/admin` | Next.js 16 + Tiptap, WordPress-style inline edit | 3001 |
| `apps/mobile` | `@tmtu/mobile` | placeholder (all-echo scripts) | — |

Shared: `packages/{types,sdk,utils,auth,i18n,analytics,ui,config}`; `e2e/` (Playwright+Axe);
`infrastructure/{docker,nginx}`; `docs/`; `scripts/`.

### 60-second mental model

The **admin** edits content → the **API** is source of truth → the **web** app displays it.
When admin saves, a secret-gated webhook surgically invalidates the public site's ISR cache so
changes appear live in ~2 s.

```
Visitor ──/uz,/ru,/en──▶ web :3000 ──GET .../api/v1/*──▶ Laravel :8000 ──▶ PostgreSQL + Redis
Editor  ──login+edit──▶ admin :3001 ──CRUD .../api/v1/*─▶ Laravel :8000
admin ──POST /api/revalidate (secret)──▶ web   web ──version poll every 2s──▶ visitor (live update)
```

**Six facts to internalise immediately:**
1. **Redis is mandatory** — cache, sessions AND queue all use it.
2. **All content is trilingual** JSONB `{uz,ru,en}` (Spatie Translatable). Never a bare string.
3. **web uses `/api`, admin uses `/api/v1`** — the #1 misconfiguration (see §4).
4. **Windows needs `php artisan storage:link`** after every clone or images 404.
5. **Conventional Commits enforced** via husky + commitlint.
6. **Only `@tmtu/utils` (cn) is actually wired in** — sdk/auth/i18n/analytics/ui + all config packages are unused scaffolding (see §5).

---

## 2. Per-area map (all 16 areas)

### Backend (`apps/api`)
- **Data model** — 24 Eloquent models / ~45 tables. Trait stack `HasFactory (+HasSlug)(+HasTranslations)(+InteractsWithMedia) +SoftDeletes`. Translatable → JSONB; polymorphic Spatie media split across **public** vs **local/private** disks (all of `JobApplication`'s 13 collections, `Staff.private_docs`, `Page.private_docs`). Index keystone: `2026_02_21_000001_add_performance_indexes.php` (mass JSON→JSONB, GIN `jsonb_path_ops`, BRIN on `created_at`, partial/composite). `Page` = adjacency-list + materialized path (`boot()` computes depth/path). Per-model observers flush Redis + fire ISR after commit.
- **HTTP layer** — `routes/api.php` (357 lines, route order load-bearing): `/api/health` + a `/v1` group behind `ApiPerformance` + `throttle:120,1`; public routes, then `auth:sanctum`, then Spatie `role:super-admin|admin`. 28 controllers extend `BaseController` → uniform `{success,message,data,meta,links}` envelope. Pattern: Route → middleware → FormRequest → thin Controller → Service → Model → Resource. Auth hardened (login lockout, anti-enumeration reset, 24 h token rotation).
- **Service layer** — ~30 near-identical CRUD services (Spatie QueryBuilder reads + `CacheService::remember`; `DB::transaction` writes with auto-WebP). `CacheService` (Redis tag flush, 4 TTL tiers, file-driver fallback), `SearchService` (GIN JSONB ILIKE prefix search ×6 entities), `MediaUploadService` (986-line hardened pipeline), `FrontendRevalidationService` (ISR webhook bridge), `HtmlSanitizer` (**only wired into Faculty/Direction!**).
- **Platform/config** — slim `bootstrap/app.php` (exception→JSON, Spatie aliases), single `AppServiceProvider` (observer wiring + `preventLazyLoading`), RBAC **3 roles / 47 permissions** seeded in `DatabaseSeeder` (CLAUDE.md's "30" is stale), 14 Artisan commands on a 9-job cron, PHPStan L5 over a 319-entry frozen baseline, Feature-only PHPUnit (Postgres-dependent).

### Public web (`apps/web`)
- **Routing/IA** — ~99 `page.tsx`, hand-rolled `/uz|/ru|/en` prefix i18n via `middleware.ts` (no i18n lib), `(main)` route group adds chrome, `[...slug]` catch-all renders arbitrary CMS pages (DOMPurify'd). 3-level layout chain; only `[locale]/layout.tsx` has `generateStaticParams`. SEO via `lib/seo.ts` + locale-prefixed `sitemap.ts`/`robots.ts`/`opengraph-image.tsx`.
- **Components** — two tiers: pure Tailwind primitives (`shared/`) + feature/section components (Server when data-only, Client when interactive). Template system = just `NavHub` + `DocumentDetail` (latter reused by 30+ regulatory-doc pages). Strong a11y subsystem (portal panel, pre-hydration FOUC guard, focus trap, cross-tab sync). `AutoRefresh` polls `/api/revalidate/stream` every 2 s.
- **Data/SEO/state** — bespoke `api.ts` fetch client (NOT `@tmtu/sdk`) + ~30 `services.ts` wrappers; env-aware ISR caching; i18n dual-source: 4142-line `i18n.ts` `s()` dict overlaid by DB translations + per-record `t()`; 3 Zustand stores; `next.config.ts` = HSTS/X-Frame/**minimal CSP** + image remotePatterns.

### Admin (`apps/admin`)
- **Routing/CRUD** — `(dashboard)` group, ~80 pages whose paths **mirror the public uz slugs** so admins edit a visual clone. Thin pages → ~22 reusable `*CrudAdmin` templates (FacultiesCrudAdmin serves 4 routes); a few fat 1000+-line inline-edit clones. `/` = editable homepage clone; real hub is `/dashboard`.
- **Inline-edit/Tiptap** — `EditableWrapper` (hover overlay) → universal `EditModal` (FieldConfig schema, replaces ~20 forms) + `LanguageTabs` (uz/ru/en) → Tiptap `RichTextEditor`. Serializes one multipart FormData (`field[uz]` keys, `_method=PUT` spoof, `remove_*`/`remove_media_ids[]`).
- **Auth/data** — `middleware.ts` **format-checks** the `admin-token` cookie only (regex, no API call); token also in localStorage (XSS-reachable); real enforcement = axios 401 interceptor. ~29 per-entity TanStack hook+service pairs; every mutation fires `revalidateFrontend` → secret-injecting admin proxy → web. Admin re-declares 668 lines of types instead of importing `@tmtu/types`.

### Shared packages
Mostly **aspirational scaffolding** — every package private/0.1.0, raw TS source, no build/tests. Apps consume **only `@tmtu/utils` (cn)** + `@tmtu/types` via `transpilePackages`. `@tmtu/sdk` (6 resources, list/show only, throws a non-Error object), `auth`, `i18n`, `analytics` (interface only — real GA/Yandex lives in `apps/web`), `ui` (broken `styles.css` export), and **all `packages/config/*`** are unconsumed; apps use their own flat ESLint + ES2017 tsconfigs that don't extend `tsconfig.base.json`.

### Infra / CI / docs / e2e / root
- **Docker** — 7-service compose; one multi-stage `Dockerfile.api` reused as app/queue/scheduler; in-container nginx serves `/storage` off disk + proxies php-fpm:9000; tuned PG16 + Redis7. **In-flight reorg**: Dockerfiles moved to `infrastructure/docker/images/`, repo-root build context, Next standalone output.
- **CI/CD** — single `ci.yml`, 5 jobs (api / frontend / e2e / docker / deploy). e2e job rewritten to stand up the full stack. pnpm bumped 9→10.28.2. Husky + commitlint Conventional Commits. Versions triple-pinned (`.tool-versions`, `.nvmrc`, `package.json`).
- **Docs** — rich corpus + **de-facto risk register** (two verification passes). 5 most valuable analysis docs are **untracked** (git `??`).
- **E2E** — `@tmtu/e2e`, 9 numbered specs (~80 tests), Playwright setup-project stored auth, fully serial (dodges 120/min throttle), Axe WCAG scans.
- **Root** — `turbo run *` wrappers + `pnpm --filter` escapes; env-allowlisted Turbo pipeline; the env-var contract (§4).

---

## 3. The five end-to-end data flows

1. **Request** — `services.ts`/axios → `ApiPerformance` (ETag/Cache-Control/Vary) → Controller → FormRequest → Service → `CacheService` (Redis) → Model → Resource → `BaseController::success()`. `@tmtu/sdk` is **dormant**; web=`/api`, admin=`/api/v1`.
2. **Auth** — `POST /v1/auth/login` → Sanctum token → admin stores it in localStorage **and** a JS-readable `admin-token` cookie → edge `middleware.ts` (format-only) → `auth:sanctum` → Spatie role MW. The `editor` role is authorized in some FormRequests but has **no routes** (dead surface).
3. **Revalidation/ISR** — admin mutation → `revalidateFrontend()` → admin proxy injects `REVALIDATION_SECRET` → web `/api/revalidate` → `revalidateTag` + `revalidatePath` (uz/ru/en) → `notifyUpdate()` bumps a `globalThis` version → `AutoRefresh` 2 s poll → `router.refresh()`. The "stream" is **polling, not SSE**, and the version is **per-process** (won't sync across replicas). A backend observer trigger (`FrontendRevalidationService`) is the second, authoritative path.
4. **Multilingual** — JSONB `{uz,ru,en}` → Spatie Translatable → Resource emits full map → middleware `x-locale` header/cookie → `getLanguage()` → `t()` (content) / `s()` (UI chrome, with DB override cached in a **never-invalidated module global**). `@tmtu/i18n` is unused.
5. **Media** — `MediaController@upload` → `MediaUploadService` (MIME×ext cross-check, double-extension + SVG-XSS blocks, sanitized filename) → auto-WebP → Spatie `addMedia` → `MediaPathGenerator` `{model}/{id}/{collection}/` → storage symlink → nginx direct serve (public) or PHP `download`/`stream` 206 (private). **Private download/stream lack per-resource ACL.**

---

## 4. The ENV-VAR contract (load-bearing)

```
apps/web/.env    NEXT_PUBLIC_API_URL = http://localhost:8000/api        (NO /v1)
apps/admin/.env  NEXT_PUBLIC_API_URL = http://localhost:8000/api/v1     (WITH /v1)
```
- web appends paths to `/api` and derives the image origin via `API_BASE = url.replace('/api','')` ⚠️ (corrupts a host containing `api`).
- admin sets axios `baseURL` to `/api/v1`, uses bare paths, and does the inverse `.replace('/api/v1','')`.
- **`REVALIDATION_SECRET` must be identical in all three `.env` files** (api/web/admin), enforced only by comments. Web fails closed (500 if unset); Laravel falls back to a **weak hardcoded default** in `config/app.php`.
- `SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:3001` enables cookie auth for both Next apps.

---

## 5. Risk register (severity-ranked, verified)

**CRITICAL**
- **C1** `REVALIDATION_SECRET` hardcoded fallback in `config/app.php:33` (`tdtutf-revalidation-secret-2026`) → forgeable cache-purge if env unset. Web fail-closed, Laravel fail-open (asymmetric → invisible).
- **C2** DB/Redis password in git history (`phpunit.xml`, reused in `.env`) → rotate + purge history + add secret-scan.
- **C3** Public `pages/tree` (`routes/api.php:134`, before the `auth:sanctum` group at :191) may leak unpublished draft pages to anonymous users → gate or add `is_published` filter.

**HIGH**
- **H1** `HtmlSanitizer` wired into only 2 of ~10 rich-text services → server-side XSS gap (News/Page/SiteContent unsanitized on write). **H1b** `biz-haqimizda/page.tsx` injects HTML **without** DOMPurify.
- **H2** Admin edge auth is format-only; token in non-HttpOnly cookie + localStorage (XSS-exfiltratable).
- **H3** Private media `download`/`stream` have no per-resource ACL — any admin can pull any file by numeric id.
- **H4** `usePasswordGuard` compares a hardcoded plaintext `'09'` shipped in the client bundle (its own docstring: "not real security").
- **H5** CSP is `frame-ancestors 'self'` only — no `default-src`/`script-src`.
- **H6** `API_BASE = .replace('/api','')` corrupts production hosts containing `api` → use `new URL(...).origin`.
- **H7** `apps/api` typecheck ends in `|| exit 0` (PHPStan never fails CI); several `lint`/`typecheck` scripts are `echo TODO` stubs.
- **H8** PHPStan baseline = 319 frozen entries (comment claims 387). **H9** CI Docker images `push:false`; prod rebuilds from scratch (drift risk).

**IN-FLIGHT (working tree, verify before commit)** — the Docker reorg is **internally consistent and fully wired** (compose + ci.yml + docker-safe.sh in lockstep), but: new Dockerfiles + 5 analysis docs are **untracked** (must commit with the deletes); `outputFileTracingRoot` not pinned (standalone tracing implicit); `media.conf` orphaned + wrong (bare-metal) path; **three uncoordinated deploy paths** (`deploy.sh` docker / `deploy-production.sh` bare-metal / hybrid) with conflicting paths (`/var/www/html` vs `/var/www/tmtu-termiz`), queue drivers, and a 200 GB-RAM assumption that would OOM a small box.

**MEDIUM** — domain split `tashmedunitf.uz` (canonical) vs `tdtutf.uz` (legacy, still in `boglanish/page.tsx`, privacy/terms, `deploy-production.sh` certbot); `foundingDate:'2024'` JSON-LD wrong (site says 2018); permission count 30(docs) vs 47(code); `editor` role dead; `@tmtu/sdk`/`i18n`/`auth`/`analytics`/`ui` + `config/*` unconsumed despite SSOT claims; divergent search (`@>` exact vs ILIKE); Page stale-path on deep re-parent; Page observed twice → double webhook; hard-vs-soft delete inconsistency; `dbTranslations`/version per-process won't scale; duplicated `formatDate`/`t()`/FormData serializers; nginx 500M vs PHP 100M upload mismatch.

**LOW** — `apps/mobile` + `packages/ui` skeletons; Husky `prepare: husky install` deprecated; scheduler healthcheck can never fail; OPcache `validate_timestamps=0` (immutable image); console noise + mojibake; Tiptap dead deps; `commitlint` scope-enum is warn-only; Framer Motion in exactly 1 file; two health endpoints coexist.

---

## 6. Onboarding quickstart

```bash
pnpm install                                   # all JS workspaces
cd apps/api && composer install && cp .env.example .env
php artisan key:generate
php artisan storage:link                       # REQUIRED on Windows every clone
php artisan migrate && php artisan db:seed      # db:seed THROWS if ADMIN_PASSWORD unset
# set NEXT_PUBLIC_API_URL (web=/api, admin=/api/v1) + same REVALIDATION_SECRET in all 3 .env
pnpm dev                                        # runs web+admin (NOT the API)
cd apps/api && php artisan serve --port=8000    # API runs outside the turbo graph
```

**Read-first files:** `routes/api.php`, `BaseController.php`, `bootstrap/app.php`, `NewsService.php`, `CacheService.php`, `Models/{News,Page}.php`, `DatabaseSeeder.php`, `AppServiceProvider.php` (api) · `middleware.ts`, `(main)/layout.tsx`, `[...slug]/page.tsx`, `lib/{api,services,seo,i18n,translate}.ts` (web) · `config/navigation.ts`, `inline-edit/{EditModal,EditableWrapper}.tsx`, `types/inline-edit.ts`, `store/useAuthStore.ts`, `middleware.ts` (admin).

**Top fixes if hardening for prod:** C1+C2 (secrets) → C3/H3 (authorization) → H1/H1b/H5 (XSS + CSP) → H4 (remove `'09'`) → commit in-flight artifacts + pick one deploy path → H6/domain/foundingDate → restore CI gates → finish or downgrade shared-package claims.
