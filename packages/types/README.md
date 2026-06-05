# @tmtu/types

Shared TypeScript types — **single source of truth** for entity shapes across `web/`, `admin/`, and `mobile/`.

## Usage

```ts
import type { News, Faculty, ApiResponse, PaginatedResponse } from '@tmtu/types';

const fetchNews = async (): Promise<PaginatedResponse<News>> => {
  // ...
};
```

## Structure

- `src/common/` — Base types (`Translatable`, `Timestamps`, `MediaItem`, etc.)
- `src/entities/` — Domain entities (`News`, `Faculty`, `Staff`, ...)
- `src/api/` — API envelope types (`ApiResponse`, `PaginatedResponse`)

## Future

These types should be **auto-generated** from the backend's OpenAPI spec
(see `apps/api/docs/openapi.yaml`). Use `openapi-typescript` or `orval` to generate.
