import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
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
  BarChart3,
  ArrowRight,
} from "lucide-react";

/* ── Level config ─────────────────────────────────── */
function getLevelMeta(level: string, lang: Language) {
  const meta: Record<string, { labelKey: string; path: string; descKey: string }> = {
    bakalavriat: {
      labelKey: "nav.bakalavriat",
      path: `/${lang}/abiturientlarga/bakalavriat`,
      descKey: "level.bakalavriat_desc",
    },
    ordinatura: {
      labelKey: "nav.ordinatura",
      path: `/${lang}/abiturientlarga/ordinatura`,
      descKey: "level.ordinatura_desc",
    },
    magistratura: {
      labelKey: "nav.magistratura",
      path: `/${lang}/abiturientlarga/magistratura`,
      descKey: "level.magistratura_desc",
    },
  };
  const m = meta[level] || meta.bakalavriat;
  return {
    label: s(m.labelKey, lang),
    path: m.path,
    description: s(m.descKey, lang),
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

function iconFor(code: string, idx: number) {
  return CODE_ICONS[code?.substring(0, 6)] ?? FALLBACK_ICONS[idx % FALLBACK_ICONS.length];
}

/* ── Strip subject/career HTML, get clean description ── */
function getCleanDescription(html: string | undefined): string {
  if (!html) return "";
  return html.replace(/<h3>[\s\S]*$/i, "").trim();
}

/* ── Color palette per card index ─────────────────── */
const CARD_COLORS = [
  { border: "border-[#00575B]", icon: "text-[#00575B]", bg: "bg-[#00575B]/5", tagBg: "bg-[#00575B]/10", tagText: "text-[#00575B]" },
  { border: "border-blue-600", icon: "text-blue-600", bg: "bg-blue-50", tagBg: "bg-blue-100", tagText: "text-blue-700" },
  { border: "border-purple-600", icon: "text-purple-600", bg: "bg-purple-50", tagBg: "bg-purple-100", tagText: "text-purple-700" },
  { border: "border-amber-600", icon: "text-amber-600", bg: "bg-amber-50", tagBg: "bg-amber-100", tagText: "text-amber-700" },
  { border: "border-rose-600", icon: "text-rose-600", bg: "bg-rose-50", tagBg: "bg-rose-100", tagText: "text-rose-700" },
  { border: "border-emerald-600", icon: "text-emerald-600", bg: "bg-emerald-50", tagBg: "bg-emerald-100", tagText: "text-emerald-700" },
];

/* ── Component ─────────────────────────────────────── */
interface Props {
  level: string;
  directions: Direction[];
  lang?: Language;
}

export default function DirectionLevelPage({ level, directions, lang = "uz" }: Props) {
  const meta = getLevelMeta(level, lang);
  const activeDirections = directions
    .filter((d) => d.level === level && d.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="pt-20 lg:pt-24">
      {/* ── Hero Section ─────────────────────── */}
      <section className="bg-linear-to-br from-[#00575B] to-[#003d40] text-white py-10 sm:py-16 lg:py-20">
        <Container>
          <Breadcrumb
            items={[
              { label: s("nav.abiturientlarga", lang), href: `/${lang}/abiturientlarga` },
              { label: meta.label },
            ]}
          />
          <h1 className="text-2xl font-bold sm:text-4xl lg:text-5xl mt-4">
            {meta.label}
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            {meta.description}
          </p>
          <div className="mt-6 flex items-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {activeDirections.length} {s("level.directions_count", lang)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {activeDirections[0]?.duration || "\u2014"}
            </span>
          </div>
        </Container>
      </section>

      {/* ── Directions Grid ──────────────────── */}
      <section className="py-10 sm:py-14 lg:py-16 bg-gray-50">
        <Container>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
            {s("level.directions", lang)}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-10">
            {s("level.directions_hint", lang)}
          </p>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {activeDirections.map((dir, idx) => {
              const Icon = iconFor(dir.code, idx);
              const name = t(dir.name, lang);
              const desc = getCleanDescription(t(dir.description, lang));
              const colors = CARD_COLORS[idx % CARD_COLORS.length];

              return (
                <Link
                  key={dir.id}
                  href={`${meta.path}/${dir.id}`}
                  className={`group block rounded-xl sm:rounded-2xl border-l-4 ${colors.border} bg-white p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* Title */}
                  <div className="flex items-start gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    <div className={`rounded-lg sm:rounded-xl p-2 sm:p-2.5 ${colors.bg}`}>
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#00575B] transition-colors">
                        {name}
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {dir.code}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {dir.duration}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 group-hover:text-[#00575B] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>

                  {/* Description excerpt */}
                  {desc && (
                    <div
                      className="text-xs sm:text-sm text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(desc) }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {activeDirections.length === 0 && (
            <div className="text-center py-12 sm:py-20">
              <GraduationCap className="h-10 w-10 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 text-sm sm:text-lg">
                {s("level.coming_soon", lang)}
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
