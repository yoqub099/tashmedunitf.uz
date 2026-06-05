import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import JournalSwiper from "@/components/journal/JournalSwiper";
import Link from "next/link";
import type { Metadata } from "next";
import { getJournalIssues } from "@/lib/services";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("jurnal-nashrlar", {
    path: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/nashrlar",
    locale: lang,
    title: "Nashrlar",
  });
}

export default async function NashrlarPage() {
  const lang = await getLanguage();

  const [currentRes, previousRes] = await Promise.all([
    getJournalIssues({ is_current: true, per_page: 10 }).catch(() => null),
    getJournalIssues({ is_current: false, per_page: 50 }).catch(() => null),
  ]);

  const currentIssues = currentRes?.data ?? [];
  const previousIssues = previousRes?.data ?? [];

  return (
    <div className="pt-6 md:pt-8">
      {/* ═══════ CTA Banner ═══════ */}
      <Container className="space-y-8">
        <div className="rounded-2xl p-4 lg:rounded-3xl flex flex-col items-center gap-10 bg-linear-to-br from-[#00575B] to-[#00969D] text-white md:flex-row md:p-8">
          <div className="flex-1 space-y-4">
            <h3 className="text-lg md:text-2xl leading-6 font-semibold">
              {s("jp.cta_heading", lang)}
            </h3>
            <p className="text-base leading-6 font-normal text-white/90">
              {s("jp.cta_desc", lang)}
            </p>
          </div>
          <div className="hidden lg:block w-px h-20 bg-white/30" />
          <Link
            href={`/${lang}/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/yoriqnoma`}
            className="rounded-full bg-white px-5 py-2.5 text-base leading-6 text-gray-900 font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
          >
            {s("jp.cta_btn", lang)}
          </Link>
        </div>
      </Container>

      {/* ═══════ Issue sections ═══════ */}
      <Container className="space-y-6 md:space-y-8">
        {/* ═══════ Current issues ═══════ */}
        {currentIssues.length > 0 && (
          <div className="mt-6 md:mt-8">
            <JournalSwiper
              issues={currentIssues}
              title={s("jp.nashrlar_current_title", lang)}
              description={s("jp.nashrlar_current_desc", lang)}
            />
          </div>
        )}

        {/* ═══════ Previous issues ═══════ */}
        {previousIssues.length > 0 && (
          <div className="mt-6 md:mt-8">
            <JournalSwiper
              issues={previousIssues}
              title={s("jp.prev_title", lang)}
              description={s("jp.prev_desc", lang)}
            />
          </div>
        )}

        {/* Empty state */}
        {currentIssues.length === 0 && previousIssues.length === 0 && (
          <div className="rounded-2xl p-8 lg:rounded-3xl bg-gray-100 text-center mt-6 md:mt-8">
            <p className="text-gray-500">{s("jp.nashrlar_empty", lang)}</p>
          </div>
        )}
      </Container>

      <Breadcrumb
        items={[
          { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
          { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
          {
            label: s("nav.ilmiy_jurnal", lang),
            href: `/${lang}/faoliyat/ilmiy-faoliyat/ilmiy-jurnal`,
          },
          { label: s("jp.breadcrumb_nashrlar", lang) },
        ]}
        className="hidden"
      />
    </div>
  );
}
