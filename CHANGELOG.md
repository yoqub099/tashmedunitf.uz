# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This changelog is **auto-generated** from Conventional Commits via `semantic-release` (planned).

---

## [Unreleased]

### Changed
- **BREAKING:** Migrated from flat `backend/` + `frontend/` + `admin/` layout to a proper monorepo with `apps/` + `packages/` + `infrastructure/` (see [ADR-0001](./docs/architecture/ADR/0001-monorepo-migration.md)).
- Adopted **Turborepo** + **pnpm workspaces** for parallel builds and dependency hoisting.
- Renamed all workspaces to use `@tmtu/` namespace (`@tmtu/api`, `@tmtu/web`, `@tmtu/admin`).
- Created shared packages: `@tmtu/types`, `@tmtu/sdk`, `@tmtu/ui`, `@tmtu/utils`, `@tmtu/i18n`, `@tmtu/auth`, `@tmtu/analytics`, `@tmtu/config`.

### Added
- Conventional Commits enforcement via `commitlint` + `husky`.
- Pre-commit hooks: `lint-staged` + secrets scanning.
- VSCode workspace settings + recommended extensions.
- EditorConfig for cross-IDE consistency.
- `tsconfig.base.json` with strict mode for all TS apps.
- Comprehensive `.gitignore` with PII/secret protection.
- `infrastructure/` folder for IaC (Docker, K8s, Terraform, Ansible, Monitoring placeholders).
- `docs/architecture/ADR/` for Architecture Decision Records.

### Security
- Sanitized `.env.example` (no real credentials).
- Updated `.gitignore` to reject `.env`, `*.sql`, `*.dump`, `*.token`, `*.pem`, `*.key`.

---

## [Pre-monorepo era]

For history before the monorepo migration, see git log of the old `tmtu_termiz project/` folder.
