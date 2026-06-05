import Container from "@/components/shared/Container";
import Link from "next/link";
import Image from "next/image";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import type { Faculty, SiteContent } from "@/types";
import { API_BASE } from "@/lib/api";

function cv(contents: SiteContent[] | undefined, key: string, lang?: string): string {
  if (!contents) return "";
  const item = contents.find((c) => c.key === key);
  if (!item?.value) return "";
  return t(item.value, lang);
}
import {
  GraduationCap,
  Stethoscope,
  Microscope,
  Pill,
  ArrowUpRight,
  Phone,
} from "lucide-react";

/* ── Level config ────────────────────────────────────── */
function getLevelMeta(lang: string): Record<
  string,
  {
    i18nLabel: string;
    path: string;
    i18nDesc: string;
    heroImage: string;
  }
> {
  return {
    bakalavriat: {
      i18nLabel: "nav.bakalavriat",
      path: `/${lang}/abiturientlarga/bakalavriat`,
      i18nDesc: "level.bakalavriat_desc",
      heroImage: "/images/bakalavriat-hero.svg",
    },
    ordinatura: {
      i18nLabel: "nav.ordinatura",
      path: `/${lang}/abiturientlarga/ordinatura`,
      i18nDesc: "level.ordinatura_desc",
      heroImage: "/images/ordinatura-hero.svg",
    },
    magistratura: {
      i18nLabel: "nav.magistratura",
      path: `/${lang}/abiturientlarga/magistratura`,
      i18nDesc: "level.magistratura_desc",
      heroImage: "/images/magistratura-hero.svg",
    },
  };
}

/* ── Faculty icon by keyword ──────────────────────────── */
function iconForFaculty(name: string): React.ElementType {
  const lower = name.toLowerCase();
  if (lower.includes("tibbiyot")) return Stethoscope;
  if (lower.includes("farmatsiya")) return Pill;
  if (lower.includes("klinik") || lower.includes("tadqiqot")) return Microscope;
  return GraduationCap;
}

/* ── TMTU Logo Icon for cards ─────────────────────────── */
function TmtuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M14 6l-1.5 4h-4l3.25 2.5L10.5 17 14 14.5 17.5 17l-1.25-4.5L19.5 10h-4L14 6z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── Decorative pattern for promo card ────────────────── */
function PromoPattern() {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-1/2 opacity-10"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="160" cy="40" r="60" fill="white" />
      <circle cx="180" cy="120" r="40" fill="white" />
      <circle cx="120" cy="160" r="30" fill="white" />
    </svg>
  );
}

/* ── Component ──────────────────────────────────────── */
interface Props {
  level: string;
  faculties: Faculty[];
  heroContents?: SiteContent[];
  descContents?: SiteContent[];
  lang?: Language;
}

