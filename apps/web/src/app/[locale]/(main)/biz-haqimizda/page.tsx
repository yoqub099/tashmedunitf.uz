import Container from "@/components/shared/Container";
import Image from "next/image";

import { getPageBySlug } from "@/lib/services";
import { t } from "@/lib/translate";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("biz-haqimizda", { path: "/biz-haqimizda", locale: lang });
}

/* ── data helpers ───────────────────────── */

interface AboutSection {
  title: string;
  content: string;
  image?: string;
}

async function getAboutData() {
  try {
    const res = await getPageBySlug("biz-haqimizda");
    return res.data;
  } catch {
    return null;
  }
}

async function getSectionData(
  slug: string,
  lang?: string
): Promise<{ title: string; content: string; image?: string } | null> {
  try {
    const res = await getPageBySlug(slug);
    const page = res.data;
    return {
      title: t(page.title, lang),
      content: t(page.content, lang),
      image: page.images?.[0]?.url,
    };
  } catch {
    return null;
  }
}

/* ── Static fallback data ─────────────── */

function getFallbackSections(lang: string): AboutSection[] {
  return [
    { title: s("about.section1_title", lang as any), content: s("about.section1_content", lang as any) },
    { title: s("about.section2_title", lang as any), content: s("about.section2_content", lang as any) },
    { title: s("about.section3_title", lang as any), content: s("about.section3_content", lang as any) },
    { title: s("about.section4_title", lang as any), content: s("about.section4_content", lang as any) },
    { title: s("about.section5_title", lang as any), content: `<ul><li>${s("about.adv1", lang as any)}</li><li>${s("about.adv2", lang as any)}</li><li>${s("about.adv3", lang as any)}</li><li>${s("about.adv4", lang as any)}</li><li>${s("about.adv5", lang as any)}</li><li>${s("about.adv6", lang as any)}</li></ul>` },
  ];
}

/* ── Advantages fallback data — ISFT card grid ── */

function getFallbackAdvantages(lang: string): string[] {
  return [
    s("about.adv1", lang as any), s("about.adv2", lang as any), s("about.adv3", lang as any),
    s("about.adv4", lang as any), s("about.adv5", lang as any), s("about.adv6", lang as any),
  ];
}

const advantageIcons = [
  /* BookOpen */ <svg key="i0" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>,
  /* Lightbulb */ <svg key="i1" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>,
  /* TrendingUp */ <svg key="i2" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
  /* Users */ <svg key="i3" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>,
  /* Globe */ <svg key="i4" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9 9 0 0 1 3 12c0-1.47.353-2.856.978-4.082" /></svg>,
  /* Heart */ <svg key="i5" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>,
];

/** Parse <li> items from HTML content */
function parseListItems(html: string): string[] {
  const matches = html.match(/<li[^>]*>(.*?)<\/li>/g);
  if (!matches || matches.length === 0) return [];
  return matches.map((m) => m.replace(/<[^>]*>/g, "").trim());
}

/* ── Sections slugs for dynamic data ──── */
const sectionSlugs = [
  "biz-haqimizda-tdtutf",
  "biz-haqimizda-talim-muhiti",
  "biz-haqimizda-oqitish-usuli",
  "biz-haqimizda-kichik-guruhlar",
  "biz-haqimizda-afzalliklar-bolim",
];

const advantagesSlug = "biz-haqimizda-afzalliklar";
const licensesSlug = "biz-haqimizda-litsenziyalar";

/* ── Licenses helper ─────────────────── */

async function getLicensesData(lang?: string): Promise<{
  title: string;
  images: { url: string; alt: string }[];
}> {
  try {
    const res = await getPageBySlug(licensesSlug);
    const page = res.data;
    return {
      title: t(page.title, lang) || s("about.license_title", lang as any),
      images:
        page.images?.map((img: { url: string; name?: string }, idx: number) => ({
          url: img.url,
          alt: img.name || `Litsenziya ${idx + 1}`,
        })) || [],
    };
  } catch {
    return { title: "", images: [] };
  }
}

/* ── Page component ───────────────────── */

