import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDirectionById, getDirections, getFacultyById, getSiteContents, getFaqs } from "@/lib/services";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { SITE_URL, SITE_NAME_UZ, SITE_NAME_RU, SITE_NAME_EN, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getLanguage } from "@/lib/language";

type Level = "bakalavriat" | "magistratura" | "ordinatura";

interface LevelKeys {
  titleSuffix: string;
  metaFallback: string;
  notFound: string;
}

/**
 * Har bir level uchun i18n kalit mapping.
 * Kalitlar turlicha bo'lgani uchun prefix-based qila olmadim.
 */
const DIRECTION_KEYS: Record<Level, LevelKeys> = {
  bakalavriat: {
    titleSuffix: "bak.meta_suffix",
    metaFallback: "bak.meta_direction_desc_fallback",
    notFound: "bak.direction_not_found",
  },
  magistratura: {
    titleSuffix: "mag.direction_title_suffix",
    metaFallback: "mag.direction_meta_fallback",
    notFound: "mag.direction_not_found",
  },
  ordinatura: {
    titleSuffix: "ord.direction_title_suffix",
    metaFallback: "ord.direction_meta_fallback",
    notFound: "ord.direction_not_found",
  },
};

const FACULTY_KEYS: Record<Level, LevelKeys> = {
  bakalavriat: {
    titleSuffix: "bak.meta_suffix",
    metaFallback: "bak.meta_faculty_desc_fallback",
    notFound: "bak.faculty_not_found",
  },
  magistratura: {
    titleSuffix: "mag.faculty_title_suffix",
    metaFallback: "mag.faculty_meta_fallback",
    notFound: "mag.faculty_not_found",
  },
  ordinatura: {
    titleSuffix: "ord.faculty_title_suffix",
    metaFallback: "ord.faculty_meta_fallback",
    notFound: "ord.faculty_not_found",
  },
};

function buildOg(title: string, description: string, path: string, lang: Language, image?: string): Metadata {
  const ogLocale = lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "uz_UZ";
  const siteName = lang === "ru" ? SITE_NAME_RU : lang === "en" ? SITE_NAME_EN : SITE_NAME_UZ;
  const img = image || DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${lang}${path}`,
      languages: {
        uz: `${SITE_URL}/uz${path}`,
        ru: `${SITE_URL}/ru${path}`,
        en: `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}${path}`,
      siteName,
      locale: ogLocale,
      alternateLocale: ["uz_UZ", "ru_RU", "en_US"].filter((l) => l !== ogLocale),
      type: "website",
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

/* ════════════════════ Direction ════════════════════ */

export async function buildDirectionMetadata(id: string, level: Level): Promise<Metadata> {
  const lang = await getLanguage();
  const keys = DIRECTION_KEYS[level];
  const path = `/abiturientlarga/${level}/${id}`;
  try {
    const res = await getDirectionById(Number(id));
    const direction = res.data;
    if (direction.level !== level) return { title: s(keys.notFound, lang), robots: { index: false } };
    const title = `${t(direction.name, lang)} — ${s(keys.titleSuffix, lang)}`;
    const description =
      t(direction.description, lang)?.replace(/<[^>]*>/g, "").slice(0, 155) ||
      `${t(direction.name, lang)} ${s(keys.metaFallback, lang)}`;
    return buildOg(title, description, path, lang, direction.image);
  } catch {
    return { title: s(keys.notFound, lang), robots: { index: false } };
  }
}

/** Direction detail page data loader. Returns props for DirectionDetailPage or calls notFound(). */
export async function loadDirectionPage(id: string, level: Level) {
  const lang = await getLanguage();

  const [dirRes, allRes] = await Promise.all([
    getDirectionById(Number(id)).catch(() => null),
    getDirections({ per_page: 100, level }).catch(() => ({ data: [] })),
  ]);

  if (!dirRes) notFound();

  const direction = dirRes.data;
  if (direction.level !== level) notFound();

  return { direction, siblingDirections: allRes.data, lang };
}

/* ════════════════════ Faculty ════════════════════ */

export async function buildFacultyMetadata(id: string, level: Level): Promise<Metadata> {
  const lang = await getLanguage();
  const keys = FACULTY_KEYS[level];
  const path = `/abiturientlarga/${level}/fakultet/${id}`;
  try {
    const res = await getFacultyById(Number(id));
    const faculty = res.data;
    if (faculty.level !== level) return { title: s(keys.notFound, lang), robots: { index: false } };
    const title = `${t(faculty.name, lang)} — ${s(keys.titleSuffix, lang)}`;
    const description =
      t(faculty.description, lang)?.replace(/<[^>]*>/g, "").slice(0, 155) ||
      `${t(faculty.name, lang)} ${s(keys.metaFallback, lang)}`;
    return buildOg(title, description, path, lang, faculty.image);
  } catch {
    return { title: s(keys.notFound, lang), robots: { index: false } };
  }
}

/** Faculty detail page data loader. Returns props for FacultyDetailPage or calls notFound(). */
export async function loadFacultyPage(id: string, level: Level) {
  const lang = await getLanguage();

  const [facRes, contentRes, faqRes] = await Promise.all([
    getFacultyById(Number(id)).catch(() => null),
    getSiteContents("faculty_detail").catch(() => ({ data: [] })),
    getFaqs({
      per_page: 50,
      "filter[category]": "faculty",
      "filter[faculty_id]": Number(id),
    }).catch(() => ({ data: [] })),
  ]);

  if (!facRes) notFound();

  const faculty = facRes.data;
  if (faculty.level !== level) notFound();

  return {
    faculty,
    siteContents: contentRes.data || [],
    faqs: faqRes.data || [],
    lang,
  };
}
