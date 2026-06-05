import Container from "@/components/shared/Container";
import FAQContent from "@/components/faq/FAQContent";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { getOrganizationSchema } from "@/lib/seo";
import type { Faculty, SiteContent, FAQItem } from "@/types";
import {
  GraduationCap,
  Stethoscope,
  Baby,
  ShieldCheck,
  Pill,
  HeartPulse,
  Scissors,
  FlaskConical,
  BookOpen,
  Building2,
  Microscope,
  ArrowRight,
  Phone,
  ChevronDown,
} from "lucide-react";

/* ── Level i18n keys ──────────────────────────────────── */
const LEVEL_I18N: Record<string, string> = {
  bakalavriat: "nav.bakalavriat",
  ordinatura: "nav.ordinatura",
  magistratura: "nav.magistratura",
};

function getLevelPaths(lang: string): Record<string, string> {
  return {
    bakalavriat: `/${lang}/abiturientlarga/bakalavriat`,
    ordinatura: `/${lang}/abiturientlarga/ordinatura`,
    magistratura: `/${lang}/abiturientlarga/magistratura`,
  };
}

/* ── Faculty icon by keyword ───────────────────────── */
function facultyIcon(name: string): React.ElementType {
  const lower = name.toLowerCase();
  if (lower.includes("tibbiyot")) return Stethoscope;
  if (lower.includes("farmatsiya")) return Pill;
  if (lower.includes("klinik")) return Building2;
  if (lower.includes("ilmiy") || lower.includes("tadqiqot")) return Microscope;
  return GraduationCap;
}

/* ── Icon by direction code prefix ─────────────────── */
const CODE_ICONS: Record<string, React.ElementType> = {
  "605101": Stethoscope,
  "605102": Baby,
  "605103": ShieldCheck,
  "605201": Pill,
  "705101": HeartPulse,
  "705102": Scissors,
  "705201": Baby,
};
const FALLBACK_ICONS = [Stethoscope, GraduationCap, BookOpen, FlaskConical];

function iconFor(code: string, idx: number) {
  return CODE_ICONS[code?.substring(0, 6)] ?? FALLBACK_ICONS[idx % FALLBACK_ICONS.length];
}

/* ── SiteContent helper ────────────────────────────── */
function cv(contents: SiteContent[] | undefined, key: string, fallback: string, lang?: string): string {
  if (!contents) return fallback;
  const item = contents.find((c) => c.key === key);
  return t(item?.value, lang) || fallback;
}

/* ── Component ─────────────────────────────────────── */
interface Props {
  faculty: Faculty;
  siteContents?: SiteContent[];
  faqs?: FAQItem[];
  lang?: Language;
}

