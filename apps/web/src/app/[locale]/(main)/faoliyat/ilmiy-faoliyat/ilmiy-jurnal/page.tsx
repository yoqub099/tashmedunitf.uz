import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import JournalSwiper from "@/components/journal/JournalSwiper";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getJournalIssues, getPageBySlug } from "@/lib/services";
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

  const [currentRes, previousRes, pageRes] = await Promise.all([
    getJournalIssues({ is_current: true, per_page: 10 }).catch(() => null),
    getJournalIssues({ is_current: false, per_page: 20 }).catch(() => null),
    getPageBySlug("ilmiy-jurnal").catch(() => null),
  ]);

  const currentIssues = currentRes?.data ?? [];
  const previousIssues = previousRes?.data ?? [];

  // DB-boshqariladigan rasmlar (admin: Sahifalar → "ilmiy-jurnal" → rasmlar):
  // 1-rasm — hero, qolganlari — litsenziya/sertifikat galereyasi.
  // Rasm bo'lmasa hero gradient bo'lib chiqadi, litsenziya bo'limi yashirinadi
  // (oldin bu yerda mavjud bo'lmagan /imgs/... fayllar 404 bo'lib turardi).
  const pageImages = pageRes?.data?.images ?? [];
  const heroImage = pageImages[0] ?? null;
  const licenseImages = pageImages.slice(1);

  return (
    <div className="space-y-16 md:space-y-20 pt-16 md:pt-20">
      {/* ═══════ Hero ═══════ */}
      <Container>
        {heroImage ? (
          <div className="relative w-full aspect-video md:aspect-[21/9] lg:h-170 overflow-hidden rounded-2xl lg:rounded-3xl bg-slate-200">
            <Image
              src={heroImage.large_url || heroImage.url}
              alt={s("jp.hero_alt", lang)}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/5" />
          </div>
        ) : (
          <div className="relative w-full aspect-video md:aspect-[21/9] lg:h-170 overflow-hidden rounded-2xl lg:rounded-3xl bg-linear-to-br from-[#00575B] to-[#00969D] flex items-center justify-center">
            <h1 className="text-white font-serif text-3xl md:text-5xl font-semibold text-center px-6">
              {s("nav.ilmiy_jurnal", lang)}
            </h1>
          </div>
        )}
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

      {/* ═══════ Licenses (DB'dan; rasm bo'lmasa bo'lim ko'rinmaydi) ═══════ */}
      {licenseImages.length > 0 && (
        <Container>
          <h2 className="text-2xl sm:text-[32px] lg:text-[40px] leading-tight font-semibold text-center">
            {s("jp.licenses_title", lang)}
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
            {licenseImages.map((img, n) => (
              <div
                key={img.id}
                className="relative rounded-2xl p-4 md:p-6 lg:rounded-3xl w-full max-w-80 cursor-pointer bg-gray-100 aspect-[260/367] overflow-hidden"
              >
                <Image
                  src={img.medium_url || img.url}
                  alt={img.name || `${s("jp.license_alt", lang)} ${n + 1}`}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </Container>
      )}

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
