"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "@/components/shared/LocaleLink";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import DOMPurify from "isomorphic-dompurify";
import type { Faculty, Direction, FAQItem, SiteContent } from "@/types";
import {
  GraduationCap,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  User,
  ChevronDown,
  BookOpen,
} from "lucide-react";

/* ── helpers ───────────────────────────────── */
function getContentValue(contents: SiteContent[], key: string, lang?: string): string {
  const item = contents.find((c) => c.key === key);
  if (!item) return "";
  return t(item.value, lang);
}

function getContentHtml(contents: SiteContent[], key: string, lang?: string): string {
  const item = contents.find((c) => c.key === key);
  if (!item) return "";
  return t(item.value, lang);
}

/** Strip "O'qitiladigan fanlar" / "Karyera imkoniyatlari" lists from description,
 *  returning only the introductory paragraph(s). */
function getCleanDescription(html: string): string {
  if (!html) return "";
  // Remove everything from "O'qitiladigan fanlar" or "Karyera imkoniyatlari" onwards
  let clean = html;
  const patterns = [/O[''\u02bc]qitiladigan fanlar/i, /Karyera imkoniyatlari/i];
  for (const pat of patterns) {
    const idx = clean.search(pat);
    if (idx > -1) clean = clean.substring(0, idx);
  }
  // Strip any trailing empty tags
  clean = clean.replace(/<(p|div|br)[^>]*>\s*(<\/(p|div)>)?\s*$/gi, "").trim();
  return clean;
}

/* ── Tab config ────────────────────────────── */
const DEGREE_TABS = [
  { key: "bakalavriat", i18nKey: "nav.bakalavriat", path: "/abiturientlarga/bakalavriat" },
  { key: "ordinatura", i18nKey: "nav.ordinatura", path: "/abiturientlarga/ordinatura" },
  { key: "magistratura", i18nKey: "nav.magistratura", path: "/abiturientlarga/magistratura" },
] as const;

/* ── Custom Globe/Cursor SVG icon (ISFT style) ── */
function FacultyGlobeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 24.5C8.2005 24.5 3.5 19.7995 3.5 14C3.5 8.2005 8.2005 3.5 14 3.5C19.7995 3.5 24.5 8.2005 24.5 14" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.09497 10.5H23.7766" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.09497 17.5H14" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.6667 14C18.6667 10.7753 17.8232 7.55062 16.1386 4.73662C15.1504 3.08812 12.8497 3.08812 11.8627 4.73662C8.49107 10.3658 8.49107 17.6353 11.8627 23.2645C12.3562 24.0881 13.1787 24.5011 14.0012 24.5011" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M22.3649 22.365L25.2874 21.196C25.8019 20.9907 25.7902 20.258 25.2699 20.0678L18.3095 17.5373C17.8289 17.3623 17.3634 17.829 17.5372 18.3097L20.0677 25.27C20.2567 25.7915 20.9894 25.802 21.1959 25.2875L22.3649 22.365Z" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Direction brand icon (ISFT-style branded triangle) ── */
function DirectionIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M13.9 3L1 25.2H4.8L13.9 9.2L23.2 25.2H26.8L13.9 3Z" fill="#00575B" />
      <path d="M14 15.6L8.4 25.2H12.2L14 21.8L16.1 25.2H19.7L14 15.6Z" fill="#00575B" />
    </svg>
  );
}