export default function FacultyDetailPage({ faculty, siteContents, faqs, lang = "uz" }: Props) {
  const level = faculty.level;
  const levelLabel = s(LEVEL_I18N[level] || "nav.bakalavriat", lang);
  const LEVEL_PATHS = getLevelPaths(lang);
  const levelPath = LEVEL_PATHS[level] || `/${lang}/abiturientlarga/bakalavriat`;
  const name = t(faculty.name, lang) || "";
  const description = t(faculty.description, lang) || "";
  const FacultyIcon = facultyIcon(name);
  const directions = (faculty.directions || [])
    .filter((d) => d.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  // JSON-LD schema: EducationalOrganization (faculty) + list of Course offerings
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name,
    description: description.replace(/<[^>]*>/g, "").slice(0, 200),
    image: faculty.image || undefined,
    parentOrganization: getOrganizationSchema(),
    hasCourse: directions.map((d) => ({
      "@type": "Course",
      name: t(d.name, lang),
      description: t(d.description, lang)?.replace(/<[^>]*>/g, "").slice(0, 200),
      courseCode: d.code,
      educationalLevel: levelLabel,
    })),
  };

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24 space-y-4 sm:space-y-6 pb-10 sm:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* ═══════════ Section 1 — Hero Grid ═══════════ */}
      <Container className="pt-4 sm:pt-8">
        <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left – Title + Hero Image (2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-5 overflow-x-auto scrollbar-none">
              <Link href={`/${lang}`} className="hover:text-[#00575B] transition-colors shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00575B]">{s("common.home", lang)}</Link>
              <ChevronDown aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5 -rotate-90 text-gray-500 shrink-0" />
              <Link href={`/${lang}/abiturientlarga`} className="hover:text-[#00575B] transition-colors shrink-0 hidden sm:inline rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00575B]">{s("nav.abiturientlarga", lang)}</Link>
              <ChevronDown aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5 -rotate-90 text-gray-500 shrink-0 hidden sm:inline" />
              <Link href={levelPath} className="hover:text-[#00575B] transition-colors shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00575B]">{levelLabel}</Link>
              <ChevronDown aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5 -rotate-90 text-gray-500 shrink-0" />
              <span className="text-gray-900 font-medium truncate max-w-32 sm:max-w-48" aria-current="page">{name}</span>
            </nav>

            <h1 className="font-serif text-xl sm:text-[28px] md:text-4xl lg:text-[44px] font-semibold leading-tight">
              {name}
            </h1>

            {faculty.image ? (
              <div className="relative mt-4 sm:mt-5 overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gray-200 h-48 sm:h-72 lg:h-96 xl:h-128">
                <Image
                  src={faculty.image}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
            ) : (
              <div className="mt-4 sm:mt-6 relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-linear-to-br from-[#00575B]/10 to-[#00575B]/5 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-[#00575B]/10 p-3 sm:p-5 mb-2 sm:mb-3">
                    <FacultyIcon className="h-8 w-8 sm:h-12 sm:w-12 text-[#00575B]/40" />
                  </div>
                  <p className="text-[#00575B]/40 font-serif text-sm sm:text-lg font-medium px-4">{name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right – Sidebar cards (1 col) */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-1">
            {/* Contact card */}
            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:rounded-3xl bg-gray-100 flex flex-col justify-between space-y-4 sm:space-y-6">
              <div>
                <div className="inline-flex items-center justify-center rounded-full bg-white w-9 h-9 sm:w-11 sm:h-11 shadow-sm mb-3 sm:mb-4">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#00575B]" />
                </div>
                <h3 className="font-serif text-base sm:text-xl font-semibold">
                  {cv(siteContents, "faculty_detail_contact_title", s("direction.contact_now", lang), lang)}
                </h3>
                <p className="mt-1.5 sm:mt-2 text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {cv(siteContents, "faculty_detail_contact_text", s("direction.contact_desc", lang), lang)}
                </p>
              </div>
              <div className="text-end">
                <Link
                  href={`/${lang}/aloqa`}
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-[#00575B] shadow-sm hover:shadow-md transition-all group"
                >
                  {cv(siteContents, "faculty_detail_contact_button", s("direction.contact_btn", lang), lang)}
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* CTA card */}
            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:rounded-3xl bg-linear-to-br from-[#00575B] to-[#003d40] relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="rounded-full bg-white/15 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="mt-3 sm:mt-5 text-white">
                  <h3 className="font-serif text-base sm:text-xl font-semibold">
                    {cv(siteContents, "faculty_detail_cta_title", s("direction.be_student", lang), lang)}
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-white/75 text-xs sm:text-sm leading-relaxed">
                    {cv(siteContents, "faculty_detail_cta_text", s("direction.be_student_desc", lang), lang)}
                  </p>
                </div>
                <Link
                  href={`/${lang}/qabul`}
                  className="mt-3 sm:mt-5 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-white/25 transition-all group"
                >
                  {cv(siteContents, "faculty_detail_cta_button", s("common.submit_docs", lang), lang)}
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Container>

      {/* ═══════════ Section 2 — Fakultet tavsifi ═══════════ */}
      {description && (
        <Container>
          <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:rounded-3xl bg-gray-100">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-5">
              <div className="rounded-lg sm:rounded-xl bg-[#00575B]/10 p-2 sm:p-2.5">
                <FacultyIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#00575B]" />
              </div>
              <h2 className="font-serif text-lg sm:text-2xl font-semibold">{s("faculty.description", lang)}</h2>
            </div>
            <div
              className="prose prose-sm sm:prose-base prose-gray max-w-none text-gray-600 leading-relaxed prose-headings:font-serif prose-headings:text-gray-900 prose-a:text-[#00575B]"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
            />
          </div>
        </Container>
      )}

      {/* ═══════════ Section 3 — Yo'nalishlar ═══════════ */}
      <Container>
        <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:rounded-3xl bg-gray-100">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
            <div className="rounded-lg sm:rounded-xl bg-[#00575B]/10 p-2 sm:p-2.5">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#00575B]" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-2xl font-semibold">{s("level.directions", lang)}</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {directions.length > 0
                  ? `${directions.length} ${s("faculty_detail.directions_count", lang)}`
                  : s("faculty_detail.directions_soon", lang)}
              </p>
            </div>
          </div>

          {directions.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {directions.map((dir, idx) => {
                const Icon = iconFor(dir.code, idx);
                const dirName = t(dir.name, lang);
                const dirDesc = t(dir.description, lang);

                return (
                  <Link
                    key={dir.id}
                    href={`${levelPath}/${dir.id}`}
                    className="rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 bg-white flex flex-col gap-2.5 sm:gap-3 h-full shadow-sm hover:shadow-md transition-shadow duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00575B] focus-visible:ring-offset-2"
                  >
                    {/* Icon + Title */}
                    <h3 className="font-serif text-base sm:text-lg font-semibold flex items-start gap-2.5 sm:gap-3 text-[#00575B]">
                      <span className="inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-[#00575B]/10 p-2 sm:p-2.5 shrink-0 mt-0.5">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#00575B]" />
                      </span>
                      <span className="group-hover:underline underline-offset-2 decoration-[#00575B]/30">
                        {dirName}
                      </span>
                    </h3>

                    {/* Description */}
                    {dirDesc && (
                      <div
                        className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3 sm:line-clamp-4 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dirDesc) }}
                      />
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-1">
                      {dir.code && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 font-medium">
                          {dir.code}
                        </span>
                      )}
                      {dir.duration && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 font-medium">
                          {dir.duration}
                        </span>
                      )}
                    </div>

                    {/* Batafsil link */}
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00575B] group-hover:gap-2.5 transition-all w-fit"
                    >
                      {s("common.details", lang)}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-40 sm:min-h-60 text-center">
              <GraduationCap className="h-10 w-10 sm:h-16 sm:w-16 text-gray-300 mb-3 sm:mb-4" />
              <p className="text-gray-600 text-sm sm:text-lg">
                {s("faculty_detail.directions_empty", lang)}
              </p>
            </div>
          )}
        </div>
      </Container>

      {/* ═══════════ Section 4 — FAQ ═══════════ */}
      {faqs && faqs.length > 0 && (
        <Container>
          <FAQContent faqs={faqs} />
        </Container>
      )}
    </div>
  );
}
