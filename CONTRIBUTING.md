# Contributing

> This is a **private** project. External contributions are not accepted.
> This guide is for internal team members.

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Development Workflow

### 1. Branch naming

Use `type/short-description`:

- `feat/news-bulk-export`
- `fix/login-redirect-loop`
- `chore/upgrade-next-16-1-7`
- `docs/adr-0002-i18n`
- `refactor/extract-news-service`

### 2. Commits

Use **Conventional Commits** ([spec](https://www.conventionalcommits.org)):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Allowed scopes: `api`, `web`, `admin`, `mobile`, `e2e`, `ui`, `sdk`, `types`, `config`, `utils`, `i18n`, `docs`, `infra`, `deps`, `release`.

Examples:
```
feat(api): add news bulk export endpoint
fix(web): correct hreflang on news detail
docs(adr): add ADR for monorepo migration
refactor(admin): extract EditableWrapper to @tmtu/ui
```

### 3. Pull Requests

- Title follows the same Conventional Commits format
- Link related issue: `Closes #123`
- Include:
  - **What** changed
  - **Why** (motivation, context)
  - **How** to test
  - Screenshots/GIFs for UI changes
- Wait for CI to pass before requesting review

### 4. Pre-commit

`husky` + `lint-staged` automatically:
- Runs `prettier` on staged files
- Runs `eslint --fix` on TS/JS files
- Runs `pint` on PHP files
- Blocks commit if `.env` files are staged
- Warns if `.sql` files are staged (potential PII)

### 5. Commit signing

Sign commits with GPG/SSH key (required for `main` branch).

## Code Style

### TypeScript / JavaScript
- Use `prettier` (config in `.prettierrc`)
- Use `eslint` (extends `@tmtu/eslint-config`)
- Prefer named exports over default
- Use `import type` for type-only imports
- No `any` — use `unknown` if needed

### PHP (Laravel)
- Follow PSR-12
- Use **Laravel Pint** for auto-formatting
- Use **PHPStan level 5** for static analysis
- Follow Service Layer Pattern: `Controller → FormRequest → Service → Model → Resource`

### React / Next.js
- Functional components only
- Use `'use client'` only when needed (default to Server Components)
- Use `@tmtu/types` for entity types
- Use `@tmtu/utils` for `cn()`, `t()`, `formatDate()`

## Architecture

### When to add to a shared package vs an app

- **Used by 1 app → keep in app**
- **Used by 2+ apps → extract to `packages/`**
- **Types from backend → `@tmtu/types`**
- **Reusable UI atoms → `@tmtu/ui`**
- **API calls → `@tmtu/sdk`**

### When to create an ADR

Create an ADR (`docs/architecture/ADR/NNNN-title.md`) when:
- Choosing between libraries (Zustand vs Redux)
- Changing repo structure
- Adopting a new pattern (CQRS, FSD)
- Major refactor with trade-offs

## Testing

### Backend
```bash
pnpm --filter @tmtu/api test
```

### Frontend
```bash
pnpm --filter @tmtu/web typecheck
pnpm --filter @tmtu/admin typecheck
```

### E2E
```bash
pnpm dev          # Start all services
pnpm test:e2e     # In another terminal
```

## Release Process

1. All changes go through PR review
2. Merge to `main` triggers CI
3. CI builds Docker images
4. Manual approval → deploy to production
5. `semantic-release` (planned) auto-bumps version + updates `CHANGELOG.md`

## Getting Help

- Slack: `#tmtu-dev` (internal)
- Tech lead: see CODEOWNERS
