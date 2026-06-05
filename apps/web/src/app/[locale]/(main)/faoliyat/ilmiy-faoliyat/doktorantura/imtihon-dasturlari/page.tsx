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
  uz: { title: "Imtihon dasturlari", description: "ToshDTU Termiz filiali doktorantura kirish imtihon dasturlari — mutaxassislik bo'yicha fanlar, kodlar, imtihon shakli." },
  ru: { title: "Программы экзаменов", description: "Программы вступительных экзаменов в докторантуру Термезского филиала ТашГосМУ — специальные предметы, коды, форма экзамена." },
  en: { title: "Exam Programs", description: "Doctoral entrance exam programs at TashSMU Termez Branch — specialty subjects, codes, exam format." },
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const meta = META_BY_LOCALE[lang] || META_BY_LOCALE.uz;
  return buildMetadata("imtihon-dasturlari", { path: "/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-dasturlari", locale: lang, title: meta.title, description: meta.description });
}

async function getDbContent(lang: Language): Promise<string | null> {
  try {
    const res = await getPageBySlug("imtihon-dasturlari");
    const html = t(res.data.content, lang);
    return html && html.trim().length > 0 ? html : null;
  } catch {
    return null;
  }
}

const getPrograms = (lang: Language) => [
  {
    specialty: `${s("dokt.spec_davolash", lang)} (56.04.01)`,
    subjects: [
      { name: s("dokt.subj_ichki_kasalliklar", lang), topics: 45 },
      { name: s("dokt.subj_jarrohlik", lang), topics: 38 },
      { name: s("dokt.subj_pat_anatomiya", lang), topics: 30 },
      { name: s("dokt.subj_pat_fiziologiya", lang), topics: 28 },
      { name: s("dokt.subj_farmakologiya", lang), topics: 35 },
    ],
  },
  {
    specialty: `${s("dokt.spec_pediatriya", lang)} (56.04.02)`,
    subjects: [
      { name: s("dokt.subj_bolalar_kasalliklari", lang), topics: 42 },
      { name: s("dokt.subj_bolalar_jarrohlik", lang), topics: 30 },
      { name: s("dokt.subj_neonatologiya", lang), topics: 25 },
      { name: s("dokt.subj_bolalar_yuqumli", lang), topics: 28 },
    ],
  },
  {
    specialty: `${s("dokt.spec_jamoat", lang)} (56.04.03)`,
    subjects: [
      { name: s("dokt.subj_gigiyena", lang), topics: 35 },
      { name: s("dokt.subj_epidemiologiya", lang), topics: 30 },
      { name: s("dokt.subj_sogliq_tashkil", lang), topics: 28 },
      { name: s("dokt.subj_tibbiy_statistika", lang), topics: 20 },
    ],
  },
  {
    specialty: `${s("dokt.spec_farmatsiya", lang)} (56.04.04)`,
    subjects: [
      { name: s("dokt.subj_farm_kimyo", lang), topics: 35 },
      { name: s("dokt.subj_farmakognoziya", lang), topics: 30 },
      { name: s("dokt.subj_dori_texnologiya", lang), topics: 32 },
      { name: s("dokt.subj_farm_tashkil", lang), topics: 25 },
    ],
  },
];

export default async function ImtihonDasturlariPage() {
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
            { label: s("nav.imtihon_dasturlari", lang) },
          ]}
          className="mb-4"
        />

        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.imtihon_dasturlari", lang)}
        </h1>

        {/* ═══════ DB content (editable via admin) ═══════ */}
        {dbContent && (
          <section className="mt-6 rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl" aria-label={s("nav.imtihon_dasturlari", lang)}>
            <div
              lang={lang}
              className="prose prose-base max-w-none text-gray-800 leading-relaxed
                [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-0 [&_h2]:mb-4
                [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:mb-3 [&_p:last-child]:mb-0
                [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2
                [&_strong]:text-gray-900 [&_strong]:font-semibold
                [&_a]:text-[#00575B]
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:bg-white [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:shadow-sm
                [&_thead]:bg-[#00575B]
                [&_th]:text-white [&_th]:p-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold
                [&_td]:p-3 [&_td]:border-t [&_td]:border-gray-200 [&_td]:text-sm [&_td]:align-top
                [&_tbody_tr:nth-child(even)]:bg-gray-50
                [&_tbody_tr:hover]:bg-[#00575B]/5"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dbContent) }}
            />
          </section>
        )}

        {/* ═══════ Info (legacy fallback block) ═══════ */}
        {!dbContent && (
        <div className="mt-6 rounded-2xl bg-linear-to-br from-[#00575B] to-[#00969D] p-6 md:p-8 lg:rounded-3xl text-white">
          <h2 className="font-serif text-2xl font-semibold">
            {s("dokt.exam_entrance_title", lang)}
          </h2>
          <p className="mt-3 text-sm opacity-90 max-w-2xl">
            {s("dokt.exam_entrance_desc", lang)}
          </p>
        </div>
        )}

        {/* ═══════ Programs by specialty (legacy fallback) ═══════ */}
        {!dbContent && (
        <div className="mt-6 space-y-6">
          {getPrograms(lang).map((prog) => (
            <section
              key={prog.specialty}
              className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
            >
              <h2 className="font-serif text-2xl font-semibold flex gap-3 text-[#00575B]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  <path d="M8 7h6" /><path d="M8 11h8" />
                </svg>
                <span>{prog.specialty}</span>
              </h2>
              <ul className="mt-6 space-y-2 list-none">
                {prog.subjects.map((subj) => (
                  <li
                    key={subj.name}
                    className="rounded-[20px] bg-white p-4 md:p-5 flex items-center justify-between"
                  >
                    <h3 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                      {subj.name}
                    </h3>
                    <span className="text-sm text-gray-700 whitespace-nowrap ml-4">
                      {subj.topics} {s("dokt.topics_count", lang)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        )}
      </Container>
    </div>
  );
}
