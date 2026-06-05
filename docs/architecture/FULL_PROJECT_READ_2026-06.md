# Full Project Read — Exhaustive Subagent Sweep

> **Generated:** 2026-06-05 · **Method:** multi-agent workflow (Claude Code, ultracode)
> **Coverage:** 853 files read in full across 23 reader slices → 4 domain syntheses → 1 master report.
> Every source/config/text file under each slice was enumerated with `git ls-files` (literal paths for Next.js `[locale]`/`(main)` route groups) and read fully with the Read tool — not grepped. Binary assets (images, fonts, lockfiles) were counted, not read.

| Domain                            | Files read |
| --------------------------------- | ---------- |
| API (Laravel Backend)             | 293        |
| Web (Public Next.js)              | 181        |
| Admin (Next.js)                   | 263        |
| Shared (Packages/Infra/Docs/Root) | 116        |
| **Total**                         | **853**    |

---

# Full Project Read — `tmtu-termiz` Monorepo: Definitive Architecture Report

_Official website of Toshkent Davlat Tibbiyot Universiteti (TMTU) Termiz Filiali_
_Lead architect synthesis · 2026-06-05_

---

## 1. Executive Summary

`tmtu-termiz` is a **production-grade trilingual (uz/ru/en) university website platform** built as a **Turborepo + pnpm monorepo**. It is the official web presence for the Termiz branch of Tashkent State Medical University, comprising a Laravel headless CMS/API, a public Next.js site, and a WordPress-style inline-editing admin app, plus a layer of shared TypeScript packages and deployment infrastructure.

### What it is

- A **headless CMS architecture**: a single writable Laravel 12 backend (`apps/api`) serves all content over a versioned `/api/v1` REST API to two Next.js 16 / React 19 front-ends — a public site (`apps/web`, `:3000`) and an admin panel (`apps/admin`, `:3001`).
- Content is fully **multilingual** — every translatable field is stored as PostgreSQL JSONB `{uz, ru, en}` via Spatie Translatable.
- The defining admin UX is **in-context WYSIWYG editing**: the admin mirrors the live site 1:1 with hover-to-edit overlays rather than a traditional sidebar dashboard.

### Scale (approximate, from inventories)

| Area                             | Count                                                                     |
| -------------------------------- | ------------------------------------------------------------------------- |
| API endpoints                    | **146 across 27 controllers** (`docs/API.md`)                             |
| Laravel models                   | 24 · enums 7 · observers 4 · services 30 · FormRequests 47 · Resources 22 |
| Migrations / seeders / factories | 48 / 20 / 11                                                              |
| Web components                   | 54 files; SEO module 1182 lines; i18n dictionary 4142 lines               |
| Admin components                 | 75 files; services 25; hooks 29                                           |
| Shared packages                  | 8 published names (6 dirs + types/sdk)                                    |
| E2E specs                        | 9 numbered specs, ~80+ tests                                              |
| CI                               | 1 workflow, 5 jobs                                                        |

### Tech stack

- **Backend:** Laravel 12, PHP 8.3 (composer says `^8.2`), Sanctum 4, the full **Spatie suite** (Translatable, MediaLibrary, Permission, Sluggable, QueryBuilder, Image), Predis 3.
- **Data:** PostgreSQL 16 (JSONB + GIN/BRIN/partial indexes), Redis 7 (cache DB1, sessions, queue).
- **Frontend:** Next.js 16.1.6, React 19.2.3, React Compiler, Turbopack (web), Tailwind v4 CSS-first, TanStack Query v5, Zustand v5, react-hook-form + Zod, Framer Motion, Leaflet, isomorphic-dompurify, Tiptap v3 (admin).
- **Tooling:** Turborepo 2.3, pnpm 10.28.2, Node 20.18.0, ESLint 9, Prettier 3, husky 9, commitlint, Playwright + Axe.
- **Infra:** Docker Compose (7 services), 3 multi-stage Dockerfiles, in-container Nginx/PHP-FPM/Supervisor, a bare-metal Nginx host config, Let's Encrypt.

### Overall maturity & quality

**Strong application layer, weak connective tissue.** The three apps are mature, feature-complete, and internally consistent in their patterns (uniform Laravel service layer; uniform admin three-layer data flow; resilience-first web rendering). However, the project carries significant debt concentrated in three places:

1. **The shared package layer is wired but unused** — a stalled SSOT migration. Apps reimplement `cn/t/formatDate/api` locally, and the implementations have _diverged_.
2. **Massive duplication inside the admin app** — ~3000 lines of near-identical faculty/direction detail pages, triplicated journal CRUD, ~20 boilerplate hook files.
3. **Operational/security gaps** — placeholder/hardcoded secrets, an unverified edge auth guard, a process-memory revalidation mechanism that breaks under multiple instances, minimal CSP, and inconsistent XSS sanitization.

The codebase is also **honest with itself**: five untracked analysis docs in `docs/architecture/` already function as a risk register (C1–C3 / H1–H9 / A1–A23), and several findings here corroborate them. Production-readiness is **conditional** — the apps work, but the deploy path, secrets, domain identity, and multi-instance correctness need resolution before scale-out.

---

## 2. Monorepo Topology

```
tmtu-termiz/
├── apps/
│   ├── api/      @tmtu/api      Laravel 12, PHP 8.3, Sanctum — :8000  (writable SSOT)
│   ├── web/      @tmtu/web      Next.js 16, React 19, Tailwind v4 — :3000 (public)
│   ├── admin/    @tmtu/admin    Next.js 16 + Tiptap — :3001 (inline-edit CMS)
│   └── mobile/   @tmtu/mobile   (placeholder)
├── packages/
│   ├── types/    domain TS types (SSOT — REAL but UNUSED by apps)
│   ├── sdk/      typed API client (REAL but UNUSED, not even transpiled)
│   ├── utils/    cn, t, formatDate, stripHtml (REAL, complete — but reimplemented in apps)
│   ├── auth/     RBAC guards (SKELETON)
│   ├── i18n/     locale helpers (SKELETON; real dict lives in apps/web)
│   ├── analytics/ GA+Yandex (SKELETON — only noopAdapter)
│   ├── ui/       design system (EMPTY)
│   └── config/   eslint, prettier, tailwind, tsconfig (REAL configs)
├── e2e/          @tmtu/e2e — Playwright + Axe (9 specs, ~80 tests)
├── infrastructure/
│   ├── docker/{configs,images,compose}   (REAL, primary deploy path)
│   ├── nginx/                            (REAL bare-metal host config, UNTRACKED)
│   └── kubernetes/ terraform/ ansible/ monitoring/   (EMPTY skeletons)
├── docs/{architecture/ADR, api, guides, security, changelog}
├── scripts/      deploy.sh · deploy-production.sh (untracked) · docker-safe.sh
└── tooling/      (EMPTY — generators never built)
```

### Responsibility map

| Layer                         | Owner                                              | Responsibility                                                                  |
| ----------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Source of truth (writes)**  | `apps/api`                                         | All content, media, auth, RBAC, search, cache invalidation, ISR webhook trigger |
| **Public reads**              | `apps/web`                                         | Visitor-facing rendering, SEO/JSON-LD, a11y, analytics, ISR consumption         |
| **Content authoring**         | `apps/admin`                                       | In-context CRUD over ~30 entities, inboxes, page-tree, revalidation triggers    |
| **Contract layer (intended)** | `packages/types`, `packages/sdk`, `packages/utils` | Cross-app types/client/helpers — _currently bypassed_                           |
| **Runtime**                   | `infrastructure/docker`                            | Compose stack: Laravel+Nginx, queue, scheduler, Postgres, Redis, web, admin     |
| **Quality gate**              | `e2e`, `.github/workflows/ci.yml`, `.husky`        | Acceptance tests, CI pipeline, commit hooks                                     |

The three apps communicate **only via HTTP** — there is no shared in-process code actually consumed across the app boundary (the shared packages that would provide it are unused). The control loop is: admin writes → API persists → API fires ISR webhook → web revalidates.

---

## 3. Backend (API) Deep Dive — `apps/api`

### 3.1 Purpose

The Laravel 12 backend is the **single source of truth and only writable surface**. It serves 146 endpoints across 27 controllers: content delivery (news, hierarchical pages, departments, staff, faculties, directions, FAQs, testimonials, partners, banners, talented students, career center, library, journal), inbound form intake (contact, conference registrations, **job applications with HR PII**, student works), site configuration / dual i18n stores, JSONB-backed global search, a security-critical media subsystem, and Sanctum + Spatie RBAC.

### 3.2 The canonical request pipeline

```
Route (v1 group: ApiPerformance + throttle:120,1)
  → route middleware (auth:sanctum + role:… on protected groups)
  → FormRequest (authorize + rules + boolean coercion)
  → Controller (thin 1–4 line delegation)
  → Service (Spatie QueryBuilder + CacheService::remember; DB::transaction on writes)
  → Model (Spatie traits: Translatable/Media/Sluggable/Permission)
  → Resource (getTranslations {uz,ru,en}, media URLs)
  → JSON envelope {success, message, data}
```

**~22 of 30 controllers follow this exactly.** Documented exceptions with inline logic: `UserController` (direct Eloquent), `SiteContentController` (inline Storage + WebP), `MediaController` (447 lines).

### 3.3 Architecture notes

- **Laravel 12 slim skeleton**: `bootstrap/app.php` is the single composition root — **no `Http/Kernel.php`, no `Exceptions/Handler.php`**. The `withExceptions` block is the API error backbone, mapping each exception type to `{success:false,message,errors}` _only when `$request->is('api/_')`*. Error strings are **hardcoded Uzbek** at this layer, bypassing `lang/`.
- **Base classes**: `Controller.php` is empty (Laravel 12 dropped `AuthorizesRequests` — `$this->authorize()` is unavailable, so **all authorization is route-middleware-based; there are no policies**). `Api\BaseController` provides `success()`, `error()`, `paginated()`.
- **Service-layer uniformity**: each domain service exposes `getAll/findById/findBySlug/create/update/delete`; reads wrap Spatie QueryBuilder in `CacheService::remember`; `per_page` clamped to `[1,100]`; writes run in `DB::transaction`, manage media, then `clearModel()` after commit.
- **PostgreSQL-aware data layer**: query scopes are co-designed with named PG indexes (documented in PHPDoc) — partial indexes for published/active, **GIN (`jsonb_path_ops`)** for JSONB search, **BRIN** on `created_at`. This makes migrations **non-portable** — CI/tests must run on Postgres.

### 3.4 Dual-channel cache invalidation (redundant)

Two mechanisms fire on every write:

1. **Observers** — `AppServiceProvider::boot()` registers `ModelCacheObserver` on ~20 models (Page registered **twice**), plus `NewsObserver` and `ContactMessageObserver`.
2. **Explicit service calls** — services _also_ call `clearModel()` because the observer is unreliable on the file driver.

On Redis both fire → **double flush** (pure overhead). Cross-entity coupling is hand-wired (Staff clears STAFF+DEPARTMENTS; News clears NEWS+SEARCH).

### 3.5 Auth flow

`POST /api/v1/auth/login` → `AuthController`: RateLimiter lockout (5 attempts/15min keyed by `sha1(email|ip)`), timing-safe `Hash::check` against a dummy bcrypt (enumeration-safe), token rotation deleting only tokens older than 24h (multi-session). Returns `UserResource + token`; `Authorization: Bearer <token>` thereafter (8h / 480min token lifetime). `User` is the **only** RBAC model (Sanctum + Spatie HasRoles + SoftDeletes).

### 3.6 Data model highlights

- `News.php` — richest model: 6 index-mapped scopes, 8 media collections, queued WebP conversions; `NewsSeeder` (30 hand + 300 factory = 330) is the only place a factory runs.
- `Page.php` — hierarchical tree (self-referential parent/children); `boot()` saving hook auto-computes `depth`/materialized `path` on `parent_id` change — but **does not cascade to descendants** (stale paths on re-parent).
- `JobApplication.php` — ~30 fillable HR fields (`is_convicted`, `salary`, `birthday`, passport/contract scans); files correctly on private LOCAL disk but **no `$hidden` array** for scalar PII.
- `StudentWork.php` — the only inbound-file model bypassing Spatie MediaLibrary (raw `file_path`), and its upload path has **zero validation** (see Findings C2).

### 3.7 Key packages

Spatie Translatable (JSONB i18n), MediaLibrary (uploads, WebP, private/public disk routing, Range streaming), Permission (3 roles / 47 permissions in the seeder — CLAUDE.md says 30), Sluggable, QueryBuilder (filter/sort), spatie/image. Sanctum 4 for auth. The `FrontendRevalidationService` POSTs to the Next.js `/api/revalidate` endpoint with a shared secret — but **synchronously** (`Http::timeout(5)->retry(2,500)`), blocking admin writes up to ~11s if the frontend is down.

---

## 4. Public Web App Deep Dive — `apps/web`

### 4.1 Routing & rendering

- **App Router** with a localized group: every page lives under `src/app/[locale]/(main)/`. `[locale]` is a real URL segment (uz/ru/en); `(main)` is a no-URL layout group providing shared chrome. `generateStaticParams` over `['uz','ru','en']`; invalid locales → `notFound()`.
- The home route is `(main)/page.tsx` (there is **no** `[locale]/page.tsx`). The 404 is `[locale]/not-found.tsx`.
- Almost every page is an **async Server Component**, in one of three content strategies: pure static/i18n, DB-with-static-fallback, or fully data-driven. Client pages are rare (`tuzilma/filiallar`, `aloqa`, `ilmiy-jurnal/boglanish`) plus client islands (forms, share buttons, countdown, FAQ accordions, a11y panel).

### 4.2 Language resolution (systemic)

Server pages resolve language via `getLanguage()` = **`x-locale` header (set by middleware) → `lang` cookie → default uz**. Pages **do NOT read the `[locale]` route param for language** — they re-derive it. This means the visible URL locale and the rendered content language can **desync** if middleware is bypassed (a systemic correctness risk; see Findings).

### 4.3 Data fetching (layered)

```
ApiClient (lib/api.ts) → service fns (lib/services.ts, ~30 typed, cache-tagged)
  → Server Components directly
  OR → client TanStack Query hooks (hooks/useApi.ts)
```

`ApiClient` uses 15s timeout; cache policy is **dev = `no-store`, prod = `next:{revalidate:60, tags}`**. Base = `NEXT_PUBLIC_API_URL` (`/api`, so services prepend `/v1`). **Resilience-first**: nearly every call is wrapped in `.catch()` returning an empty fallback, and pages ship hardcoded i18n fallbacks so they render when the API/CMS is down.

### 4.4 Revalidation / live-refresh (the documented gotcha)

Admin edits → backend POSTs `api/revalidate/route.ts` (shared secret) → `revalidateTag` + `revalidatePath` for all locales → `notifyUpdate()` bumps `globalThis.__revalidateVersion`. `api/revalidate/stream/route.ts` is **misnamed "stream" — it is JSON polling, not SSE**. `AutoRefresh.tsx` polls it **every 2s**, calls `router.refresh()` on version change, full-reloads after 3 refreshes. **This is process-memory-bound and breaks under >1 instance.**

### 4.5 i18n & SEO

- Dual-track i18n: **`s(key, lang)`** for UI strings (a 4142-line static dictionary, ~1094 keys × 3 locales), **`t(field, lang)`** for translatable DB JSONB (`dbTranslations` cache loaded once via `loadTranslations()` from `/v1/translations`). Resolution: DB → DB.uz → static → static.uz → raw key.
- **SEO** (`lib/seo.ts`, 1182 lines): `SITE_URL = https://tashmedunitf.uz`, a ~95-entry `PAGE_SEO` registry (UZ-only titles), `buildMetadata`/`buildArticleMetadata` with hreflang, and **9 JSON-LD generators** (Organization, Website, Breadcrumb, Article, FAQ, Course, Event, Person, Department, LocalBusiness). `sitemap.ts` (~120 routes) and `robots.ts` (~20 crawlers) complete the surface.

### 4.6 State, styling, a11y

- **Zustand** (`useLanguageStore`, `useUIStore`, `useA11yStore`), no persist middleware (a11y store hand-persists + applies DOM + emits CustomEvent).
- **Tailwind v4 CSS-first** — no `tailwind.config.ts`; `globals.css` has a bespoke WCAG theming engine (6 color schemes, font/spacing/line-height controls). Brand teal `#00575B`.
- **a11y subsystem**: `A11yPreHydrationScript` (anti-FOUC inline script), `AccessibilityWidget`, cross-tab sync. WCAG 2.1 AA toolkit.
- **HTML safety**: `isomorphic-dompurify` wraps _most_ `dangerouslySetInnerHTML` — with notable exceptions (see Findings H4).

### 4.7 Notable component families

Five intentional template families with heavy duplication: `NavHub` hubs (~15 pages), `DocumentDetail` static leaves (~15 pages), CMS-content pages, program-level pages (`FacultyLevelPage`), and dynamic detail pages. Home is composed of 10 sections (`BannerSlider`, `HeroSection`, `NewsSection` bento, `StatsCounterSection` with hardcoded stats, `LocationSection` with Leaflet at lat 37.2242/lng 67.2784).

---

## 5. Admin App Deep Dive — `apps/admin`

### 5.1 The defining UX

A **WordPress/Wix-style inline editor**: instead of a sidebar CRUD dashboard, admins see a 1:1 visual mirror of the live site decorated with hover-to-edit overlays, and edit content in-context through schema-driven modals. **Defaults-as-fallback everywhere** — hardcoded Uzbek defaults render (and seed the create modal) when no DB row exists, so the public site never looks empty.

### 5.2 Three-layer data flow (strict per-entity template)

```
Component → use<Entity> hook (TanStack Query) → <entity>Service (Axios) → shared `api` → Laravel /api/v1
```

- **API client** (`lib/api.ts`): single `axios.create`, `baseURL = NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api/v1` — **note the `/v1`, unlike web's `/api`** — the single most important env gotcha), `withCredentials`, Bearer-injecting request interceptor, 401-handling response interceptor (dedup + `window.location.replace('/login')`).
- **Services (25)**: plain async objects. Mutation convention: `create = POST FormData`; `update = POST FormData + _method=PUT` (Laravel multipart method-spoof) — **except** faq/contact/contactLocation/translation/siteContent (real JSON PUT) and pageService (branches on `hasFiles()`).
- **Hooks (29)**: identical optimistic create/update/delete pattern + `revalidateFrontend(tags, paths)` + `react-hot-toast`.

### 5.3 Inline-edit engine (`components/inline-edit/`)

- `EditableWrapper` — hover overlay with Add/Edit/Delete.
- `EditModal` (491 lines) — **universal schema-driven form** from `FieldConfig[]`: translatable fields under `LanguageTabs`, multipart `FormData` build, media URL→ID mapping for targeted removal, file-size validation, ISO↔`datetime-local`, 422 error mapping (`title.uz → title`).
- `RichTextEditor` — Tiptap StarterKit + Image(`allowBase64`)+Link+Placeholder+TextAlign; URLs via `window.prompt`.
- `MediaUploader`, `LanguageTabs`, `TagsInput`, plus SiteContent-specific `TextEditModal`/`CardEditModal`.

### 5.4 Page structure (three tiers)

1. **Thin wrappers** (~11 lines) rendering one `*CrudAdmin` template.
2. **Full client editors** — the heavy WYSIWYG pages: `abiturientlarga/page.tsx` (1109 lines), `talabalarga/page.tsx` (922), `biz-haqimizda/page.tsx` (642), faculty/direction detail pages, `sahifalar` (page-tree), `translations`, `foydalanuvchilar`.
3. **Redirect stubs** deduping routes (including external redirects to unilibrary.uz / emerald.com).

### 5.5 Auth & guarding (two gates)

