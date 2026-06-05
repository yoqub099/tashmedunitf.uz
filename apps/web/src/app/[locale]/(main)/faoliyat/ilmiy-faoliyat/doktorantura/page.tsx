import Link from "next/link";
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

async function getDbContent(lang: Language): Promise<string | null> {
  try {
    const res = await getPageBySlug("doktorantura");
    const html = t(res.data.content, lang);
    return html && html.trim().length > 0 ? html : null;
  } catch {
    return null;
  }
}

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  uz: { title: "Doktorantura", description: "ToshDTU Termiz filiali doktorantura — PhD va DSc dasturlari, ilmiy rahbarlar, mutaxassisliklar, tadqiqot yo'nalishlari." },
  ru: { title: "Докторантура", description: "Докторантура Термезского филиала ТашГосМУ — программы PhD и DSc, научные руководители, специальности, направления исследований." },
  en: { title: "Doctoral Studies", description: "Doctoral studies at TashSMU Termez Branch — PhD and DSc programs, scientific supervisors, specialties, and research directions." },
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const meta = META_BY_LOCALE[lang] || META_BY_LOCALE.uz;
  return buildMetadata("doktorantura", { path: "/faoliyat/ilmiy-faoliyat/doktorantura", locale: lang, title: meta.title, description: meta.description });
}

/* ── Arrow icon ── */
function ArrowIcon() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#00575B] text-[#00575B] transition-colors group-hover:bg-[#00575B] group-hover:text-white">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </span>
  );
}

const getSpecialties = (lang: Language) => [
  { code: "56.04.01", name: s("dokt.spec_davolash", lang), type: s("dokt.degree_tibbiyot", lang) },
  { code: "56.04.02", name: s("dokt.spec_pediatriya", lang), type: s("dokt.degree_tibbiyot", lang) },
  { code: "56.04.03", name: s("dokt.spec_jamoat", lang), type: s("dokt.degree_tibbiyot", lang) },
  { code: "56.04.04", name: s("dokt.spec_farmatsiya", lang), type: s("dokt.degree_farmatsevtika", lang) },
];

const getLinks = (lang: Language) => [
  {
    title: s("nav.tadqiqotchilar", lang),
    description: s("dokt.link_researchers_desc", lang),
    href: `/${lang}/faoliyat/ilmiy-faoliyat/doktorantura/tadqiqotchilar`,
  },
  {
    title: s("nav.imtihon_dasturlari", lang),
    description: s("dokt.link_exam_programs_desc", lang),
    href: `/${lang}/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-dasturlari`,
  },
  {
    title: s("nav.imtihon_savollari", lang),
    description: s("dokt.link_exam_questions_desc", lang),
    href: `/${lang}/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-savollari`,
  },
];

export default async function DoktoranturaPage() {
  const lang = await getLanguage();
  const dbContent = await getDbContent(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
            { label: s("nav.doktorantura", lang) },
          ]}
          className="mb-4"
        />

        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.doktorantura", lang)}
        </h1>

        {/* ═══════ About (DB-driven, fallback to i18n) ═══════ */}
        {dbContent ? (
          <section className="mt-6 rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl" aria-label={s("dokt.about_title", lang)}>
            <div
              lang={lang}
              className="prose prose-base max-w-none text-gray-800 leading-relaxed [&_h1]:font-serif [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_strong]:text-gray-900 [&_a]:text-[#00575B]"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dbContent) }}
            />
          </section>
        ) : (
          <section className="mt-6 rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl" aria-labelledby="dok-about">
            <h2 id="dok-about" className="font-serif text-2xl font-semibold text-gray-900">
              {s("dokt.about_title", lang)}
            </h2>
            <div className="mt-4 space-y-4 text-base text-gray-700 leading-relaxed">
              <p>{s("dokt.about_p1", lang)}</p>
              <p>{s("dokt.about_p2", lang)}</p>
            </div>
          </section>
        )}

        {/* ═══════ Specialties ═══════ */}
        <section className="mt-6 rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl" aria-labelledby="dok-specs">
          <h2 id="dok-specs" className="font-serif text-2xl font-semibold flex gap-3 text-[#00575B]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span>{s("dokt.specialties_title", lang)}</span>
          </h2>
          <ul className="mt-6 space-y-2 list-none">
            {getSpecialties(lang).map((sp) => (
              <li
                key={sp.code}
                className="rounded-[20px] bg-white p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <h3 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                    {sp.name}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">{s("dokt.code_label", lang)}: {sp.code}</p>
                </div>
                <span className="inline-block rounded-full bg-[#00575B]/10 px-3 py-1 text-xs font-medium text-[#00575B] whitespace-nowrap">
                  {sp.type}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ═══════ Quick links ═══════ */}
        <nav className="mt-6 grid gap-4 md:grid-cols-3" aria-label={s("dokt.quick_links_label", lang)}>
          {getLinks(lang).map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group flex min-h-[10rem] flex-col justify-between rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00575B]"
            >
              <div>
                <h2 className="font-serif text-lg font-semibold text-gray-900">
                  {link.title}
                </h2>
                <p className="mt-2 text-sm text-gray-700">
                  {link.description}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <ArrowIcon />
              </div>
            </Link>
          ))}
        </nav>
      </Container>
    </div>
  );
}
