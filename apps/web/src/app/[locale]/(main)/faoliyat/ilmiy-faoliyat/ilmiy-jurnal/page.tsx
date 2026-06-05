import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import JournalSwiper from "@/components/journal/JournalSwiper";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getJournalIssues } from "@/lib/services";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("jurnal-bosh-sahifa", {
    path: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal",
    locale: lang,
    title: "Bosh sahifa",
  });
}

export default async function IlmiyJurnalBoshSahifa() {
  const lang = await getLanguage();

  const [currentRes, previousRes] = await Promise.all([
    getJournalIssues({ is_current: true, per_page: 10 }).catch(() => null),
    getJournalIssues({ is_current: false, per_page: 20 }).catch(() => null),
  ]);

  const currentIssues = currentRes?.data ?? [];
  const previousIssues = previousRes?.data ?? [];

  return (
    <div className="space-y-16 md:space-y-20 pt-16 md:pt-20">
      {/* ═══════ Hero Image ═══════ */}
      <Container>
        <div className="relative w-full aspect-video md:aspect-[21/9] lg:h-170 overflow-hidden rounded-2xl lg:rounded-3xl bg-slate-200">
          <Image
            src="/imgs/journal/hero.jpg"
            alt={s("jp.hero_alt", lang)}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>
      </Container>

      {/* ═══════ CTA Banner ═══════ */}
      <Container>
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

      {/* ═══════ Current Issues ═══════ */}
      {currentIssues.length > 0 && (
        <Container>
          <JournalSwiper
            issues={currentIssues}
            title={s("jp.current_title", lang)}
            description={s("jp.current_desc", lang)}
            linkHref="/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/nashrlar"
            linkLabel={s("jp.all_issues", lang)}
          />
        </Container>
      )}

      {/* ═══════ Previous Issues ═══════ */}
      {previousIssues.length > 0 && (
        <Container>
          <JournalSwiper
            issues={previousIssues}
            title={s("jp.prev_title", lang)}
            description={s("jp.prev_desc", lang)}
            linkHref="/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/nashrlar"
            linkLabel={s("jp.all_issues", lang)}
          />
        </Container>
      )}

      {/* ═══════ Licenses ═══════ */}
      <Container>
        <h2 className="text-2xl sm:text-[32px] lg:text-[40px] leading-tight font-semibold text-center">
          {s("jp.licenses_title", lang)}
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="relative rounded-2xl p-4 md:p-6 lg:rounded-3xl w-full max-w-80 cursor-pointer bg-gray-100 aspect-[260/367] overflow-hidden"
            >
              <Image
                src={`/imgs/license/${n}.jpg`}
                alt={`${s("jp.license_alt", lang)} ${n}`}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          ))}
        </div>
      </Container>

      <Breadcrumb
        items={[
          { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
          { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
          { label: s("nav.ilmiy_jurnal", lang) },
        ]}
        className="hidden"
      />
    </div>
  );
}
