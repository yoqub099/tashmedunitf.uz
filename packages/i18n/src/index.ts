/**
 * @tmtu/i18n — Shared translations
 *
 * TODO (migration):
 *   - Move apps/web/src/lib/i18n.ts (1653 lines) → here
 *   - Split into per-namespace files (nav, footer, common, etc.)
 *   - Both web/ and admin/ import from here
 */

import type { Locale } from '@tmtu/types';

export const LOCALES: readonly Locale[] = ['uz', 'ru', 'en'] as const;
export const DEFAULT_LOCALE: Locale = 'uz';

export const isValidLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
