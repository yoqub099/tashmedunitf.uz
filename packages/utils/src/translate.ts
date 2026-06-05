import type { Translatable, Locale } from '@tmtu/types';

const LOCALE_ORDER: Locale[] = ['uz', 'ru', 'en'];

/**
 * Extract a translated string from a Translatable field.
 * Falls back through locales (requested → uz → ru → en → '').
 */
export function t(field: Translatable | string | null | undefined, lang: Locale = 'uz'): string {
  if (!field) return '';
  if (typeof field === 'string') return field;

  if (field[lang]) return field[lang] as string;

  for (const fallback of LOCALE_ORDER) {
    if (field[fallback]) return field[fallback] as string;
  }

  return '';
}

/**
 * Check if a translatable field has any value in any locale.
 */
export function hasTranslation(field: Translatable | string | null | undefined): boolean {
  if (!field) return false;
  if (typeof field === 'string') return field.trim().length > 0;
  return LOCALE_ORDER.some((loc) => (field[loc] ?? '').trim().length > 0);
}
