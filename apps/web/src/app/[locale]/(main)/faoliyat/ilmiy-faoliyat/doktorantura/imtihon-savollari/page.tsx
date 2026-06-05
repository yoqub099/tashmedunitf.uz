import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("imtihon-savollari", { path: "/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-savollari", locale: lang });
}

const getExamSets = (lang: Language) => [
  {
    specialty: s("dokt.spec_davolash", lang),
    code: "56.04.01",
    sections: [
      {
        subject: s("dokt.subj_ichki_kasalliklar", lang),
        sampleQuestions: [
          s("dokt.q_arterial", lang),
          s("dokt.q_bronxial", lang),
          s("dokt.q_buyrak", lang),
          s("dokt.q_jigar", lang),
          s("dokt.q_revmatoid", lang),
        ],
      },
      {
        subject: s("dokt.subj_jarrohlik", lang),
        sampleQuestions: [
          s("dokt.q_appenditsit", lang),
          s("dokt.q_xolesistit", lang),
          s("dokt.q_qorin", lang),
          s("dokt.q_peritonit", lang),
        ],
      },
    ],
  },
  {
    specialty: s("dokt.spec_pediatriya", lang),
    code: "56.04.02",
    sections: [
      {
        subject: s("dokt.subj_bolalar_kasalliklari", lang),
        sampleQuestions: [
          s("dokt.q_sariqlik", lang),
          s("dokt.q_pnevmoniya", lang),
          s("dokt.q_kamqonlik", lang),
          s("dokt.q_obstruksiya", lang),
        ],
      },
    ],
  },
  {
    specialty: s("dokt.spec_farmatsiya", lang),
    code: "56.04.04",
    sections: [
      {
        subject: s("dokt.subj_farm_kimyo", lang),
        sampleQuestions: [
          s("dokt.q_sifat_tahlil", lang),
          s("dokt.q_antibiotik", lang),
          s("dokt.q_barqarorlik", lang),
          s("dokt.q_gmp", lang),
        ],
      },
    ],
  },
];

export default async function ImtihonSavollariPage() {
  const lang = await getLanguage();

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
            { label: s("nav.doktorantura", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat/doktorantura` },
            { label: s("nav.imtihon_savollari", lang) },
          ]}
          className="mb-4"
        />

        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.imtihon_savollari", lang)}
        </h1>

        {/* ═══════ Info banner ═══════ */}
        <div className="mt-6 rounded-2xl bg-linear-to-br from-[#00575B] to-[#00969D] p-6 md:p-8 lg:rounded-3xl text-white">
          <h4 className="font-serif text-2xl font-semibold">
            {s("dokt.sample_questions_title", lang)}
          </h4>
          <p className="mt-3 text-sm opacity-90 max-w-2xl">
            {s("dokt.sample_questions_desc", lang)}
          </p>
        </div>

        {/* ═══════ Exam questions by specialty ═══════ */}
        <div className="mt-6 space-y-6">
          {getExamSets(lang).map((set) => (
            <div key={set.code}>
              {/* Specialty header */}
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="inline-block rounded-full bg-[#00575B]/10 px-3 py-1 text-xs font-medium text-[#00575B]">
                  {set.code}
                </span>
                {set.specialty}
              </h3>

              <div className="space-y-4">
                {set.sections.map((section) => (
                  <div
                    key={section.subject}
                    className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
                  >
                    <h4 className="font-serif text-2xl font-semibold flex gap-3 text-[#00575B]">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                      <span>{section.subject}</span>
                    </h4>
                    <div className="mt-6 space-y-2">
                      {section.sampleQuestions.map((q, i) => (
                        <div
                          key={i}
                          className="rounded-[20px] bg-white p-4 md:p-5 flex items-start gap-3"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00575B]/10 text-xs font-semibold text-[#00575B]">
                            {i + 1}
                          </span>
                          <h6 className="font-serif text-base leading-tight lg:text-lg">
                            {q}
                          </h6>
                        </div>
                      ))}
                    </div>
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
