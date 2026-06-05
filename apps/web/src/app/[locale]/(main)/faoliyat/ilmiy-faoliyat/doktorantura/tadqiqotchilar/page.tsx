import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { getPageBySlug } from "@/lib/services";
import { t } from "@/lib/translate";

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  uz: { title: "Tadqiqotchilar", description: "ToshDTU Termiz filiali doktorantura va mustaqil tadqiqotchilar ro'yxati — mutaxassisliklar, dissertatsiya mavzulari, ilmiy rahbarlar." },
  ru: { title: "Исследователи", description: "Список докторантов и самостоятельных исследователей Термезского филиала ТашГосМУ — специальности, темы диссертаций, научные руководители." },
  en: { title: "Researchers", description: "List of doctoral candidates and independent researchers at TashSMU Termez Branch — specialties, dissertation topics, supervisors." },
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const meta = META_BY_LOCALE[lang] || META_BY_LOCALE.uz;
  return buildMetadata("tadqiqotchilar", { path: "/faoliyat/ilmiy-faoliyat/doktorantura/tadqiqotchilar", locale: lang, title: meta.title, description: meta.description });
}

async function getDbContent(lang: Language): Promise<string | null> {
  try {
    const res = await getPageBySlug("tadqiqotchilar");
    const html = t(res.data.content, lang);
    return html && html.trim().length > 0 ? html : null;
  } catch {
    return null;
  }
}

const getResearchers = (lang: Language) => [
  {
    name: "Karimov A.B.",
    specialty: s("dokt.spec_davolash", lang),
    topic: s("dokt.topic_karimov", lang),
    supervisor: "prof. Rahimov S.T.",
    year: "2024-2027",
  },
  {
    name: "Toshmatova D.K.",
    specialty: s("dokt.spec_pediatriya", lang),
    topic: s("dokt.topic_toshmatova", lang),
    supervisor: "prof. Nazarov M.X.",
    year: "2024-2027",
  },
  {
    name: "Jurayev F.N.",
    specialty: s("dokt.spec_jamoat", lang),
    topic: s("dokt.topic_jurayev", lang),
    supervisor: "dots. Alimova G.R.",
    year: "2025-2028",
  },
  {
    name: "Xolmatova N.S.",
    specialty: s("dokt.spec_farmatsiya", lang),
    topic: s("dokt.topic_xolmatova", lang),
    supervisor: "prof. Sultonov B.A.",
    year: "2025-2028",
  },
  {
    name: "Raxmatullayev I.O.",
    specialty: s("dokt.spec_davolash", lang),
    topic: s("dokt.topic_raxmatullayev", lang),
    supervisor: "prof. Rahimov S.T.",
    year: "2023-2026",
  },
];

export default async function TadqiqotchilarPage() {
  const lang = await getLanguage();
  const dbContent = await getDbContent(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
            { label: s("nav.doktorantura", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat/doktorantura` },
            { label: s("nav.tadqiqotchilar", lang) },
          ]}
          className="mb-4"
        />

        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.tadqiqotchilar", lang)}
        </h1>

        {/* ═══════ Researchers list — DB-driven with fallback ═══════ */}
        {dbContent ? (
          <section className="mt-6 rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl" aria-label={s("nav.tadqiqotchilar", lang)}>
            <div
              lang={lang}
              className="prose prose-base max-w-none text-gray-800 leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-0 [&_h2]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:bg-white [&_table]:rounded-xl [&_table]:overflow-hidden [&_th]:bg-[#00575B] [&_th]:text-white [&_th]:p-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_td]:p-3 [&_td]:border-t [&_td]:border-gray-200 [&_td]:text-sm [&_tbody_tr:hover]:bg-gray-50 [&_strong]:text-gray-900 [&_a]:text-[#00575B]"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dbContent) }}
            />
          </section>
        ) : (
          <div className="mt-6 space-y-4">
            {getResearchers(lang).map((r, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-serif text-xl font-semibold text-gray-900 md:text-2xl">{r.name}</h2>
                  <span className="inline-block rounded-full bg-[#00575B]/10 px-3 py-1 text-xs font-medium text-[#00575B]">{r.year}</span>
                </div>
                <div className="mt-4 rounded-[20px] bg-white p-4 md:p-5">
                  <p className="text-sm text-gray-700">{s("dokt.dissertation_topic", lang)}</p>
                  <h3 className="mt-1 font-serif text-base font-semibold leading-tight lg:text-lg">{r.topic}</h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700">
                  <span><strong className="text-gray-900">{s("dokt.specialty_label", lang)}</strong> {r.specialty}</span>
                  <span><strong className="text-gray-900">{s("dokt.supervisor_label", lang)}</strong> {r.supervisor}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