- **Client gate**: `(dashboard)/layout.tsx` reads persisted `useAuthStore`, waits for hydration, redirects unauthenticated to `/login`.
- **Edge gate**: `middleware.ts` reads the `admin-token` cookie and validates **format only** (`/^[0-9]+\|[A-Za-z0-9+/=]+$/`, length ≥20) — **not a real verification**.
- **Auth store** persists `{user,token,isAuthenticated}` to localStorage **AND** writes a **non-HttpOnly `admin-token` cookie** (raw `document.cookie`, not `js-cookie` despite CLAUDE.md's claim) so middleware can read it.

### 5.6 Revalidation

Hook → `revalidateFrontend(tags, paths)` → `POST /api/revalidate` (same-origin) → `api/revalidate/route.ts` forwards to `${NEXT_PUBLIC_FRONTEND_URL}/api/revalidate` with server-only `REVALIDATION_SECRET`. **Pull-based, not SSE.** Always force-pushes `/` into paths → every edit revalidates the home page.

### 5.7 The duplication problem (signature debt of this app)

- **3× direction-detail + 3× faculty-detail pages** (~99% identical, ~3000 lines) that should be one template parameterized by `level`/`basePath`.
- **3× diverging Journal CRUD** with inconsistent PDF validation (51200 vs 102400 maxSize).
- **~320-line news pages** (`yangiliklar`, `konferensiyalar`, `tadbirlar`) near-identical; `AdminOverlay`/`StatusChip` re-declared in 5+ files.
- **~20 CRUD hook files ~95% boilerplate** — no `createEntityHooks` factory.

---

## 6. Shared Packages, Infrastructure, CI/CD, Docs, E2E — Real vs Skeleton

### 6.1 Shared packages: real vs skeleton vs empty

| Package           | Status                    | Reality                                                                                                         |
| ----------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `@tmtu/types`     | **Real, hand-maintained** | 13 entities + mixins + envelopes — **but ZERO real imports in `apps/**`\*\*                                     |
| `@tmtu/sdk`       | **Real but unused**       | `TmtuApiClient` + `createResources` — **not even in `transpilePackages`**, so an import would fail to build     |
| `@tmtu/utils`     | **Real, complete**        | `cn, t, hasTranslation, formatDate, stripHtml, truncate` — but apps reimplement these with _divergent_ behavior |
| `@tmtu/config`    | **Real configs**          | eslint/prettier/tailwind/tsconfig                                                                               |
| `@tmtu/auth`      | **Skeleton**              | guards only; token/refresh/2FA are TODO                                                                         |
| `@tmtu/i18n`      | **Skeleton**              | `LOCALES`/`isValidLocale`; the real 4142-line dictionary lives in `apps/web`                                    |
| `@tmtu/analytics` | **Skeleton**              | only `noopAdapter` — **contradicts CLAUDE.md's "GA + Yandex adapters"**                                         |
| `@tmtu/ui`        | **Empty**                 | all exports commented out                                                                                       |

**The entire shared contract layer is wired but not consumed — a stalled SSOT migration.** Both `apps/web/src/lib/utils.ts` and `apps/admin/src/lib/utils.ts` reimplement `cn/t/formatDate/truncate` and the implementations **diverge** (package `formatDate` returns `{day,month,year,full}` via hardcoded month arrays; web returns a string via `Intl.DateTimeFormat('uz-UZ')`; package `t` falls back uz→ru→en while admin only falls back to `.uz`).

### 6.2 Infrastructure: real vs empty

**Real (Docker Compose — the cohesive primary path):** 7 services — `app` (supervisord runs php-fpm+nginx, the only one publishing `:8000->80`), `queue` (`queue:work redis`), `scheduler` (`while-true; sleep 60; schedule:run`), `postgres` (16-alpine), `redis` (7-alpine, requirepass+appendonly+512MB LRU), `web`, `admin` (Next.js standalone, non-root `nextjs:1001`). Config injected entirely via env vars.

**Real but UNTRACKED:** `Dockerfile.web`, `Dockerfile.admin`, `infrastructure/nginx/nginx-production.conf` (bare-metal host), `scripts/deploy-production.sh`. The old `apps/*/Dockerfile.*` were _deleted_ — so the **only copies of the web/admin images and host config live in the working tree** and would be lost on a clean checkout.

**Empty skeletons (ZERO files):** `kubernetes/`, `terraform/`, `ansible/`, `monitoring/`, `tooling/`. CLAUDE.md presents these as real; there is **no IaC, no cluster manifests, no observability stack**.

### 6.3 CI/CD

`.github/workflows/ci.yml` — 5 jobs: **api** (PG16+Redis7, Pint `--test`, PHPStan L5, parallel PHPUnit), **frontend** (turbo lint/typecheck/build), **e2e** (main-only/label, boots full stack), **docker** (main-only, builds 3 images, `push:false`), **deploy** (production env gate → appleboy ssh `deploy.sh docker`). **No zero-downtime or rollback** — prod rebuilds from scratch. **Three uncoordinated deploy paths** (`deploy.sh`, `deploy-production.sh`, Compose) disagree on domain, server spec, queue driver, and artisan path.

### 6.4 Docs

Five **untracked** analysis docs in `docs/architecture/` form a de-facto risk register (`PROJECT_DEEP_DIVE_2026-06.md` with C1–C3/H1–H9 is authoritative; plus `MIGRATION_VERIFICATION_REPORT.md` with A1–A23, etc.). One ADR (`0001-monorepo-migration`). Guides (getting-started, deployment, runbook, seo-strategy) + `security.md`. Notable drift: `security.md` is partly wrong (claims `editor` role and HttpOnly cookies that don't match reality); a leaked LLM preamble sits in line 1 of `MIGRATION_VERIFICATION_REPORT.md`.

### 6.5 E2E

`@tmtu/e2e` — Playwright + Axe, serial (workers:1), **no `webServer` block** (expects live services), 9 numbered specs (~80+ tests). Only `09-real-crud-operations` mutates the DB. Hardcoded test creds (`admin@tdtutf.uz / Admin123456`). A11y gate is weak — fails only on `impact==='critical'`.

---

## 7. Cross-Cutting Concerns

### 7.1 Auth & RBAC

- **Sanctum bearer tokens** end-to-end. Backend authorization is **100% route-middleware-based** (no policies). 3 roles, but the **`editor` role is referenced in zero route middleware** → editors currently get no admin routes.
- **Two sources of truth for RBAC**: `UserRole::permissions()` hardcodes the matrix while `DatabaseSeeder` defines 47 permissions — drift risk (and CLAUDE.md says "30").
- **Token storage is the weak link**: admin stores the token in JS-readable localStorage + a non-HttpOnly cookie; the edge guard only format-checks it.

### 7.2 i18n (uz/ru/en JSONB)

The end-to-end multilingual contract is consistent: backend persists `{uz,ru,en}` via Spatie Translatable to JSONB; FormRequests validate `field => array` with `field.uz` required; Resources emit via `getTranslations()`; both front-ends consume via `t(field, lang)` with `lang → uz → ru → en` fallback. **Inconsistencies**: API exception strings are Uzbek-only (only `uz` has `validation.php`); the web `privacy`/`terms`/`CookieConsent` pages are Uzbek-only; **two parallel i18n stores** exist on the backend (`site_contents` and `translations`) serving near-identical purposes.

### 7.3 SEO

Comprehensive on web: 1182-line `seo.ts`, 9 JSON-LD generators, hreflang, sitemap/robots. **Risk**: `SITE_URL` is hardcoded to `tashmedunitf.uz` in `sitemap.ts`/`robots.ts` while other code uses `tdtutf.uz` — **the canonical domain is unresolved**, and `foundingDate '2024'` (JSON-LD) contradicts about-copy '2018'.

### 7.4 Caching / ISR / revalidation

A three-tier system: **Redis tag-aware cache** (backend) → **Next.js fetch cache** (`revalidate:60` + tags) → **`AutoRefresh` 2s polling** for live updates. **The critical flaw**: the live-refresh "version" lives in `globalThis.__revalidateVersion` (process memory), and `revalidateTag`/`revalidatePath` only affect the receiving process. **With >1 Next.js instance this is broken** — needs a shared store (Redis pub/sub). The backend revalidation webhook is also synchronous/blocking, not fire-and-forget.

### 7.5 Security headers

**CSP is effectively absent** on both front-ends — only `Content-Security-Policy: frame-ancestors 'self'` is set; no `script-src`/`default-src`, despite multiple `dangerouslySetInnerHTML` sinks. `X-XSS-Protection` (deprecated) and HSTS-preload are emitted on all responses (including dev). CLAUDE.md's "Security headers (CSP, …)" claim is **overstated**. Nginx `add_header` inheritance pitfalls silently drop server-level security headers on `/storage/*` and `.php` locations.

### 7.6 The data model

PostgreSQL 16 with 48 migrations / 45+ tables / 24 models. Translatable columns are JSONB (21 GIN-indexed; several translatable columns _remain plain `json`_ outside the allowlist → inconsistent search perf). BRIN on `created_at`; partial indexes for published/active. Hierarchical pages via materialized path. Spatie polymorphic media table. **Migration fragility**: duplicate timestamp prefixes resolved only by alphabetical filename; SoftDeletes added then removed from some tables; one `down()` has a dedup bug; `create_media_table` has no `down()`.

---

## 8. Consolidated Findings & Risks (Prioritized)

### CRITICAL

| #   | Finding                                                                                                                                                                                                                                                                                           | Location                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| C1  | **Unvalidated public file upload** — `StudentWorkService::create` does `$file->store('student-works','public')` with **zero MIME/extension/size/SVG validation**, bypassing `MediaUploadService`. Arbitrary-file-upload on a public endpoint.                                                     | `apps/api/.../Services/StudentWorkService.php`                           |
| C2  | **Hardcoded revalidation secret fallback** — `config/app.php` `revalidation_secret` falls back to literal `'tdtutf-revalidation-secret-2026'` (known repo constant). If prod omits `REVALIDATION_SECRET`, the ISR webhook auth is bypassable. Placeholders also ship in all three `.env.example`. | `apps/api/config/app.php`; `apps/{web,admin}/.env.example`               |
| C3  | **Multi-instance revalidation is broken** — live-refresh version lives in `globalThis.__revalidateVersion`; `revalidateTag`/`revalidatePath` are per-process. With K8s replicas / multiple workers, browsers polling another replica never refresh. Needs Redis pub/sub.                          | `apps/web/src/app/api/revalidate/*`, `components/shared/AutoRefresh.tsx` |
| C4  | **Admin bearer token in JS-readable storage** — token in localStorage `admin-auth` **and** non-HttpOnly `admin-token` cookie; any XSS exfiltrates it. Combined with absent CSP and admin-authored HTML, this is a real token-theft surface.                                                       | `apps/admin/src/store/useAuthStore.ts`                                   |
| C5  | **Untracked critical infra files** — `Dockerfile.web`, `Dockerfile.admin`, `nginx-production.conf`, `deploy-production.sh`, 5 analysis docs are uncommitted while the old `apps/*/Dockerfile.*` were deleted. Web/admin images and host config exist **only in the working tree**.                | `infrastructure/docker/images/`, `infrastructure/nginx/`, `scripts/`     |

### HIGH

| #   | Finding                                                                                                                                                                                                                                                                                                       | Location                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| H1  | **Shared package layer unused** — ZERO real imports of `@tmtu/{sdk,types,utils,auth,i18n,analytics,ui}` in apps; SDK isn't even in `transpilePackages`. Stalled SSOT migration; types can silently drift from Laravel models.                                                                                 | `packages/*`, `apps/*/next.config.ts`                                                                         |
| H2  | **Admin edge guard is not a security boundary** — `middleware.ts` only regex-checks cookie format/length; no signature verification. A forged matching string passes; real authz relies solely on API 401.                                                                                                    | `apps/admin/src/middleware.ts`                                                                                |
| H3  | **JobApplication PII exposure** — model stores `is_convicted`/`salary`/`birthday`/passport scans with **no `$hidden` array**; scalar PII serializes by default. `GET contact/stats` is also unauthenticated.                                                                                                  | `apps/api/.../Models/JobApplication.php`                                                                      |
| H4  | **Inconsistent XSS sanitization on web** — `biz-haqimizda/page.tsx` (hero L167-172, sections L204-209) and `kafedralar/[slug]` (L232) render CMS HTML via `dangerouslySetInnerHTML` **WITHOUT DOMPurify**, while sibling pages do sanitize. A compromised CMS = injection.                                    | `apps/web/src/app/[locale]/(main)/biz-haqimizda/...`                                                          |
| H5  | **Triplicated department↔faculty fuzzy heuristic** — `normalize()`/`namesMatch()` word-matching (with _divergent_ stopWords) copy-pasted in 3 files; locale-naive, can mis-group/drop departments. Should be an explicit `faculty_id` relation. Biggest correctness risk on web.                              | `apps/web/.../tuzilma/{fakultetlar/[id],kafedralar,kafedralar/[slug]}`; mirrored in admin `kafedralar/[slug]` |
| H6  | **~3000 lines of duplicated admin detail pages** — 3× direction-detail + 3× faculty-detail (~99% identical) should be one parameterized template.                                                                                                                                                             | `apps/admin/.../abiturientlarga/{bakalavriat,magistratura,ordinatura}/[id]` and `/fakultet/[id]`              |
| H7  | **Synchronous blocking revalidation webhook** — `FrontendRevalidationService` blocks every admin write up to ~11s when frontend is unreachable; should be queue-dispatched.                                                                                                                                   | `apps/api/.../Services/FrontendRevalidationService.php`                                                       |
| H8  | **CSP effectively absent on both front-ends** — only `frame-ancestors 'self'`.                                                                                                                                                                                                                                | `apps/web/next.config.ts`, `apps/admin/next.config.ts`                                                        |
| H9  | **Secrets in plain env, no secret management** — `APP_KEY`/`DB_PASSWORD`/`REDIS_PASSWORD`/`REVALIDATION_SECRET`/`MAIL_PASSWORD` as plain env; `REDIS_PASSWORD` embedded in the redis healthcheck command line (visible in `docker inspect`). Postgres `:5432` and Redis `:6379` published to host by default. | `infrastructure/docker/compose/compose.yml`                                                                   |

### MEDIUM

| #   | Finding                                                                                                                                                                                                              | Location                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| M1  | **`MediaController::clearModelCache` prefixMap bug** — `faculty => PREFIX_DIRECTIONS` (faculty cache never invalidated); several types absent → caches never cleared on media upload.                                | `apps/api/.../Controllers/MediaController.php`        |
| M2  | **Inconsistent JSONB search semantics** — News/Journal/Library do substring ILIKE; Page/Dept/Staff/Direction/Faq do exact `@>` containment (silently fails on partial input). Locale whitelisting also inconsistent. | `apps/api/.../Services/*Service.php`                  |
| M3  | **Redundant cache invalidation on Redis** — both observer and explicit `clearModel()` fire on every write (double flush).                                                                                            | `AppServiceProvider`, all services                    |
| M4  | **Orphaned/unmanaged cache keys** — `*:unread_count`/`contact:stats` outside the PREFIX list and no observer → admin badges stale up to 30–60s.                                                                      | `CacheService`, observers                             |
| M5  | **SiteMedia accepts any file type** — `max:51200` with no `mimes:` constraint (50MB any-type for admins).                                                                                                            | `apps/api/.../Requests/.../*SiteMediaRequest.php`     |
| M6  | **CORS over-permissive** — regex permits any localhost/127.0.0.1 port http/https with `supports_credentials=true`. Must be dropped in prod.                                                                          | `apps/api/config/cors.php`                            |
| M7  | **SDK is fundamentally broken (latent)** — throws a plain object (not `Error`), hardcodes `/v1` (double-prefixes for admin), only exposes 6 of 13 entities, three envelope shapes.                                   | `packages/sdk/src/client.ts`                          |
| M8  | **`rektorat` keys business data by `sort_order`** — reception hours + telegram handle keyed by `staff.sort_order`; reordering reassigns them to the wrong person. (Present in both web and admin.)                   | `apps/{web,admin}/.../tuzilma/rektorat/page.tsx`      |
| M9  | **Systemic URL↔content locale desync** — `getLanguage()` ignores `[locale]`; if middleware is bypassed, uz wins on every server page.                                                                                | `apps/web/src/lib/language.ts`                        |
| M10 | **9 of 11 factories broken** (column drift) — crash if any test calls them.                                                                                                                                          | `apps/api/database/factories/*`                       |
| M11 | **Several admin edit modals show empty uploader for existing images** — `Faculties/Departments/Staff/EditableDirectionsSection` omit media from edit `initialData` (accidental no-op risk).                          | `apps/admin/src/components/templates/*`               |
| M12 | **Public form abuse surface** — Job/StudentWork/Conference/Virtual-reception forms POST multipart directly to the API with no captcha/CSRF; rate-limiting fully delegated to backend throttle.                       | `apps/web/.../forms`, `apps/api/routes/api.php`       |
| M13 | **Domain identity unresolved** — `tashmedunitf.uz` vs `tdtutf.uz` split across SEO, legal pages, docs, deploy scripts, e2e. No ADR adjudicates.                                                                      | repo-wide                                             |
| M14 | **`contactService.markAsRead` is a no-op** (GETs and returns, marks nothing); conference search filters only the current page; `tadqiqod-markazi/[id]` likely broken (numeric id as slug).                           | `apps/admin/src/lib/services/contactService.ts`, etc. |
| M15 | **Scheduler anti-pattern + no-op healthcheck** — `while-true sleep 60` accumulates drift; healthcheck `pgrep …                                                                                                       |                                                       | true`can never report unhealthy.`queue`/`scheduler`use plain`depends_on` (may start before DB ready). | `infrastructure/docker/compose/compose.yml` |

### LOW

| #   | Finding                                                                                                                                                                              | Location                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| L1  | Inconsistent XSS escaping across API Resources (~9 of 22 escape) → relies on frontend DOMPurify; double-encodes where client also sanitizes.                                         | `apps/api/.../Resources/*`                                 |
| L2  | Regex-based HTML sanitizers (`HtmlSanitizer`, SVG scan) — brittle; News/Page rich text not server-sanitized.                                                                         | `apps/api/.../Services/HtmlSanitizer.php`                  |
| L3  | Hardcoded client-side password `'09'` gating "add page" (admits "Real xavfsizlik emas").                                                                                             | `apps/admin/.../sahifalar`, `PageLock`, `usePasswordGuard` |
| L4  | Dead code/components: `MediaObserver` never registered; web `AntiCard/ContactCard/LawCard`; admin `cleanDescription()` defined-never-called; `data/journal.ts`.                      | various                                                    |
| L5  | Hardcoded/stale demo data in production — faoliyat pages (fake researchers, patent `IAP 07XXX`), `StatsCounterSection`, `DocumentDetail` stubs (`downloadUrl:'#'`/undefined).        | `apps/{web,admin}/.../faoliyat/*`                          |
| L6  | Production `console.log` in `AutoRefresh.tsx` + hard `window.location.reload()` after 3 refreshes.                                                                                   | `apps/web/.../AutoRefresh.tsx`                             |
| L7  | Brand-color mismatch — manifest/themeColor navy `#1e3a5f` vs UI teal `#00575B`.                                                                                                      | `apps/web/public/manifest.json`, `globals.css`             |
| L8  | Encoding corruption (mojibake) in `Header.tsx`/`AdminTopHeader.tsx`; Cyrillic char in a JS function name.                                                                            | `apps/{web,admin}/.../layout/*`                            |
| L9  | Deprecated husky setup (v10 will fail); duplicate workspace declaration (`package.json` + `pnpm-workspace.yaml`); ESLint 9 flat-config risk; shared `lint` scripts are no-op echoes. | root, `packages/*`                                         |
| L10 | Committed 527KB Playwright report `e2e/report/index.html` in VCS; stale e2e README.                                                                                                  | `e2e/`                                                     |
| L11 | Thin backend test coverage — 2 Feature classes, zero unit tests; `phpunit.xml` references uninstalled Pulse/Telescope.                                                               | `apps/api/tests/`                                          |
| L12 | PHP version mismatch — composer `^8.2` vs docs/CLAUDE.md 8.3.                                                                                                                        | `apps/api/composer.json`                                   |
| L13 | PHP `upload_max_filesize=100M` conflicts with nginx `client_max_body_size=500M` and docs' "500MB video"; uploads through PHP get 413 above 100M.                                     | `infrastructure/docker/configs/php/php.ini`                |

---

## 9. Open Questions & Recommended Next Steps

### Open questions requiring product/ops decisions

1. **Canonical domain** — `tashmedunitf.uz` or `tdtutf.uz`? (Affects SEO canonical/OG, TLS, deploy, e2e.) **And founding year — 2018 or 2024?**
2. **Single-instance vs scaled** — is web guaranteed single-instance in prod? If not, C3 (revalidation) is a blocker.
3. **Which deploy path is canonical** — `deploy.sh`, `deploy-production.sh`, or Compose? No ADR adjudicates.
4. **Adopt or delete the shared packages** — wire `@tmtu/{types,sdk,utils}` and remove the duplicated `apps/*/lib/{api,utils}.ts`, or remove the abandoned scaffolding (and the empty k8s/terraform/ansible/monitoring/tooling dirs)?
5. **Is `editor` role intended** to have routes (currently dead)? Is `UserRole::permissions()` or the seeder the RBAC source of truth?
6. **Should department↔faculty use an explicit `faculty_id`** relation instead of the fuzzy heuristic (H5)?
7. **Are the hardcoded "demo" datasets and `downloadUrl:'#'`/undefined stubs** intended placeholders awaiting content?

### Recommended next steps (priority order)

1. **Lock down secrets & auth (C2, C4, H2, H3, H9):** remove the hardcoded revalidation-secret fallback and fail-fast if unset; move the admin token to an HttpOnly session cookie with server-verified middleware; add `$hidden` to `JobApplication`; pull Postgres/Redis ports off the host; remove `REDIS_PASSWORD` from the healthcheck command line.
2. **Close the file-upload hole (C1, M5):** route `StudentWorkService` and `SiteMedia` through `MediaUploadService` with MIME/extension/size validation.
3. **Commit the untracked infra (C5):** atomically commit `Dockerfile.web`, `Dockerfile.admin`, `nginx-production.conf`, `deploy-production.sh`, and the analysis docs alongside the `apps/*/Dockerfile.*` deletions.
4. **Fix multi-instance revalidation (C3, H7):** move the version signal to Redis pub/sub; make the backend webhook queue-dispatched (fire-and-forget).
5. **Add a real CSP (H8)** at the app or nginx/edge layer; fix the nginx `add_header` inheritance pitfall on `/storage/*`.
6. **Make XSS sanitization uniform (H4, L1):** add DOMPurify to the unsanitized web pages; standardize escaping across API Resources.
7. **Decide the shared-package strategy (H1):** either adopt-and-dedupe or delete; if adopting, first unify the SDK envelope shapes, fix it to throw `Error`, and fix the `/v1` double-prefix.
8. **Collapse the duplicated admin detail pages (H6)** into one `level`/`basePath`-parameterized template; extract a `createEntityHooks` factory.
9. **Resolve domain/branding (M13)** with an ADR; thread `SITE_URL` from one env-driven source through sitemap/robots/seo.
10. **Replace the fuzzy department↔faculty heuristic (H5, M8)** with an explicit `faculty_id` relation; stop keying business data by `sort_order`.
11. **Backfill tests (L11):** repair the 9 broken factories, add unit + feature coverage for search, page-tree, media, admin CRUD, and the PII inboxes.
12. **Reconcile the docs (drift):** update CLAUDE.md (permission count 47 not 30; analytics adapters are skeletons; k8s/terraform are empty; CSP claim overstated; `editor` role is dead); fix `security.md`'s HttpOnly/editor claims; remove the leaked LLM preamble.

---

## Appendix A — Per-Slice Read Coverage (23 reader agents)

| Domain | Slice                                                                                                                                                                                                                                             | Files read |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| API    | API — Eloquent Models, Enums, Observers, Traits (apps/api/app/{Models,Enums,Observers,Traits})                                                                                                                                                    | 36         |
| API    | API — Controllers &amp; Routes (apps/api/app/Http/Controllers, apps/api/routes)                                                                                                                                                                   | 33         |
| API    | API — FormRequests, Resources, Middleware                                                                                                                                                                                                         | 70         |
| API    | API — Services, Providers, Console (apps/api/app/Services, apps/api/app/Providers, apps/api/app/Console)                                                                                                                                          | 48         |
| API    | API — Database Migrations (apps/api/database/migrations)                                                                                                                                                                                          | 48         |
| API    | API — Seeders & Factories (apps/api/database/seeders, apps/api/database/factories)                                                                                                                                                                | 32         |
| API    | API — Config, Bootstrap, Tests, Lang, Meta (apps/api)                                                                                                                                                                                             | 26         |
| Web    | Web — Routes: abiturientlarga + biz-haqimizda (+ [locale]/(main) wrappers)                                                                                                                                                                        | 38         |
| Web    | Web — Routes: faoliyat, talabalarga, yangiliklar, faq, aloqa, privacy, terms, [...slug], api (apps/web/src/app)                                                                                                                                   | 42         |
| Web    | Web — Components (apps/web/src/components)                                                                                                                                                                                                        | 54         |
| Web    | Web app — lib, hooks, store, providers, config, data, types, middleware (apps/web/src)                                                                                                                                                            | 33         |
| Web    | Web — Config & app root (apps/web)                                                                                                                                                                                                                | 14         |
| Admin  | Admin — Dashboard: abiturientlarga + biz-haqimizda (+ dashboard wrapper)                                                                                                                                                                          | 55         |
| Admin  | Admin — Dashboard: faoliyat, talabalarga, news (yangiliklar), events (tadbirlar), conferences (konferensiyalar), conference registrations, journals, library (kutubxona), career (karyera), job applications (ish-arizalari), student-life photos | 47         |
| Admin  | Admin — Dashboard core sections + auth pages + app root                                                                                                                                                                                           | 17         |
| Admin  | Admin — Components (apps/admin/src/components)                                                                                                                                                                                                    | 75         |
| Admin  | Admin app — lib, services, hooks, store, providers, config, types, middleware (apps/admin/src)                                                                                                                                                    | 63         |
| Admin  | Admin — Config & app root (apps/admin/public + admin build/config files)                                                                                                                                                                          | 6          |
| Shared | Packages — @tmtu/types & @tmtu/sdk                                                                                                                                                                                                                | 12         |
| Shared | Packages — utils, auth, i18n, analytics, ui, config                                                                                                                                                                                               | 31         |
| Shared | Infrastructure — Docker, Nginx, K8s, Terraform, Ansible, Monitoring                                                                                                                                                                               | 12         |
| Shared | Docs, E2E, Scripts, Tooling, CI                                                                                                                                                                                                                   | 34         |
| Shared | Root — Workspace config & meta files                                                                                                                                                                                                              | 27         |

---

## Appendix B — Domain Deep-Dive: API (Laravel Backend) (293 files)

# API (Laravel Backend) — `apps/api`

## 1. Overall Purpose & Responsibilities

`apps/api` (`@tmtu/api`) is the **Laravel 12 / PHP 8.x backend** for the Toshkent Davlat Tibbiyot Universiteti (TMTU) Termiz Filiali public website. It is the single source of truth for all content and the only writable surface in the system. It exposes a versioned `/api/v1` REST API serving two Next.js front-ends (public web `:3000`, admin `:3001`).

Core responsibilities:

- **Content delivery**: news, pages (hierarchical tree), departments, staff, faculties, directions, FAQs, testimonials, partners, banners, talented students, career-center info, student-life photos, library resources, journal issues — all multilingual (`uz`/`ru`/`en` JSONB).
- **Inbound form intake**: contact messages, conference registrations, job applications (sensitive HR PII), student works.
- **Site configuration / i18n**: `site_contents`, `translations`, `site_media`, `contact_locations` (two parallel key/value i18n stores).
- **Global search**: JSONB/GIN-backed multilingual search.
- **Media subsystem**: validated upload, WebP conversion, private/public disk routing, HTTP Range streaming, download, stats.
- **Auth & RBAC**: Sanctum bearer tokens, password reset, Spatie Permission (3 roles), super-admin user management.
- **Cache + ISR invalidation**: Redis tag-aware caching plus a webhook that pings the Next.js `/api/revalidate` endpoint.

Infrastructure baseline: **PostgreSQL 16** (JSONB, GIN/BRIN/partial indexes) + **Redis 7** (cache DB1, session, queue). `docs/API.md` catalogs **146 endpoints across 27 controllers**.

---

## 2. Architecture & Key Patterns

### The canonical request pipeline

```
Route (api.php /v1 group: ApiPerformance + throttle:120,1)
  → route middleware (auth:sanctum + role:… on protected groups)
  → FormRequest (authorize() + rules() + prepareForValidation boolean coercion)
  → Controller (thin delegation)
  → Service (Spatie QueryBuilder + CacheService::remember + DB::transaction on writes)
  → Model (Spatie traits: Translatable/Media/Sluggable/Permission)
  → Resource (getTranslations() {uz,ru,en}, media URLs, conditional fields)
  → JSON envelope {success, message, data}
```

**~22 of 30 controllers follow this exactly** (1–4 line methods delegating to an injected `private readonly *Service`). Exceptions: `UserController` (direct Eloquent, inline validation), `SiteContentController` (inline Storage + WebP), `MediaController` (447 lines of logic).

### Base classes & response envelope

- `app/Http/Controllers/Controller.php` — **empty** abstract base. Laravel 12 dropped `AuthorizesRequests`/`ValidatesRequests`, so `$this->authorize()` is unavailable; **all authorization is route-middleware-based** (no policies anywhere).
- `app/Http/Controllers/Api/BaseController.php` — provides `success($data,$msg,$code)`, `error($msg,$code,$errors)`, `paginated($paginator,$resourceClass,$msg)` (adds `meta{current_page,last_page,per_page,total,from,to}` + `links{first,last,prev,next}`).
- **Envelope inconsistency**: some `index()` use `paginated()` (with meta/links), others return a flat `Resource::collection()` inside `success()` — frontend/SDK must branch per endpoint (see Findings).

### Service-layer pattern (uniform)

Each domain service exposes `getAll(Request, $onlyActive=true)`, `findById/findBySlug/findByIdentifier`, `create(array)`, `update(int,array)`, `delete(int)`. Reads wrap Spatie QueryBuilder (`allowedFilters`/`allowedSorts`/`defaultSort`) in `CacheService::remember(...)` keyed by `requestKey(prefix, query+flag)`. `per_page` is universally clamped `max(1, min((int)per_page, 100))`. Writes run in `DB::transaction`, manage media collections, then call `CacheService::clearModel(prefix)` **after commit** (a documented "observer file-cache bug workaround").

### Cache invalidation (dual-channel, partly redundant)

1. **Observers**: `AppServiceProvider::boot()` registers `ModelCacheObserver` on ~20 models (Page registered **twice**: `PREFIX_PAGES` + `PREFIX_NAV`), plus bespoke `NewsObserver` and `ContactMessageObserver`.
2. **Explicit service calls**: services _also_ call `clearModel()` because the observer is unreliable on the file driver.
   On Redis both fire → **double flush** (pure overhead). Cross-entity coupling is hand-wired: Direction/Faculty clear both DIRECTIONS+FACULTIES; Staff clears STAFF+DEPARTMENTS; News clears NEWS+SEARCH.

### Bootstrap (Laravel 12 slim skeleton)

`bootstrap/app.php` is the single composition root (`Application::configure()->withRouting()->withMiddleware()->withExceptions()->create()`) — **no `Http/Kernel.php`, no `Exceptions/Handler.php`**. The `withExceptions` block is the API error backbone: each exception type (`NotFound`→404, `ModelNotFound`→404, `MethodNotAllowed`→405, `Authentication`→401, `Validation`→422, Spatie `Unauthorized`→403, Spatie `InvalidQuery`→400, `TooManyRequests`→429, catch-all `Throwable`→500) maps to `{success:false,message,errors}` **only when `$request->is('api/*')`**. Error strings are **hardcoded Uzbek** at this layer (bypassing `lang/`). Scheduling is Kernel-less — lives entirely in `routes/console.php`.

### PostgreSQL-aware data layer

Query scopes are co-designed with named PG indexes (documented in PHPDoc): partial indexes for published/active, **GIN** (`jsonb_path_ops`) for JSONB search, **BRIN** on `created_at` for time-series. Translatable columns are JSONB `{uz,ru,en}`. Two divergent JSONB search idioms coexist (see Findings).

---

## 3. Concrete Inventory

### Models (24) — `apps/api/app/Models/`

`News`, `Page`, `Department`, `Staff`, `Faculty`, `Direction`, `Faq`, `Banner`, `Partner`, `Testimonial`, `ContactMessage`, `ContactLocation`, `SiteContent`, `SiteMedia`, `Translation`, `CareerCenterInfo`, `ConferenceRegistration`, `JobApplication`, `JournalIssue`, `LibraryResource`, `StudentLifePhoto`, `StudentWork`, `TalentedStudent`, `User`.

Trait composition convention: `HasFactory, HasSlug, HasTranslations, InteractsWithMedia, SoftDeletes`. Highlights:

- `News.php` — richest model: 6 index-mapped scopes, 8 media collections, queued WebP conversions.
- `Page.php` — hierarchical tree: self-referential `parent/children/allChildren`, `boot()` saving hook auto-computes `depth`/materialized-`path` on `parent_id` change; `private_docs` on LOCAL disk; JSONB containment search.
- `User.php` — `Authenticatable` + `HasApiTokens` (Sanctum) + `HasRoles` (RBAC) + `SoftDeletes` (the only model using RBAC).
- `JobApplication.php` — ~30 fillable HR fields (incl. `is_convicted`, `salary`, `birthday`); all file collections on LOCAL private disk; **no `$hidden` array**.
- `StudentWork.php` — only inbound-file model bypassing Spatie MediaLibrary (raw `file_path`/`file_name`).

### Enums (7, backed string) — `apps/api/app/Enums/`

`ContactStatus`, `DirectionLevel`, `FaqCategory`, `FileType` (+`maxSizeMB`), `LibraryCategory`, `NewsCategory`, `UserRole` (+`permissions()`). Only `DirectionLevel` & `NewsCategory` are wired into `Rule::in` validation; the rest are **decorative** (not used as Eloquent casts).

### Observers (4) — `apps/api/app/Observers/`

`ModelCacheObserver` (generic, ~20 models), `NewsObserver` (News, after-commit), `ContactMessageObserver` (logs only), `MediaObserver` (**NEVER registered** — dead code).

### Traits (1) — `apps/api/app/Traits/`

`ConvertsToWebp.php` — GD-based image→WebP (used by ~15 services + `MediaUploadService`).

### Controllers (30) — `apps/api/app/Http/Controllers/`

`Controller`(base), `Api\BaseController`, `AuthController`, `PasswordResetController`, `UserController`, `NewsController`, `DepartmentController`, `StaffController`, `FacultyController`, `DirectionController`, `FaqController`, `TestimonialController`, `PartnerController`, `BannerController`, `PageController`, `ContactController`, `ContactLocationController`, `ConferenceRegistrationController`, `JobApplicationController`, `StudentWorkController`, `TalentedStudentController`, `CareerCenterInfoController`, `StudentLifePhotoController`, `LibraryResourceController`, `JournalIssueController`, `SiteMediaController`, `SiteContentController`, `TranslationController`, `MediaController`, `SearchController` (invokable).

### Routes — `apps/api/routes/`

- `api.php` (358 lines) — **sole API route map**. `GET /api/health` outside v1 (`throttle:10,1`, pings DB PDO + Cache put/forget → 200/503). Everything else under `Route::prefix('v1')->middleware([ApiPerformance::class,'throttle:120,1'])`. Public read block + public writes (`contact`, `conference-registrations`, `job-applications`, `student-works`). Protected: `auth:sanctum` → `role:super-admin` (UserController) + `role:super-admin|admin` (all admin CRUD).
- `console.php` — scheduler (9 jobs): `cache:warm` /30min, `media-library:clean` hourly, `media:cleanup-temp` /6h, `media:health` 02:00, `db:backup` 03:00, `media:backup` 03:30, `media:clean-orphans` Sun 04:00, `media:cleanup` Sun 04:30, `project:stats` 08:00.
- `web.php` — single `GET /` static JSON banner.

**Throttles**: global 120/1; login 20/1; forgot/reset 10/1; health 10/1; contact 10/1; conference 10/1; job-applications 10/5; student-works 10/5; search 30/1.

### FormRequests (47) — `apps/api/app/Http/Requests/`

`BaseFormRequest` (boolean coercion), `MediaUploadRequest`, `Auth/LoginRequest`, and Store/Update pairs per entity under namespace folders. Store-only: `ConferenceRegistration`, `JobApplication`, `StudentWork`. SiteContent: `UpsertSiteContentRequest` + `BatchUpsertSiteContentRequest`.

### Resources (22) — `apps/api/app/Http/Resources/`

`Banner`, `CareerCenterInfo`, `ConferenceRegistration`, `ContactLocation`, `ContactMessage`, `Department`, `Direction`, `Faculty`, `Faq`, `JobApplication`, `JournalIssue`, `LibraryResource`, `News`, `Page`, `Partner`, `SiteContent`, `SiteMedia`, `Staff`, `StudentLifePhoto`, `StudentWork`, `TalentedStudent`, `Testimonial`, `Translation`, `User`.

### Middleware (1) — `apps/api/app/Http/Middleware/`

`ApiPerformance.php` — GET-only cache headers. Authenticated (bearerToken OR user) → `private/no-store`; anonymous → xxh3 ETag, 304 on `If-None-Match`, `Cache-Control: public max-age=300 s-maxage=600` SWR, `Vary: Accept, Accept-Encoding, Accept-Language`.

### Services (30) — `apps/api/app/Services/`

24 domain CRUD services + 6 infra: `CacheService` (23 PREFIX\_\* constants, 4 TTL tiers, Redis tags + file-driver `_tracked_keys` fallback), `FrontendRevalidationService` (22 prefix→Next.js tag map, `Http::timeout(5)->retry(2,500)`), `MediaUploadService` (986 lines, security-critical), `MediaPathGenerator` (`{modelFolder}/{id}/{collection}/` + legacy fallback), `ForceFileRemover` (Spatie disk cleanup), `HtmlSanitizer` (regex-only, used by Direction/Faculty only), `SearchService` (JSONB ILIKE prefix-match).

### Providers (1) — `apps/api/app/Providers/AppServiceProvider.php`

`boot()`: `Model::preventLazyLoading` + `preventSilentlyDiscardingAttributes` (strict non-prod, log in prod) + 22 observer registrations. `register()` empty.

### Console Commands (14) — `apps/api/app/Console/Commands/`

`CleanOrphanMedia`, `CleanupTempFiles`, `DatabaseBackup`, `DatabaseRestore`, `DeployRefresh` (post-deploy orchestrator), `FullBackup`, `MediaBackup`, `MediaCleanup`, `MediaHealth`, `MediaMigrateStructure`, `ProjectStats`, `SafeSeed`, `StorageSetup`, `WarmCache`.

### Migrations (48) — `apps/api/database/migrations/`

45+ tables: Laravel framework, all content/domain, Spatie Permission (5) + Media. Key perf migration `2026_02_21_000001_add_performance_indexes.php` (JSON→JSONB ×21 cols, 7 GIN, 14 composite/partial, 2 BRIN, SET STATISTICS). Page tree: `2026_04_06_000001_add_tree_structure_to_pages_table.php`.

### Seeders (20) + Factories (11) — `apps/api/database/{seeders,factories}/`

`DatabaseSeeder` creates **47 permissions** (CLAUDE.md says 30), 3 roles, super-admin `admin@tdtutf.uz` (password from `env('ADMIN_PASSWORD')`, throws if unset), then calls 12 content seeders. `NewsSeeder` (30 hand + 300 factory = 330) is the **only** place a factory runs. `translations.json` = 842 entries / 62 groups. **9 of 11 factories are broken/unused** (column drift).

### Config / Tests / Lang — `apps/api/{config,tests,lang}/`

12 config files; Sanctum 480min token; CORS pinned to `:3000`/`:3001` + permissive localhost regex; Redis cache DB1; `phpunit.xml` → real Postgres `tmtu_termiz_test`. Tests: only 2 Feature classes (`AuthTest`, `PublicApiTest`), **zero Unit tests**. `lang/{en,ru,uz}/messages.php` + only `uz/validation.php`.

---

## 4. Data & Control Flow

### Typical public list read

`Request → v1 group (ApiPerformance + throttle:120,1) → Controller::index reads optional user role via $request->user()?->hasAnyRole(...) → Service::getAll($request, $onlyPublished) → Spatie QueryBuilder + CacheService::remember → paginator → BaseController::paginated(Resource collection + meta/links)`. ApiPerformance then adds ETag/Cache-Control for anonymous GETs (304 on match) or no-store for authenticated.

### Write + cache invalidation

`FormRequest validates (multilingual {uz,ru,en} arrays) → Service::create/update in DB::transaction → media collection management (WebP via ConvertsToWebp) → commit → ModelCacheObserver fires (after commit for News/Media) → CacheService::clearModel(prefix) + 'search' → FrontendRevalidationService::revalidateByPrefix POSTs to Next.js {frontend_url}/api/revalidate with shared secret`. Services _also_ call `clearModel()` explicitly (redundant on Redis).

### Multilingual input contract

Translatable field validated as `field => required|array` (Store) / `sometimes|array` (Update); `field.uz` required (Store) / `required_with:field` (Update); `field.ru`/`field.en` nullable. Persisted to JSONB by Spatie Translatable; emitted by Resources via `getTranslations()`. Fallback chain `uz→ru→en→empty`.

### Auth flow

`POST /api/v1/auth/login` → `AuthController`: RateLimiter lockout (5 attempts/15min keyed by `sha1(email|ip)`), timing-safe `Hash::check` against dummy bcrypt (enumeration-safe), token rotation deletes only tokens older than 24h (multi-session), returns `UserResource + token`. `Authorization: Bearer <token>` thereafter.

### Page tree

`Page::boot()` recomputes `depth`/`path` only when `parent_id` `isDirty` — moving a node updates that node but does **not** cascade to descendants (stale paths).

---

## 5. Notable Conventions

- **Spatie-centric models**: consistent trait order; translatable fields as `public array $translatable`; `casts()` method form; defaults via `protected $attributes`; immutable slugs (`doNotGenerateSlugsOnUpdate()->preventOverwrite()`).
- **Index-aware scopes**: PHPDoc names the backing PG index; partial/GIN/BRIN strategy.
- **Media routing**: public disk for browser assets, LOCAL disk for private (`private_docs`, HR files, staff personal docs). Queued WebP conversions (`thumbnail`/`medium`/`large`/`desktop`/`mobile`).
- **Boolean coercion** in `BaseFormRequest::prepareForValidation()` for multipart string booleans (`''→false`).
- **Resource conventions**: `getTranslations()`; media URL + conversion variants (with N+1 mitigation via single `getFirstMedia()`); heavy fields gated by `$this->when(array_key_exists(...getAttributes()))`; relations via `whenLoaded()`/`whenCounted()`; timestamps via `?->toISOString()`.
- **Three admin-detection idioms** coexist: route `role:` middleware (the real gate); `$request->user()?->hasAnyRole(...)` flag in public index/show (reveals drafts to authed admins); manual `auth('sanctum')->user()` in try/catch (Banner/ContactLocation).
- **Idempotent seeders**: "⚡ XAVFSIZ" — create-if-empty or `updateOrCreate` on natural key; safe to re-run in prod.
- **Idempotent late migrations**: `Schema::hasTable/hasColumn` + `pg_indexes` probes (hardened reactively).
- **Uzbek-language** docblocks, console UX, success messages, and exception strings throughout (i18n inconsistency for API responses — some controllers use `__('messages…')`, others hardcode Uzbek).
- **PostgreSQL-only**: GIN/BRIN/jsonb_path_ops/SET STATISTICS make migrations non-portable; CI/tests must run on Postgres.

---

## 6. Dependencies

### Internal (cross-slice)

- **Services ⇄ Models ⇄ Observers ⇄ CacheService ⇄ FrontendRevalidationService** — the core write/invalidate loop.
- **Controllers → Services / FormRequests / Resources** — the documented pattern.
- `ConvertsToWebp` trait → consumed by ~15 services + `MediaUploadService` + `SiteContentController`.
- `MediaUploadService::FILE_LIMITS` → single source of truth for `MediaUploadRequest` size/extension limits.
- `config/media-library.php` → binds `ForceFileRemover` (`file_remover_class`) + `MediaPathGenerator` (`path_generator`) — **NOT** via the Provider.
- `AppServiceProvider` → registers all observers; `bootstrap/app.php` → registers RBAC middleware aliases + exception handlers.
- `DirectionLevel`/`NewsCategory` enums → `Rule::in` in FormRequests.
- `lang/*/messages.php` → controller/resource messages (separate from bootstrap exception strings).

### External (packages & infra)

- **Spatie suite**: laravel-translatable, laravel-medialibrary, laravel-sluggable, laravel-permission, laravel-query-builder, spatie/image.
- **Laravel Sanctum 4** (bearer + stateful SPA, 8h tokens), **predis 3** (Redis 7), **PostgreSQL 16**.
- **PHP GD** (required, WebP) + optional **Imagick** (TIFF fallback), **ZipArchive** (media backups).
- **Laravel HTTP client** → Next.js `/api/revalidate` (external webhook target, shared secret).
- **External binaries**: `pg_dump`, `pg_restore`, `psql`, `find`/`chmod`/`chown` (Linux ops).
- **Dev tooling**: PHPUnit 11, Laravel Pint, Larastan 3 (PHPStan), Pail/Sail.
- **External data files**: `translations.json` (from `frontend/scripts/export-i18n.js`); `NavigationSeeder` mirrors `frontend/src/config/navigation.ts`; seed assets from `../rasim/*.webp`, `../admin/public/images/`.

---

## 7. Consolidated Findings (Tech Debt · Risks · Bugs · Security · Inconsistencies)

### Security & Privacy

1. **Unvalidated public file upload** — `StudentWorkService::create` stores via `$file->store('student-works','public')` with **zero validation** (no MIME/extension/double-extension/size/SVG checks), bypassing `MediaUploadService`. Arbitrary-file-upload gap on a public endpoint.
2. **SiteMedia accepts any file type** — `Store/UpdateSiteMediaRequest` validate `file => required|file|max:51200` with **no `mimes:` constraint** (50MB any-type for admins), unlike every other file request.
3. **Hardcoded revalidation secret fallback** — `config/app.php` `revalidation_secret` falls back to literal `'tdtutf-revalidation-secret-2026'` (a known repo constant); `.env.example` uses a _different_ `…-change-me` value. If prod omits `REVALIDATION_SECRET`, the ISR webhook auth is bypassable.
4. **JobApplication PII exposure** — model stores `is_convicted`, `salary`, `birthday`, passport/contract scans but has **no `$hidden` array**; all scalar PII serializes by default unless filtered downstream. Files correctly on private disk; scalars are not protected.
5. **Public `media/{modelType}/{modelId}` (`MediaController::show`)** returns media URLs for whitelisted types **regardless of published/active state** — media for unpublished news/pages can be enumerated by id.
6. **Public `GET contact/stats`** — exposes aggregate contact-message statistics with no auth (only global 120/min throttle).
7. **CORS over-permissive** — `config/cors.php` regex permits **any** localhost/127.0.0.1 port over http OR https with `supports_credentials=true`. Must be dropped in prod.
8. **Inconsistent XSS escaping across Resources** — only ~9 of 22 escape user/translatable text (`CareerCenterInfo`, `ConferenceRegistration`, `ContactMessage`, `Direction`, `Faculty`, `JobApplication`, `LibraryResource`, `StudentWork`, `TalentedStudent`). **Un-escaped**: `Banner`, `ContactLocation`, `Department`, `Faq`, `Staff`, `Testimonial`, `SiteContent`, `Translation`, `JournalIssue`, `Partner`, `StudentLifePhoto`. Defense relies entirely on frontend DOMPurify; double-encodes where the client also sanitizes.
9. **Regex HTML sanitizers** — `HtmlSanitizer` (Direction/Faculty only) and `MediaUploadService` SVG XSS scan are regex/blocklist-based, brittle vs obfuscation; News/Page rich-text is **not** server-sanitized.
10. **`MediaController::download`** streams any media id to any admin with **no ownership/collection/disk-type check**; sets `Content-Length` from possibly-stale `$media->size`; only catches `ModelNotFoundException` → missing-on-disk I/O errors 500 mid-stream. Range regex ignores multi-range requests.
11. **`User` uses `SoftDeletes` + Sanctum** — soft-deleted users could still authenticate unless the auth provider excludes `deleted_at` (unverified).

### Bugs

12. **`MediaController::clearModelCache` prefixMap bug** — maps `faculty => PREFIX_DIRECTIONS` (faculty cache never invalidated, directions wrongly cleared); `library-resource`/`journal-issue` → `PREFIX_PAGES`; several types (contact-message, site-media, job-application, talented-student, etc.) absent → caches never cleared on media upload.
13. **Migration `2026_04_13_210000` `down()` bug** — `$indexes` map uses string key `'directions'` twice; PHP dedupes → on rollback only `idx_directions_sort_order` dropped, `idx_directions_faculty_id` leaks.
14. **Testimonials double-encoding** — `2026_03_04_000001` wrapped already-JSON `role` in `jsonb_build_object`, requiring the irreversible repair migration `2026_03_04_000003`.
15. **`MediaObserver` never registered** — the documented Windows orphaned-media-folder cleanup never runs (dead code; no `Media::observe(...)` anywhere).
16. **`MediaMigrateStructure` doc/behavior mismatch** — docblock claims it updates the DB path; `processMedia()` only touches disk, relying on `MediaPathGenerator::isLegacyMedia()` runtime `Storage::exists()` per resolution (perf cost at scale).
17. **`create_media_table.php` has no `down()`** — `migrate:rollback` leaves the `media` table behind.
18. **`UpdateBannerRequest`** sets `title.uz => sometimes|string` (not `required_with`), so partial updates can drop `uz` — unlike other entities.
19. **Page tree re-parent staleness** — `Page::boot()` only fixes the moved node's `depth`/`path`; descendants become stale.
20. **`DatabaseRestore`** interpolates `$database` directly into the `pg_terminate_backend` SQL (unescaped, inconsistent); also interactive → would hang if scheduled.
21. **9 of 11 factories broken** — `DepartmentFactory` (`head_of_department`/`order`), `PartnerFactory` (translatable `name`/`website`/`type`/`order`), `TestimonialFactory` (`author_name`/`rating`), `FaqFactory` (English categories), `DirectionFactory` (missing required `price_daytime`/`price_remote`) — all drifted from current schema; crash if any test calls them.

### Risks & Inconsistencies

22. **Inconsistent JSONB search semantics** — News/JournalIssue/LibraryResource do **substring ILIKE** (`col->>locale ILIKE %term%`); Page/Department/Staff/Direction/Faq do **exact containment** (`col @> {locale:term}::jsonb`) — the latter silently fails on partial input. Locale whitelisting is also inconsistent (News/Journal/Library whitelist; Page/Dept/Staff/Direction/Faq do not).
23. **`FrontendRevalidationService` is synchronous, not "fire-and-forget"** — `Http::timeout(5)->retry(2,500)` blocks every admin write up to ~11s when the frontend is unreachable; no queue dispatch. (Matches memory note "revalidation is polling not SSE".)
24. **Redundant cache invalidation on Redis** — both `ModelCacheObserver` and explicit `clearModel()` fire on every write.
25. **Orphaned/unmanaged cache keys** — `conf_reg:unread_count`, `contact:unread_count`/`contact:stats`, `job_applications:unread_count`, `student_works:unread_count` are outside the registered PREFIX list and no observer → admin badge counts stale up to 30–60s TTL; `ConferenceRegistration` model also absent from observer registration.
26. **Decorative enums** — `ContactStatus`, `FaqCategory`, `LibraryCategory`, `FileType` not used as Eloquent casts → DB values can diverge. `FaqCategory` self-documents a legacy duplicate (`general` + `umumiy` both label "Umumiy"). `ContactMessage` carries both legacy `is_read` boolean AND `status` string (uncast) — dual state can drift.
27. **Two sources of truth for RBAC** — `UserRole::permissions()` hardcodes the permission matrix, duplicating the seeder's 47 permissions; drift risk. `DatabaseSeeder` defines 47 permissions vs CLAUDE.md's "30". The **`editor` role is never referenced in any route middleware** → editors currently get no admin routes.
28. **Authorization asymmetry** — Department/Staff: `Store` requires `super-admin|admin` but `Update` _also_ allows `editor` (likely unintended). `UpdateContactRequest`/`ContactLocation` Store/Update return `authorize()=true` (rely solely on route middleware).
29. **List-shape inconsistency** — `Banner`(public)/`ContactLocation`/`SiteMedia.index`/`SiteContent`/`Translation.publicIndex` return flat collections (no meta) while most use `paginated()`.
30. **Two parallel i18n stores** — `site_contents` and `translations` serve near-identical purposes; 7 seeders (Navigation, Translation, BizHaqimizda, LibraryResource, CareerCenterInfo, SiteMedia, StudentLifePhoto) are **excluded** from `DatabaseSeeder->call()` → plain `db:seed` never builds nav/translations.
31. **Migration ordering fragility** — duplicate timestamp prefixes: `2026_02_21_000001` (×2: perf-indexes + soft-deletes), `2026_03_05_000001` (×2), `2026_03_05_100000` (×3). Ordering resolved only by alphabetical filename.
32. **SoftDeletes churn** — added broadly, then _removed_ from `library_resources` & `student_works` (`2026_04_12_120000`/`130000`) in favor of forceDelete; verify models don't still declare `SoftDeletes` (would reference missing `deleted_at`).
33. **Translatable columns without GIN** — `talented_students`, `career_center_infos`, `site_contents`, `student_life_photos`, `banners.button_text` etc. remain plain `json` (outside the fixed 21-column conversion allowlist) → inconsistent search perf.
34. **Three overlapping media-cleanup commands** with inverted safety defaults — `CleanOrphanMedia` deletes _unless_ `--dry-run`; `MediaCleanup` dry-runs _unless_ `--force`. Both scheduled weekly (Sun 04:00 + 04:30). Operational footgun.
35. **Three different temp/queue config conflicts** — `media-library.php` `queue_connection_name='database'` vs redis default (inert but misleading); two temp dirs (`temp-media-uploads` vs `storage/app/temp`).
36. **DRY debt** — `escapeTranslations()`/`escape()` copy-pasted into ~8 resources; `{uz,ru,en}` validation block hand-duplicated across ~40 requests; `NewsObserver` duplicates `ModelCacheObserver` (and differs by running after-commit).
37. **`preventLazyLoading`** throws in non-prod — `PageService::findByPath` walks `$current->parent` (lazy ancestor chain) → would throw in dev for deep paths.
38. **`ConvertsToWebp` omits `imagedestroy()`** (cites PHP 8.5 GC) — peak memory spikes on bulk conversion under PHP 8.3/8.4.
39. **Thin test coverage** — only ~10 assertions across 2 Feature classes; **zero unit tests**; no tests for search, pages tree, media, admin CRUD, conference/job/student-work, users, site-contents, translations. `tests/CreatesApplication.php` is orphaned dead code; `phpunit.xml` references uninstalled PULSE/TELESCOPE and needs a live Postgres test DB.
40. **PHP version mismatch** — `composer.json` requires `php ^8.2` but CLAUDE.md/docs say 8.3.
41. **Uzbek-only exception envelope** — bootstrap error strings hardcoded Uzbek regardless of request locale, bypassing `ru`/`en` `lang/messages.php`; only `uz` has `validation.php` → mixed-language responses for non-uz clients.

### TODOs

42. **`ContactMessageObserver`** has a commented-out admin-email `Notification` — admins are **not** notified of new contact messages despite the observer's stated purpose.

### Open Questions (carry-forward for whoever touches prod)

- Is `MediaObserver` disabled intentionally, or was registration dropped by accident?
- Is the `@>` vs ILIKE search divergence intentional per-entity or a silent bug?
- Should `FrontendRevalidationService` be queue-dispatched instead of blocking admin writes?
- Should `StudentWorkService` route uploads through `MediaUploadService`?
- Does the auth provider exclude soft-deleted Users?
- Is `UserRole::permissions()` or the seeder the source of truth on drift?
- Are the 7 seeders excluded from `DatabaseSeeder->call()` run by a separate deploy script (`scripts/deploy*.sh`)?

---

## Appendix C — Domain Deep-Dive: Web (Public Next.js App) (181 files)

# Web (Public Next.js App) — `apps/web` (`@tmtu/web`)

## 1. Overall Purpose & Responsibilities

`apps/web` is the **public-facing website** of Toshkent Davlat Tibbiyot Universiteti (TMTU) Termiz Filiali — a trilingual (uz/ru/en) **Next.js 16 / React 19** App Router application. It is the largest, most content-heavy app in the monorepo and is responsible for every visitor-facing surface:

- **Homepage** — hero/banner slider, directions tabs, advantages, stats counter, news bento grid, testimonials, partners, location map, mission.
- **`abiturientlarga` (For Applicants)** — admissions hub: study programs by degree level (bakalavriat/magistratura/ordinatura), faculty- and direction-detail pages, transfer/restoration, entrance-exam subjects, admission-commission redirect.
- **`biz-haqimizda` (About Us)** — institutional hub: about page, org structure (`tuzilma`: rectorate, staff, departments, faculties, advisory bodies, branches), a deep regulatory-documents tree (`meyoriy-hujjatlar`: ~9 categories + ~25 leaf pages), anti-corruption, quality policy, appeals, general info, virtual reception form.
- **`faoliyat` (Activities)** — scientific activity, doctoral studies, a scientific-journal mini-site, curricula, international cooperation, a DB-driven research center.
- **`talabalarga` (For Students)** — career center + job-application/student-work forms, library with detail pages + external redirects.
- **`yangiliklar` (News)** — news/events/conferences feeds with detail pages, share buttons, countdown timer, conference registration.
- **Static/legal & utility** — `faq`, `aloqa` (contact), `privacy`, `terms`, a catch-all `[...slug]` CMS renderer, and internal `/api` route handlers (health, revalidate webhook, version-poll endpoint).
- **Cross-cutting systems** — SEO/JSON-LD instrumentation, a WCAG-2.1-AA accessibility toolkit, GDPR-gated analytics, PWA manifest, and ISR/on-demand revalidation driven by the admin app.

It consumes the Laravel API (`/api/v1/*`) for all dynamic content and is built for Docker (`output: 'standalone'`) with the React Compiler enabled.

---

## 2. Architecture & Key Patterns

### Routing

- **App Router** with a localized route group: every public page lives under `apps/web/src/app/[locale]/(main)/`. `[locale]` is a real URL path segment (uz/ru/en); `(main)` is a layout group with **no URL segment** providing shared chrome.
- `apps/web/src/app/[locale]/layout.tsx` runs `generateStaticParams` over `['uz','ru','en']` and guards invalid locales via `isValidLocale()` → `notFound()`.
- `apps/web/src/app/[locale]/(main)/layout.tsx` is the shared shell: awaits `loadTranslations()` + `getLanguage()` once/request, calls `getNavigation()` (try/catch fallback), and wraps `Header`/`Footer`/`SearchModal`/`AutoRefresh`/`AccessibilityWidget` in `NavigationProvider`.
- **No `[locale]/page.tsx`** — the home route is `(main)/page.tsx`. The real 404 is `apps/web/src/app/[locale]/not-found.tsx` (there is **no** root `not-found.tsx`).

### Server vs Client rendering

- Almost every page is an **async Server Component**. Three content strategies coexist:
  1. **Pure static/i18n** pages built entirely from `s()` keys (most of `faoliyat/ilmiy-faoliyat`).
  2. **DB-with-static-fallback** — `getPageBySlug(...)` → sanitized HTML if present, else hardcoded blocks.
  3. **Fully data-driven** — news feeds, library, journal issues, talented students, `[...slug]`.
- **Client route pages** (rare): `biz-haqimizda/tuzilma/filiallar/page.tsx` (`'use client'`, browser fetch + Leaflet `ssr:false`, needs a sibling `layout.tsx` purely to host `generateMetadata`, which client pages cannot export), `aloqa/page.tsx` (`useEffect` fetch), and `faoliyat/.../ilmiy-jurnal/boglanish/page.tsx`. Plus client islands: all forms, share buttons, countdown timer, FAQ accordions, the a11y panel.

### Language resolution (systemic, important)

- Server pages resolve language via `getLanguage()` (`apps/web/src/lib/language.ts`): **`x-locale` header (set by middleware) → `lang` cookie → `DEFAULT_LANGUAGE` (uz)**. Pages **do NOT read the `[locale]` route param for language** — they re-derive it from headers/cookies. The visible URL locale and rendered content language can therefore **desync** if middleware is bypassed.
- Client components mirror via `useLanguageStore` (Zustand; cookie + pathname sync).

### Data fetching (layered)

```
ApiClient (lib/api.ts)
  → service fns (lib/services.ts, ~30 typed, server-side, cache-tagged)
    → Server Components directly
    OR
    → client TanStack Query hooks (hooks/useApi.ts, ~14 of ~30 fns wrapped)
```

- `apps/web/src/lib/api.ts` — `ApiClient` (`get/post/postFormData/put/delete`), `ApiError`, 15s `AbortSignal.timeout`. **Cache policy: dev = `no-store`; prod = `next:{ revalidate: 60, tags }`**. Base = `NEXT_PUBLIC_API_URL` (web uses `.../api`, so services prepend `/v1`).
- `apps/web/src/lib/services.ts` — all endpoints hardcode `/v1/...`; builds Spatie Query Builder `filter[...]` params; each call tags cache for ISR.
- **Two distinct fetch paths coexist**: RSC (services + Next fetch cache) and client (TanStack Query, `staleTime 60s`, `refetchOnWindowFocus: false`). Hooks duplicate query params already typed in services.
- **Resilience convention**: nearly every data call is wrapped in `.catch()` returning an empty-shaped fallback, and many pages also ship hardcoded i18n fallbacks (`getDefaultItems`/`getFallback*`/`META_BY_LOCALE`) so pages render when the API/CMS is down.

### Revalidation / live-refresh

- Admin edits → backend POSTs `apps/web/src/app/api/revalidate/route.ts` (shared secret) → `revalidateTag(tag,'default')` + `revalidatePath(/${locale}${p}, 'layout')` for uz/ru/en + bare path → `notifyUpdate()` bumps `globalThis.__revalidateVersion = Date.now()`.
- `apps/web/src/app/api/revalidate/stream/route.ts` — **misnamed "stream"; it is a JSON polling endpoint**, NOT SSE. `GET` returns `{version}`.
- `apps/web/src/components/shared/AutoRefresh.tsx` polls it **every 2s**; on version change calls `router.refresh()`, cache-busts `/storage/media/` images, full-reloads after 3 refreshes. (This is the documented "revalidation is polling not SSE" gotcha.)

### i18n

- Dual-track: **`s(key, lang)`** for UI strings, **`t(field, lang)`** for translatable DB JSONB fields (fallback `lang → uz → ru → en`).
- `apps/web/src/lib/i18n.ts` is a **4142-line static `ui` dictionary** (~1094 keys × uz/ru/en) + a module-level `dbTranslations` cache loaded once via `loadTranslations()` (fetches `/v1/translations`, deduped through a shared `loadPromise`, invoked in the `(main)` layout). `s()` resolves **DB → DB.uz → static → static.uz → raw key** (missing keys render as literal dotted strings).

### SEO

- `apps/web/src/lib/seo.ts` (1182 lines): `SITE_URL = https://tashmedunitf.uz`, `PAGE_SEO` registry (~95 page configs, UZ-only titles/descriptions), `buildMetadata()`/`buildArticleMetadata()` (hreflang alternates + OG/Twitter), and **9 JSON-LD generators** (Organization, Website, Breadcrumb, Article, FAQ, Course, Event, Person, Department, LocalBusiness).
- Two metadata styles coexist: `buildMetadata(pageKey, overrides)` and hand-rolled OG blocks (`abiturient-helpers.ts`, `fakultetlar/[id]`, `kafedralar/[slug]`, `xodimlar/[id]`). Route handlers `sitemap.ts` + `robots.ts` complete the SEO surface.

### Styling / a11y / state

- **Tailwind v4 CSS-first** — no `tailwind.config.ts`; `globals.css` does `@import 'tailwindcss'` plus a large bespoke WCAG theming engine (6 color schemes, font-size/spacing/line-height controls). Brand color teal `#00575B`.
- **a11y subsystem**: `A11yPreHydrationScript` injects a blocking inline script reading `localStorage 'tmtu:a11y'` to set `<html>` classes pre-hydration (anti-FOUC); `AccessibilityWidget` hydrates `useA11yStore`, applies settings, syncs cross-tab via `storage`/`a11y:change` events; all a11y UI carries `data-a11y-ui="true"`.
- **State**: Zustand (`useLanguageStore`, `useUIStore`, `useA11yStore`) — plain `create()`, **no persist middleware** (a11y store manually persists + applies DOM + emits CustomEvent).
- **HTML safety**: `isomorphic-dompurify` `DOMPurify.sanitize()` wraps **most** `dangerouslySetInnerHTML` of CMS/admin content (see findings for the exceptions).

---

## 3. Concrete Inventory

### Config & root scaffolding

| Path                                                 | Role                                                                                                                                                                                                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apps/web/next.config.ts`                            | 8 global security headers, env-aware Cache-Control across 5 matchers, image `remotePatterns` whitelist, `output:'standalone'`, `reactCompiler:true`, `transpilePackages:[@tmtu/utils,@tmtu/types]`                                               |
| `apps/web/src/app/layout.tsx`                        | Root async layout; Inter font (latin+cyrillic); large static Metadata + Viewport; reads `x-locale`; injects Organization + Website JSON-LD; mounts QueryProvider, NextTopLoader, CookieConsent, Analytics, SkipToContent, A11yPreHydrationScript |
| `apps/web/src/app/globals.css`                       | Tailwind v4 entry (~958 lines); Safari backdrop shims; Leaflet z-index fixes; WCAG theming engine                                                                                                                                                |
| `apps/web/src/app/sitemap.ts`                        | ~120 static localized routes + dynamic API entries (news/departments/faculties/directions/staff/library/journal), try/catch degrade-to-static                                                                                                    |
| `apps/web/src/app/robots.ts`                         | Per-bot rules (~20 crawlers), crawl-delay on aggressive bots, disallows `/api/ /login /_next/ /admin/`, host hardcoded to `https://tashmedunitf.uz`                                                                                              |
| `apps/web/src/app/[locale]/not-found.tsx`            | Localized 404 with `generateMetadata` (`robots index:false`)                                                                                                                                                                                     |
| `apps/web/src/middleware.ts`                         | 308-redirect non-prefixed paths to `/uz`; 2-entry legacy `redirects` map; sets `x-locale` header + `lang` cookie (365d); static-asset bypass + matcher                                                                                           |
| `apps/web/public/manifest.json`, `browserconfig.xml` | Static PWA config (theme `#1e3a5f`)                                                                                                                                                                                                              |
| `apps/web/.env.example`                              | `NEXT_PUBLIC_API_URL=.../api` (no `/v1`), `REVALIDATION_SECRET`, optional GA/Yandex/verification                                                                                                                                                 |

### Internal API route handlers (`apps/web/src/app/api/`)

- `health/route.ts` — `GET {status:'ok',service:'web',time}` (Docker healthcheck; untracked/new).
- `revalidate/route.ts` — `POST`+`OPTIONS`; secret-guarded ISR webhook; CORS limited to `ADMIN_URL`.
- `revalidate/stream/route.ts` — `GET {version}` polling endpoint (misnamed "stream").

### Lib / infrastructure layer (`apps/web/src/lib/`)

`api.ts`, `services.ts`, `i18n.ts`, `seo.ts`, `translate.ts` (`t`, a _second_ `formatDate`, `stripHtml`), `language.ts` (`getLanguage`), `locale.ts` (`isValidLocale/stripLocale/localePath`), `abiturient-helpers.ts` (`buildDirectionMetadata/buildFacultyMetadata`, `loadDirectionPage/loadFacultyPage`, `DIRECTION_KEYS/FACULTY_KEYS`), `exam-subjects-i18n.ts` (`translateExamSubject`, UZ→RU/EN for ~22 medical subjects), `a11y/{apply,storage,types}.ts`, `utils.ts` (re-exports only `cn` from `@tmtu/utils`).

### State / providers / hooks / config / data / types

- **Stores**: `apps/web/src/store/{useLanguageStore,useUIStore,useA11yStore}.ts`.
- **Providers**: `QueryProvider.tsx` (staleTime 60s), `NavigationProvider.tsx` (context exposing `NavTreeItem[]`).
- **Hooks**: `useApi.ts` (TanStack hooks: `useNews/useNewsBySlug/useDepartments/useDepartmentBySlug/useStaff/useDirections/useFaqs/useTestimonials/usePartners/useBanners/usePageBySlug/useSendContact/useSearch`), plus `useDebounce/useEscapeKey/useFocusTrap/useMediaQuery/useReducedMotion/useScrollDirection`.
- **Config**: `config/navigation.ts` (`getStaticNavigation` 7-section deep tree, `getMainNavigation` static+dynamic merge dedup-by-href, `getFooterNavigation`; **hardcodes faculty IDs `fakultet/1..5`**), `config/site.ts`.
- **Data**: `data/journal.ts` (hardcoded static journal data — likely dead/legacy).
- **Types**: `apps/web/src/types/index.ts` (312-line local SSOT — does **NOT** import `@tmtu/types`).

### Components (`apps/web/src/components/`, 54 files)

- **a11y/** (8): `A11yLiveRegion`, `A11yPreHydrationScript`, `AccessibilityFooterLink`, `AccessibilityHeaderButton`, `AccessibilityIcons`, `AccessibilityPanel` (6 sections; **only** Framer Motion + `createPortal` usage), `AccessibilityWidget`, `SkipToContent`.
- **directions/** (6): `ApplicantsPageClient` (largest admissions page — degree+faculty tabs, admission committee, measured-height FAQ, 4 DOMPurify sinks), `DirectionDetailPage`, `DirectionLevelPage`, `FacultyDetailPage`, `FacultyLevelPage`, `FacultyTabView`.
- **faq/**: `FAQContent` (canonical accordion w/ proper ARIA + DOMPurify).
- **home/** (10): `AdvantagesSection`, `BannerSlider`, `DirectionsSection`, `HeroSection`, `LocationSection` (lat 37.2242 / lng 67.2784), `MissionSection`, `NewsSection` (5-item bento), `PartnersSection`, `StatsCounterSection` (hardcoded stats), `TestimonialsSection`.
- **journal/** (4): `JournalCard`, `JournalFAQ`, `JournalNavbar`, `JournalSwiper`.
- **layout/** (4): `Footer` (async; fetches `/v1/site-contents/social`), `Header` (3-level dropdown nav; returns `null` on journal routes), `LanguageSwitcher`, `MobileMenu` (recursive accordion).
- **shared/** (16): `Analytics`, `AutoRefresh`, `Badge`, `Breadcrumb`, `Button`, `Card`, `ContactMap`, `Container`, `CookieConsent`, `LeafletMap`, `LocaleLink`, `NewsCard`, `Pagination`, `SearchModal`, `SectionTitle`, `VideoPlayer`.
- **talabalarga/**: `StudentLifeGallery`. **templates/**: `DocumentDetail`, `NavHub` (~34 lucide iconMap, 10 colorClasses). **virtual-qabulxona/**: `VirtualQabulxonaForm`.

### Backend endpoints consumed (all `/api/v1/*`)

`news`(+`/{slug}`), `pages`(+`/{slug}`, `/navigation`, `/by-path/{path}`), `departments`(+`/{slug}`), `staff`(+`/{id}`), `faculties`(+`/{id}`), `directions`(+`/{id}`), `faqs`, `testimonials`, `partners`, `banners`, `search?q=`, `site-contents/{section}`, `site-media/{key}`, `contact` (POST FormData), `contact/stats`, `contact-locations`, `library-resources`(+`/categories`, `/{slug}`), `journal-issues`(+`/{slug}`), `talented-students`, `career-center-infos`, `student-life-photos`, `conference-registrations` (POST), `job-applications` (POST multipart), `student-works` (POST multipart), `translations`.

### Key page routes (under `/[locale]/(main)/`)

- **abiturientlarga**: `/`, `/{bakalavriat|magistratura|ordinatura}`, `/{level}/[id]`, `/{level}/fakultet/[id]`, `/oqishni-kochirish-va-tiklash`, `/qabul-komissiyasi` (redirect→hub, noindex), `/test-topshiriladigan-fanlar`.
- **biz-haqimizda**: `/`, `/{umumiy-malumot|sifat-siyosati|murojaatlar-tartibi|virtual-qabulxona}`, `antikorrupsiya/*`, `meyoriy-hujjatlar/` + 9 sub-categories (~25 leaves), `tuzilma/{rektorat,xodimlar(+[id]),kafedralar(+[slug]),fakultetlar(+[id]),konsultativ-organlar,filiallar}`.
- **faoliyat**: `ilmiy-faoliyat/*` (tadqiqot, ilmiy-ishlar, konferensiyalar, iqtidorli-talabalar, oaq-tavsiya-nashrlar, doktorantura+sub-pages, ilmiy-jurnal mini-site), `oquv-faoliyati/oquv-rejalari/{bakalavriat,magistratura}`, `xalqaro-hamkorlik`, `tadqiqod-markazi`(+`/[id]`).
- **talabalarga**: `karyera-markazi`(+`bosh-ish-orinlari`+`JobApplicationForm`), `kutubxona`(+`/[slug]`, `/e-library`→unilibrary.uz, `/emerald`→emerald.com), `talaba-ishlari`(+`StudentWorkForm`).
- **yangiliklar**: `/`, `/[slug]`(+`ShareButtons`), `/konferensiyalar`(+`ConferenceClient`: CountdownTimer, ParticipateButton), `/tadbirlar`.
- **misc**: `faq`, `aloqa`(+layout), `privacy`, `terms`, `[...slug]` (catch-all CMS).

---

## 4. Data & Control Flow

1. **Request → middleware** (`middleware.ts`): ensures `/{locale}` prefix (308 redirect), applies legacy redirect map, sets `x-locale` request header + `lang` cookie.
2. **Layouts**: `[locale]/layout.tsx` validates locale → `(main)/layout.tsx` calls `loadTranslations()` (populates `dbTranslations`) + `getLanguage()` + `getNavigation()`, seeds `NavigationProvider`, renders chrome.
3. **Page (RSC)**: derives language from `getLanguage()` (header→cookie→default), calls `services.ts` fns → `ApiClient` → Laravel `/v1/*` (cache-tagged, `revalidate:60` in prod). Translatable fields resolved via `t()`, UI strings via `s()`, CMS HTML sanitized via DOMPurify and injected with `dangerouslySetInnerHTML`.
4. **Client islands**: hydrate Zustand stores; forms POST **multipart FormData directly** to `/v1/*` (bypassing the typed `ApiClient`).
5. **Content updates**: admin edit → backend POST `/api/revalidate` (secret) → `revalidateTag`/`revalidatePath` + `notifyUpdate()` bumps in-memory version → `AutoRefresh` 2s poll of `/api/revalidate/stream` → `router.refresh()` in open browsers.

---

## 5. Notable Conventions

- **Template families with intentional heavy duplication**: (1) `NavHub` hubs (~15 pages — `getPageBySlug` → cards else `getDefaultItems`); (2) `DocumentDetail` static leaves (~15 pages, lex.uz links or placeholder `downloadUrl`); (3) CMS-content pages (`getPageBySlug` → `t()` → DOMPurify → HTML); (4) program-level pages (`getFaculties({level})` → `FacultyLevelPage`, byte-near-identical across levels); (5) dynamic `[id]/[slug]` detail pages with inline metadata builders.
- **`LocaleLink`** auto-prefixes the active locale — but several components bypass it with hardcoded `/${lang}/...` (`DirectionDetailPage`, `FacultyDetailPage`, `HeroSection`).
- **Resilience-first**: `.catch()` empty fallbacks + hardcoded i18n fallbacks everywhere.
- **Brand**: teal `#00575B` with `#00969D` gradient; news category badges green/crimson/blue.
- **Maps**: two parallel Leaflet implementations — `shared/LeafletMap.tsx` (static import, wired via `LocationSection` + `next/dynamic ssr:false`) and `shared/ContactMap.tsx` (fully dynamic `react-leaflet`); both load marker images from **unpkg.com**.
- **Detail pages inject JSON-LD** (`getCourseSchema`/`getDepartmentSchema`/`getPersonSchema`). `not-found` + `qabul-komissiyasi` set `robots index:false`.

---

## 6. Dependencies

### Internal (within app)

`@/lib/{api,services,i18n,seo,translate,language,locale,abiturient-helpers,exam-subjects-i18n,utils,a11y/*}`, `@/types` (local SSOT), `@/store/*`, `@/providers/{QueryProvider,NavigationProvider}`, `@/hooks/*`, `@/config/{site,navigation}`, `@/components/*`.

### Workspace packages

- **`@tmtu/utils`** — but only `cn` is actually re-exported/used; the rest of the shared utils package is unused.
- **`@tmtu/types`** — listed in `next.config.ts` `transpilePackages` but **NOT** in `package.json` dependencies (resolved via workspace hoisting only). The app deliberately maintains its **own** `types/index.ts` instead of importing it — divergence risk vs. CLAUDE.md's "`@tmtu/types` is SSOT" claim.
- `@tmtu/sdk` is **not** used here (app uses its own fetch-based `ApiClient`).

### External

Next.js 16.1.6, React 19.2.3, TypeScript 5 (strict), Tailwind v4 (`@tailwindcss/postcss`), `babel-plugin-react-compiler` 1.0.0, `@tanstack/react-query` v5, `zustand` v5, `js-cookie`, `framer-motion`, `leaflet`/`react-leaflet`, `swiper`, `lucide-react`, `isomorphic-dompurify`, `sharp`, `nextjs-toploader`, `react-hook-form`+`zod`, `react-hot-toast`, `next/font` (Inter).

### Backend / env

Laravel API at `NEXT_PUBLIC_API_URL` (`/api` base, `/v1` endpoints, incl. `/v1/translations`). Env: `NEXT_PUBLIC_API_URL`, `REVALIDATION_SECRET`, `ADMIN_URL`, `NODE_ENV`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YANDEX_METRIKA_ID`, `NEXT_PUBLIC_{GOOGLE,YANDEX,BING}_VERIFICATION`, `NEXT_PUBLIC_CONTACT_PHONE/EMAIL`.

---

## 7. Consolidated Findings (Tech Debt, Risks, Bugs, Security, Inconsistencies)

### Security

- **CSP effectively absent** — `next.config.ts` sets only `Content-Security-Policy: frame-ancestors 'self'`; no `script-src`/`style-src`/`default-src`. Notable given multiple `dangerouslySetInnerHTML` JSON-LD/CMS sinks. `X-XSS-Protection` is set but deprecated/ignored. **CLAUDE.md's "Security headers (CSP, …)" claim is overstated.** _(Open Q: is a fuller CSP enforced at nginx/edge?)_
- **Inconsistent HTML sanitization (XSS surface)** — `biz-haqimizda/page.tsx` renders CMS content via `dangerouslySetInnerHTML` **WITHOUT** DOMPurify (hero L167-172, sections L204-209); `kafedralar/[slug]` dept description (L232) and the dead `ContactCard` also render unsanitized. Sibling pages (`umumiy-malumot`, `sifat-siyosati`, `murojaatlar-tartibi`, `[...slug]`, `DirectionDetailPage`, etc.) **do** sanitize. A compromised CMS = real injection on the unsanitized pages.
- **Public form abuse surface** — `JobApplicationForm` (20+ file uploads), `StudentWorkForm`, `ConferenceClient`, `VirtualQabulxonaForm` POST multipart FormData directly to `/v1/job-applications`, `/v1/student-works`, `/v1/conference-registrations`, `/v1/contact` with **no client auth, no CSRF token, no captcha**; rate-limiting fully delegated to the backend throttle. `JobApplicationForm` builds the URL inline instead of via `ApiClient`.
- **Broad image `remotePatterns` wildcards** — `*.tdtutf.uz` / `*.tashmedunitf.uz` over https allow any subdomain to serve optimized images (scoped to `/storage/**`, which limits but doesn't eliminate the optimizer-proxy/SSRF surface).
- **`REVALIDATION_SECRET` placeholder** — `.env.example` ships `change-me-to-random-32-char-string`; no runtime guard prevents shipping the placeholder (must stay in sync across backend+admin+web).
- **PDF iframe** — `kutubxona/[slug]` uses `sandbox='allow-scripts allow-popups'` on a backend-provided document URL (runs scripts from uploaded-PDF origin; low risk).
- **External CDN dependency** — Leaflet marker images load from unpkg.com at runtime; CSP/edge must allow it. `ContactMap` injects a Leaflet stylesheet `<link>` with SRI; `LeafletMap` has no SRI.

### Scalability / correctness bugs

- **Single-instance-only revalidation (real bug)** — the AutoRefresh "version" lives in `globalThis.__revalidateVersion` (process memory). With >1 Next.js instance (K8s replicas / multiple workers / LB), the webhook bumps only one process's version, so browsers polling another replica never refresh; likewise `revalidateTag`/`revalidatePath` only invalidate the receiving process. **Needs a shared store (e.g., Redis pub/sub).**
- **Triplicated fragile department↔faculty heuristic** — `normalize()`/`namesMatch()` fuzzy word-matching to link departments to faculty directions is copy-pasted in `tuzilma/fakultetlar/[id]`, `tuzilma/kafedralar/page.tsx`, and `tuzilma/kafedralar/[slug]/page.tsx`, with **divergent `stopWords` arrays**. Locale-naive (always matches on `uz`), can mis-group/drop departments. Should use an explicit `faculty_id` relation. **Biggest correctness risk in the slice.**
- **`rektorat/page.tsx` keys business data by `sort_order`** — `receptionHours` + telegram `@ttatf_director` are keyed by `staff.sort_order` (1-4); **reordering staff silently reassigns reception hours/telegram to the wrong person.**
- **`[...slug]` `generateMetadata` swallows errors → `{}`** — a CMS page that errors only in metadata but still renders a body could ship with no title/description.
- **`konsultativ-organlar`** renders the inline `OrgChart` only when the CMS page is absent (`!page`) — creating the slug silently hides the chart in favor of CMS HTML (non-obvious).

### Locale / i18n issues

- **Systemic URL↔content locale desync** — `getLanguage()` ignores the `[locale]` param; if middleware is bypassed, the cookie/default (uz) wins, so `/ru/...` could render in uz across **every** server page.
- **`privacy/page.tsx` + `terms/page.tsx` are Uzbek-only** — ignore `[locale]`, hardcode `/uz` breadcrumb links, export static `metadata` (locale-agnostic OG/canonical). RU/EN visitors get Uzbek legal text.
- **`CookieConsent.tsx` is Uzbek-only** — the GDPR consent UI shown to ru/en users hardcodes Uzbek strings + a hardcoded `/uz/privacy` link (compliance concern).
- **Hardcoded-string i18n gaps** — `aloqa/page.tsx` (map loading, `toast.error('Joylashuvlarni yuklashda xatolik...')`, empty/error states); multiple `faoliyat/oquv` pages use `lang==='ru'?…:'en'?…` ternaries instead of `s()`; `boglanish` loading fallback hardcodes `s(...,'uz')`.
- **News-badge key-namespace inconsistency** — `NewsCard` uses `cat.<category>`, `NewsSection` uses `cat_label.<category>`, `SearchModal` uses `search.<type>` — three namespaces for overlapping labels, risking missing-translation fallbacks.

### Domain / config inconsistencies

- **Hardcoded prod origin in 3+ places** — `SITE_URL = https://tashmedunitf.uz` hardcoded in `sitemap.ts` (L4) and `robots.ts` (L3), while `layout.tsx` imports `SITE_URL` from `@/lib/seo`. If `@/lib/seo` is env-driven/different, sitemap+robots diverge from canonical/OG. _(Open Q: confirm they match.)_
- **Domain not unified** — legal pages use `tashmedunitf.uz` / `info@tashmedunitf.uz`; journal/career/contact code uses `tdtutf.uz` / `jurnal@tdtutf.uz`. **Which is canonical?**
- **Brand-color mismatch** — `viewport.themeColor` / `msapplication-TileColor` / manifest `theme_color` are navy `#1e3a5f`, but `globals.css --color-primary` is teal `#00575B` and the whole UI is teal/cyan.
- **`foundingDate '2024'` (JSON-LD) vs about copy '2018'** — which is correct?
- **Hardcoded faculty IDs `fakultet/1..5`** in `navigation.ts` — are these stable across DB seeds/environments?

### Tech debt / duplication / dead code

- **Dead components**: `AntiCard.tsx`, `ContactCard.tsx`, `LawCard.tsx` (under `biz-haqimizda/antikorrupsiya`) defined but never imported (`LawCard` has hardcoded non-i18n Uzbek text). Likely-dead `data/journal.ts` (superseded by journal-issues API; its `JournalIssue` interface name-clashes).
- **Unreachable code**: `abiturientlarga/{level}/[id]` and `fakultet/[id]` do `if(!data) return null;`, but `loadDirectionPage`/`loadFacultyPage` call `notFound()` (throws) and never return null.
- **Dead form fields**: `VirtualQabulxonaForm` renders `company`/`address` inputs that `handleSubmit` never reads/sends — user input silently discarded.
- **Dead helper**: `ApplicantsPageClient` `getContentValue()` and `getContentHtml()` are byte-identical (both `t(item.value, lang)`).
- **Triplicated `cv()` helper with divergent behavior** — `HeroSection`/`AdvantagesSection` define a local `cv()` reading `item.value?.[lang] || item.value?.uz` (breaks if `value` is a string); `FacultyDetailPage`/`FacultyLevelPage` define a different `cv()` correctly using `t()`. None reuse the shared `t()` that already handles both shapes.
- **Listing duplication** — `yangiliklar/page.tsx`, `konferensiyalar/page.tsx`, `tadbirlar/page.tsx` are ~90% identical (candidate `NewsListing`); `bakalavriat` vs `magistratura` curricula near-duplicates; two separate `Pagination` implementations.
- **Inconsistent fetch convention** — `oqishni-kochirish` and `test-topshiriladigan-fanlar` bypass `services.ts` and call `fetch(\`${NEXT_PUBLIC_API_URL}/v1/...\`)`directly;`sitemap.ts`uses a raw fetch +`:any` for journal-issues while using typed services elsewhere.
- **Mixed revalidation intent** — dynamic abiturient routes set segment `revalidate=3600` while underlying SDK fetches use `revalidate:60` (1h vs 60s — likely unintended).
- **Duplicated helpers across lib** — a _second_ `formatDate()`/`stripHtml()` in `translate.ts` overlapping `utils.ts`/`abiturient-helpers`; `abiturient-helpers.buildOg` re-implements the OG block instead of reusing `seo.buildMetadata` (drift risk). Three overlapping locale-type definitions (`constants.LANGUAGES`, `locale.ts Locale`, `i18n/language Language`).
- **Type/name shadowing** — `templates/NavHub.tsx` exports its own `NavItem` colliding with the navigation-config `NavItem`; `journal/JournalFAQ.tsx` declares a local non-translatable `FAQItem` shadowing `@/types FAQItem`.
- **Misnamed "stream" route** — `api/revalidate/stream` is polling, not SSE; should be `/version`.

### Stale / placeholder content in production

- **Hardcoded demo data** — several `faoliyat` pages (konferensiyalar, oaq-tavsiya-nashrlar, doktorantura researchers/programs/questions, ilmiy-jurnal `jurnal-haqida`) render baked-in fake data (fake researcher names, patent numbers `IAP 07XXX`, ISSN lists, conference dates). Several have **both** a DB path and a stale hardcoded fallback.
- **Unfinished `DocumentDetail` stubs** — `ichki-hujjatlar/*` leaves pass `downloadUrl:undefined` (akademik-halollik, diskriminatsiya, institut-kengashi, odob-axloq, sifat-siyosati, tanlov-reglamenti, tyutorlik); `nizom/institut-nizomi` + `tashkiliy-tuzilma` use `downloadUrl:'#'`.
- **`StatsCounterSection`** embeds stats (3760/671/7/20534/2/75) in source with no CMS binding; formats with `toLocaleString('uz-UZ')` regardless of `lang`.
- **`og-image.svg` orphaned** — `layout.tsx` OG + manifest screenshots point to the dynamic `/opengraph-image` route, not this static file.

### Minor / cosmetic

- **CORS asymmetry** in `revalidate/route.ts` — the 500 "secret not set" path returns before setting `Access-Control-Allow-Origin: ADMIN_URL` (other paths set it).
- **Production `console.log`** — `AutoRefresh.tsx` logs `"[AutoRefresh] Version o'zgardi…"` on every revalidation, plus a hard `window.location.reload()` after 3 refreshes.
- **`aloqa` is client-rendered** (useEffect fetch) so contact locations are absent from SSR HTML (worse SEO/initial paint) — inconsistent with the rest of the slice.
- **Accessibility gaps** — `Header` hamburger has hardcoded `aria-label='Menu'` (untranslated) while search uses `s('common.search')`; `Pagination` renders every page number with no ellipsis/windowing (DOM bloat for large `totalPages`).
- **Breadcrumb inconsistency** — shared `<Breadcrumb>` vs hand-rolled `<ol>` (fakultetlar/kafedralar/xodimlar) with differing label sets.
- **`NavHub` uses `key={item.href}`** — default items often use `#anchor`/`doc.url`, so duplicate keys are possible if the backend returns repeated URLs.
- **Heading hierarchy** — `biz-haqimizda/page.tsx` top heading is `<h2>` (no `<h1>`).
- **`FacultyLevelPage`** uses `unoptimized={!!uploadedHero}` (bypasses `next/image` optimization for admin uploads).
- **Encoding corruption** — `layout/Header.tsx` comments contain UTF-8 mojibake from a prior bad save; `bakalavriat/page.tsx` function name contains a Cyrillic char (`Bakalavri<cyrillic>OquvRejalariPage`).
- **Asset-path inconsistency** — `JournalCard` falls back to `/imgs/journal/placeholder.jpg` while the rest of the app uses `/images/` (likely broken path).
- **Duplicated `<meta>`** — `apple-mobile-web-app-capable`/`mobile-web-app-capable`/`msapplication-TileColor` declared both in `metadata.other` and as raw `<head>` tags.
- **`sitemap.ts` `staticDate`** hardcoded to `new Date('2026-04-01')` — meaningless `lastModified` for ~120 routes.
- **Inconsistent admission CTA destinations** — `FacultyDetailPage` → `/${lang}/qabul`, `DirectionDetailPage` → `/${lang}/aloqa`, `FacultyTabView` → `/abiturientlarga/qabul-komissiyasi` (which itself redirects away).

### Key open questions

1. Is the web app guaranteed single-instance in prod? If not, the in-memory revalidation version **and** per-process `revalidateTag` are broken.
2. Should department↔faculty association use an explicit `faculty_id` relation instead of the fuzzy `namesMatch` heuristic?
3. Where is `loadTranslations()` invoked and is `dbTranslations` ever invalidated on translation edits, or does an admin change require redeploy?
4. Why a local `types/index.ts` instead of `@tmtu/types` — intentional decoupling or drift?
5. Canonical domain — `tdtutf.uz` or `tashmedunitf.uz`? And does `@/lib/seo` `SITE_URL` match the hardcoded sitemap/robots origin?
6. Are the hardcoded "demo" datasets and `downloadUrl:undefined/'#'` stubs intended placeholders awaiting real content?
7. Should `privacy`/`terms`/`CookieConsent` be localized and honor `[locale]`?
8. Is the segment `revalidate=3600` vs fetch `revalidate:60` divergence deliberate?

---

## Appendix D — Domain Deep-Dive: Admin (Next.js Admin App) (263 files)

# Admin (Next.js Admin App) — `apps/admin`

## 1. Overall Purpose & Responsibilities

`@tmtu/admin` is the content-management application for the **Toshkent Davlat Tibbiyot Universiteti (TMTU) Termiz Filiali** website. It is a **Next.js 16 / React 19** App Router app (dev port **3001**, `next dev -p 3001`) that presents editors with a **WordPress/Wix-style inline-editing experience**: instead of a traditional sidebar CRUD dashboard, admins see a 1:1 visual mirror of the live public site, decorated with hover-to-edit overlays, and edit content "in-context" through schema-driven modals.

Core responsibilities:

- **In-context (WYSIWYG) editing** of every public-site section via `EditableWrapper` overlays + a universal `EditModal`.
- **Full CRUD** over ~30 Laravel-backed entities (News, Faculties, Directions, Departments, Staff, Partners, Testimonials, Banners, FAQ, Library, Journal issues, Career-center, SiteContents, SiteMedia, StudentLifePhotos, Pages, Translations, Contacts, etc.).
- **Read-only inboxes** for incoming submissions (contact messages, conference registrations, job applications, student works) with PII detail views.
- **Multilingual authoring** — all translatable fields are `{uz, ru, en}` JSONB, edited under `uz/ru/en` language tabs (the admin chrome itself is single-locale Uzbek).
- **Hierarchical page-tree management** (`sahifalar`) with reorder/move/parent re-parenting.
- **Rich text** via Tiptap, **media/PDF uploads** via Spatie Media Library, and **frontend ISR revalidation** (fire-and-forget webhook to the public site).
- **Accessibility toolbar** (WCAG 2.1 AA: font scaling, color schemes, spacing) backed by a Zustand store.
- **Cookie + localStorage auth** against Laravel Sanctum, with an edge `middleware.ts` route guard.

A defining trait: **defaults-as-fallback everywhere** — if no DB row exists, a hardcoded Uzbek default renders (and seeds the create modal), so the public site never appears empty before content is authored.

---

## 2. Architecture & Key Patterns

### Three-layer client data flow (strict per-entity template)

```
Component → use<Entity> hook (TanStack Query) → <entity>Service (Axios) → shared `api` instance → Laravel /api/v1
```

- **API client** (`apps/admin/src/lib/api.ts`): single `axios.create` with `baseURL = siteConfig.apiUrl` (`NEXT_PUBLIC_API_URL`, default `http://localhost:8000/api/v1` — **note the `/v1`, unlike `apps/web` which uses `/api`**), `withCredentials:true`, 10s timeout. Request interceptor injects `Authorization: Bearer <token>` from `useAuthStore`. Response interceptor: on **401** (deduped via module-level `isRedirectingTo401`, skipped on `auth/login` and `/login`) calls `logout()` + `window.location.replace('/login')`.
- **Service layer** (`apps/admin/src/lib/services/*`, 25 files): plain async objects wrapping each endpoint. Mutation convention: `create = POST FormData`; `update = POST FormData + _method=PUT` (Laravel multipart method-spoof) — **except** `faqService`/`contactService`/`contactLocationService`/`translationService`/`siteContentService` (real JSON `PUT`) and `pageService` (branches on `hasFiles()`). Spatie Query Builder filters are built client-side as bracket params (`filter[category]`, `filter[level]`, etc.).
- **Hook layer** (`apps/admin/src/hooks/*`, 29 files): list hooks key on `[...QUERY_KEYS.X, params]`; detail hooks use `QUERY_KEYS.X_DETAIL(id)` with `enabled:!!id`. Identical optimistic pattern: create → `setQueriesData` prepend + `total+1`; update → map-merge + `setQueryData(detail)`; delete → `onMutate` snapshot + optimistic filter, `onError` rollback, `onSettled` invalidate. Every mutation fires `revalidateFrontend(tags, paths)` and surfaces errors via `react-hot-toast`.

### Inline-edit engine (`apps/admin/src/components/inline-edit/`)

The heart of the WordPress-style UX:

- **`EditableWrapper.tsx`** — hover overlay (dashed-blue, `pointer-events-none`) exposing Add/Edit/Delete buttons + label badge.
- **`EditModal.tsx`** (491 lines) — **universal schema-driven form** from `FieldConfig[]` + `initialData`. Translatable fields under `LanguageTabs`, builds multipart `FormData`, handles media URL→ID mapping for targeted removal (`remove_media_ids[]`, `remove_<field>`), File-size validation, ISO→`datetime-local` normalization, and 422 backend-error mapping (`title.uz → title`).
- **`RichTextEditor.tsx`** — Tiptap StarterKit + Image(`allowBase64`)+Link+Placeholder+TextAlign; image/link via `window.prompt` (URL only, no upload); `immediatelyRender:false` for SSR.
- **`MediaUploader.tsx`** — drag-drop; existing-URL vs new-File diffing; multi-file with per-item replace; fullscreen preview portal.
- **`LanguageTabs.tsx`**, **`TagsInput.tsx`**, plus two specialized SiteContent modals: **`TextEditModal.tsx`** (single key/value upsert) and **`CardEditModal.tsx`** (batch multi-key upsert).

### Three structural tiers of pages (under `apps/admin/src/app/(dashboard)/`)

1. **Thin wrapper pages** (~11-line server components): export `metadata`, render one `@/components/templates/*CrudAdmin`. E.g. `aloqa→ContactsAdmin`, `bannerlar→BannersCrudAdmin`, `faq→FaqCrudAdmin`, `sheriklar→PartnersCrudAdmin`, `testimoniallar→TestimonialsCrudAdmin`, `sayt-kontenti→SiteContentsCrudAdmin`, `sayt-media→SiteMediaCrudAdmin`. Most `meyoriy-hujjatlar` leaves render `StaticPageAdmin`/`DocumentDetailAdmin`/`NavHubAdmin`.
2. **Full client editors** (`'use client'`): the heavy WYSIWYG pages (`abiturientlarga/page.tsx` 1109 lines, `talabalarga/page.tsx` 922 lines, `biz-haqimizda/page.tsx` 642 lines, faculty/direction detail pages, `sahifalar`, `translations`, `foydalanuvchilar`, `social-links`).
3. **Redirect stubs**: dedupe routes — `abiturientlarga/qabul-komissiyasi → /abiturientlarga`, `biz-haqimizda/umumiy-malumot → /biz-haqimizda`, `tadbirlar → /yangiliklar/tadbirlar`, `konferensiyalar → /yangiliklar/konferensiyalar`, `talabalarga/karyera-markazi/bosh-ish-orinlari → /ish-arizalari`, plus external redirects (`kutubxona/e-library → unilibrary.uz`, `emerald → emerald.com`).

### Two persistence shapes

- **Entity CRUD** (Faculty/Direction/Staff/Department/Faq/News/...): `FormData` (so media uploads work); updates append `_method=PUT`; image removal via `remove_image=1` flag.
- **SiteContent** key/value model: namespaced keys (`applicants_hero_title`, `faculty_detail_contact_button`) with `batchUpsert`/`upsert`/`delete`; translatable values `{uz,ru,en}`.
- **Pages**: slug-based create/update with `parseFormData` (JSON-or-multipart by `hasFiles()`).

### Auth & guarding

- **Client gate**: `apps/admin/src/app/(dashboard)/layout.tsx` reads persisted `useAuthStore`, waits for hydration, redirects to `/login` if unauthenticated, then renders `AdminTopHeader` + `main` + `Footer` + `AccessibilityWidget`.
- **Edge gate**: `apps/admin/src/middleware.ts` reads the `admin-token` cookie and validates **format only** (`/^[0-9]+\|[A-Za-z0-9+/=]+$/`, length≥20) — not a real verification. `publicPaths` (`/login`, `/forgot-password`, `/reset-password`) bypass and proactively delete the cookie (to break a localStorage/cookie desync loop). Two hardcoded 308 redirects.
- **Auth store**: `apps/admin/src/store/useAuthStore.ts` persists `{user,token,isAuthenticated}` to localStorage (`admin-auth`) AND writes a **non-HttpOnly `admin-token` cookie** so middleware can read it.

### App root & providers

- `apps/admin/src/app/layout.tsx` — `html lang='uz'`, Inter font, `robots: noindex`, wraps in `<Providers>` + `NextTopLoader` + a11y helpers (`SkipToContent`, `A11yPreHydrationScript`), imports `globals.css`.
- `apps/admin/src/providers/Providers.tsx` — single `QueryClient` (staleTime 60s, gcTime 10m, `refetchOnWindowFocus:false`, queries retry 1 / mutations retry 0) + `react-hot-toast` Toaster.

---

## 3. Concrete Inventory

### Backend endpoints consumed (`/api/v1`)

`auth/login|logout|me`, `news`, `journal-issues`, `pages` (+`/{slug}`, `/tree`, `/reorder`), `library-resources` (+`/categories`), `career-center-infos`, `student-life-photos`, `talented-students`, `faculties`, `directions`, `departments`, `staff`, `partners`, `testimonials`, `banners`, `faqs`, `site-contents` (+`/{section}`, `/batch`, `/upload-image`), `site-media` (+`/{key}`), `media/upload`, `media/{id}`, `media/stats`, `contacts` (+`/unread/count`), `contact-locations`, `conference-registrations` (+`/unread/count`), `job-applications` (+`/unread/count`), `student-works` (+`/unread/count`), `translations` (+`/admin`), `users`, `auth/forgot-password`, `auth/reset-password`, and the same-origin proxy `POST /api/revalidate`.

### Services (25) — `apps/admin/src/lib/services/`

`authService`, `newsService`, `bannerService`, `partnerService`, `testimonialService`, `faqService`(JSON PUT), `pageService`(multipart-or-JSON, `getTree`/`reorder`), `departmentService`(by slug), `staffService`, `facultyService`(`filter[level]`), `directionService`(`filter[level]`/`[faculty_id]`), `contactService`(+unread, **markAsRead bug**), `contactLocationService`(JSON), `conferenceRegistrationService`, `jobApplicationService`, `studentWorkService`, `careerCenterInfoService`, `journalIssueService`(`filter[is_current|year|title]`), `libraryResourceService`(+`/categories`), `mediaService`, `siteContentService`, `siteMediaService`, `studentLifePhotoService`(leading-slash paths + manual multipart header — sole deviation), `talentedStudentService`, `translationService`.

### Hooks (29) — `apps/admin/src/hooks/`

`useAuth`(`useLogin`/`useLogout`/`useMe`), `useNews`, `useBanners`, `usePartners`, `useTestimonials`, `useFaqs`, `usePages`(+`usePageTree`/`useReorderPages`), `useDepartments`, `useStaff`, `useFaculties`, `useDirections`, `useContacts`(+`useUnreadCount` polling), `useContactLocations`, `useConferenceRegistrations`(+`useConferenceUnreadCount`), `useJobApplications`(visibility-aware poll), `useStudentWorks`(visibility-aware poll), `useCareerCenterInfos`, `useJournalIssues`, `useLibraryResources`, `useSiteContents`(+`getContentValue`/`getContentTranslatable`), `useSiteMedia`, `useStudentLifePhotos`, `useTalentedStudents`, `useTranslations`; UI hooks `useEscapeKey`, `useFocusTrap`, `useReducedMotion`, `useScrollDirection`, `usePasswordGuard.tsx`.

### Stores / providers / config / types — `apps/admin/src/`

- **Stores**: `store/useAuthStore.ts` (persist + cookie), `store/useUIStore.ts` (modal/menu flags), `store/useA11yStore.ts` (hand-rolled persist + `CustomEvent('a11y:change')`).
- **Providers**: `providers/Providers.tsx`.
- **Config**: `config/site.ts` (`siteConfig`), `config/navigation.ts` (`mainNavigation`, `adminNavItems`, `footerNavigation` — hardcodes faculty IDs `fakultet/1..5`).
- **Types**: `types/index.ts` (~668 lines, ~30 entity interfaces + `Translatable`/`Paginated`/`ApiResponse`/`ApiError`/`DashboardStats`), `types/inline-edit.ts` (`FieldType`, `FieldConfig`, `EditModalProps`, `MediaUploaderProps`, `Language`).
- **Lib**: `lib/constants.ts` (`QUERY_KEYS` factory, `NEWS_CATEGORIES`, `LANGUAGES`), `lib/utils.ts` (`t`, `formatDate`/`RelativeTime`/`FileSize`, `decodeHtml`, `buildFormData`/`parseFormData`, `generateSlug`, re-exports `cn`), `lib/sanitize.ts` (DOMPurify allow-list — allows `style`/`class`), `lib/revalidate.ts`, `lib/a11y/{apply,defaults,labels,storage,types}.ts`.

### Components (75 files) — `apps/admin/src/components/`

- **inline-edit/ (8)**: `EditableWrapper`, `EditModal`, `LanguageTabs`, `MediaUploader`, `RichTextEditor`, `TagsInput`, `TextEditModal`, `CardEditModal`.
- **sections/ (7 editors + 1 stray doc)**: `EditableHeroSection` (391 lines, `id='hero-section'` scroll-detected by header), `EditableAdvantagesSection`, `EditableDirectionsSection`, `EditableNewsSection`, `EditablePartnersSection`, `EditableTestimonialsSection`, `EditableLocationSection`; plus a misplaced design doc `# Admin Panel Inline Editing Redesign Pl.prompt.md`.
- **templates/ (22)**: CRUD — `NewsCrudAdmin`, `NewsDetailAdmin`, `FacultiesCrudAdmin` (1068 lines, reference impl: grid/table/stats/search/reorder/export), `DirectionsCrudAdmin`, `DepartmentsCrudAdmin`, `StaffCrudAdmin`, `PartnersCrudAdmin`, `TestimonialsCrudAdmin`, `BannersCrudAdmin`, `FaqCrudAdmin`, `LibraryResourcesCrudAdmin`, `JournalIssuesCrudAdmin`, `CareerCenterInfosCrudAdmin`, `SiteContentsCrudAdmin`, `SiteMediaCrudAdmin`, `StudentLifePhotosCrudAdmin`; Inbox — `ContactsAdmin` (911 lines, dual-tab locations+messages), `VirtualQabulxonaAdmin`; Presentational — `NavHubAdmin`, `StaticPageAdmin`, `DocumentDetailAdmin`.
- **shared/ (24)**: `Button`, `Input`, `Textarea`, `Select`, `Toggle`, `Modal` (Esc + scroll-lock, no focus trap), `Card`, `Badge`, `Avatar`, `Breadcrumb`, `ConfirmDialog`, `Container`, `EmptyState`, `ErrorState`, `LoadingSpinner` (ignores all props), `Pagination`, `SearchInput`, `SectionTitle`, `ContactMap`/`LeafletMap` (two near-dup Leaflet wrappers, assets hot-linked from unpkg.com), `PageTreeView`, `PageLock`, `AddPageGuardedButton`.
- **layout/ (4)**: `AdminTopHeader` (686 lines, merges static nav + DB page-tree, injects 4 unread badges, mojibake in comments), `AdminMobileMenu`, `Footer`, `PageHeader`.
- **a11y/ (8)**: `AccessibilityPanel`, `AccessibilityWidget`, `AccessibilityHeaderButton`, `AccessibilityFooterLink`, `AccessibilityIcons`, `A11yLiveRegion`, `A11yPreHydrationScript`, `SkipToContent`.
- **journal/ (3)**: `AdminIssueCard`, `AdminJournalNavbar`, `journalIssueConfig.ts`.

### Key route pages — `apps/admin/src/app/(dashboard)/`

- **Core/site**: `dashboard` (nav hub — 14 query hooks feed counts, NOT a stats page), `aloqa`, `bannerlar`, `faq`, `foydalanuvchilar` (users/RBAC), `sahifalar` (page tree), `sayt-kontenti`, `sayt-media`, `sheriklar`, `social-links`, `testimoniallar`, `translations`.
- **abiturientlarga** (14 routes): `page.tsx` (1109-line full editor), `{bakalavriat,magistratura,ordinatura}` (FacultiesCrudAdmin), `.../{degree}/[id]` (direction detail), `.../{degree}/fakultet/[id]` (faculty detail + nested directions/FAQ), `yo-nalishlar`, `test-topshiriladigan-fanlar`, `oqishni-kochirish-va-tiklash`, `qabul-komissiyasi` (redirect).
- **biz-haqimizda** (40 routes): `page.tsx`, `meyoriy-hujjatlar` (NavHub → 9 categories → DocumentDetail leaves, 3–4 level tree), `tuzilma/{fakultetlar,filiallar,kafedralar(+[slug]),konsultativ-organlar,rektorat,xodimlar}`, `antikorrupsiya` cluster (static), `virtual-qabulxona`, `sifat-siyosati`, `murojaatlar-tartibi`.
- **faoliyat / talabalarga / news**: `faoliyat` (NavHub) → `ilmiy-faoliyat/*`, `oquv-faoliyati/oquv-rejalari/{bakalavriat,magistratura}`, `iqtidorli-talabalar`, `ilmiy-jurnal(+/nashrlar)`, `tadqiqod-markazi(+[id])`; `talabalarga` (922-line aggregate of 5 resources) + `karyera-markazi`, `kutubxona`, `talaba-ishlari`; `yangiliklar(+[id])`, `yangiliklar/{konferensiyalar,tadbirlar}`.
- **Inboxes**: `ish-arizalari` (JobApplications), `konferensiya-royxatlari` (ConferenceRegistrations).
- **Standalone CRUD-template pages**: `ilmiy-jurnal-nashrlar`, `kutubxona-resurslari`, `karyera-malumotlari`, `talabalar-hayoti-fotolari`.
- **Auth (outside `(dashboard)`)**: `login`, `forgot-password`, `reset-password`. **API**: `api/revalidate/route.ts`.

### Build/config & assets — `apps/admin/`

- `next.config.ts` — `output:'standalone'`, `transpilePackages:[@tmtu/utils, @tmtu/types]`, security/caching headers (no-store on admin HTML for instant deploys; immutable `/_next/static` in prod), `images.remotePatterns` allowlist (`localhost:8000`, `127.0.0.1:8000`, `tdtutf.uz`/`*.tdtutf.uz`, `tashmedunitf.uz`/`*.tashmedunitf.uz`, all `/storage/**`). No `experimental` block (diverges from web's React Compiler + Turbopack).
- `package.json` — `@tmtu/admin` v0.1.0; next 16.1.6 / react 19.2.3; Tiptap v3 suite, TanStack Query v5, react-hook-form+zod v4, axios, **js-cookie**, leaflet/react-leaflet, framer-motion, swiper, dompurify, zustand; sole workspace dep `@tmtu/utils`.
- `tsconfig.json` — strict, `moduleResolution:bundler`, `@/* → ./src/*`.
- `postcss.config.mjs` — single plugin `@tailwindcss/postcss` (Tailwind v4).
- `.env.example` — `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` (**documents the `/v1` suffix**), `NEXT_PUBLIC_FRONTEND_URL`, `REVALIDATION_SECRET` (placeholder `change-me-to-random-32-char-string`).
- `src/app/globals.css` — 1036 lines, CSS-first Tailwind v4 (`@import "tailwindcss"`, **no `tailwind.config.ts` exists**); `:root` design tokens, `.editable-wrapper`/`.editable-overlay`, `.tiptap-editor .ProseMirror`, login animations, `.a11y-*` toolbar system.
- `public/` (16 assets) — `favicon.ico` + 4 webp PWA icons; `images/` hero SVGs, `ebooks_img6.png`, `IMG_3455.mp4` (suspicious — likely copy-pasted from `apps/web`).

---

## 4. Data & Control Flow

1. **Auth bootstrap**: `login/page.tsx` → `useLogin` → `authService.login` → `useAuthStore.setAuth` writes localStorage (`admin-auth`) + non-HttpOnly `admin-token` cookie. `forgot-password`/`reset-password` call **axios directly** (not the shared `api`) against `${siteConfig.apiUrl}/auth/...`.
2. **Route entry**: edge `middleware.ts` format-checks the cookie (redirects to `/login?redirect=<path>` on miss); then `(dashboard)/layout.tsx` re-checks the hydrated store client-side.
3. **Read**: page mounts → `use<Entity>` TanStack hook → service → `api` (Bearer injected) → Laravel. List = `{data,meta}`; detail/mutation = `{data}`; auth/counts = `{success,message,data}`.
4. **Edit**: `EditableWrapper.onEdit` → opens `EditModal` (driven by `FieldConfig[]`) → per-language `formData` → `handleSubmit` builds `FormData` (translatable → `field[lang]`, media → file / `remove_<field>`, toggle → `1`/`0`, tags → `field[i]`) → `onSubmit(fd)` → mutation `mutateAsync`.
5. **Cache update**: hook does optimistic `setQueriesData` + `invalidateQueries`; many pages ALSO call `refetch()` — up to 3 cache operations per mutation.
6. **ISR sync**: hook fires `revalidateFrontend(tags, paths)` → `POST /api/revalidate` (same-origin) → `api/revalidate/route.ts` forwards to `${NEXT_PUBLIC_FRONTEND_URL}/api/revalidate` with server-only `REVALIDATION_SECRET`. **Pull-based (fetch), not push/SSE.** Always force-pushes `'/'` into paths, so every edit revalidates the home page.
7. **401 anywhere** → interceptor `logout()` + redirect; `useMe()` also logs out on `/auth/me` error — two independent logout paths that can race.

---

## 5. Notable Conventions

- **`/v1` API base** for admin (`NEXT_PUBLIC_API_URL` must include `/v1`) vs `/api` for `apps/web` — the single most important env gotcha.
- **Translatable display**: read `x.field?.uz` for cards; store full `{uz,ru,en}` in `EditModal` initialData; serialize as `field[uz]`/`field[ru]`/`field[en]`.
- **FormData vs JSON split**: most entities use multipart `_method=PUT`; FAQ/Pages/SiteContents/Location use JSON. Three separate FormData→object parsers exist (`utils.parseFormData`, `SiteContentsCrudAdmin.parseFormDataLocal`, `EditableLocationSection` inline regex).
- **Degree scoping** by hardcoded string literal per route (`'bakalavriat'`/`'magistratura'`/`'ordinatura'`) set via `formData.set('level', ...)`.
- **Defaults-as-fallback**: hardcoded Uzbek defaults render when no DB row exists and seed create modals.
- **`dangerouslySetInnerHTML` is always wrapped in `sanitizeHtml`** (NewsDetail, StaticPage, Faq, SiteContents, CareerCenter, antikorrupsiya cards) — consistent XSS hygiene.
- **`QUERY_KEYS` factory** (`lib/constants.ts`) is the single source of cache keys.
- **Single-locale admin chrome**: all toasts/labels are hardcoded Uzbek (only `lib/a11y/labels.ts` centralizes strings).

---

## 6. Dependencies

### Internal (monorepo)

- **`@tmtu/utils`** — sole workspace package actually consumed (`cn` re-exported in `lib/utils.ts`; transpiled by Next).
- **`@tmtu/types`** — listed in `next.config.transpilePackages` but **absent from `package.json` deps** (resolved transitively or a latent install risk).
- **`apps/web`** (public site) — target of the ISR revalidation webhook via `NEXT_PUBLIC_FRONTEND_URL`.
- **`apps/api`** (Laravel 12 / Sanctum, Spatie Media/Translatable/Permission/QueryBuilder) — the data backend at `/api/v1`.
- **`infrastructure/docker/images/Dockerfile.admin`** — consumes `output:'standalone'`.

### External (npm)

Next.js 16.1.6, React 19.2.3, TypeScript 5, TanStack Query v5, Zustand v5 (+persist), Axios, **js-cookie** (declared) / raw `document.cookie` (actually used in the auth store), Tiptap v3 (StarterKit + image/link/placeholder/text-align), react-hook-form 7 + zod 4, lucide-react, react-hot-toast, nextjs-toploader, framer-motion 12, swiper 12, leaflet/react-leaflet 5 (assets from unpkg.com), dompurify (isomorphic), date-fns, clsx/tailwind-merge, Tailwind CSS v4 (`@tailwindcss/postcss`), ESLint 9.

### Env vars

`NEXT_PUBLIC_API_URL` (must include `/v1`), `NEXT_PUBLIC_FRONTEND_URL`, `REVALIDATION_SECRET` (shared api/web/admin).

---

## 7. Consolidated Findings (tech debt, risks, bugs, security, inconsistencies)

### Security

- **(HIGH) Bearer token in JS-readable storage**: the Sanctum token lives in BOTH localStorage (`admin-auth`) AND a **non-HttpOnly `admin-token` cookie** (`useAuthStore.setAuthCookie`, raw `document.cookie`, SameSite=Lax, Secure only on https). Any XSS can exfiltrate it. The cookie must be JS-readable so middleware can read it — a real token-theft surface. Consider HttpOnly session cookie + server-verified middleware.
- **(MEDIUM) Middleware is a UX gate, not a security boundary**: `middleware.ts` only regex-checks the cookie **format/length** (`/^[0-9]+\|[A-Za-z0-9+/=]+$/`, ≥20) — no signature verification. A forged string matching the pattern passes the edge guard; real authz relies solely on the API 401. SSR/admin shells can load before the client 401 fires.
- **(LOW/by-design) Hardcoded client-side password `'09'`**: `sahifalar/page.tsx` (`SAHIFALAR_PASSWORD='09'`), `shared/PageLock.tsx`, `shared/AddPageGuardedButton`, and `usePasswordGuard.tsx` gate "add page" actions with a plaintext password shipped in the bundle + sessionStorage unlock. The code's own comment admits it is "Real xavfsizlik emas". Misclick guard only.
- **(LOW) Sanitizer allows `style`/`class`**: `lib/sanitize.ts` `ALLOWED_ATTR` includes `style`+`class`; `FORBID_ATTR` only blacklists 4 `on*` handlers. DOMPurify still strips dangerous CSS/`javascript:`, but allowing arbitrary inline `style` on admin-authored HTML widens the surface. Tiptap also permits `allowBase64` images and arbitrary `window.prompt` link/image URLs stored verbatim — confirm the sanitizer strips `javascript:`/`data:`.
- **(LOW) Minimal CSP**: `next.config.ts` sets only `Content-Security-Policy: frame-ancestors 'self'` — no `script-src`/`connect-src`/`style-src`. Also emits deprecated `X-XSS-Protection: 1; mode=block` and HSTS preload on **all** responses (including dev/localhost) — a foot-gun if ever served over plain HTTP on a real hostname.
- **PII exposure in inboxes**: `JobApplicationsAdmin` exposes 30+ sensitive fields (birthday, citizenship, `is_convicted`, salary, social links, dissertation/diploma files downloaded as auth'd blobs); conference/student-work inboxes expose email/phone/address. **No client-side RBAC gate** in any of these pages — authz presumably relies entirely on Sanctum middleware + the unverified edge guard. `foydalanuvchilar` shows "faqat super-admin" but has no client role check beyond cookie presence.

### Bugs / correctness

- **`contactService.markAsRead(id)` is a no-op**: it just `GET contacts/{id}` and returns it — no `PUT`, marks nothing. Read-state likely only changes via `useUpdateContact`. Misleading dead-ish code.
- **Conference-registrations search only filters the current page**: `ConferenceRegistrationsAdmin` debounces `search` but applies it via `registrations.filter(...)` on the already-paginated page — never sent to the API (service lacks a search param). Contrast with `ish-arizalari`/`talaba-ishlari` which correctly server-side filter (`filter[name]`/`filter[search]`).
- **`tadqiqod-markazi/[id]` likely broken**: passes the numeric child page `id` as the `slug` prop to `StaticPageAdmin` → `usePageBySlug(id)` → `GET pages/{id}`. Works only if the Laravel `pages/{slug}` route resolves numeric IDs; if slug-only binding, detail pages 404. Title is hardcoded `'Maqola'`.
- **Mark-as-read drift**: in `konferensiya-royxatlari` and `ish-arizalari`, mark-as-read is a client-only `getById` side effect that does NOT invalidate the unread-count query → sidebar badge can drift. `talaba-ishlari` correctly invalidates `STUDENT_WORKS_UNREAD`. Inconsistent.
- **Single-role round-trip loss**: `foydalanuvchilar` edit assumes `u.roles[0]`; a user with multiple roles silently loses all but the first on save (table shows all roles, form keeps one).
- **Broken/placeholder UI**: konferensiyalar featured card has a hardcoded countdown `00:00:00` and an "Ishtirok etish" button that just opens the edit modal; `talabalarga` video card has static mute/fullscreen buttons with no handlers; `nizom/institut-nizomi` and `nizom/tashkiliy-tuzilma` use `downloadUrl:'#'` (broken downloads); journal `bosh-sahifa/page.tsx` is a hardcoded mock duplicating the real `ilmiy-jurnal/page.tsx`.
- **Edit modals show empty uploader for existing images**: `FacultiesCrudAdmin`, `DepartmentsCrudAdmin` (image+head_photo), `StaffCrudAdmin` (photo), `EditableDirectionsSection` omit the media field from edit `initialData` → opening "edit" shows a blank uploader despite an existing image (risk of accidental no-op / re-upload). Directions/Library/Banners/Testimonials/Partners DO include it.
- **`exam-subjects` editor cannot clear subjects**: `test-topshiriladigan-fanlar` returns early with `toast.error` when `subjects.length===0` — no UI path to empty `exam_subjects`.
- **Silent save failures in home sections**: `EditableNews/Partners/Testimonials/Location` wrap `onSubmit` in try/catch that logs to console and ALWAYS closes the modal in `finally` — a failed save looks successful. The `templates/*` `EditModal` path instead keeps the modal open and surfaces 422s. Two failure UXs for the same action.
- **`revalidate.ts` retry off-by-naming**: `MAX_RETRIES=2` but the loop yields at most 2 attempts with one 1s gap (naming implies 2 retries / 3 tries). Minor.
- **`PageTreeView` connector lines** are absolutely-positioned inside a row whose parent isn't `relative` → lines render against the page/section, not the row (visual bug).
- **`EditableTestimonialsSection`** duplicates the array to length≥10 for Swiper loop; deleting from a duplicate slide removes the source row (subtle).
- **No `<img onError>` fallback** anywhere — broken media URLs render as broken images (native `<img>` used in most editors, not `next/image`).
- **`reset-password`** redirects via `setTimeout(2500)` with no cleanup; **`tadqiqod-markazi`** image upload manually splits files out of FormData and uploads each via `media/upload` after page save (fragile multi-step flow).

### Massive duplication

- **3× direction-detail + 3× faculty-detail pages**: `abiturientlarga/{bakalavriat,magistratura,ordinatura}/[id]/page.tsx` are ~99% identical; the three `/fakultet/[id]/page.tsx` (~577 lines each) are near byte-for-byte. ~3000 lines that should be one template parameterized by `level`/`basePath` (the list pages already do this via `FacultiesCrudAdmin`).
- **3× diverging Journal CRUD**: `journal/journalIssueConfig.ts` (PDF maxSize 51200, accept `.pdf`) used by `ilmiy-jurnal/page.tsx`+`nashrlar`; `templates/JournalIssuesCrudAdmin.tsx` (PDF maxSize 102400, accept `application/pdf`, date defaults to today) used by `ilmiy-jurnal-nashrlar`. Same entity, inconsistent validation. Library + student-life photos similarly have a dedicated route page AND a `*CrudAdmin` template variant with different field sets/categories.
- **~320-line news pages near-identical**: `yangiliklar/page.tsx`, `.../konferensiyalar`, `.../tadbirlar` differ only by category/badge/color. `AdminOverlay`/`StatusChip`/`IsftDate`/`IsftPagination` re-declared in 5+ files. `bakalavriat` vs `magistratura` oquv-rejalari pages identical except a level string.
- **~20 CRUD hook files ~95% boilerplate** (optimistic add/update/delete + toast + revalidate) — no `createEntityHooks` factory; special-cases (404-as-success only in news/journal/library; detail-revalidate only in library/direction) diverge inconsistently.
- **Duplicate FormData builders**: `pageService.toFormData` vs `utils.buildFormData` (differ in single-File handling); three FormData→object parsers; two Leaflet wrappers (`ContactMap`/`LeafletMap`); two pagination components; `stripHtml`/`formatFileSize`/`formatDate` redefined locally in templates despite `@tmtu/utils` exports.
- **Duplicate source-of-truth**: `abiturientlarga/page.tsx` AND `oqishni-kochirish-va-tiklash/page.tsx` both write `applicants_transfer_*` SiteContent (last-write-wins); duplicate unread-badge-injection logic in `AdminTopHeader` + `AdminMobileMenu`.

### Hardcoded/static "content" masquerading as editable

- **`tuzilma/rektorat/page.tsx`** hardcodes `receptionHours` and a single telegram handle (`@ttatf_director`) keyed by `staff.sort_order` — mis-attributes data if sort_order changes, and is NOT editable despite being an admin editor.
- **`meyoriy-hujjatlar` NavHub** hardcodes `(N hujjat)` counts that drift from reality.
- **Entire `antikorrupsiya` cluster** (page + `AntiCard` + `aloqa-kanallari`/`ContactCard` + `idoraviy-hujjatlar`/`LawCard`) renders hardcoded content with **no edit capability and no API calls**.
- **`DocumentDetailAdmin` leaf pages** hardcode `title`/`linkUrl` (lex.uz links, `downloadUrl:'#'`) in route files — not DB-backed.
- Many `StaticPageAdmin` items + faoliyat pages (tadqiqot, oaq-tavsiya-nashrlar, jurnal-haqida, etc.) ship hardcoded reference data as `children`.

### Brand / data integrity

- **Inconsistent org names baked into defaults**: code mixes `TdTUTF`, `TTATF` (`@ttatf_director`, `email@ttatf.uz`), `ISFT` (many fallback titles literally say "ISFT Institutning…"), and "Toshkent tibbiyot akademiyasi" vs CLAUDE.md's canonical "Toshkent Davlat Tibbiyot Universiteti". Default admission values reference mixed-case `admission.TdTUTF.uz`/`info@TdTUTF.uz`. These ship as visible public content when no DB rows exist.
- **Faculty-delete cascade messaging contradicts itself**: `fakultet/[id]` says directions are left with null `faculty_id`; `abiturientlarga/page.tsx` says related directions are DELETED. At least one misleads the admin about backend behavior.

### Inconsistencies / type-safety / dead code

- **Response-envelope handling is non-uniform** (list `{data,meta}`, detail/mutation `{data}`, auth/counts `{success,message,data}`) with no shared unwrapping helper — a backend shape change silently breaks a subset.
- **Update strategy differs per entity with no documented rule** (multipart `_method=PUT` vs JSON PUT vs `hasFiles()` branch) — risk of "file upload silently dropped" if a JSON-PUT entity gains a file field.
- **i18n display inconsistency**: same `TalentedStudent` entity is `decodeHtml`-decoded in `iqtidorli-talabalar` but read raw `.uz` in the `talabalarga` aggregate (visible entity-encoding difference).
- **`error: any` in all 29 mutation hooks** + `useLogin`/`useLogout`; `bakalavriat`/`magistratura`/`tadqiqod-markazi` pages use `useState<any>`/`faculty: any`; `AdminTopHeader`'s `dbToNav`/`mergeNavWithDb` is almost entirely `any`.
- **`LoadingSpinner` ignores its `size`/`text`/`className` props** — ~15 callers pass dead props; intended `py-16` spacing/loading text never render.
- **Dead code**: `cleanDescription()` defined in all 3 direction-detail pages but never called; unused lucide imports across many files; `NavHubAdmin` imports ~40 icons, faoliyat NavHub uses 4; `KaryeraMarkaziAdmin` imports unused `useRouter`; several `types/index.ts` `*FormData` interfaces appear unused (forms build raw FormData).
- **Encoding corruption**: `AdminTopHeader.tsx` contains mojibake (`â”€â”€`, `â€”`) from a UTF-8/Windows-1252 round-trip; `FacultiesCrudAdmin` has heavy `\u`-escaped smart quotes — files re-saved through a lossy tool.
- **`sahifalar`** duplicates bracket-key FormData parsing inline (in `handleCreate` AND `handleUpdate`, ~40 lines each) instead of reusing the shared `parseFormData()` that `translations` uses.
- **Two accordion implementations** for the same FAQ UX (measured-`scrollHeight` in `abiturientlarga/page.tsx` — the documented height-bug area — vs simple `isOpen` conditional in faculty detail pages); `react-hooks/exhaustive-deps` suppressed in `abiturientlarga/page.tsx` `admissionItems` memo.
- **Fragile HTML-regex content parsing**: `getCleanDescription`/`parseDescription`/`parseListItems` strip sections by regex on stored HTML (e.g. `/O'qitiladigan fanlar/`, `/<li...>/`) — brittle against editor markup variations.
- **`kafedralar/[slug]`** has a client-side fuzzy name-matching heuristic (`normalize`/`namesMatch`/`groups`) grouping departments under faculties by name similarity — unvalidated correctness risk (could mis-group).
- **Config divergence**: admin `next.config.ts` has no `experimental` React Compiler/Turbopack block (web does); no `tailwind.config.ts` (CSS-first v4) so Tailwind utilities and bespoke ISFT colors aren't unified through a theme config; brand color inconsistency (`#00575B` teal on public templates vs `blue-700` on chrome/inline-edit affordances; `TagsInput` hardcodes `#00575B`).
- **Misplaced artifact**: `apps/admin/src/components/sections/# Admin Panel Inline Editing Redesign Pl.prompt.md` — a 350-line design doc inside the source tree referencing planned-but-absent components (`DashboardDropdown`, `AdminAvatar`, `EditableMission`, `inline-edit/ConfirmDialog`).
- **Accessibility gaps in admin chrome**: `shared/Modal` has Esc + scroll-lock but **no focus trap / `aria-modal` / `role=dialog`** (only `AccessibilityPanel` does it right); `EditableWrapper` action buttons are `<button title>` (no `aria-label`) and the overlay is hover-only (no keyboard path to edit).
- **Performance**: `dashboard` fires 14 parallel `per_page:1` queries just to read `meta.total` (could be one aggregated stats endpoint); CRUD pages do optimistic update + `invalidateQueries` + explicit `refetch()` (triple work); `revalidateFrontend` always pushes `/` → every edit triggers a full-home ISR revalidation (heavy churn under frequent edits).
- **`api.ts ↔ useAuthStore` 2-way import coupling**; `studentLifePhotoService` alone uses leading-slash paths + manual multipart header (breaks the convention of the other 24 services).

### Open questions to resolve

- Should the 3×-duplicated faculty/direction detail pages collapse into one parameterized template?
- Does the Laravel `pages/{slug}` route resolve numeric IDs (determines if `tadqiqod-markazi/[id]` is broken)?
- Which Journal/Library CRUD implementation is canonical vs legacy/dead?
- Is `@tmtu/types` (in `transpilePackages`, absent from `package.json` deps) resolved transitively, or a clean-install risk?
- Are `public/images/*` hero SVGs + `IMG_3455.mp4` referenced in admin or dead copy-paste from `apps/web`?
- Is the dashboard hub linking to real sibling routes (`/yangiliklar`, `/ish-arizalari`, `/konferensiya-royxatlari`, `/biz-haqimizda/tuzilma/*`) or are some dead links?
- Does CLAUDE.md's "js-cookie cookie auth" claim still hold — the auth store uses raw `document.cookie`, not `js-cookie`?
- Is `REVALIDATION_SECRET` guaranteed overridden in prod (default is a placeholder)?
- Should the JSON-vs-multipart split, the three FormData parsers, and the duplicate FormData builders be consolidated?

---

## Appendix E — Domain Deep-Dive: Shared (Packages, Infra, Docs, Tooling, Root) (116 files)

# Shared (Packages, Infra, Docs, Tooling, Root)

This domain is the **non-application connective tissue** of the `tmtu-termiz` monorepo: the shared TS packages meant to be the cross-app contract layer, the deployment/runtime infrastructure, the documentation and risk-register corpus, the E2E acceptance suite, the deploy/CI automation, and the root workspace control plane. A recurring theme across all five slices is **aspirational scaffolding ahead of adoption**: substantial structure exists (packages, infra dirs, IaC trees, generators) that is wired but unused, hand-maintained but claiming automation, or entirely empty.

## Overall Purpose & Responsibilities

- **Shared packages (`packages/*`)** — the intended single source of truth (SSOT) for domain types, the typed API client, cross-app utilities, RBAC guards, i18n, analytics, the design system, and shared lint/format/TS/Tailwind configs.
- **Infrastructure (`infrastructure/*`)** — Docker Compose stack, three multi-stage Dockerfiles, in-container Nginx/PHP/Postgres/Supervisor configs, and a bare-metal host Nginx config. K8s/Terraform/Ansible/Monitoring trees are empty placeholders.
- **Docs (`docs/*`)** — onboarding/deployment/runbook/SEO/security guides, one ADR, and five untracked analysis docs forming a de-facto risk register and migration audit.
- **E2E (`e2e/*`)** — `@tmtu/e2e` Playwright + Axe black-box acceptance suite against the three live services.
- **Scripts & CI (`scripts/*`, `.github/workflows/ci.yml`)** — three uncoordinated deploy paths plus the single 5-job CI pipeline.
- **Root control plane** — Turborepo + pnpm orchestration, git-hook enforcement, pinned tool versions, shared strict TS base, editor/format normalization, and top-level governance docs.

## Architecture & Key Patterns

### Source-first workspace model

Every shared package follows an identical convention: `@tmtu/<x>`, version `0.1.0`, `private:true`, `main`/`types` pointing **directly at `./src/index.ts`** (raw TS, no build/dist emit). Consumption is source-first via pnpm `workspace:*` + Next.js `transpilePackages` — there is no compilation boundary. `lint` scripts are deliberate **no-op echoes**; `typecheck` via `tsc --noEmit` is the only real per-package gate.

### Two-layer orchestration

`pnpm-workspace.yaml` is the canonical workspace discovery source (globs: `apps/*`, `packages/*`, `packages/config/*`, `e2e`, `tooling/*`). Turborepo (`turbo.json`) layers the task graph on top, with nearly every task declaring `dependsOn: [^build]` — correct for the `@tmtu/types → sdk → apps` chain. `tsconfig.base.json` (repo root) is the strict TS SSOT, wired into `turbo` `globalDependencies` so any change busts all caches.

### Dependency graph (packages)

```
@tmtu/sdk ──workspace:*──▶ @tmtu/types ──(only devDep typescript)
@tmtu/utils / auth / i18n ──workspace:*──▶ @tmtu/types   (for Locale & Translatable)
@tmtu/utils ──▶ clsx ^2.1.1, tailwind-merge ^3.5.0
@tmtu/ui ──peerDep──▶ react/react-dom ^19   (otherwise empty)
@tmtu/analytics ──▶ (no runtime deps)
```

### SDK control flow

`TmtuApiClient.request<T>()` (`packages/sdk/src/client.ts`) is the single private chokepoint: builds JSON headers + conditional `Authorization: Bearer`, normalizes the endpoint leading slash, arms an `AbortController` timeout (default 15000ms), awaits `fetch`, normalizes non-ok responses into an `ApiError`, returns parsed JSON, and always clears the timer in `finally`. `get()` threads Next.js cache options `{tags, revalidate}`. `createResources(client)` returns typed resource namespaces hitting hardcoded `/v1/*` paths.

### Two parallel deployment topologies

1. **Docker Compose** (`infrastructure/docker/compose/compose.yml`) — the cohesive primary path. The Laravel `app` image (built from `Dockerfile.api`, 3-stage base/vendor/production) is reused verbatim by three services differing only by `command`: `app` (supervisord runs php-fpm + nginx in one container, only one publishing `:8000->80`), `queue` (`queue:work redis`), `scheduler` (raw `while-true; sleep 60; schedule:run` shell loop). Web/admin use 2-stage Node builds leveraging Next.js `output: standalone` + pnpm workspace filtering, running as non-root `nextjs:1001`. Config is injected entirely via env vars (hence `www.conf` sets `clear_env=no`).
2. **Bare-metal host** (`infrastructure/nginx/nginx-production.conf` + orphan `media.conf`) — single big Ubuntu box, Nginx over a unix socket to PHP-FPM, reverse-proxying Next.js apps, paths under `/var/www/tmtu-termiz/` instead of `/var/www/html/`. **Not reconciled with the Compose model.**

### Git-hook quality gate (husky v9)

Three tiers: editorconfig/prettier for style, lint-staged at commit (prettier on TS/JS/JSON/MD/YAML, `pint --dirty` on PHP) + inline secret-scan, commitlint for message format, with CI as the final gate.

## Concrete Inventory

### Shared packages (8 published names across 6 dirs + types/sdk)

| Package                                                                                      | Path                                                   | Status                     | Exports                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@tmtu/types`                                                                                | `packages/types/src/`                                  | **Real (hand-maintained)** | 13 entities (`News, Faculty, Department, Staff, Direction, Faq, Banner, Partner, Testimonial, Page, ContactMessage, SiteContent`), common mixins (`Locale, Translatable, Timestamps, Identifiable, SoftDeletable, Sortable, Toggleable, Slug, MediaItem`), api envelopes (`ApiResponse<T>, PaginatedResponse<T>, ApiError`) |
| `@tmtu/sdk`                                                                                  | `packages/sdk/src/`                                    | **Real but unused**        | `TmtuApiClient` (get/post/put/delete/setToken/request), `createClient()`, `createResources()` exposing `news.{list,show}`, `faculties.{list,show}`, `departments.{list,show}`, `staff.{list,show}`, `directions.{list,show}`, `faqs.{list}`                                                                                 |
| `@tmtu/utils`                                                                                | `packages/utils/src/`                                  | **Real, complete**         | `cn`, `t`, `hasTranslation`, `formatDate` (+`FormattedDate`), `stripHtml`, `truncate`                                                                                                                                                                                                                                       |
| `@tmtu/auth`                                                                                 | `packages/auth/src/`                                   | **Skeleton**               | `hasPermission`, `hasRole`, `hasAnyRole` (+`User`, `AuthState`); token storage/refresh/2FA are TODO                                                                                                                                                                                                                         |
| `@tmtu/i18n`                                                                                 | `packages/i18n/src/`                                   | **Skeleton**               | `LOCALES`, `DEFAULT_LOCALE='uz'`, `isValidLocale`; real 1653-line dictionary still in `apps/web/src/lib/i18n.ts`                                                                                                                                                                                                            |
| `@tmtu/analytics`                                                                            | `packages/analytics/src/`                              | **Skeleton**               | `noopAdapter` (+`AnalyticsEvent`, `AnalyticsAdapter`); GA & Yandex adapters are TODO                                                                                                                                                                                                                                        |
| `@tmtu/ui`                                                                                   | `packages/ui/src/`                                     | **Empty placeholder**      | none (all exports commented out; `.gitkeep`; README marked 🚧)                                                                                                                                                                                                                                                              |
| `@tmtu/eslint-config` / `@tmtu/prettier-config` / `@tmtu/tailwind-config` / `@tmtu/tsconfig` | `packages/config/{eslint,prettier,tailwind,tsconfig}/` | **Real configs**           | eslint base+nextjs (`index.js`, `nextjs.js`), prettier object (`index.js`), tailwind `preset.css` @theme tokens, tsconfig `base/nextjs/node/react-library.json`                                                                                                                                                             |

Key utility files: `packages/utils/src/{cn,translate,date,strip-html,index}.ts`. Config files: `packages/config/eslint/{index.js,nextjs.js}`, `packages/config/prettier/index.js`, `packages/config/tailwind/preset.css`, `packages/config/tsconfig/base.json`.

### Infrastructure

- **Compose services (7):** `app` (`tmtu_app`, `:8000->80`), `queue` (`tmtu_queue`), `scheduler` (`tmtu_scheduler`), `postgres` (`tmtu_postgres`, `postgres:16-alpine`, `:5432`), `redis` (`tmtu_redis`, `redis:7-alpine`, `:6379`, requirepass+appendonly+512MB LRU), `web` (`tmtu_web`, `node server.js :3000`), `admin` (`tmtu_admin`, `node server.js :3001`).
- **Volumes (4):** `tmtu_postgres_data`, `tmtu_redis_data`, `tmtu_app_storage` (→`/var/www/html/storage/app`), `tmtu_app_logs`. **Network:** `tmtu_network` (bridge).
- **Dockerfiles:** `infrastructure/docker/images/Dockerfile.api` (tracked; stages base/vendor/production); `Dockerfile.web` & `Dockerfile.admin` (**UNTRACKED**; stages base/builder/runner).
- **In-container configs:** `infrastructure/docker/configs/nginx/{default.conf, media.conf}`, `php/{php.ini, opcache.ini, www.conf}`, `postgres/postgresql.conf`, `supervisor/supervisord.conf`.
- **Host config:** `infrastructure/nginx/nginx-production.conf` (**UNTRACKED**; domains `tdtutf.uz`/`www` + `app.tdtutf.uz`, Let's Encrypt TLS, 50GB proxy_cache, limit_req zones).
- **Empty skeletons (ZERO files):** `infrastructure/kubernetes/{base,overlays/production,overlays/staging}`, `infrastructure/terraform/{modules,environments/production,environments/staging}`, `infrastructure/ansible/{playbooks,roles}`, `infrastructure/monitoring/{alerts,grafana/dashboards,loki,prometheus}`.
- **PHP extensions built:** pdo, pdo_pgsql, pgsql, gd, zip, intl, bcmath, opcache, exif, pcntl, redis, imagick.

### Docs

- `docs/architecture/PROJECT_DEEP_DIVE_2026-06.md` (**authoritative risk register**, C1-C3/H1-H9; untracked), `ARCHITECTURE_STUDY.md` (pass-1, stale paths), `VERIFICATION_ADDENDUM.md` (pass-2), `MIGRATION_VERIFICATION_REPORT.md` (audit + A1-A23), `MIGRATION_FIXES_APPLIED.md` (matches current working tree) — all untracked. Plus tracked `admin-inline-editing-plan.md` (outdated), `ADR/0001-monorepo-migration.md` (the only ADR), `overview.md`.
- `docs/guides/{seo-strategy,deployment,getting-started,runbook}.md`, `docs/security/security.md`.

### E2E (`e2e/`)

`playwright.config.ts` (workers:1 serial, setup project, html report → `report/`, **no webServer block**), `global-setup.ts` (clears Laravel rate-limit cache), `tests/auth-setup.ts` (→`.auth/admin.json`), and 9 numbered specs: `01-login`, `02-frontend`, `03-admin-crud-ui`, `04-screenshots`, `05-a11y` (Axe), `06-a11y-panel`, `07-news-system` (largest), `08-new-admin-crud`, `09-real-crud-operations` (only DB-mutating spec). ~80+ tests.

### Scripts & CI

- `scripts/deploy.sh` (dual-mode bare|docker), `scripts/deploy-production.sh` (**UNTRACKED**, bare-metal provisioner), `scripts/docker-safe.sh` (`down -v` guard).
- `.github/workflows/ci.yml` — 5 jobs: **api** (PG16+Redis7, Pint `--test`, PHPStan L5, `php artisan test --parallel`), **frontend** (turbo lint/typecheck/build), **e2e** (main-only/label, boots full stack, uploads `e2e/report`), **docker** (main-only, builds 3 images at repo-root context, `push:false`), **deploy** (production env gate → appleboy ssh `deploy.sh docker`).

### Root control plane

`package.json`, `turbo.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.env.example`, `.gitignore`, `.dockerignore`, `.tool-versions` (node 20.18.0 / php 8.3.14 / pnpm 10.28.2), `.nvmrc`, `commitlint.config.js`, `.prettierrc`, `.prettierignore`, `.editorconfig`, `.gitattributes`, `.husky/{pre-commit,commit-msg}` (+ vendored `_/`), README/CONTRIBUTING/CODE_OF_CONDUCT/SECURITY/CHANGELOG/LICENSE.

## Data & Control Flow

- **Media serving (Docker):** request → nginx `/storage/` alias → `/var/www/html/storage/app/public` (the `storage:link` target) → file off disk, bypassing PHP. Private files route through Laravel which returns `X-Accel-Redirect` to the `internal` `/private-files/` location.
- **API request path (Docker):** supervisord (nodaemon) starts nginx + php-fpm → nginx (`default.conf`) terminates HTTP on `:80`, serves `/storage/*` static, proxies `*.php` to php-fpm on `127.0.0.1:9000` (matches `www.conf`).
- **Startup ordering:** `app` waits on postgres+redis `service_healthy`; web+admin wait on app `service_healthy`. **But** `queue`/`scheduler` use plain `depends_on` (not `service_healthy`), so they may run before the DB/migrations are ready.
- **Translatable extraction:** `t(field, lang='uz')` → string passthrough OR direct `field[lang]` OR loop over `LOCALE_ORDER ['uz','ru','en']` fallback OR `''`.
- **Git hooks:** git → `.husky/<hook>` → sources deprecated `_/husky.sh` shim → real dispatch in `_/h` (sets `PATH=node_modules/.bin`) → `sh -e` runs the user hook → pre-commit runs lint-staged + secret-scan; commit-msg runs commitlint.
- **CI deploy gate:** push to `main` → docker job builds images (`push:false`) → deploy job (manual production approval) → ssh `deploy.sh docker` → `compose build --pull + up -d` (no zero-downtime/rollback; prod rebuilds from scratch).

## Notable Conventions

- `type` (not `interface`) aliases throughout; explicit `| null` for nullable DB columns; `string` for ISO timestamps; numeric ids; `satisfies` used on the thrown `ApiError`.
- Translatable fields modeled as `{uz?, ru?, en?}` matching backend JSONB Spatie Translatable; API envelopes mirror Laravel Resource/pagination output.
- Naming: containers `tmtu_*`, volumes `tmtu_*_data`, single bridge net `tmtu_network`.
- Config-via-env: no `.env` baked into images; all Laravel/Next config injected as compose env vars. Admin honors the `/api/v1` prefix (`NEXT_PUBLIC_API_URL=.../api/v1`); web uses `/api`.
- Tailwind v4 CSS-first `@theme` tokens (oklch brand blue + medical-green accent, Inter font vars) in `preset.css`.
- Commit scopes (commitlint, **warn-level**): api, web, admin, mobile, e2e, ui, sdk, types, config, utils, i18n, docs, infra, deps, release.
- Infra config comments are largely in Uzbek (xavfsizlik=security, rasmlar=images).

## Dependencies

**Internal:** `@tmtu/sdk → @tmtu/types`; `@tmtu/utils/auth/i18n → @tmtu/types` (Locale/Translatable); every package tsconfig `extends ../../tsconfig.base.json` (repo root, **not** the `@tmtu/tsconfig` package — two parallel systems). Infra depends on: root `.dockerignore`, root `package.json` pnpm pin, `pnpm-lock.yaml` (frozen installs), `apps/api/composer.{json,lock}`, Next.js standalone output, `apps/web` `/api/health` route, `apps/api` `GET /api/health` (throttle:10,1).

**External:** TypeScript ^5.7.2, clsx ^2.1.1, tailwind-merge ^3.5.0, Tailwind v4, ESLint ^9.17 + @typescript-eslint ^8.18 + eslint-config-next ^16.1.6 (+ import/react/react-hooks/jsx-a11y plugins), Prettier ^3.4.2 + prettier-plugin-tailwindcss ^0.8.0, Turborepo ^2.3.3, husky ^9.1.7, @commitlint ^19.6.0, lint-staged ^15.2.10. Runtime: PHP 8.3-fpm-alpine, Laravel 12, Nginx, Supervisor, PostgreSQL 16, Redis 7, Node 20-alpine + Corepack + pnpm 10.28.2, Next.js 16 standalone, Let's Encrypt/Certbot, OPcache+JIT, ffmpeg + ImageMagick + image optimizers. E2E: @playwright/test, @axe-core/playwright.

**Referenced-but-missing:** `apps/api/docs/openapi.yaml` (intended SDK/types codegen source — absent; only `API.md` exists), `CODEOWNERS` (referenced by CONTRIBUTING/SECURITY — absent), `docs/architecture/diagrams/` (linked by `overview.md` — empty), ADR-0001's `deep_read_audit_2026_05_18.md` + `critical_security_exposures_2026_05_18.md` (absent).

## Consolidated Findings (tech debt · risks · bugs · security · inconsistencies · TODOs)

### Dead / unused / aspirational code

1. **Shared packages are unused.** Repo-wide grep finds ZERO real imports of `@tmtu/sdk`, `@tmtu/types`, `@tmtu/utils`, `@tmtu/auth`, `@tmtu/i18n`, `@tmtu/analytics`, `@tmtu/ui` in `apps/**`. The only `@tmtu/types` match is the literal string inside `transpilePackages` arrays. The entire shared layer is wired but not consumed — a stalled migration.
2. **SDK isn't even transpiled.** `transpilePackages` in `apps/web/next.config.ts` and `apps/admin/next.config.ts` list `['@tmtu/utils','@tmtu/types']` but **omit `@tmtu/sdk`** — so even an attempted import of the raw-TS SDK would fail to transpile.
3. **Logic duplicated with drift.** Web and admin reimplement `cn/t/formatDate/truncate` in `apps/web/src/lib/utils.ts` and `apps/admin/src/lib/utils.ts`, and the implementations **diverge** from `@tmtu/utils`: package `formatDate` returns a structured `{day,month,year,full}` object via hardcoded month arrays while web returns a string via `Intl.DateTimeFormat('uz-UZ')`; package `t` falls back uz→ru→en while admin's only falls back to `.uz` (and uses a separate `Language` type); `truncate` uses `…` (U+2026) in the package vs `...` (3 ASCII dots) in apps. Web also reimplements the SDK as its own `apps/web/src/lib/api.ts`.
4. **Skeleton vs real status.** Real & complete: `@tmtu/utils`, `@tmtu/config`. Skeleton stubs: `@tmtu/auth` (no token/refresh/2FA), `@tmtu/i18n` (real dictionary still in app), `@tmtu/analytics` (only interface + noopAdapter — **contradicts CLAUDE.md's "GA + Yandex adapters" claim**). Empty: `@tmtu/ui`.
5. **Empty infra skeletons** — `kubernetes/`, `terraform/`, `ansible/`, `monitoring/` contain zero files. CLAUDE.md presents them as real; there is no IaC, no cluster manifests, no observability stack.
6. **Empty tooling dirs** — `tooling/`, `tooling/generators/`, `tooling/scripts/`, `scripts/ci/`, `docs/architecture/diagrams/` are zero-file placeholders. The ADR-promised Plop/Hygen generators were never built.
7. **Orphan/dead config** — `infrastructure/docker/configs/nginx/media.conf` is never `COPY`ed or `include`d. It mixes http-context directives with location blocks and uses host paths (`/var/www/tmtu-termiz/`), so it would fail `nginx -t` if included in `default.conf`'s server block. Also `e2e/tests/09-real-crud-operations.spec.ts` builds a FormData object (lines 44-52) that is then ignored.

### Bugs & latent design defects

8. **SDK throws a plain object, not an Error.** `TmtuApiClient.request()` does `throw {...body, status, success:false}` — no stack, fails `instanceof Error`, breaks `catch(e){ e.message }`. The app's own `ApiError` (in `apps/web/src/lib/api.ts`) correctly extends `Error`.
9. **SDK hardcodes `/v1` prefix** in `createResources` (`/v1/...`), assuming `baseUrl = <host>/api` (web convention). Admin's `NEXT_PUBLIC_API_URL` already includes `/v1`, so passing it as baseUrl yields `/api/v1/v1/...`. Latent (no app uses the SDK) but mis-routes for admin.
10. **Query-string type coercion lie** — `news.list`/`directions.list` cast `params as Record<string,string>` while params include numeric fields (`per_page`, `faculty_id`); works at runtime but bypasses strictness intent.
11. **SDK/types coverage gap** — types defines 13 entities but `createResources` exposes only 6; missing accessors for Banner/Partner/Testimonial/Page/ContactMessage/SiteContent, `Faq.show`, search, contact, auth/login, and all admin CRUD (post/put/delete defined on the client but unused).
12. **Envelope shape mismatch** — `ApiResponse<T>` `{success,message,data}` (no status), `ApiError` `{success:false,message,errors?,status}`, `PaginatedResponse<T>` bare Laravel paginator (no success/message): three conventions, so generic response handling can't assume a uniform shape. Also the `level` union `'bakalavriat'|'magistratura'|'ordinatura'` is duplicated inline in Direction and Faculty rather than a shared named type.
13. **Scheduler anti-pattern + no-op healthcheck** — compose `scheduler` runs `while true; sleep 60; schedule:run` (drift accumulates; a hung run stalls the loop). Its healthcheck `pgrep -f 'schedule:run' || true` always returns success — it can never report unhealthy.
14. **Nginx `add_header` inheritance pitfall** — in `default.conf` and `nginx-production.conf`, location blocks that declare any `add_header` silently drop the server-level security headers (X-Frame-Options, Referrer-Policy, Permissions-Policy) for `/storage/*` media and the `.php` location.
15. **PHP upload cap vs advertised limits** — `php.ini` `upload_max_filesize=100M` / `post_max_size=110M` conflicts with nginx `client_max_body_size=500M` and docs advertising 500MB video uploads; uploads routed through PHP get 413/truncated above 100M.
16. **storage:link vs volume shadowing** — `Dockerfile.api` runs `php artisan storage:link` at build time, but the `app_storage` volume mounts over `/var/www/html/storage/app` at runtime and can shadow the symlink (classic Laravel+Docker gotcha — needs fresh-deploy verification).
17. **deploy-production.sh will fail at the nginx step** — it `cp`s `$APP_DIR/nginx-production.conf`, but `infrastructure/nginx/` is a new untracked dir; on a clean checkout that file isn't there.
18. **deploy.sh path mismatch** — reads `/var/run/php-fpm.pid` (systemd path mismatch).
19. **`opcache.validate_timestamps=0`** — API container never picks up code changes without a full image rebuild/restart (correct for immutability, foot-gun for hotfixes).

### Security

20. **Secrets in plain env, no secret management** — `APP_KEY`, `DB_PASSWORD`, `REDIS_PASSWORD`, `REVALIDATION_SECRET`, `MAIL_PASSWORD` passed as plain env vars. `REDIS_PASSWORD` is embedded in the redis healthcheck command line (`redis-cli -a ${REDIS_PASSWORD} ping`), exposing it in `docker inspect`/process list.
21. **Host port exposure** — compose publishes postgres `:5432` and redis `:6379` to the host by default; in production these should only be reachable on `tmtu_network`.
22. **Pre-commit secret-scan gap** — the regex `^\.env$|\.env\.local$|\.env\.production$` does NOT catch `.env.staging`, `.env.development`, or `.env.*.local`, all of which `.gitignore` lists as secret files. A staged `.env.staging` passes the hook.
23. **`stripHtml()` is NOT sanitization** — naive `/<[^>]*>/g`; safe for previews, a foot-gun on untrusted-HTML output paths (use DOMPurify).
24. **Weak a11y gate** — `e2e/tests/05-a11y.spec.ts` fails only on `impact==='critical'`; serious/moderate WCAG violations pass silently.
25. **Hardcoded test credentials** — `admin@tdtutf.uz / Admin123456` in `auth-setup.ts`, `01-login`, `09-real-crud`; CI seeds `ADMIN_PASSWORD: Admin123456` to match.
26. **TLS header drift** — the `app.tdtutf.uz` proxy server block in `nginx-production.conf` omits HSTS and the modern `ssl_protocols`/ciphers set on the main block; no OCSP stapling.
27. **security.md partly wrong** — claims an `editor` role (actually dead/no routes) and HttpOnly session cookies (real admin token is in localStorage + a non-HttpOnly `admin-token` cookie); CSP still `frame-ancestors`-only + `unsafe-inline`.

### Tooling / config debt

28. **Deprecated husky setup** — `.husky/{pre-commit,commit-msg}` start with the legacy `. "$(dirname -- "$0")/_/husky.sh"` lines that now only print a removal warning ("WILL FAIL in v10.0.0"). Also `package.json` `prepare: "husky install"` uses the deprecated subcommand. The vendored `.husky/_/` is committed despite its own `_/.gitignore` containing `*`.
29. **Duplicate workspace declaration** — `package.json` has a `workspaces` array AND `pnpm-workspace.yaml` exists; pnpm ignores the package.json field, so it's dead/drift-prone config.
30. **ESLint 9 legacy-format risk** — configs are old `.eslintrc` CommonJS (`module.exports`) while `eslint ^9.17` defaults to flat config; needs `ESLINT_USE_FLAT_CONFIG=false` or a compat shim. Apps have no `.eslintrc` extending `@tmtu/eslint-config`, so the shared lint config appears unused. `packages/config/eslint/index.js` documents `./react` and `./node` variants that **don't exist**.
31. **Two parallel tsconfig systems** — packages extend repo-root `tsconfig.base.json`, not the published `@tmtu/tsconfig` package, which nothing consumes. Package tsconfigs set vestigial `outDir:'dist'`/`rootDir:'src'` though base sets `noEmit:true`.
32. **Lint is a no-op across the shared layer** — every package `lint` script is `echo … && exit 0`. Combined with finding 30, `pnpm lint`/`turbo lint` may be effectively no-ops for these workspaces (the real gates are CI's Pint/PHPStan and `tsc --noEmit`).
33. **Version inconsistencies** — README "Prerequisites" says `pnpm >= 9.0.0` while engines/`.tool-versions` enforce pnpm `10.28.2`. `getting-started.md` says "40+ migrations" (count drift). `prettier-plugin-tailwindcss ^0.8.0` is an unusual pin for a Tailwind v4 project (maintained line is 0.6.x).
34. **Type-source duplication risk** — `@tmtu/auth.User` is defined standalone, not sourced from `@tmtu/types`; the Tailwind `preset.css` brand scale is non-contiguous (50,100,500,600,700,900 — missing 200/300/400/800; accent only 500/600), so references like `brand-300`/`accent-100` silently yield no token.
35. **commitlint scope-enum is warn-only (level 1)** — out-of-list and comma scopes (`fix(web,admin)` in recent history) pass.
36. **LICENSE inconsistency** — `package.json` declares SPDX-ish `"UNLICENSED"` while `LICENSE` is custom proprietary text (functionally consistent, minor mismatch). `.vscode/extensions.json` recommends `Vue.volar` (irrelevant to a React/Next stack — template leftover).

### Documentation drift & process gaps

37. **Phantom SDK/types codegen source** — README, `src/index.ts` (both packages), entity/resource TODOs, and the sdk `generate` script all reference `apps/api/docs/openapi.yaml`, which **doesn't exist**. The `generate` script merely echoes a TODO; the "single source of truth" is hand-maintained and can silently drift from Laravel models.
38. **Untracked critical files** — `Dockerfile.web`, `Dockerfile.admin`, `nginx-production.conf`, `deploy-production.sh`, and the 5 analysis docs are NOT committed (the old `apps/*/Dockerfile.*` were deleted), so the only copies of the web/admin images, host config, and provisioner live in the working tree and would be lost on a clean checkout.
39. **Three uncoordinated deploy paths** — `deploy.sh` (bare|docker), `deploy-production.sh` (bare-metal), and Docker Compose disagree on domain, server spec (4-8GB vs 200GB), queue driver (redis vs database), and artisan path (`apps/api/artisan` vs `/var/www/tmtu-termiz/artisan`). No doc declares a canonical path.
40. **Domain branding split** — `seo-strategy.md`, `deploy-production.sh`, `getting-started.md`, `runbook.md`, and ALL e2e auth use legacy `tdtutf.uz`; `deployment.md`, the CI deploy URL, and `security.md` use `tashmedunitf.uz`. `seo-strategy.md` also hardcodes `foundingDate:'2024'` (real founding 2018).
41. **Stale docs** — `e2e/README.md` says "4 files/30 test, e2e_tests/, npm ci" (actual: 9 specs/80+ tests/pnpm); `admin-inline-editing-plan.md` references `/api/admin/*` (real `/api/v1/*`) + old `frontend/` paths; `ARCHITECTURE_STUDY.md` paths point at the pre-migration tree.
42. **Leaked LLM preamble** committed into `MIGRATION_VERIFICATION_REPORT.md` line 1 ("I'll write the migration completion report based on…").
43. **Committed build artifact** — `e2e/report/index.html` is a 527KB Playwright HTML report in VCS; action A14 calls for `git rm --cached` + reconciling `.gitignore`/CI artifact paths.
44. **Missing CODEOWNERS** despite CONTRIBUTING/SECURITY referencing it for reviewer routing / "2 approvers" policy. ADR-0001 references two memory docs not present in the repo.
45. **CI/deploy has no zero-downtime or rollback** — `compose build --pull + up -d`; the docker job builds images `push:false`, so prod rebuilds from scratch (drift risk; contradicts deploy.sh's "zero-downtime" claim). Doc/impl mismatch: CONTRIBUTING claims pre-commit runs `eslint --fix` but lint-staged only runs `prettier --write`; semantic-release is "(planned)" not installed; backup format drift (`deployment.md` `pg_dump | gzip` vs backend `pg_dump -Fc`).

### Key Open Questions

- Adopt `@tmtu/sdk`/`@tmtu/types`/`@tmtu/utils` and delete the duplicated `apps/*/src/lib/{api,utils}.ts`, or remove the abandoned scaffolding? Unify the SDK envelope shapes and the `level` union before any app depends on them?
- Which deploy path and which production domain (`tashmedunitf.uz` vs `tdtutf.uz`) are canonical? No ADR adjudicates.
- Should the untracked Dockerfiles/host-config/provisioner/analysis docs be committed atomically with the `apps/*/Dockerfile.*` deletions?
- Migrate ESLint configs to flat config and husky hooks for the v10 upgrade before bumping? Remove the redundant `package.json` `workspaces` array?
- Keep the empty `kubernetes/terraform/ansible/monitoring/tooling` dirs as roadmap or remove them to stop implying capabilities that don't exist?
- Remove postgres/redis host port publishing in production? Move the scheduler to supervisord/cron with a real liveness check?
