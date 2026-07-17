import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import JournalFAQ from "@/components/journal/JournalFAQ";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

/** "prof./dots." kabi unvon prefikslarisiz ism bosh harflari (foto o'rnida avatar) */
function initialsOf(name: string): string {
  return name
    .replace(/^(prof\.|dots\.|akad\.)\s*/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("jurnal-haqida", {
    path: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/jurnal-haqida",
    locale: lang,
    title: "Jurnal haqida",
  });
}

export default async function JurnalHaqidaPage() {
  const lang = await getLanguage();

  const faqItems = [
    { question: s("jp.faq_q1", lang), answer: s("jp.faq_a1", lang) },
    { question: s("jp.faq_q2", lang), answer: s("jp.faq_a2", lang) },
    { question: s("jp.faq_q3", lang), answer: s("jp.faq_a3", lang) },
    { question: s("jp.faq_q4", lang), answer: s("jp.faq_a4", lang) },
    { question: s("jp.faq_q5", lang), answer: s("jp.faq_a5", lang) },
    { question: s("jp.faq_q6", lang), answer: s("jp.faq_a6", lang) },
  ];

  const editorialBoard = [
    {
      name: "prof. Rahimov S.T.",
      role: s("jp.role_chief_editor", lang),
      description: s("jp.desc_rahimov", lang),
    },
    {
      name: "prof. Nazarov M.X.",
      role: s("jp.role_deputy_editor", lang),
      description: s("jp.desc_nazarov", lang),
    },
    {
      name: "dots. Alimova G.R.",
      role: s("jp.role_exec_editor", lang),
      description: s("jp.desc_alimova", lang),
    },
    {
      name: "dots. Toshmatov A.K.",
      role: s("jp.role_tech_editor", lang),
      description: s("jp.desc_toshmatov", lang),
    },
  ];

  const editorialMembers = [
    {
      name: "prof. Sultonov B.A.",
      field: s("jp.field_pharma_doctor", lang),
      country: s("jp.country_uz", lang),
    },
    {
      name: "prof. Karimova N.D.",
      field: s("jp.field_med_doctor", lang),
      country: s("jp.country_uz", lang),
    },
    {
      name: "dots. Ergashev M.R.",
      field: s("jp.field_med_candidate", lang),
      country: s("jp.country_uz", lang),
    },
    {
      name: "prof. Xolmatov A.I.",
      field: s("jp.field_med_doctor", lang),
      country: s("jp.country_uz", lang),
    },
    {
      name: "dots. Qodirov U.B.",
      field: s("jp.field_med_candidate", lang),
      country: s("jp.country_uz", lang),
    },
    {
      name: "prof. Ruziyeva R.X.",
      field: s("jp.field_bio_doctor", lang),
      country: s("jp.country_uz", lang),
    },
  ];

  return (
    <div className="pt-8">
      <Container>
        {/* ═══════ Two-column layout ═══════ */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left column — Journal description */}
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl md:text-2xl text-[#00575B] font-bold">
              {s("jp.about_title", lang)}
            </h3>
            <div className="rounded-2xl p-4 lg:rounded-3xl md:p-4 mt-8 bg-gray-100 space-y-8 text-xl leading-7">
              <div className="space-y-4">
                <p className="text-justify text-base">
                  <strong>{s("jp.about_title", lang)}</strong>{" "}
                  — {s("jp.about_p1", lang)}
                </p>
                <p className="text-justify text-base">
                  {s("jp.about_p2", lang)}
                </p>
                <p className="text-justify text-base">
                  {s("jp.about_p3", lang)}
                </p>
                <p className="text-justify text-base">
                  <strong>{s("jp.about_p4", lang)}</strong>
                </p>
                <p className="text-justify text-base">
                  <strong>{s("jp.about_p5", lang)}</strong>
                </p>
                <p className="text-justify text-base">
                  <strong>{s("jp.about_p6_label", lang)}</strong>{" "}
                  {s("jp.about_p6", lang)}
                </p>
                <p className="text-justify text-base">
                  <strong>{s("jp.about_p7_label", lang)}</strong> —{" "}
                  {s("jp.about_p7", lang)}
                </p>
                <p className="text-justify text-base">
                  {s("jp.about_p8", lang)}
                </p>
              </div>
            </div>
          </div>

          {/* Right column — FAQ + Map */}
          <div className="w-full md:w-96 lg:w-103 shrink-0 space-y-8">
            <h3 className="text-xl sm:text-2xl md:text-2xl text-gray-900 font-bold">
              {s("jp.faq_title", lang)}
            </h3>
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl md:px-4 md:py-2 bg-gray-100 min-h-25 flex items-center justify-center">
              <JournalFAQ items={faqItems} />
            </div>
          </div>
        </div>

        {/* ═══════ Editorial board ═══════ */}
        <div className="pt-12">
          <h2 className="font-bold text-xl sm:text-2xl md:text-[26px] text-[#00575B]">
            {s("jp.editorial_board", lang)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6">
            {editorialBoard.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl p-4 lg:rounded-3xl md:p-5 space-y-2.5 bg-gray-100"
              >
                <div className="relative aspect-[261/288] w-full overflow-hidden rounded-[20px] bg-linear-to-br from-[#00575B] to-[#00969D] flex items-center justify-center">
                  <span className="text-white/90 text-5xl font-serif font-semibold select-none">
                    {initialsOf(member.name)}
                  </span>
                </div>
                <h4 className="text-base md:text-xl leading-6 font-semibold text-[#101828] pt-2 line-clamp-1">
                  {member.name}
                </h4>
                <p className="font-normal text-[#4A5565] text-sm line-clamp-3">
                  {member.role}
                </p>
                <p className="font-normal text-[#4A5565] text-sm line-clamp-3">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ Editorial members table ═══════ */}
        <div className="pt-12 mb-20">
          <h2 className="font-bold text-xl sm:text-2xl md:text-[26px] text-[#00575B]">
            {s("jp.editorial_members", lang)}
          </h2>
          <div className="rounded-2xl p-4 lg:rounded-3xl md:p-3 space-y-2.5 bg-gray-100 mt-6 md:mt-10 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[500px] w-full">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1fr_auto] border-b border-[#DFE4EA] pb-2">
                  <small className="text-sm px-2 sm:px-4 py-2 font-bold text-[#6C6E70]">
                    {s("jp.th_name", lang)}
                  </small>
                  <small className="text-sm px-2 sm:px-4 py-2 font-bold text-[#6C6E70] text-center">
                    {s("jp.th_field", lang)}
                  </small>
                  <small className="text-sm px-2 sm:px-4 py-2 font-bold text-[#6C6E70] text-center">
                    {s("jp.th_country", lang)}
                  </small>
                </div>
                {/* Table rows */}
                <div className="divide-y divide-[#DFE4EA]">
                  {editorialMembers.map((member) => (
                    <div
                      key={member.name}
                      className="grid grid-cols-[1fr_1fr_auto] hover:bg-slate-50/50 transition-colors items-center"
                    >
                      <small className="text-sm px-2 sm:px-4 py-4 font-medium truncate">
                        {member.name}
                      </small>
                      <small className="text-sm font-medium px-2 sm:px-4 py-4 text-center text-slate-500">
                        {member.field}
                      </small>
                      <small className="text-sm font-medium px-2 sm:px-4 py-4 text-center text-slate-500">
                        {member.country}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Breadcrumb
        items={[
          { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
          { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
          {
            label: s("nav.ilmiy_jurnal", lang),
            href: `/${lang}/faoliyat/ilmiy-faoliyat/ilmiy-jurnal`,
          },
          { label: s("jp.breadcrumb_about", lang) },
        ]}
        className="hidden"
      />
    </div>
  );
}
