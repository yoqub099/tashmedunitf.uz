import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s, type Language } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("ilmiy-ishlar", { path: "/faoliyat/ilmiy-faoliyat/ilmiy-ishlar-va-innovatsiyalar", locale: lang });
}

function getInnovations(lang: Language) {
  return [
    {
      title: s("sci.innov_diagnostics", lang),
      items: [
        s("sci.innov_diagnostics_1", lang),
        s("sci.innov_diagnostics_2", lang),
        s("sci.innov_diagnostics_3", lang),
      ],
    },
    {
      title: s("sci.innov_pharma", lang),
      items: [
        s("sci.innov_pharma_1", lang),
        s("sci.innov_pharma_2", lang),
        s("sci.innov_pharma_3", lang),
      ],
    },
    {
      title: s("sci.innov_education", lang),
      items: [
        s("sci.innov_education_1", lang),
        s("sci.innov_education_2", lang),
        s("sci.innov_education_3", lang),
        s("sci.innov_education_4", lang),
      ],
    },
  ];
}

function getPatents(lang: Language) {
  return [
    { number: "IAP 07XXX", title: s("sci.patent_1_title", lang), year: "2025" },
    { number: "IAP 07XXX", title: s("sci.patent_2_title", lang), year: "2025" },
    { number: "IAP 07XXX", title: s("sci.patent_3_title", lang), year: "2024" },
  ];
}

export default async function IlmiyIshlarVaInnovatsiyalarPage() {
  const lang = await getLanguage();
  const innovations = getInnovations(lang);
  const patents = getPatents(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.ilmiy_ishlar", lang)}
        </h2>

        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
            { label: s("nav.ilmiy_ishlar", lang) },
          ]}
          className="mt-3"
        />

        {/* ═══════ Intro ═══════ */}
        <div className="mt-6 rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
          <h4 className="font-serif text-2xl font-semibold text-gray-900">
            {s("sci.innov_intro_title", lang)}
          </h4>
          <div className="mt-4 space-y-4 text-base text-gray-700 leading-relaxed">
            <p>{s("sci.innov_intro_p1", lang)}</p>
            <p>{s("sci.innov_intro_p2", lang)}</p>
          </div>
        </div>

        {/* ═══════ Innovation directions ═══════ */}
        <div className="mt-6 space-y-6">
          {innovations.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
            >
              <h4 className="font-serif text-2xl font-semibold flex gap-3 text-[#00575B]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M2 12h5" /><path d="M17 12h5" /><path d="M12 2v5" />
                  <path d="M12 17v5" /><circle cx="12" cy="12" r="4" />
                </svg>
                <span>{section.title}</span>
              </h4>
              <div className="mt-6 space-y-2">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] bg-white p-4 md:p-5 flex items-center"
                  >
                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                      {item}
                    </h6>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ═══════ Patents table ═══════ */}
        <div className="mt-6 rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
          <h4 className="font-serif text-2xl font-semibold text-gray-900">
            {s("sci.patents_title", lang)}
          </h4>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="pb-3 font-semibold text-gray-900">{s("sci.patent_number", lang)}</th>
                  <th className="pb-3 font-semibold text-gray-900">{s("sci.patent_name", lang)}</th>
                  <th className="pb-3 font-semibold text-gray-900">{s("sci.patent_year", lang)}</th>
                </tr>
              </thead>
              <tbody>
                {patents.map((p, i) => (
                  <tr key={i} className="border-b border-gray-200 last:border-0">
                    <td className="py-3 text-gray-600 whitespace-nowrap">{p.number}</td>
                    <td className="py-3 text-gray-700">{p.title}</td>
                    <td className="py-3 text-gray-600">{p.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  );
}