/* ── Admission Committee Items (defaults + site content keys) ── */
const ADMISSION_DEFAULTS = [
  { key: "adm_website", icon: Globe, i18nLabel: "applicants.online_reception", defaultValue: "admission.tdtutf.uz", linkPrefix: "https://" },
  { key: "adm_secretary", icon: User, i18nLabel: "applicants.secretary", defaultValue: "Qabul komissiyasi" },
  { key: "adm_phone", icon: Phone, i18nLabel: "applicants.phone", defaultValue: "+998 76 223-14-50", linkPrefix: "tel:" },
  { key: "adm_email", icon: Mail, i18nLabel: "applicants.email", defaultValue: "info@tdtutf.uz", linkPrefix: "mailto:" },
  { key: "adm_address", icon: MapPin, i18nLabel: "applicants.address", defaultValue: "Termiz sh., Al-Xorazmiy ko'chasi, 7-uy" },
  { key: "adm_schedule", icon: Clock, i18nLabel: "applicants.schedule", defaultValue: "Dushanba – Shanba 9:00–18:00" },
];

/* ── Props ─────────────────────────────────── */
interface Props {
  faculties: Faculty[];
  directions: Direction[];
  faqs: FAQItem[];
  siteContents: SiteContent[];
  lang?: Language;
}

