import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s, type Language } from "@/lib/i18n";
import { getPageBySlug } from "@/lib/services";
import { t } from "@/lib/translate";

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  uz: {
    title: "Ilmiy tadqiqot",
    description: "ToshDTU Termiz filiali ilmiy tadqiqot yo'nalishlari — klinik, jamoat salomatligi va farmatsevtik tadqiqotlar.",
  },
  ru: {
    title: "Научные исследования",
    description: "Научно-исследовательские направления Термезского филиала ТашГосМУ — клинические, общественного здоровья и фармацевтические исследования.",
  },
  en: {
    title: "Scientific Research",
    description: "Research areas of TashSMU Termez Branch — clinical, public health, and pharmaceutical research.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const meta = META_BY_LOCALE[lang] || META_BY_LOCALE.uz;
  return buildMetadata("tadqiqot", { path: "/faoliyat/ilmiy-faoliyat/tadqiqot", locale: lang, title: meta.title, description: meta.description });
}

/* ── Research directions ── */
function getDirections(lang: Language) {
  return [
    {
      title: s("sci.dir_clinical", lang),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0-1-13" />
          <path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
          <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
        </svg>
      ),
      items: [
        s("sci.dir_clinical_1", lang),
        s("sci.dir_clinical_2", lang),
        s("sci.dir_clinical_3", lang),
        s("sci.dir_clinical_4", lang),
      ],
    },
    {
      title: s("sci.dir_public_health", lang),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      items: [
        s("sci.dir_public_health_1", lang),
        s("sci.dir_public_health_2", lang),
        s("sci.dir_public_health_3", lang),
        s("sci.dir_public_health_4", lang),
      ],
    },
    {
      title: s("sci.dir_pharma", lang),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
      ),
      items: [
        s("sci.dir_pharma_1", lang),
        s("sci.dir_pharma_2", lang),
        s("sci.dir_pharma_3", lang),
      ],
    },
  ];
}

function getStats(lang: Language) {
  return [
    { value: "50+", label: s("sci.stat_articles", lang) },
    { value: "12", label: s("sci.stat_projects", lang) },
    { value: "8", label: s("sci.stat_partnerships", lang) },
    { value: "30+", label: s("sci.stat_researchers", lang) },
  ];
}

async function getDbContent(lang: Language): Promise<string | null> {
  try {
    const res = await getPageBySlug("tadqiqot");
    const html = t(res.data.content, lang);
    return html && html.trim().length > 0 ? html : null;
  } catch {
    return null;
  }
}

export default async function TadqiqotPage() {
  const lang = await getLanguage();
  const directions = getDirections(lang);
  const stats = getStats(lang);
  const dbContent = await getDbContent(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
            { label: s("nav.tadqiqot", lang) },
          ]}
          className="mb-4"
        />

        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.tadqiqot", lang)}
        </h1>

        {/* ═══════ Stats ═══════ */}
        <section aria-label={s("sci.about_research_title", lang)} className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 items-stretch">
          {stats.map((st) => (
            <div
              key={st.label}
              className="rounded-2xl bg-linear-to-br from-[#00575B] to-[#00969D] p-5 text-center text-white h-full flex flex-col justify-center"
            >
              <p className="font-serif text-3xl font-bold">{st.value}</p>
              <p className="mt-1 text-sm opacity-90">{st.label}</p>
            </div>
          ))}
        </section>

        {/* ═══════ About ═══════ */}
        <section className="mt-6 rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl" aria-labelledby="about-research">
          <h2 id="about-research" className="font-serif text-2xl font-semibold text-gray-900">
            {s("sci.about_research_title", lang)}
          </h2>
          <div className="mt-4 space-y-4 text-base text-gray-700 leading-relaxed">
            <p>{s("sci.about_research_p1", lang)}</p>
            <p>{s("sci.about_research_p2", lang)}</p>
          </div>
        </section>

        {/* ═══════ Admin-editable DB content (Page #tadqiqot) ═══════ */}
        {dbContent && (
          <section className="mt-6 rounded-2xl bg-white ring-1 ring-gray-200 p-4 md:p-6 lg:rounded-3xl" aria-labelledby="db-content">
            <h2 id="db-content" className="sr-only">{s("sci.detailed_info", lang)}</h2>
            <div
              lang={lang}
              className="prose prose-base max-w-none text-gray-800 leading-relaxed [&_h1]:font-serif [&_h2]:font-serif [&_h3]:font-serif [&_a]:text-[#00575B]"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dbContent) }}
            />
          </section>
        )}

        {/* ═══════ Research directions ═══════ */}
        <div className="mt-6 space-y-6">
          {directions.map((dir) => (
            <section
              key={dir.title}
              className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
              aria-labelledby={`dir-${dir.title}`}
            >
              <h2 id={`dir-${dir.title}`} className="font-serif text-2xl font-semibold flex gap-3 text-[#00575B]">
                {dir.icon}
                <span>{dir.title}</span>
              </h2>
              <ul className="mt-6 space-y-2">
                {dir.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-[20px] bg-white p-4 md:p-6 font-serif text-base font-semibold leading-tight lg:text-lg text-gray-900 list-none"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
