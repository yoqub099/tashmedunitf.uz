import { s, type Language } from "@/lib/i18n";
import { t } from "@/lib/translate";
import type { NavTreeItem } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}

function p(href: string, lang: string): string {
  if (href.startsWith("http")) return href;
  return `/${lang}${href}`;
}

function prefixItems(items: NavItem[], lang: string): NavItem[] {
  return items.map((item) => ({
    ...item,
    href: item.external ? item.href : p(item.href, lang),
    children: item.children ? prefixItems(item.children, lang) : undefined,
  }));
}

/**
 * Convert dynamic NavTreeItem[] from API into NavItem[] format.
 * Recursively builds href from parent slugs and handles external links.
 */
export function buildDynamicNavigation(
  items: NavTreeItem[],
  lang: Language,
  parentSlug = ""
): NavItem[] {
  return items.map((item) => {
    const title = t(item.title, lang);
    const currentSlug = parentSlug ? `${parentSlug}/${item.slug}` : `/${item.slug}`;

    // External link type
    if (item.page_type === "link" && item.external_url) {
      return {
        title,
        href: item.external_url,
        external: true,
        children: item.children?.length
          ? buildDynamicNavigation(item.children, lang, currentSlug)
          : undefined,
      };
    }

    return {
      title,
      href: `/${lang}${currentSlug}`,
      children: item.children?.length
        ? buildDynamicNavigation(item.children, lang, currentSlug)
        : undefined,
    };
  });
}

/**
 * Main navigation = static (hardcoded 7 sections) + dynamic (admin-created).
 *
 * Dynamic items are APPENDED after static ones. Duplicates are deduplicated
 * by href, so if admin publishes a nav item with the same slug as a static
 * one, the static version wins (admin editing existing sections should be
 * done by adding children, not duplicating the parent).
 */
export function getMainNavigation(lang: Language, dynamicNav?: NavTreeItem[]): NavItem[] {
  const staticItems = getStaticNavigation(lang);

  if (!dynamicNav || dynamicNav.length === 0) {
    return staticItems;
  }

  const dynamicItems = buildDynamicNavigation(dynamicNav, lang);
  const staticHrefs = new Set(staticItems.map((i) => i.href));
  // Append only dynamic items that are not already represented statically
  const merged = [
    ...staticItems,
    ...dynamicItems.filter((i) => !staticHrefs.has(i.href)),
  ];
  return merged;
}

