import { DEFAULT_LANGUAGE } from "./constants";
import { s } from "./i18n";
import type { Language } from "./i18n";

export type TranslatableField = {
  uz?: string;
  ru?: string;
  en?: string;
} | string;

/**
 * Extract text from a translatable field for the given language.
 * Falls back to: requested lang → uz → ru → en → ""
 */
export function t(field: TranslatableField | undefined | null, lang?: string): string {
  if (!field) return "";
  if (typeof field === "string") return field;

  const locale = lang || DEFAULT_LANGUAGE;
  return (
    field[locale as keyof typeof field] ||
    field.uz ||
    field.ru ||
    field.en ||
    ""
  );
}

/**
 * Format a date string into a localized format.
 */
export function formatDate(dateStr: string | null | undefined, lang?: string): { day: string; month: string; year: number; full: string } {
  if (!dateStr) return { day: "01", month: s("month.0", (lang || "uz") as Language), year: 2026, full: "" };

  const locale = (lang || DEFAULT_LANGUAGE) as Language;
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = s(`month.${date.getMonth()}`, locale);
  const year = date.getFullYear();
  const full = `${day} ${month} ${year}`;
  return { day, month, year, full };
}

/**
 * Strip HTML tags from a string for excerpts
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
