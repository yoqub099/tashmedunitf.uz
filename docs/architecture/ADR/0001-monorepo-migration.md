# 0001. Migrate to monorepo with apps/ + packages/ structure

**Date:** 2026-05-18
**Status:** ✅ Accepted
**Deciders:** Tech Lead

## Context

The original project had a flat layout:

```
tmtu_termiz project/
├── backend/      (Laravel 12)
├── frontend/     (Next.js 16 — public site)
├── admin/        (Next.js 16 — admin panel)
├── mobile-app/   (empty placeholder)
├── e2e_tests/    (Playwright)
├── docker/       (configs)
├── Dockerfile
├── docker-compose.yml
├── deploy.sh
└── README.md / DEPLOYMENT.md / SECURITY.md / ...
```

**Problems identified:**
1. **Duplicated code** between `frontend/` and `admin/`: same UI components (Button, Card, Container, Badge, etc.), same TanStack Query setup, same Zustand patterns, similar API client wrappers — but they drift apart over time.
2. **No shared types** — `News`, `Faculty`, etc. are redefined in each app. When the backend adds a field, two TypeScript apps must be updated independently.
3. **No coordinated builds** — building all three apps requires three separate commands; no caching or parallelization.
4. **No clear infrastructure boundary** — Docker, deploy scripts, and CI configs scattered at root.
5. **No design system** — UI components live in `apps/` only; no Storybook, no visual regression tests.
6. **No SDK** — both apps reimplement API clients with subtle differences.
7. **Hard to onboard new contributors** — no clear "where does X go?" answer.

This is fine for a small project, but **TMTU's site serves a real medical university** with high traffic expectations. The codebase is **production-grade** but needs a **production-grade structure** to scale.

## Decision

We will migrate to a **monorepo** with:

- **`apps/`** — Deployable applications (`@tmtu/api`, `@tmtu/web`, `@tmtu/admin`, `@tmtu/mobile`)
- **`packages/`** — Shared libraries (`@tmtu/types`, `@tmtu/sdk`, `@tmtu/ui`, `@tmtu/utils`, `@tmtu/i18n`, `@tmtu/auth`, `@tmtu/analytics`, `@tmtu/config`)
- **`infrastructure/`** — IaC (Docker, K8s, Terraform, Ansible, monitoring)
- **`docs/`** — Centralized documentation (ADRs, guides, API specs, security)
- **`e2e/`** — End-to-end tests as a separate workspace
- **`scripts/`** — Build & deploy automation
- **`tooling/`** — Build tools & generators

**Tool choice:** **Turborepo** (build orchestration) + **pnpm workspaces** (package management).

## Alternatives Considered

### Option A: Keep flat layout
- ✅ Pros: No migration cost; everyone knows it
- ❌ Cons: Continued code duplication; no path to design system; harder to enforce consistency

### Option B: Multi-repo (separate repos per app)
- ✅ Pros: Strong isolation; independent deployment cadence
- ❌ Cons: Type drift between repos; cross-cutting changes need PR coordination; harder to share infra

### Option C: Monorepo with **Nx**
- ✅ Pros: Mature, opinionated, excellent generators
- ❌ Cons: Heavier learning curve; Angular DNA; over-tooled for our scale

