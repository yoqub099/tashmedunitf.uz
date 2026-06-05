import Container from "@/components/shared/Container";
import Link from "next/link";
import type { Banner, SiteContent } from "@/types";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import BannerSlider from "./BannerSlider";
import { s, type Language } from "@/lib/i18n";

interface Props {
  banners: Banner[];
  heroContents?: SiteContent[];
  lang: Language;
}

/**
 * Helper: SiteContent[] dan key bo'yicha qiymat olish (til bo'yicha)
 */
function cv(contents: SiteContent[] | undefined, key: string, fallback: string, lang: Language): string {
  if (!contents) return fallback;
  const item = contents.find((c) => c.key === key);
  return item?.value?.[lang] || item?.value?.uz || fallback;
}

export default function HeroSection({ banners, heroContents, lang }: Props) {
  const slideBanners = banners.filter((b) => b.image);

  return (
    <section id="hero-section" className="relative rounded-es-[40px] bg-[#00575B] bg-[url('/images/hero-pattern.svg')] bg-cover bg-no-repeat pt-16 pb-6 sm:pt-18 sm:pb-8 lg:rounded-es-[80px] lg:pt-20 lg:pb-16">
      <Container>
        {/* Hero grid: ISFT-style 3-col layout */}
        <div className="hero-section grid gap-4 text-white sm:gap-6 lg:mt-4 xl:grid-cols-3">
          {/* Left — 2/3 width at xl, full width at lg */}
          <div className="xl:col-span-2">
            {/* Heading */}
            <h1 className="font-serif text-2xl font-semibold leading-tight sm:text-3xl lg:text-5xl">
              {cv(heroContents, "hero_heading", s("hero.heading", lang), lang)}
            </h1>

            {/* Empty subtitle placeholder (matches ISFT <p class="mt-4"></p>) */}
            <p className="mt-4" />

            {/* Banner area — ISFT grid wrapper */}
            <div className="mt-3 grid w-full grid-cols-3 gap-4 sm:mt-4 sm:gap-6">
              <div className="shine col-span-3 rounded-xl p-0 sm:rounded-2xl lg:rounded-3xl">
                <BannerSlider
                  banners={slideBanners.length > 0 ? slideBanners : banners}
                />
              </div>
            </div>

            {/* Mission text */}
            <h5 className="mt-3 font-serif text-lg font-semibold sm:mt-4 sm:text-xl">
              {cv(heroContents, "hero_mission_title", s("hero.mission_title", lang), lang)}
            </h5>
            <p className="text-container mt-1.5 text-sm text-white/80 sm:mt-2 sm:text-base">
              {cv(heroContents, "hero_mission_text", s("hero.mission_text", lang), lang)}
            </p>
          </div>

          {/* Right — 1/3 sidebar cards */}
          <div className="grid w-full grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-1 xl:h-full xl:content-center">
            {/* Contact card — teal hover */}
            <Link href={`/${lang}/aloqa`}>
              <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-3 text-gray-900 transition-colors duration-300 hover:bg-gradient-to-br hover:from-cyan-600 hover:to-cyan-800 hover:text-white sm:rounded-2xl sm:p-4 md:p-6 lg:rounded-3xl">
                <div className="relative z-10 flex gap-2">
                  <div className="mb-3 grow">
                    <h5 className="font-serif text-lg font-semibold sm:text-xl">
                      {cv(heroContents, "hero_contact_title", s("hero.contact_title", lang), lang)}
                    </h5>
                    <p className="text-container mt-1.5 text-sm sm:mt-2 sm:text-base">
                      {cv(heroContents, "hero_contact_text", s("hero.contact_text", lang), lang)}
                    </p>
                  </div>
                  <div className="flex items-end">
                    <span className="rounded-full border border-cyan-700 p-1.5 group-hover:border-white">
                      <MessageCircle className="text-3xl text-cyan-700 group-hover:text-white" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Stats card */}
            <div className="rounded-xl bg-white p-3 text-gray-900 sm:rounded-2xl sm:p-4 md:p-6 lg:rounded-3xl">
              <p className="text-3xl font-semibold text-blue-700 sm:text-4xl">
                {cv(heroContents, "hero_stats_number", s("hero.stats_number", lang), lang)}
              </p>
              <div className="mt-3">
                <h5 className="font-serif text-lg font-semibold sm:text-xl">
                  {cv(heroContents, "hero_stats_title", s("hero.stats_title", lang), lang)}
                </h5>
                <p className="text-container mt-1.5 text-sm sm:mt-2 sm:text-base">
                  {cv(heroContents, "hero_stats_text", s("hero.stats_text", lang), lang)}
                </p>
              </div>
            </div>

            {/* CTA card — with decorative circles */}
            <Link href={`/${lang}/abiturientlarga`}>
              <div className="relative overflow-hidden rounded-xl bg-white p-3 text-gray-900 sm:rounded-2xl sm:p-4 md:p-6 lg:rounded-3xl">
                {/* Decorative SVG circles */}
                <svg
                  className="absolute right-0 top-0 overflow-visible"
                  width="120"
                  height="120"
                  viewBox="0 0 170 170"
                  fill="none"
                  style={{ zIndex: 2 }}
                >
                  <circle cx="160" cy="10" r="160" fill="#1d4ed8" fillOpacity="0.12" className="pulse" />
                  <circle cx="160" cy="10" r="122" fill="#1d4ed8" fillOpacity="0.12" className="pulse" />
                  <circle cx="160" cy="10" r="84" fill="#1d4ed8" fillOpacity="0.12" />
                </svg>
                <div className="relative z-10 flex items-end gap-4">
                  <div>
                    <h5 className="font-serif text-lg font-semibold sm:text-xl">
                      {cv(heroContents, "hero_cta_title", s("hero.cta_title", lang), lang)}
                    </h5>
                    <p className="text-container mt-1.5 text-sm sm:mt-2 sm:text-base">
                      {cv(heroContents, "hero_cta_text", s("hero.cta_text", lang), lang)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-blue-700 bg-white p-2">
                    <ArrowUpRight className="text-2xl text-blue-700" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