export default function ApplicantsPageClient({
  faculties,
  directions,
  faqs,
  siteContents,
  lang = "uz",
}: Props) {
  /* State */
  const [activeDegree, setActiveDegree] = useState<string>("bakalavriat");
  const [activeFacultyId, setActiveFacultyId] = useState<number | null>(null);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  /* FAQ animation refs */
  const faqRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [faqHeights, setFaqHeights] = useState<Record<number, number>>({});

  useEffect(() => {
    const measured: Record<number, number> = {};
    faqs.forEach((f) => {
      const el = faqRefs.current[f.id];
      if (el) measured[f.id] = el.scrollHeight;
    });
    setFaqHeights(measured);
  }, [faqs]);

  /* Computed */
  const degreeFaculties = useMemo(() => {
    return faculties
      .filter((f) => f.level === activeDegree)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [faculties, activeDegree]);

  /* Reset faculty tab when degree changes */
  useEffect(() => {
    setActiveFacultyId(degreeFaculties.length > 0 ? degreeFaculties[0].id : null);
  }, [activeDegree, degreeFaculties]);

  const activeFaculty = degreeFaculties.find((f) => f.id === activeFacultyId) || null;

  const facultyDirections = useMemo(() => {
    if (!activeFacultyId) return [];
    return directions
      .filter((d) => d.faculty_id === activeFacultyId && d.level === activeDegree)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [directions, activeFacultyId, activeDegree]);

  const levelPath = DEGREE_TABS.find((d) => d.key === activeDegree)?.path || "/abiturientlarga/bakalavriat";

  /* Site content helpers */
  const heroTitle = getContentValue(siteContents, "applicants_hero_title", lang) || s("applicants.hero_title_fallback", lang);
  const heroText = getContentHtml(siteContents, "applicants_hero_text", lang) || s("applicants.hero_text_fallback", lang);
  const transferTitle = getContentValue(siteContents, "applicants_transfer_title", lang) || s("nav.oqishni_kochirish", lang);
  const transferText = getContentHtml(siteContents, "applicants_transfer_text", lang) || s("applicants.transfer_text_fallback", lang);

  /* Admission items resolved from site contents */
  const admissionItems = useMemo(
    () =>
      ADMISSION_DEFAULTS.map((def) => {
        const content = siteContents.find((c) => c.key === `applicants_${def.key}`);
        const value = content ? t(content.value, lang) || def.defaultValue : def.defaultValue;
        const label = s(def.i18nLabel, lang);
        let link: string | undefined;
        if (def.linkPrefix) {
          const raw = value.replace(/[\s-]/g, "");
          link = def.linkPrefix.startsWith("http") ? `${def.linkPrefix}${value}` : `${def.linkPrefix}${raw}`;
        }
        return { ...def, label, value, link };
      }),
    [siteContents, lang]
  );

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <Breadcrumb items={[{ label: s("nav.abiturientlarga", lang) }]} />

        {/* ═══════════ Section 1 — Hero Grid ═══════════ */}
        <section className="hero-section grid gap-6 lg:row-span-1 lg:grid-cols-3">
          {/* Left — Hero Banner */}
          <div className="flex flex-col lg:col-span-2">
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl grow flex flex-col justify-center bg-[url('/images/applicants-hero.svg')] bg-cover bg-no-repeat bg-center text-white lg:p-11! min-h-64 sm:min-h-80 md:min-h-105 lg:min-h-125">
              <h2 className="font-serif text-xl font-semibold capitalize leading-tight sm:text-2xl md:text-[32px] lg:text-[40px]">
                {heroTitle}
              </h2>
              <div
                className="mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:text-white [&_a]:text-yellow-300 [&_a]:underline [&_a:hover]:text-yellow-200"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(heroText) }}
              />
              <div className="mt-3 lg:mt-3" />
            </div>
          </div>

          {/* Right — Faculty List Sidebar */}
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl space-y-5 bg-gray-100 lg:col-span-1">
            <h2 className="font-serif text-xl font-semibold leading-tight sm:text-2xl md:text-[32px] lg:text-[40px]">
              <Link href="/abiturientlarga/bakalavriat" className="hover:text-[#00575B] transition-colors">
                {s("nav.bakalavriat", lang)}
              </Link>
            </h2>
            <div className="space-y-5">
              {faculties
                .filter((f) => f.level === "bakalavriat")
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((faculty) => {
                  const fName = t(faculty.name, lang);
                  return (
                    <div key={faculty.id} className="rounded-[20px] p-4 md:p-6 flex flex-col gap-3 bg-white">
                      <h5 className="font-serif text-xl font-semibold flex gap-2 text-[#00575B]">
                        <span className="flex-none">
                          <FacultyGlobeIcon />
                        </span>
                        <span>{fName}</span>
                      </h5>
                      <div className="flex w-full justify-end">
                        <Link
                          href={`/abiturientlarga/bakalavriat/${faculty.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-[#00575B] no-underline hover:underline"
                        >
                          <span>{s("applicants.view_details", lang)}</span>
                          <ArrowUpRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* ═══════════ Section 2 — Qabul komissiyasi ═══════════ */}
        <section className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
          <h4 className="font-serif text-xl font-semibold sm:text-2xl">{s("applicants.admission_commission", lang)}</h4>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {admissionItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.key}
                  className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex items-center gap-4 bg-white"
                >
                  <div className="shrink-0 flex items-center justify-center rounded-full bg-[#00575B]/10 w-10 h-10">
                    <IconComp className="h-5 w-5 text-[#00575B]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">{item.label}:</p>
                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg mt-1 line-clamp-2 text-[#00575B]">
                      {item.link ? (
                        <a href={item.link} className="hover:underline" target={item.link.startsWith("http") ? "_blank" : undefined} rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}>
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </h6>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════ Section 3 — Degree Tabs + Faculty Sub-tabs + Directions ═══════════ */}
        <section className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
          {/* Degree tabs */}
          <div className="flex overflow-x-auto scrollbar-none pb-2">
            {DEGREE_TABS.map((tab) => {
              const isActive = activeDegree === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveDegree(tab.key)}
                  className={`mr-4 sm:mr-6 whitespace-nowrap px-0 font-serif text-lg sm:text-2xl font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "text-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {s(tab.i18nKey, lang)}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="pt-6">
            {/* Degree description */}
            {activeDegree === "bakalavriat" && (
              <p className="text-base text-gray-600 leading-relaxed">
                {s("applicants.bakalavriat_desc", lang)}
              </p>
            )}
            {activeDegree === "ordinatura" && (
              <p className="text-base text-gray-600 leading-relaxed">
                {s("applicants.ordinatura_desc", lang)}
              </p>
            )}
            {activeDegree === "magistratura" && (
              <p className="text-base text-gray-600 leading-relaxed">
                {s("applicants.magistratura_desc", lang)}
              </p>
            )}

            {/* Faculty sub-tabs (pill buttons) */}
            {degreeFaculties.length > 0 && (
              <div className="mt-6 flex overflow-x-auto bg-transparent">
                {degreeFaculties.map((fac, idx) => {
                  const isActive = activeFacultyId === fac.id;
                  const isLast = idx === degreeFaculties.length - 1;
                  return (
                    <button
                      key={fac.id}
                      onClick={() => setActiveFacultyId(fac.id)}
                      className={`h-12 text-wrap rounded-full px-4 text-xs md:text-sm font-medium transition-all cursor-pointer ${
                        isLast ? "mr-0" : "mr-2"
                      } ${
                        isActive
                          ? "bg-[#00575B]! text-white!"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t(fac.name, lang)}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Directions grid */}
            <div className="mt-6">
              {facultyDirections.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {facultyDirections.map((dir) => (
                    <div
                      key={dir.id}
                      className="rounded-[20px] p-4 md:p-6 lg:rounded-3xl flex flex-col gap-3 bg-white"
                    >
                      <h5 className="font-serif text-xl font-semibold flex items-end gap-2 text-[#00575B]">
                        <DirectionIcon />
                        <Link
                          href={`${levelPath}/${dir.id}`}
                          className="hover:underline underline-offset-2"
                        >
                          {t(dir.name, lang)}
                        </Link>
                      </h5>
                      {dir.description && t(dir.description, lang) && (() => {
                        const cleanDesc = getCleanDescription(t(dir.description, lang));
                        return cleanDesc ? (
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {cleanDesc.replace(/<[^>]*>/g, '')}
                          </p>
                        ) : null;
                      })()}
                    </div>
                  ))}
                </div>
              ) : degreeFaculties.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-40 text-center py-10">
                  <GraduationCap className="h-16 w-16 text-gray-300 mb-3" />
                  <p className="text-gray-400 text-lg">
                    {s("applicants.faculties_soon", lang)}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-40 text-center py-10">
                  <BookOpen className="h-16 w-16 text-gray-300 mb-3" />
                  <p className="text-gray-400 text-lg">
                    {s("applicants.directions_soon", lang)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════ Section 4 — O'qishni ko'chirish ═══════════ */}
        <div className="mt-6 flex flex-col gap-6 md:flex-row">
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:rounded-3xl flex-1 bg-gray-100">
            <h4 className="font-serif text-xl sm:text-2xl font-semibold">{transferTitle}</h4>
            <div
              className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(transferText) }}
            />
          </div>
        </div>

        {/* ═══════════ Section 5 — FAQ ═══════════ */}
        {faqs.length > 0 && (
          <section className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
            <h4 className="font-serif text-xl font-semibold sm:text-2xl">{s("applicants.faq", lang)}</h4>
            <div className="mt-6 divide-y divide-gray-100 overflow-hidden rounded-2xl bg-white lg:rounded-3xl">
              {faqs
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((faq) => {
                  const question = t(faq.question, lang);
                  const answer = t(faq.answer, lang);
                  const isOpen = openFaqId === faq.id;

                  return (
                    <div key={faq.id}>
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="flex w-full items-center justify-between px-4 py-4 md:px-6 md:py-5 text-left gap-3 cursor-pointer"
                      >
                        <h6 className="text-sm font-semibold leading-tight text-gray-900 md:text-base">
                          {question}
                        </h6>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-[#00575B]" : ""
                          }`}
                        />
                      </button>

                      <div
                        ref={(el) => { faqRefs.current[faq.id] = el; }}
                        className="overflow-hidden transition-all duration-400 ease-out"
                        style={{
                          maxHeight: isOpen ? `${(faqHeights[faq.id] ?? 0) + 16}px` : "0px",
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <div className="px-4 pb-4 md:px-6 md:pb-5">
                          <div
                            className="text-sm text-gray-600 leading-relaxed md:text-base [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:text-gray-800 [&_a]:text-[#00575B] [&_a]:underline [&_a:hover]:text-[#003d40]"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer) }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
