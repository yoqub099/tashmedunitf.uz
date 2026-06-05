import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s, type Language } from "@/lib/i18n";

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  uz: {
    title: "Ilmiy konferensiyalar",
    description: "ToshDTU Termiz filiali ilmiy konferensiyalari — yo'nalishlar, sanalar, mavzular va ishtirok etish imkoniyatlari.",
  },
  ru: {
    title: "Научные конференции",
    description: "Научные конференции Термезского филиала ТашГосМУ — направления, даты, темы и возможности участия.",
  },
  en: {
    title: "Scientific Conferences",
    description: "Scientific conferences at TashSMU Termez Branch — topics, dates, themes, and participation opportunities.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const meta = META_BY_LOCALE[lang] || META_BY_LOCALE.uz;
  return buildMetadata("ilmiy-konferensiyalar", { path: "/faoliyat/ilmiy-faoliyat/konferensiyalar", locale: lang, title: meta.title, description: meta.description });
}

/* ── Calendar icon ── */
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

/* ── Location icon ── */
function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function getConferences(lang: Language) {
  return [
    {
      title: s("sci.conf_1_title", lang),
      date: s("sci.conf_1_date", lang),
      location: s("sci.conf_1_location", lang),
      status: s("sci.conf_1_status", lang),
      statusColor: "bg-blue-100 text-blue-700",
      topics: [
        s("sci.conf_1_topic_1", lang),
        s("sci.conf_1_topic_2", lang),
        s("sci.conf_1_topic_3", lang),
        s("sci.conf_1_topic_4", lang),
      ],
    },
    {
      title: s("sci.conf_2_title", lang),
      date: s("sci.conf_2_date", lang),
      location: s("sci.conf_2_location", lang),
      status: s("sci.conf_2_status", lang),
      statusColor: "bg-blue-100 text-blue-700",
      topics: [
        s("sci.conf_2_topic_1", lang),
        s("sci.conf_2_topic_2", lang),
        s("sci.conf_2_topic_3", lang),
      ],
    },
    {
      title: s("sci.conf_3_title", lang),
      date: s("sci.conf_3_date", lang),
      location: s("sci.conf_3_location", lang),
      status: s("sci.conf_3_status", lang),
      statusColor: "bg-green-100 text-green-700",
      topics: [
        s("sci.conf_3_topic_1", lang),
        s("sci.conf_3_topic_2", lang),
        s("sci.conf_3_topic_3", lang),
      ],
    },
  ];
}

export default async function KonferensiyalarPage() {
  const lang = await getLanguage();
  const conferences = getConferences(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
            { label: s("nav.konferensiyalar", lang) },
          ]}
          className="mb-4"
        />

        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.konferensiyalar", lang)}
        </h1>

        {/* ═══════ Conference cards ═══════ */}
        <div className="mt-6 space-y-6">
          {conferences.map((conf) => (
            <section
              key={conf.title}
              className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
              aria-labelledby={`conf-${conf.title.replace(/\s+/g, "-")}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 id={`conf-${conf.title.replace(/\s+/g, "-")}`} className="font-serif text-xl font-semibold text-gray-900 md:text-2xl max-w-2xl">
                  {conf.title}
                </h2>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${conf.statusColor}`}>
                  {conf.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-700">
                <span className="flex items-center gap-2">
                  <CalendarIcon /> {conf.date}
                </span>
                <span className="flex items-center gap-2">
                  <LocationIcon /> {conf.location}
                </span>
              </div>

              <ul className="mt-6 space-y-2">
                {conf.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-[20px] bg-white p-4 md:p-5 font-serif text-base font-semibold leading-tight lg:text-lg text-gray-900 list-none"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* ═══════ Link to news feed for more conferences ═══════ */}
        <aside className="mt-6 rounded-2xl bg-linear-to-br from-[#00575B] to-[#00969D] p-5 md:p-6 lg:rounded-3xl text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg md:text-xl font-semibold">
              {s("sci.more_conferences_title", lang)}
            </h2>
            <p className="mt-1 text-sm text-white/85">
              {s("sci.more_conferences_desc", lang)}
            </p>
          </div>
          <Link
            href={`/${lang}/yangiliklar/konferensiyalar`}
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#00575B] hover:bg-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {s("common.view_all", lang)}
          </Link>
        </aside>
      </Container>
    </div>
  );
}