### Option D: Monorepo with **Turborepo + pnpm workspaces** ⭐ (chosen)
- ✅ Pros:
  - Used by Vercel, Netflix, Cal.com (battle-tested with Next.js)
  - Minimal config (`turbo.json` ~30 lines)
  - Incremental build cache (local + remote)
  - Parallel task execution
  - pnpm's strict dep resolution prevents phantom imports
  - Lightweight (~80MB Turborepo install vs Nx's 200MB+)
- ❌ Cons: Less generator support than Nx (we can use Plop/Hygen separately)

### Option E: Monorepo with **Bun workspaces**
- ✅ Pros: Fastest install
- ❌ Cons: Bun on Windows still experimental; we use Windows dev machines

## Consequences

### Positive

- **Eliminate duplication:** Shared `@tmtu/ui`, `@tmtu/types`, `@tmtu/sdk` reduce ~2000 lines of duplicate code across `web/` and `admin/`.
- **Single source of truth for types:** Backend changes propagate via `@tmtu/types` (manual today, auto-generated from OpenAPI tomorrow).
- **Faster CI:** Turborepo cache + parallel tasks cut build time by ~50% (estimated).
- **Easier onboarding:** New contributors have a clear mental model — "shared = `packages/`, deployable = `apps/`".
- **Path to design system:** `@tmtu/ui` + Storybook enables visual regression tests.
- **Future-proof:** Adding new apps (e.g., admin v2, marketing site, internal tooling) is trivial.
- **Clear infrastructure boundary:** All IaC in one place under `infrastructure/`.

### Negative

- **Migration cost:** ~2-3 days of focused work to:
  1. Reorganize files
  2. Update all imports
  3. Configure Turborepo pipeline
  4. Verify all apps build/test
- **Initial pnpm setup:** Some developers may not have pnpm installed yet.
- **Learning curve:** Workspace-aware commands (`pnpm --filter @tmtu/web build`) are new to the team.
- **CI changes:** `.github/workflows/ci.yml` needs updates to use pnpm + workspace filters.

### Neutral

- **Git history:** Old `backend/` history doesn't move — the new monorepo starts fresh. The old folder remains as a reference until verified stable.
- **Docker compose paths:** Updated to point to new `apps/` locations.
- **`.env` files:** Each app still has its own `.env` (Laravel/Next.js conventions); root `.env` is for shared dev config only.

## Implementation Notes

### Migration plan (executed 2026-05-18)

1. ✅ Stop running dev servers (release file locks)
2. ✅ Create new directory tree at `~/Desktop/tmtu-termiz/`
3. ✅ Copy with **robocopy** (excluding `vendor/`, `node_modules/`, `.next/`, `.turbo/`)
4. ✅ Create root configs (`package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`)
5. ✅ Create shared package skeletons (`packages/types`, `packages/sdk`, etc.)
6. ✅ Rename app `package.json` names to `@tmtu/*`
7. ✅ Add workspace dependencies (`@tmtu/types`: `workspace:*`)
8. ✅ Reorganize `infrastructure/` (move `docker/`, `Dockerfile`, `docker-compose.yml`)
9. ✅ Reorganize `docs/` (move `DEPLOYMENT.md`, `SECURITY.md`, `SEO_STRATEGY.md`)
10. ✅ Move `deploy.sh`, `docker-safe.sh` → `scripts/`
11. ✅ Update `docker-compose.yml` paths to point to `apps/*`
12. ✅ Install dependencies (`composer install` + `pnpm install`)
13. ✅ Smoke-test all 3 apps (backend on :8000, web on :3000, admin on :3001)
14. ✅ Write this ADR
15. ⏳ Future: Initialize fresh `git init`, first commit, set up remote

### Rollback plan

If issues are discovered:
1. The **original `~/Desktop/tmtu_termiz project/` is untouched** — we can immediately resume work there.
2. Delete `~/Desktop/tmtu-termiz/` and revisit the migration plan.

### Estimated effort

- Migration: 2-3 days
- Code extraction to packages: 1-2 weeks per package (incremental)
- CI/CD pipeline updates: 1 day
- Documentation: ongoing

## References

- [Turborepo docs](https://turbo.build/repo/docs)
- [pnpm workspaces](https://pnpm.io/workspaces)
- [Vercel Commerce monorepo](https://github.com/vercel/commerce) — reference structure
- [Cal.com monorepo](https://github.com/calcom/cal.com) — similar scale
- Memory: `deep_read_audit_2026_05_18.md` — comprehensive audit before migration
- Memory: `critical_security_exposures_2026_05_18.md` — secrets to address
