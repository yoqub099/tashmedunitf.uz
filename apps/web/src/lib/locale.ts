export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/**
 * Strip locale prefix from a pathname.
 * "/uz/biz-haqimizda" -> "/biz-haqimizda"
 * "/biz-haqimizda" -> "/biz-haqimizda"
 */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(uz|ru|en)(\/.*)?$/);
  return match ? match[2] || "/" : pathname;
}

/**
 * Prepend locale to a path.
 * ("/biz-haqimizda", "ru") -> "/ru/biz-haqimizda"
 */
export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}