export default async function BizHaqimizdaPage() {
  const lang = await getLanguage();
  const aboutPage = await getAboutData();

  // Try to load dynamic sections (5 sections), fall back to static
  const fallbackSections = getFallbackSections(lang);
  const dynamicSections = await Promise.all(
    sectionSlugs.map((sl) => getSectionData(sl, lang))
  );
  const sections: AboutSection[] = dynamicSections.map((ds, i) =>
    ds ? ds : fallbackSections[i]
  );

  // Load advantages section separately
  const advantagesData = await getSectionData(advantagesSlug, lang);
  const fallbackAdvantages = getFallbackAdvantages(lang);
  const advantagesTitle =
    advantagesData?.title || s("about.section5_title", lang as any);
  const advantagesItems =
    advantagesData?.content
      ? parseListItems(advantagesData.content)
      : fallbackAdvantages;
  const items =
    advantagesItems.length > 0 ? advantagesItems : fallbackAdvantages;

  // Load licenses/certificates
  const licensesData = await getLicensesData(lang);

  const heroTitle = aboutPage ? t(aboutPage.title, lang) : s("nav.biz_haqimizda", lang);
  const heroContent = aboutPage
    ? t(aboutPage.content, lang)
    : s("about.hero_fallback", lang as any);
  const heroImage = aboutPage?.images?.[0]?.url;

  return (
    <div className="pt-20 lg:pt-24">
      <Container className="py-6">
        {/* ═══ Hero Section — ISFT style ═══ */}
        <div className="rounded-2xl bg-[url(/images/Head.svg)] bg-cover bg-no-repeat p-4 text-white sm:p-6 lg:rounded-3xl lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
                {heroTitle}
              </h2>
              <div
                className="mt-4 text-container"
                dangerouslySetInnerHTML={{
                  __html: `<p>${heroContent.replace(/<[^>]*>/g, "")}</p>`,
                }}
              />
            </div>
            {heroImage && (
              <div className="relative w-full lg:w-auto lg:float-right lg:mt-10 aspect-[456/240] overflow-hidden rounded-2xl bg-gray-200">
                <Image
                  src={heroImage}
                  alt={heroTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 456px"
                  priority
                />
              </div>
            )}
          </div>
        </div>

        {/* ═══ Content Sections — ISFT alternating style (5 sections) ═══ */}
        <div className="mt-6 flex flex-col gap-6">
          {sections.map((section, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={index}
                className={`flex flex-col gap-6 ${isReversed ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                {/* Text card — ISFT style */}
                <div className="rounded-2xl bg-gray-100 p-4 text-gray-800 md:w-1/2 sm:p-6 md:p-14! lg:rounded-3xl">
                  <h4 className="font-serif text-2xl font-semibold">
                    {section.title}
                  </h4>
                  <div
                    className="mt-6 text-container leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: section.content,
                    }}
                  />
                </div>

                {/* Image card — ISFT style */}
                <div className="relative md:w-1/2 overflow-hidden rounded-2xl lg:rounded-3xl bg-gray-200 min-h-70">
                  {section.image ? (
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full min-h-70 items-center justify-center bg-linear-to-br from-blue-800 via-blue-700 to-blue-900">
                      <div className="text-center text-white/80">
                        <svg
                          className="mx-auto mb-3 h-16 w-16 opacity-40"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Zm16.5-13.5h.008v.008h-.008V7.5Zm0 0A.375.375 0 0 1 20.625 7.5"
                          />
                        </svg>
                        <p className="text-sm font-medium">
                          {s("about.image_placeholder", lang as any)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══ Advantages Section — ISFT card grid style ═══ */}
        <div className="mt-10 sm:mt-16 lg:mt-20">
          <h2 className="text-center font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
            {advantagesTitle}
          </h2>
          <div className="mt-6 sm:mt-8 grid gap-4 rounded-2xl bg-gray-100 p-4 sm:p-6 md:grid-cols-2 lg:rounded-3xl">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl bg-white p-4 sm:p-6 md:h-46"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00575B] text-white">
                  {advantageIcons[i % advantageIcons.length]}
                </div>
                <h5 className="mt-4 font-serif text-xl font-semibold text-[#00575B] md:mt-0 md:text-[22px]">
                  {item}
                </h5>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Rektor bilan bog'laning ═══ */}
        <div className="mt-10 sm:mt-16 flex flex-col items-center gap-6 sm:gap-8 rounded-2xl bg-linear-to-br from-[#00575B] to-[#00969D] p-4 sm:p-8 text-white md:flex-row md:p-12 lg:rounded-3xl">
          <div className="flex-1 space-y-3">
            <h3 className="font-serif text-2xl font-semibold lg:text-[32px]">
              {s("about.rector_title", lang as any)}
            </h3>
            <p className="leading-relaxed opacity-90">
              {s("about.rector_desc", lang as any)}
            </p>
          </div>
          <div className="hidden h-16 w-px bg-white/20 lg:block" />
          <div className="shrink-0">
            <a
              href={`/${lang}/biz-haqimizda/virtual-qabulxona`}
              className="inline-block whitespace-nowrap rounded-full bg-white px-6 py-3 font-semibold text-[#00575B] transition hover:bg-white/90"
            >
              {s("about.rector_btn", lang as any)}
            </a>
          </div>
        </div>

        {/* ═══ Litsenziya va sertifikatlar — ISFT style ═══ */}
        <div className="mt-10 sm:mt-16 lg:mt-20 text-center">
          <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
            {licensesData.title}
          </h2>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 justify-items-center gap-4 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {licensesData.images.length > 0 ? (
              licensesData.images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-full cursor-pointer rounded-2xl bg-gray-100 p-4 lg:rounded-3xl aspect-[260/367] overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 400px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
              ))
            ) : (
              /* Fallback placeholder cards when no images in DB */
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex w-full items-center justify-center rounded-2xl bg-gray-100 p-4 sm:p-6 lg:rounded-3xl min-h-48 sm:min-h-[280px]"
                >
                  <div className="text-center text-gray-400">
                    <svg
                      className="mx-auto mb-3 h-16 w-16 opacity-40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    <p className="text-sm font-medium">{s("about.license_item", lang as any)} {i + 1}</p>
                    <p className="mt-1 text-xs">{s("about.image_placeholder", lang as any)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
