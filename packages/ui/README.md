# @tmtu/ui

Shared Design System for TMTU monorepo. **Single source of truth** for UI primitives.

## Status

🚧 **Placeholder** — components live in `apps/web/src/components/shared/` and `apps/admin/src/components/shared/`.

## Migration plan

1. Extract atoms (Button, Input, Card, Badge, Container) to `src/components/`
2. Add Storybook (`pnpm storybook`)
3. Add visual regression tests
4. Generate design tokens (color, spacing, typography)
5. Update both apps to import from `@tmtu/ui`

## Usage (future)

```tsx
import { Button, Card, Container } from '@tmtu/ui';
import '@tmtu/ui/styles.css';

<Button variant="primary" size="md">Click me</Button>
```
