import Container from "@/components/shared/Container";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { translateExamSubject } from "@/lib/exam-subjects-i18n";
import { getCourseSchema } from "@/lib/seo";
import type { Direction } from "@/types";
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
  Clock,
  ArrowRight,
  ArrowUpRight,
  Phone,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  Banknote,
} from "lucide-react";

/* ── Level paths ──────────────────────────────────── */
function getLevelPaths(lang: string): Record<string, string> {
  return {
    bakalavriat: `/${lang}/abiturientlarga/bakalavriat`,
    ordinatura: `/${lang}/abiturientlarga/ordinatura`,
    magistratura: `/${lang}/abiturientlarga/magistratura`,
  };
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

function iconFor(code: string) {
  return CODE_ICONS[code?.substring(0, 6)] ?? FALLBACK_ICONS[0];
}

/* ── Extract main text from description HTML ──────────── */
function parseDescription(html: string | undefined): {
  mainText: string;
} {
  if (!html) return { mainText: "" };
  const mainText = html
    .replace(/<h3>[\s\S]*$/i, "")
    .replace(/<p>\s*<strong>[^<]*(?:[Kk]aryera|[Кк]арьера|[Cc]areer)[^<]*<\/strong>\s*<\/p>[\s\S]*/i, "")
    .trim();
  return { mainText };
}

/* ── SVG Icons (ISFT style) ────────────────────────── */
function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.748 3.496V6.998" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.252 3.496V6.998" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.665 24.504H6.997c-1.934 0-3.502-1.567-3.502-3.501V8.748c0-1.934 1.568-3.502 3.502-3.502h14.006c1.934 0 3.502 1.568 3.502 3.502v2.917" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.127 17.482v2.052l1.613.984" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19.252" cy="19.252" r="5.252" stroke="#00575B" strokeWidth="1.5" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M7 24.5H4.667A1.167 1.167 0 013.5 23.333v-7a1.167 1.167 0 011.167-1.166H7A1.167 1.167 0 018.167 16.333v7A1.167 1.167 0 017 24.5z" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.167 19.833h2.721c.505 0 .997-.163 1.4-.466l2.82-2.114a1.75 1.75 0 012.31.165 1.75 1.75 0 010 2.499l-2.42 2.418a3.5 3.5 0 01-2.384 1.276l-3.42.684a3.5 3.5 0 01-2.046-.149l-3.092-.772a3.5 3.5 0 00-1.13-.16H8.166" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10.5" y="2.333" width="14" height="9.333" rx="1.944" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.5" cy="7" r="1.75" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DegreeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.32 4.777L4.117 8.779c-1.514.841-1.514 3.018 0 3.86l7.203 4.001a7 7 0 006.36 0l7.203-4.002c1.514-.841 1.514-3.018 0-3.859L17.68 4.777a7 7 0 00-6.36 0z" stroke="#00575B" strokeWidth="1.419" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.99 14.233v4.578a3.5 3.5 0 001.474 2.752l1.875 1.248a7 7 0 007.321 0l1.875-1.248a3.5 3.5 0 001.475-2.752v-4.578" stroke="#00575B" strokeWidth="1.417" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Format price with spaces ──────────────────────── */
function formatPrice(value: number | null | undefined): string {
  if (!value) return "\u2014";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/* ── Component ─────────────────────────────────────── */
interface Props {
  direction: Direction;
  siblingDirections: Direction[];
  lang?: Language;
}

export default function DirectionDetailPage({ direction, siblingDirections, lang = "uz" }: Props) {
  const name = t(direction.name, lang);
  const levelLabel = s(`level.${direction.level}`, lang);
  const LEVEL_PATHS = getLevelPaths(lang);
  const levelPath = LEVEL_PATHS[direction.level] || `/${lang}/abiturientlarga/bakalavriat`;
  const Icon = iconFor(direction.code);
  const { mainText } = parseDescription(t(direction.description, lang));

  const otherDirections = siblingDirections
    .filter((d) => d.id !== direction.id && d.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const courseSchema = getCourseSchema({
    name: name,
    description: mainText?.replace(/<[^>]*>/g, '').slice(0, 200) || `${name} — ${levelLabel}`,
    duration: direction.duration,
    level: levelLabel,
    price: direction.price_daytime?.toString(),
    url: `/abiturientlarga/${direction.level || 'bakalavriat'}/${direction.id}`,
  });

  return (
    <main className="pt-16 sm:pt-20 lg:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <Container className="py-6">
        {/* ═══════════ Section 1 — Hero Grid (ISFT style) ═══════════ */}
        <section className="grid gap-6 p-0 lg:row-span-1 lg:grid-cols-3">
          {/* Left – Title + Image + Info Cards (2 cols) */}
          <div className="flex flex-col lg:col-span-2">
            <div className="flex grow flex-col">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-5 overflow-x-auto scrollbar-none">
                <Link href={`/${lang}`} className="hover:text-[#00575B] transition-colors shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00575B]">{s("common.home", lang)}</Link>
                <ChevronRight aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 shrink-0" />
                <Link href={`/${lang}/abiturientlarga`} className="hover:text-[#00575B] transition-colors shrink-0 hidden sm:inline rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00575B]">{s("nav.abiturientlarga", lang)}</Link>
                <ChevronRight aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 shrink-0 hidden sm:inline" />
                <Link href={levelPath} className="hover:text-[#00575B] transition-colors shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00575B]">{levelLabel}</Link>
                <ChevronRight aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 shrink-0" />
                <span className="text-gray-900 font-medium truncate max-w-32 sm:max-w-48" aria-current="page">{name}</span>
              </nav>

              {/* Title */}
              <h1 className="font-serif text-2xl font-semibold leading-tight sm:text-[32px] lg:text-5xl first-letter:capitalize">
                {name}
              </h1>
              <p className="my-4">{levelLabel}</p>

              {/* Hero Image */}
              <div className="relative rounded-2xl lg:rounded-3xl bg-gray-100 overflow-hidden h-full min-h-70">
                {direction.image && direction.image.length > 0 ? (
                  <Image
                    src={direction.image}
                    alt={name}
                    fill
                    className="h-full w-full rounded-3xl object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center min-h-[200px] sm:min-h-[280px]">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center rounded-full bg-[#00575B]/10 p-5 mb-3">
                        <Icon className="h-12 w-12 text-[#00575B]/40" />
                      </div>
                      <p className="text-[#00575B]/40 font-serif text-lg font-medium px-4">{name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3 Info Cards Grid */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                {/* Card 1: Duration */}
                <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
                  <div className="size-10 sm:size-13 rounded-full bg-[#DCE6E8] p-2 sm:p-3">
                    <CalendarIcon />
                  </div>
                  <p className="mb-1 mt-4 text-sm text-[#4B4A4A]">{s("direction.duration", lang)}</p>
                  <p className="font-semibold text-[#0D0D0D]">{direction.duration || "\u2014"}</p>
                </div>

                {/* Card 2: Payment */}
                <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
                  <div className="size-10 sm:size-13 rounded-full bg-[#DCE6E8] p-2 sm:p-3">
                    <PaymentIcon />
                  </div>
                  <p className="mb-1 mt-4 text-sm text-[#4B4A4A]">{s("direction.payment", lang)}</p>
                  <div className="mt-1 space-y-0.5">
                    {direction.price_daytime != null && (
                      <p className="font-semibold text-[#0D0D0D] text-sm">{s("direction.daytime", lang)} <span className="text-[#4B4A4A] font-normal">..........{formatPrice(direction.price_daytime)} {s("common.currency", lang)}</span></p>
                    )}
                    {direction.price_remote != null && (
                      <p className="font-semibold text-[#0D0D0D] text-sm">{s("direction.remote", lang)} <span className="text-[#4B4A4A] font-normal">..........{formatPrice(direction.price_remote)} {s("common.currency", lang)}</span></p>
                    )}
                  </div>
                </div>

                {/* Card 3: Degree */}
                <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
                  <div className="size-10 sm:size-13 rounded-full bg-[#DCE6E8] p-2 sm:p-3">
                    <DegreeIcon />
                  </div>
                  <p className="mb-1 mt-4 text-sm text-[#4B4A4A]">{s("direction.degree", lang)}</p>
                  <p className="font-semibold text-[#0D0D0D]">{levelLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right – Sidebar Cards (1 col) */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-1">
            {/* Contact Card */}
            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:rounded-3xl bg-gray-100 flex flex-col justify-between space-y-4 sm:space-y-6 flex-1">
              <div>
                <div className="inline-flex items-center justify-center rounded-full bg-white w-9 h-9 sm:w-11 sm:h-11 shadow-sm mb-3 sm:mb-4">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#00575B]" />
                </div>
                <h3 className="font-serif text-base sm:text-xl font-semibold">
                  {s("direction.contact_now", lang)}
                </h3>
                <p className="mt-1.5 sm:mt-2 text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {s("direction.contact_desc", lang)}
                </p>
              </div>
              <div className="text-end">
                <Link
                  href={`/${lang}/aloqa`}
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-[#00575B] shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  {s("direction.contact_btn", lang)}
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* CTA Card */}
            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:rounded-3xl bg-linear-to-br from-[#00575B] to-[#003d40] relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5"></div>
              <div className="relative z-10">
                <div className="rounded-full bg-white/15 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="mt-3 sm:mt-5 text-white">
                  <h3 className="font-serif text-base sm:text-xl font-semibold">
                    {s("direction.be_student", lang)}
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-white/75 text-xs sm:text-sm leading-relaxed">
                    {s("direction.be_student_desc", lang)}
                  </p>
                </div>
                <Link
                  href={`/${lang}/aloqa`}
                  className="mt-3 sm:mt-5 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-white/25 transition-all cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {s("common.submit_docs", lang)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ Section 2 — Direction description ═══════════ */}
        {/* ═══════════ Exam subjects ═══════════ */}
        {direction.exam_subjects && direction.exam_subjects.length > 0 && (
          <section className="py-6">
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
              <h2 className="font-serif text-xl font-semibold sm:text-2xl">
                {s("direction.exam_subjects", lang)}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {direction.exam_subjects.map((subject, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#00575B] shadow-sm"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    {translateExamSubject(subject, lang)}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {mainText && (
          <section className="py-6">
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
              <h2 className="font-serif text-xl font-semibold sm:text-2xl">{s("direction.description", lang)}</h2>
              <div
                lang={lang}
                className="mt-6 prose prose-base max-w-none text-gray-600 leading-relaxed prose-headings:font-serif prose-headings:text-gray-900 prose-a:text-[#00575B]"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mainText) }}
              />
            </div>
          </section>
        )}

        {/* ═══════════ Section 3 — Other directions ═══════════ */}
        {otherDirections.length > 0 && (
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
            <h2 className="font-serif text-xl font-semibold sm:text-2xl mb-4 sm:mb-6">
              {s("direction.other", lang)}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 items-stretch">
              {otherDirections.map((d) => {
                const DIcon = iconFor(d.code);
                return (
                  <Link
                    key={d.id}
                    href={`/${lang}/abiturientlarga/${d.level}/${d.id}`}
                    className="flex h-full items-center gap-3 rounded-2xl bg-white p-4 sm:p-5 hover:shadow-md transition-shadow duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00575B]"
                  >
                    <span className="inline-flex items-center justify-center rounded-full bg-[#DCE6E8] p-3 shrink-0">
                      <DIcon className="h-5 w-5 text-[#00575B]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#00575B] transition-colors line-clamp-2">
                        {t(d.name, lang)}
                      </span>
                      {d.code && (
                        <p className="text-xs text-gray-600 mt-0.5">{d.code}</p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#00575B] transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