export default function FacultyLevelPage({ level, faculties, heroContents, descContents, lang = "uz" }: Props) {
  const LEVEL_META = getLevelMeta(lang);
  const meta = LEVEL_META[level] || LEVEL_META.bakalavriat;
  const label = s(meta.i18nLabel, lang);
  const heroKey = `hero_image_${level}`;
  const uploadedHero = cv(heroContents, heroKey, lang);
  const heroSrc = uploadedHero ? `${API_BASE}${uploadedHero}` : meta.heroImage;
  const descKey = `level_description_${level}`;
  const dynamicDesc = cv(descContents, descKey, lang);
  const activeFaculties = faculties
    .filter((f) => f.level === level && f.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="pt-20 lg:pt-24">
      <Container className="py-6 sm:py-8">

        {/* ═══ SECTION 1 — Hero Grid ═══════════════════════ */}
        <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">

          {/* Left — Title + Hero Image */}
          <div className="flex flex-col lg:col-span-2">
            <h1 className="font-serif text-[28px] font-semibold leading-tight sm:text-[32px] lg:text-5xl mb-4 capitalize">
              {label}
            </h1>
            <div className="relative grow overflow-hidden rounded-2xl bg-gray-100 lg:rounded-3xl min-h-60 max-h-115">
              <Image
                alt={label}
                src={heroSrc}
                fill
                className="rounded-2xl object-cover lg:rounded-3xl"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
                unoptimized={!!uploadedHero}
              />
            </div>
          </div>

          {/* Right — CTA Cards */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-1">
            {/* Contact Card */}
            <div className="rounded-2xl bg-gray-50 p-5 sm:p-6 lg:rounded-3xl flex flex-col justify-between space-y-4">
              <div>
                <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-[#00575B]/10 p-2.5">
                  <Phone className="h-5 w-5 text-[#00575B]" />
                </div>
                <h5 className="font-serif text-lg font-semibold sm:text-xl">
                  {s("faculty_level.contact_now", lang)}
                </h5>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {s("faculty_level.contact_desc", lang)}
                </p>
              </div>
              <div className="text-end">
                <Link
                  href={`/${lang}/aloqa`}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-[#00575B] shadow-sm transition-all hover:bg-[#00575B] hover:text-white hover:border-[#00575B]"
                >
                  <span>{s("faculty_level.contact_btn", lang)}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Promo Card — Become a student */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#00575B] to-[#003d40] p-5 sm:p-6 lg:rounded-3xl text-white">
              <PromoPattern />
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/15 p-3">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h5 className="font-serif text-lg font-semibold sm:text-xl">
                  {s("faculty_level.be_student", lang)}
                </h5>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">
                  {s("faculty_level.be_student_desc", lang)}
                </p>
                <Link
                  href={`/${lang}/aloqa`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>{s("common.submit_docs", lang)}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2 — Description ═══════════════════════ */}
        <section className="mt-6 sm:mt-8">
          <div className="rounded-2xl bg-gray-50 p-5 sm:p-6 lg:rounded-3xl">
            <h4 className="font-serif text-xl font-semibold sm:text-2xl">
              {s("faculty_level.direction_desc", lang)}
            </h4>
            <div className="mt-4 sm:mt-6 text-container text-gray-600 leading-relaxed">
              <p>{dynamicDesc || s(meta.i18nDesc, lang)}</p>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 3 — Faculties & Directions ════════════ */}
        <section className="mt-6 sm:mt-8">
          <div className="rounded-2xl bg-gray-50 p-5 sm:p-6 lg:rounded-3xl">
            <h4 className="font-serif text-xl font-semibold sm:text-2xl">
              {s("faculty_level.faculties_directions", lang)}
            </h4>

            {activeFaculties.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {activeFaculties.map((faculty) => {
                  const Icon = iconForFaculty(t(faculty.name, lang) || "");
                  const name = t(faculty.name, lang);
                  const desc = t(faculty.description, lang);

                  return (
                    <Link
                      key={faculty.id}
                      href={`${meta.path}/fakultet/${faculty.id}`}
                      className="group flex flex-col gap-3 rounded-2xl bg-white p-5 sm:p-6 transition-shadow hover:shadow-lg"
                    >
                      {/* Faculty title */}
                      <h5 className="font-serif text-lg font-semibold sm:text-xl flex items-center gap-2 text-[#00575B]">
                        <span className="inline-flex items-center justify-center rounded-lg bg-[#00575B]/10 p-2">
                          <Icon className="h-5 w-5 text-[#00575B]" />
                        </span>
                        <span className="group-hover:underline">{name}</span>
                      </h5>

                      {/* Faculty description */}
                      {desc && (
                        <div className="text-sm text-gray-500 leading-relaxed text-container line-clamp-4">
                          <p>{desc}</p>
                        </div>
                      )}

                      {/* Direction chips */}
                      {faculty.directions && faculty.directions.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                          {faculty.directions.map((dir) => (
                            <span
                              key={dir.id}
                              className="rounded-full bg-[#00575B]/8 px-3 py-1 text-xs text-[#00575B] font-medium"
                            >
                              {t(dir.name, lang)}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Arrow */}
                      <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#00575B] transition-transform group-hover:translate-x-1">
                        {s("common.details", lang)}
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center min-h-40 text-center">
                <GraduationCap className="h-14 w-14 text-gray-300 mb-4" />
                <p className="text-gray-600 text-base">
                  {s("applicants.faculties_soon", lang)}
                </p>
              </div>
            )}
          </div>
        </section>

      </Container>
    </div>
  );
}
