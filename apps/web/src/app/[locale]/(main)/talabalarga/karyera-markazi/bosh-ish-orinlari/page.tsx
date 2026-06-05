import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import Link from "next/link";
import JobApplicationForm from "./JobApplicationForm";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("bosh-ish-orinlari", { path: "/talabalarga/karyera-markazi/bosh-ish-orinlari", locale: lang });
}

/* ── ISFT-style sub-components ── */

/* ── Arrow icon ── */
function ArrowIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={20} width={20}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ════════════════════════════════════════
   Page
   ════════════════════════════════════════ */
export default async function BoshIshOrinlariPage() {
  const lang = await getLanguage();

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container as="main" className="py-6">
        {/* ── Title ── */}
        <h2 className="font-serif text-xl font-semibold leading-tight sm:text-2xl md:text-[32px] lg:text-[40px]">
          {s("nav.bosh_ish_orinlari", lang)}
        </h2>

        {/* ── Breadcrumb ── */}
        <Breadcrumb
          items={[
            { label: s("common.home", lang), href: `/${lang}` },
            { label: s("nav.talabalarga", lang), href: `/${lang}/talabalarga` },
            { label: s("nav.bosh_ish_orinlari", lang) },
          ]}
        />

        {/* ── Karyera markazi info section ── */}
        <section className="mb-6">
          <div className="mt-6 grid items-end gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:col-span-2 lg:rounded-3xl">
              <div className="flex flex-col">
                <h4 className="font-serif text-xl font-semibold sm:text-2xl">
                  {s("career.title", lang)}
                </h4>
                <div className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base whitespace-pre-line">
                  <p>{s("career.info_desc", lang)}</p>
                  <br />
                  <p>{s("career.info_desc_2", lang)}</p>
                  <br />
                  <p>{s("career.info_desc_3", lang)}</p>
                  <br />
                  <p>{s("career.info_desc_4", lang)}</p>
                  <br />
                  <p>{s("career.info_desc_5", lang)}</p>
                </div>
                <Link
                  href={`/${lang}/talabalarga/karyera-markazi`}
                  className="ml-auto mt-6 flex items-center text-sm text-[#00575B]"
                >
                  <span className="mr-2">{s("common.view_all", lang)}</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Job application form ── */}
        <JobApplicationForm />
      </Container>
    </div>
  );
}
