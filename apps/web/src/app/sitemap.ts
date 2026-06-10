import type { MetadataRoute } from "next";
import { getNews, getDepartments, getFaculties, getDirections, getStaff, getLibraryResources } from "@/lib/services";

const SITE_URL = "https://tashmedunitf.uz";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const locales = ["uz", "ru", "en"] as const;

// Fixed date for static pages so it doesn't change every build
const staticDate = new Date("2026-04-01");

/** Generate locale-prefixed sitemap entries with hreflang alternates */
function localeEntries(
  path: string,
  opts: { lastModified?: Date; changeFrequency?: MetadataRoute.Sitemap[0]["changeFrequency"]; priority?: number }
): MetadataRoute.Sitemap {
  const alternates = {
    languages: Object.fromEntries(
      locales.map((l) => [l, `${SITE_URL}/${l}${path === "/" ? "" : path}`])
    ),
  };
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path === "/" ? "" : path}`,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ===== STATIC PAGES (with locale variants) =====
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage
    ...localeEntries("/", { lastModified: staticDate, changeFrequency: "daily", priority: 1.0 }),
    // Biz haqimizda
    ...localeEntries("/biz-haqimizda", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 }),
    ...localeEntries("/biz-haqimizda/sifat-siyosati", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/biz-haqimizda/virtual-qabulxona", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 }),
    ...localeEntries("/biz-haqimizda/murojaatlar-tartibi", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/biz-haqimizda/antikorrupsiya", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/biz-haqimizda/antikorrupsiya/aloqa-kanallari", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/antikorrupsiya/idoraviy-hujjatlar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.4 }),
    // Tuzilma
    ...localeEntries("/biz-haqimizda/tuzilma", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 }),
    ...localeEntries("/biz-haqimizda/tuzilma/rektorat", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 }),
    ...localeEntries("/biz-haqimizda/tuzilma/fakultetlar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 }),
    ...localeEntries("/biz-haqimizda/tuzilma/kafedralar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 }),
    ...localeEntries("/biz-haqimizda/tuzilma/xodimlar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/biz-haqimizda/tuzilma/filiallar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/biz-haqimizda/tuzilma/konsultativ-organlar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    // Me'yoriy hujjatlar
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/qonunlar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/qonunlar/talim-qonuni", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/qonunlar/litsenziyalash", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/qonunlar/pedagog-maqomi", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari/taraqqiyot-strategiyasi", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari/mamuriy-islohotlar", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/qabul-tartib", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/sirtqi-talim", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/pedagog-tanlov", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/akademik-tatil", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/nizom", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/nizom/institut-nizomi", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/nizom/tashkiliy-tuzilma", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar/akademik-halollik", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar/diskriminatsiya-siyosati", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar/institut-kengashi", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar/odob-axloq-kodeksi", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar/sifat-siyosati", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar/tanlov-reglamenti", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar/tyutorlik-nizomi", { lastModified: staticDate, changeFrequency: "yearly", priority: 0.4 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/ishga-qabul", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.6 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/akademik-hujjatlar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/vazirlik-hujjatlari", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/biz-haqimizda/meyoriy-hujjatlar/elonlar", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.6 }),
    // Faoliyat
    ...localeEntries("/faoliyat", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/ilmiy-jurnal", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/nashrlar", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.6 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/jurnal-haqida", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/yoriqnoma", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/boglanish", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.4 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/tadqiqot", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/konferensiyalar", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/ilmiy-ishlar-va-innovatsiyalar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/doktorantura", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/doktorantura/tadqiqotchilar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-dasturlari", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-savollari", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/iqtidorli-talabalar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/faoliyat/ilmiy-faoliyat/oaq-tavsiya-nashrlar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/faoliyat/oquv-faoliyati", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/faoliyat/oquv-faoliyati/oquv-rejalari/bakalavriat", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/faoliyat/oquv-faoliyati/oquv-rejalari/magistratura", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.5 }),
    ...localeEntries("/faoliyat/xalqaro-hamkorlik", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/faoliyat/tadqiqod-markazi", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    // Abiturientlarga
    ...localeEntries("/abiturientlarga", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.9 }),
    ...localeEntries("/abiturientlarga/bakalavriat", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.9 }),
    ...localeEntries("/abiturientlarga/magistratura", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.8 }),
    ...localeEntries("/abiturientlarga/ordinatura", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.8 }),
    ...localeEntries("/abiturientlarga/test-topshiriladigan-fanlar", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 }),
    ...localeEntries("/abiturientlarga/oqishni-kochirish-va-tiklash", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    // Talabalarga
    ...localeEntries("/talabalarga", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 }),
    ...localeEntries("/talabalarga/karyera-markazi", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 }),
    ...localeEntries("/talabalarga/karyera-markazi/bosh-ish-orinlari", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 }),
    ...localeEntries("/talabalarga/kutubxona", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/talabalarga/talaba-ishlari", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    // Yangiliklar
    ...localeEntries("/yangiliklar", { lastModified: staticDate, changeFrequency: "daily", priority: 0.8 }),
    ...localeEntries("/yangiliklar/tadbirlar", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 }),
    ...localeEntries("/yangiliklar/konferensiyalar", { lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 }),
    // FAQ & Aloqa
    ...localeEntries("/faq", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 }),
    ...localeEntries("/aloqa", { lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 }),
  ];

  // ===== DYNAMIC PAGES =====
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // News articles
    const newsRes = await getNews({ per_page: 100 }).catch(() => null);
    if (newsRes?.data) {
      const newsPages: MetadataRoute.Sitemap = newsRes.data.flatMap((item) =>
        localeEntries(`/yangiliklar/${item.slug}`, {
          lastModified: new Date(item.updated_at || item.created_at),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })
      );
      dynamicPages = [...dynamicPages, ...newsPages];
    }

    // Departments
    const deptsRes = await getDepartments({ per_page: 100 }).catch(() => null);
    if (deptsRes?.data) {
      const deptPages: MetadataRoute.Sitemap = deptsRes.data.flatMap((dept) =>
        localeEntries(`/biz-haqimizda/tuzilma/kafedralar/${dept.slug}`, {
          lastModified: new Date(dept.updated_at || dept.created_at),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })
      );
      dynamicPages = [...dynamicPages, ...deptPages];
    }

    // Faculties
    const facultiesRes = await getFaculties({ per_page: 50 }).catch(() => null);
    if (facultiesRes?.data) {
      const facultyPages: MetadataRoute.Sitemap = facultiesRes.data.flatMap((faculty) =>
        localeEntries(`/biz-haqimizda/tuzilma/fakultetlar/${faculty.id}`, {
          lastModified: new Date(faculty.updated_at || faculty.created_at),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        })
      );
      dynamicPages = [...dynamicPages, ...facultyPages];

      // Faculty pages for each level
      for (const fac of facultiesRes.data) {
        const level = fac.level;
        if (level) {
          dynamicPages.push(...localeEntries(`/abiturientlarga/${level}/fakultet/${fac.id}`, {
            lastModified: new Date(fac.updated_at || fac.created_at),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          }));
        }
      }
    }

    // Directions
    const directionsRes = await getDirections({ per_page: 100 }).catch(() => null);
    if (directionsRes?.data) {
      const directionPages: MetadataRoute.Sitemap = directionsRes.data.flatMap((dir) =>
        localeEntries(`/abiturientlarga/${dir.level}/${dir.id}`, {
          lastModified: new Date(dir.updated_at || dir.created_at),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        })
      );
      dynamicPages = [...dynamicPages, ...directionPages];
    }

    // Staff members
    const staffRes = await getStaff({ per_page: 100 }).catch(() => null);
    if (staffRes?.data) {
      const staffPages: MetadataRoute.Sitemap = staffRes.data.flatMap((staff) =>
        localeEntries(`/biz-haqimizda/tuzilma/xodimlar/${staff.id}`, {
          lastModified: new Date(staff.updated_at || staff.created_at),
          changeFrequency: "monthly" as const,
          priority: 0.5,
        })
      );
      dynamicPages = [...dynamicPages, ...staffPages];
    }

    // Library resources (kutubxona kitoblari)
    const libRes = await getLibraryResources({ per_page: 100 }).catch(() => null);
    if (libRes?.data) {
      const libPages: MetadataRoute.Sitemap = libRes.data.flatMap((item) =>
        localeEntries(`/talabalarga/kutubxona/${item.slug}`, {
          lastModified: new Date(item.created_at),
          changeFrequency: "monthly" as const,
          priority: 0.5,
        })
      );
      dynamicPages = [...dynamicPages, ...libPages];
    }

    // Journal issues
    try {
      const journalRes = await fetch(`${API}/v1/journal-issues?per_page=50`, { next: { revalidate: 3600, tags: ["journal-issues"] } }).then(r => r.json()).catch(() => null);
      if (journalRes?.data) {
        journalRes.data.forEach((issue: any) => {
          dynamicPages.push(...localeEntries(`/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/nashrlar/${issue.slug || issue.id}`, {
            lastModified: issue.updated_at ? new Date(issue.updated_at) : staticDate,
            changeFrequency: "monthly" as const,
            priority: 0.5,
          }));
        });
      }
    } catch {}
  } catch {
    // Sitemap generation should never fail — return static pages only
  }

  return [...staticPages, ...dynamicPages];
}
