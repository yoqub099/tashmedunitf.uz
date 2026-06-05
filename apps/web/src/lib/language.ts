import { headers, cookies } from "next/headers";
import { DEFAULT_LANGUAGE } from "./constants";

export type Language = "uz" | "ru" | "en";

/**
 * Server-side: get current language.
 * Priority: x-locale header (from middleware) → cookie → default.
 */
export async function getLanguage(): Promise<Language> {
  // Priority 1: x-locale header set by middleware from URL
  const headerStore = await headers();
  const headerLang = headerStore.get("x-locale");
  if (headerLang === "uz" || headerLang === "ru" || headerLang === "en") return headerLang;

  // Priority 2: cookie fallback
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value;
  if (cookieLang === "uz" || cookieLang === "ru" || cookieLang === "en") return cookieLang;

  return DEFAULT_LANGUAGE as Language;
}
