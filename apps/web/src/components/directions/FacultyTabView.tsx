"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "@/components/shared/LocaleLink";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import type { Faculty } from "@/types";
import {
  GraduationCap,
  Stethoscope,
  Microscope,
  Building2,
  Pill,
  ArrowRight,
  ArrowUpRight,
  FileText,
} from "lucide-react";

/* ── Tab config ────────────────────────────────── */
const tabs = [
  {
    key: "bakalavriat",
    i18nKey: "nav.bakalavriat",
    path: "/abiturientlarga/bakalavriat",
  },
  {
    key: "ordinatura",
    i18nKey: "nav.ordinatura",
    path: "/abiturientlarga/ordinatura",
  },
  {
    key: "magistratura",
    i18nKey: "nav.magistratura",
    path: "/abiturientlarga/magistratura",
  },
] as const;

/* ── Faculty icon by keyword ───────────────────── */
function iconForFaculty(name: string): React.ElementType {
  const lower = name.toLowerCase();
  if (lower.includes("tibbiyot")) return Stethoscope;
  if (lower.includes("farmatsiya")) return Pill;
  if (lower.includes("klinik")) return Building2;
  if (lower.includes("ilmiy") || lower.includes("tadqiqot")) return Microscope;
  return GraduationCap;
}

/* ── Accent colors ─────────────────────────────── */
const CARD_ACCENTS = [
  { border: "border-l-blue-600", icon: "bg-blue-100 text-blue-700", tag: "bg-blue-50 text-blue-700 border-blue-200" },
  { border: "border-l-teal-600", icon: "bg-teal-100 text-teal-700", tag: "bg-teal-50 text-teal-700 border-teal-200" },
  { border: "border-l-emerald-600", icon: "bg-emerald-100 text-emerald-700", tag: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { border: "border-l-indigo-600", icon: "bg-indigo-100 text-indigo-700", tag: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

interface Props {
  faculties: Faculty[];
  lang?: Language;
}

export default function FacultyTabView({ faculties, lang = "uz" }: Props) {
  const [activeTab, setActiveTab] = useState<string>("bakalavriat");

  const levelPath =
    tabs.find((l) => l.key === activeTab)?.path ||
    "/abiturientlarga/bakalavriat";

  const levelFaculties = faculties
    .filter((f) => f.level === activeTab)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <section className="py-10 sm:py-16 lg:py-20 bg-white">
        <Container>
          <Breadcrumb items={[{ label: s("nav.abiturientlarga", lang) }]} />

          {/* ── Header ─────────────────────────── */}
          <div className="flex flex-col items-center justify-center mt-5 sm:mt-8">
            <h1 className="font-serif text-xl sm:text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px] text-center text-gray-900">
              {s("faculty_tab.become_student", lang)}
            </h1>
            <p className="mb-6 sm:mb-8 mt-2 text-center text-xs sm:text-sm md:text-base text-gray-500 px-2">
              {s("faculty_tab.choose_direction", lang)}
            </p>
          </div>

          {/* ── Tab Bar ────────────────────────── */}
          <div className="flex w-full gap-2 sm:gap-4 overflow-x-auto pb-3 scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <div
                  key={tab.key}
                  className="h-9 sm:h-10 grow md:h-12 min-w-28 sm:min-w-0"
                >
                  <button
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative w-full h-full rounded-full border text-xs sm:text-sm md:text-base font-bold transition-all duration-300 cursor-pointer ${isActive ? "border-[#00575B] text-[#00575B] bg-white shadow-md" : "border-gray-200 text-gray-400 bg-white hover:border-[#00575B] hover:text-[#00575B] hover:bg-[#00575B]/5"}`}
                  >
                    {s(tab.i18nKey, lang)}
                    {isActive && (
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                        <span className="block h-3 w-3 sm:h-3.5 sm:w-3.5 rotate-45 border-b border-r border-[#00575B] bg-white" />
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Content Area ───────────────────── */}
          <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:rounded-3xl min-h-60 sm:min-h-85 w-full bg-gray-50">
            {levelFaculties.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                {levelFaculties.map((faculty, index) => {
                  const Icon = iconForFaculty(t(faculty.name, lang) || "");
                  const name = t(faculty.name, lang);
                  const directions = faculty.directions || [];
                  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

                  return (
                    <Link
                      key={faculty.id}
                      href={`${levelPath}/fakultet/${faculty.id}`}
                      className={`group relative rounded-xl sm:rounded-2xl border-l-4 ${accent.border} bg-white p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                    >
                      {/* Top row */}
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className={`rounded-lg sm:rounded-xl p-2 sm:p-2.5 ${accent.icon}`}>
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-base sm:text-lg md:text-xl font-semibold text-gray-900 leading-snug">
                            {name}
                          </h5>
                          <p className="mt-0.5 text-xs sm:text-sm text-gray-600">
                            {directions.length} {s("faculty_tab.directions_count", lang)}
                          </p>
                        </div>
                        <span className="rounded-full border border-gray-200 p-1 sm:p-1.5 group-hover:border-[#00575B] group-hover:bg-[#00575B] transition-colors duration-300">
                          <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </span>
                      </div>

                      {/* Direction chips */}
                      {directions.length > 0 && (
                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                          {directions.map((dir) => (
                            <span
                              key={dir.id}
                              className={`inline-flex items-center rounded-lg border px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium ${accent.tag}`}
                            >
                              {t(dir.name, lang)}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-40 sm:min-h-70 text-center px-4">
                <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-3 sm:mb-4" />
                <p className="text-gray-600 text-sm sm:text-lg">
                  {s("faculty_tab.faculties_soon", lang)}
                </p>
              </div>
            )}
          </div>

          {/* ── CTA Button ─────────────────────── */}
          <div className="mt-6 sm:mt-10 text-center">
            <Link
              href="/abiturientlarga/qabul-komissiyasi"
              className="inline-flex items-center gap-2 rounded-lg sm:rounded-xl bg-blue-700 px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-blue-800 transition-colors"
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              {s("common.submit_docs", lang)}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