function getStaticNavigation(lang: Language): NavItem[] {
  return prefixItems([
    {
      title: s("nav.biz_haqimizda", lang),
      href: "/biz-haqimizda",
      children: [
        { title: s("nav.umumiy_malumot", lang), href: "/biz-haqimizda/umumiy-malumot" },
        {
          title: s("nav.tuzilma", lang),
          href: "/biz-haqimizda/tuzilma",
          children: [
            { title: s("nav.konsultativ_organlar", lang), href: "/biz-haqimizda/tuzilma/konsultativ-organlar" },
            { title: s("nav.rektorat", lang), href: "/biz-haqimizda/tuzilma/rektorat" },
            { title: s("nav.fakultetlar", lang), href: "/biz-haqimizda/tuzilma/fakultetlar" },
            { title: s("nav.kafedralar", lang), href: "/biz-haqimizda/tuzilma/kafedralar" },
            { title: s("nav.xodimlar", lang), href: "/biz-haqimizda/tuzilma/xodimlar" },
            { title: s("nav.filiallar", lang), href: "/biz-haqimizda/tuzilma/filiallar" },
          ],
        },
        { title: s("nav.virtual_qabulxona", lang), href: "/biz-haqimizda/virtual-qabulxona" },
        { title: s("nav.murojaatlar_tartibi", lang), href: "/biz-haqimizda/murojaatlar-tartibi" },
        {
          title: s("nav.meyoriy_hujjatlar", lang),
          href: "/biz-haqimizda/meyoriy-hujjatlar",
          children: [
            { title: s("nav.qonunlar", lang), href: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar" },
            { title: s("nav.prezident_qarorlari", lang), href: "/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari" },
            { title: s("nav.vazirlar_mahkamasi", lang), href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi" },
            { title: s("nav.nizom", lang), href: "/biz-haqimizda/meyoriy-hujjatlar/nizom" },
            { title: s("nav.ichki_hujjatlar", lang), href: "/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar" },
            { title: s("nav.ishga_qabul", lang), href: "/biz-haqimizda/meyoriy-hujjatlar/ishga-qabul" },
            { title: s("nav.elonlar", lang), href: "/biz-haqimizda/meyoriy-hujjatlar/elonlar" },
            { title: s("nav.akademik_hujjatlar", lang), href: "/biz-haqimizda/meyoriy-hujjatlar/akademik-hujjatlar" },
            { title: s("nav.vazirlik_hujjatlari", lang), href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlik-hujjatlari" },
          ],
        },
        { title: s("nav.sifat_siyosati", lang), href: "/biz-haqimizda/sifat-siyosati" },
        { title: s("nav.antikorrupsiya", lang), href: "/biz-haqimizda/antikorrupsiya" },
      ],
    },
    {
      title: s("nav.faoliyat", lang),
      href: "/faoliyat",
      children: [
        {
          title: s("nav.ilmiy_faoliyat", lang),
          href: "/faoliyat/ilmiy-faoliyat",
          children: [
            { title: s("nav.ilmiy_jurnal", lang), href: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal" },
            { title: s("nav.tadqiqot", lang), href: "/faoliyat/ilmiy-faoliyat/tadqiqot" },
            { title: s("nav.konferensiyalar", lang), href: "/faoliyat/ilmiy-faoliyat/konferensiyalar" },
            { title: s("nav.ilmiy_ishlar", lang), href: "/faoliyat/ilmiy-faoliyat/ilmiy-ishlar-va-innovatsiyalar" },
            {
              title: s("nav.doktorantura", lang),
              href: "/faoliyat/ilmiy-faoliyat/doktorantura",
              children: [
                { title: s("nav.tadqiqotchilar", lang), href: "/faoliyat/ilmiy-faoliyat/doktorantura/tadqiqotchilar" },
                { title: s("nav.imtihon_dasturlari", lang), href: "/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-dasturlari" },
                { title: s("nav.imtihon_savollari", lang), href: "/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-savollari" },
              ],
            },
            { title: s("nav.iqtidorli_talabalar", lang), href: "/faoliyat/ilmiy-faoliyat/iqtidorli-talabalar" },
            { title: s("nav.oaq_nashrlar", lang), href: "/faoliyat/ilmiy-faoliyat/oaq-tavsiya-nashrlar" },
          ],
        },
        { title: s("nav.oquv_faoliyati", lang), href: "/faoliyat/oquv-faoliyati" },
        { title: s("nav.xalqaro_hamkorlik", lang), href: "/faoliyat/xalqaro-hamkorlik" },
        { title: s("nav.tadqiqod_markazi", lang), href: "/faoliyat/tadqiqod-markazi" },
      ],
    },
    {
      title: s("nav.abiturientlarga", lang),
      href: "/abiturientlarga",
      children: [
        {
          title: s("nav.bakalavriat", lang),
          href: "/abiturientlarga/bakalavriat",
          children: [
            { title: s("nav.tibbiyot_fakulteti", lang), href: "/abiturientlarga/bakalavriat/fakultet/1" },
            { title: s("nav.farmatsiya_fakulteti", lang), href: "/abiturientlarga/bakalavriat/fakultet/2" },
            { title: s("nav.qoshma_talim_fakulteti", lang), href: "/abiturientlarga/bakalavriat/fakultet/5" },
          ],
        },
        {
          title: s("nav.ordinatura", lang),
          href: "/abiturientlarga/ordinatura",
          children: [
            { title: s("nav.klinik_tibbiyot_fakulteti", lang), href: "/abiturientlarga/ordinatura/fakultet/3" },
          ],
        },
        {
          title: s("nav.magistratura", lang),
          href: "/abiturientlarga/magistratura",
          children: [
            { title: s("nav.ilmiy_tadqiqot_fakulteti", lang), href: "/abiturientlarga/magistratura/fakultet/4" },
          ],
        },
        { title: s("nav.oqishni_kochirish", lang), href: "/abiturientlarga/oqishni-kochirish-va-tiklash" },
        { title: s("nav.test_fanlar", lang), href: "/abiturientlarga/test-topshiriladigan-fanlar" },
      ],
    },
    {
      title: s("nav.talabalarga", lang),
      href: "/talabalarga",
      children: [
        {
          title: s("nav.karyera_markazi", lang),
          href: "/talabalarga/karyera-markazi",
          children: [
            { title: s("nav.karyera_markazi", lang), href: "/talabalarga/karyera-markazi" },
            { title: s("nav.bosh_ish_orinlari", lang), href: "/talabalarga/karyera-markazi/bosh-ish-orinlari" },
          ],
        },
        {
          title: s("nav.kutubxona", lang),
          href: "/talabalarga/kutubxona",
          children: [
            { title: s("nav.e_library", lang), href: "https://unilibrary.uz/", external: true },
            { title: s("nav.emerald", lang), href: "https://www.emerald.com/", external: true },
            { title: s("nav.ichki_kutubxona", lang), href: "/talabalarga/kutubxona" },
          ],
        },
        { title: s("nav.talaba_ishlari", lang), href: "/talabalarga/talaba-ishlari" },
      ],
    },
    {
      title: s("nav.yangiliklar", lang),
      href: "/yangiliklar",
      children: [
        { title: s("nav.yangiliklar", lang), href: "/yangiliklar" },
        { title: s("nav.tadbirlar", lang), href: "/yangiliklar/tadbirlar" },
        { title: s("nav.konferensiyalar", lang), href: "/yangiliklar/konferensiyalar" },
      ],
    },
    {
      title: s("nav.faq", lang),
      href: "/faq",
    },
    {
      title: s("nav.aloqa", lang),
      href: "/aloqa",
    },
  ], lang);
}

export function getFooterNavigation(lang: Language) {
  return {
    tezkorHavolalar: [
      { title: s("nav.biz_haqimizda", lang), href: p("/biz-haqimizda", lang) },
      { title: s("nav.karyera_markazi", lang), href: p("/talabalarga/karyera-markazi", lang) },
      { title: s("nav.yangiliklar", lang), href: p("/yangiliklar", lang) },
      { title: s("nav.faq", lang), href: p("/faq", lang) },
    ],
    foydaliHavolalar: [
      { title: s("nav.konferensiyalar", lang), href: p("/yangiliklar/konferensiyalar", lang) },
    ],
    talimDasturlari: [
      { title: s("nav.bakalavriat", lang), href: p("/abiturientlarga/bakalavriat", lang) },
      { title: s("nav.magistratura", lang), href: p("/abiturientlarga/magistratura", lang) },
      { title: s("nav.ordinatura", lang), href: p("/abiturientlarga/ordinatura", lang) },
    ],
  };
}
