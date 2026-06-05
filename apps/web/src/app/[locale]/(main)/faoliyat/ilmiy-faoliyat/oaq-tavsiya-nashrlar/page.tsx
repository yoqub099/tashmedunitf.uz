import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s, type Language } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("oaq-tavsiya-nashrlar", { path: "/faoliyat/ilmiy-faoliyat/oaq-tavsiya-nashrlar", locale: lang });
}

function getJournals(lang: Language) {
  return [
    {
      category: s("sci.cat_medical", lang),
      items: [
        { name: "O'zbekiston tibbiyot jurnali", issn: "2181-1458", index: "Scopus, Web of Science" },
        { name: "Tibbiyotda yangi kun", issn: "2181-712X", index: "RSCI" },
        { name: "Stomatologiya", issn: "2091-5845", index: "RSCI" },
        { name: "Pediatriya (Toshkent)", issn: "2181-0443", index: "RSCI" },
        { name: "Infeksiya, immunitet va farmakologiya", issn: "2181-2985", index: "RSCI" },
        { name: "Journal of Biomedicine and Practice", issn: "2181-9300", index: "Google Scholar" },
        { name: "Central Asian Journal of Medical and Natural Sciences", issn: "2708-1028", index: "Google Scholar, SJIF" },
      ],
    },
    {
      category: s("sci.cat_pharma", lang),
      items: [
        { name: "O'zbekiston farmatsevtik xabarnomasi", issn: "2181-1466", index: "RSCI" },
        { name: "Farmatsiya va farmakologiya xalqaro jurnali", issn: "2181-2799", index: "Google Scholar" },
        { name: "Kimyo va farmatsiya ilmiy xabarlari", issn: "2181-0850", index: "RSCI" },
      ],
    },
    {
      category: s("sci.cat_biology", lang),
      items: [
        { name: "O'zbekiston biologiya jurnali", issn: "2181-1474", index: "RSCI" },
        { name: "Gigiyena va sanitariya", issn: "0016-9900", index: "Scopus" },
        { name: "Sog'liqni saqlashni tashkil etish va boshqarish", issn: "2181-0710", index: "Google Scholar" },
      ],
    },
  ];
}

export default async function OaqTavsiyaNashrlarPage() {
  const lang = await getLanguage();
  const journals = getJournals(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.oaq_nashrlar", lang)}
        </h2>

        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
            { label: s("nav.oaq_nashrlar", lang) },
          ]}
          className="mt-3"
        />

        {/* ═══════ Info ═══════ */}
        <div className="mt-6 rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
          <h4 className="font-serif text-2xl font-semibold text-gray-900">
            {s("sci.oaq_intro_title", lang)}
          </h4>
          <div className="mt-4 text-base text-gray-700 leading-relaxed">
            <p>{s("sci.oaq_intro_desc", lang)}</p>
          </div>
        </div>

        {/* ═══════ Journals by category ═══════ */}
        <div className="mt-6 space-y-6">
          {journals.map((cat) => (
            <div
              key={cat.category}
              className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
            >
              <h4 className="font-serif text-2xl font-semibold flex gap-3 text-[#00575B]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  <path d="M8 7h6" /><path d="M8 11h8" />
                </svg>
                <span>{cat.category}</span>
              </h4>
              <div className="mt-6 space-y-2">
                {cat.items.map((j) => (
                  <div
                    key={j.name}
                    className="rounded-[20px] bg-white p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                        {j.name}
                      </h6>
                      <p className="text-sm text-gray-500 mt-1">
                        ISSN: {j.issn}
                      </p>
                    </div>
                    <span className="inline-block rounded-full bg-[#00575B]/10 px-3 py-1 text-xs font-medium text-[#00575B] whitespace-nowrap">
                      {j.index}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
