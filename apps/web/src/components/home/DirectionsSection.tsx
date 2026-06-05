"use client";

import { useState, useMemo } from "react";
import Container from "@/components/shared/Container";
import Link from "@/components/shared/LocaleLink";
import { Faculty } from "@/types";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";
import {
  GraduationCap,
  Stethoscope,
  Building2,
  FlaskConical,
  Microscope,
  Pill,
  ArrowUpRight,
} from "lucide-react";

/* ── Faculty icon by keyword in name ───────────────── */
const FACULTY_ICONS: { keyword: string; icon: React.ElementType }[] = [
  { keyword: "tibbiyot", icon: Stethoscope },
  { keyword: "farmatsiya", icon: Pill },
  { keyword: "klinik", icon: Building2 },
  { keyword: "ilmiy", icon: Microscope },
  { keyword: "tadqiqot", icon: FlaskConical },
];

function iconForFaculty(name: string): React.ElementType {
  const lower = name.toLowerCase();
  for (const f of FACULTY_ICONS) {
    if (lower.includes(f.keyword)) return f.icon;
  }
  return GraduationCap;
}

/* ── Accent colors for each card ───────────────────── */
const CARD_ACCENTS = [
  { bg: "bg-blue-50", border: "border-l-blue-600", icon: "bg-blue-100 text-blue-700", tag: "bg-blue-50 text-blue-700 border-blue-200" },
  { bg: "bg-teal-50", border: "border-l-teal-600", icon: "bg-teal-100 text-teal-700", tag: "bg-teal-50 text-teal-700 border-teal-200" },
  { bg: "bg-emerald-50", border: "border-l-emerald-600", icon: "bg-emerald-100 text-emerald-700", tag: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { bg: "bg-indigo-50", border: "border-l-indigo-600", icon: "bg-indigo-100 text-indigo-700", tag: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

/* ── Component ─────────────────────────────────────── */
export default function DirectionsSection({
  faculties,
}: {
  faculties: Faculty[];
}) {
  const { language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<string>("bakalavriat");

  /* ── Tab config (dynamic labels) ──────────────────── */
  const tabs = useMemo(() => [
    { key: "bakalavriat" as const, label: s("tab.bakalavriat", language) },
    { key: "ordinatura" as const, label: s("tab.ordinatura", language) },
    { key: "magistratura" as const, label: s("tab.magistratura", language) },
  ], [language]);

  const firstNonEmpty = useMemo(
    () =>
      tabs.find((tb) => faculties.some((f) => f.level === tb.key))?.key ??
      "bakalavriat",
    [faculties, tabs],
  );
  const currentTab = faculties.some((f) => f.level === activeTab)
    ? activeTab
    : firstNonEmpty;

  const filtered = useMemo(
    () =>
      faculties
        .filter((f) => f.level === currentTab && f.is_active !== false)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [faculties, currentTab],
  );

  if (!faculties || faculties.length === 0) return null;

  return (
    <section className="pb-5 pt-6 lg:pb-10 lg:pt-10 bg-white" id="yonalishlar">
      <Container>
        {/* ── Header ───────────────────────────── */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px] text-center text-gray-900">
            {s("home.directions_title", language)}
          </h2>
        </div>

        {/* ── Tab Bar ──────────────────────────── */}
        <div role="tablist" className="flex w-full gap-4 overflow-x-auto pb-3">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <div key={tab.key} className="h-10 grow md:h-12">
                <button
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    relative w-full h-full rounded-full border text-sm md:text-base
                    font-bold transition-all duration-300 cursor-pointer
                    ${
                      isActive
                        ? "border-[#00575B] text-[#00575B] bg-white shadow-md"
                        : "border-gray-200 text-gray-400 bg-white hover:border-[#00575B] hover:text-[#00575B] hover:bg-[#00575B]/5"
                    }
                  `}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                      <span className="block h-3.5 w-3.5 rotate-45 border-b border-r border-[#00575B] bg-white" />
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Content Area ─────────────────────── */}
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl min-h-85 w-full bg-gray-50">
          {filtered.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((faculty, index) => {
                const Icon = iconForFaculty(t(faculty.name, language) || "");
                const name = t(faculty.name, language);
                const directions = faculty.directions || [];
                const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

                return (
                  <Link
                    key={faculty.id}
                    href={`/abiturientlarga/${faculty.level}/fakultet/${faculty.id}`}
                    className={`group relative rounded-2xl border-l-4 ${accent.border} bg-white p-5 md:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                  >
                    {/* Top row: icon + title + arrow */}
                    <div className="flex items-start gap-3">
                      <div className={`rounded-xl p-2.5 ${accent.icon} transition-colors duration-300`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-lg md:text-xl font-semibold text-gray-900 leading-snug">
                          {name}
                        </h5>
                        <p className="mt-0.5 text-sm text-gray-400">
                          {faculty.directions_count || directions.length} {s("level.directions_count", language)}
                        </p>
                      </div>
                      <span className="rounded-full border border-gray-200 p-1.5 group-hover:border-[#00575B] group-hover:bg-[#00575B] transition-colors duration-300">
                        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                      </span>
                    </div>

                    {/* Direction tags */}
                    {directions.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {directions.map((dir) => (
                          <span
                            key={dir.id}
                            className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${accent.tag} transition-colors duration-300`}
                          >
                            {t(dir.name, language)}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-70 text-center">
              <GraduationCap className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-400 text-lg font-medium">
                {s("directions.faculties_soon", language)}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {s("directions.contact_admission", language)}
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
