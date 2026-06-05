# Architecture Decision Records (ADRs)

ADRs document **significant architectural decisions** along with their context, alternatives considered, and consequences.

## Why ADRs?

When someone (including future-you) asks "why did we choose X over Y?", an ADR provides the answer with all the relevant context — instead of relying on tribal knowledge or git archaeology.

## Format

We use the [MADR](https://adr.github.io/madr/) (Markdown Architecture Decision Records) format. See [`template.md`](./template.md).

## When to write an ADR

Write an ADR when:
- ✅ Choosing between libraries with different trade-offs (Zustand vs Redux)
- ✅ Changing project structure (monorepo migration)
- ✅ Adopting a new architectural pattern (DDD, CQRS, FSD)
- ✅ Major refactor with significant trade-offs
- ✅ Security or compliance-driven changes
- ❌ Trivial decisions (variable naming, file layout within a feature)

## Index

| # | Status | Title |
|---|--------|-------|
| [0001](./0001-monorepo-migration.md) | ✅ Accepted | Migrate to monorepo with apps/ + packages/ structure |

## Status legend

- 🟡 **Proposed** — Under discussion
- ✅ **Accepted** — Approved, being implemented
- 🔵 **Implemented** — Fully in use
- ❌ **Rejected** — Considered but not chosen
- 🟠 **Deprecated** — No longer relevant
- ⚫ **Superseded** — Replaced by another ADR (link to it)
