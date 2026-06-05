# @tmtu/mobile

> Mobile app for TMTU Termiz — **placeholder**.

## Status

🚧 **Not yet implemented**

This workspace is a placeholder for a future React Native (Expo) mobile app
that will consume the same `@tmtu/api` backend.

## Planned stack

- **Expo SDK** (latest) — React Native runtime
- **Expo Router** — File-based navigation (like Next.js)
- **TanStack Query** — Server state (shared patterns with web/admin)
- **Zustand** — Client state
- **`@tmtu/sdk`** — Shared API client
- **`@tmtu/types`** — Shared entity types
- **`@tmtu/i18n`** — Shared translations

## Getting started (future)

```bash
pnpm create expo-app@latest apps/mobile --template default
# Then add workspace deps:
pnpm --filter @tmtu/mobile add @tmtu/sdk @tmtu/types @tmtu/i18n
```

## References

- [Expo docs](https://docs.expo.dev)
- [ADR-0001 — Monorepo migration](../../docs/architecture/ADR/0001-monorepo-migration.md)
