import Container from "@/components/shared/Container";
import Image from "next/image";
import type { SiteContent } from "@/types";
import { s, type Language } from "@/lib/i18n";
import { API_BASE } from "@/lib/api";
import {
  GraduationCap,
  Microscope,
  UserCheck,
  FlaskConical,
  Globe2,
  Library,
  BookOpen,
  Heart,
  Shield,
  Rocket,
  Star,
  Award,
} from "lucide-react";

/** SiteContent helper (til bo'yicha) */
function cv(contents: SiteContent[] | undefined, key: string, fallback: string, lang: Language): string {
  if (!contents) return fallback;
  const item = contents.find((c) => c.key === key);
  return item?.value?.[lang] || item?.value?.uz || fallback;
}

/** Available icons pool */
const AVAILABLE_ICONS = [
  GraduationCap, Microscope, UserCheck, FlaskConical, Globe2, Library,
  BookOpen, Heart, Shield, Rocket, Star, Award,
];

const GRADIENT_POOL = [
  { gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-200" },
  { gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-200" },
  { gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-200" },
  { gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-200" },
  { gradient: "from-teal-500 to-cyan-600", shadow: "shadow-teal-200" },
  { gradient: "from-rose-500 to-red-500", shadow: "shadow-rose-200" },
  { gradient: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-200" },
  { gradient: "from-pink-500 to-pink-600", shadow: "shadow-pink-200" },
  { gradient: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-200" },
  { gradient: "from-orange-500 to-red-500", shadow: "shadow-orange-200" },
  { gradient: "from-lime-500 to-green-600", shadow: "shadow-lime-200" },
  { gradient: "from-fuchsia-500 to-purple-600", shadow: "shadow-fuchsia-200" },
];

interface Props {
  advantagesContents?: SiteContent[];
  lang: Language;
}

export default function AdvantagesSection({ advantagesContents, lang }: Props) {
  const DEFAULT_TITLES = [
    s("adv.1", lang),
    s("adv.2", lang),
    s("adv.3", lang),
    s("adv.4", lang),
    s("adv.5", lang),
    s("adv.6", lang),
  ];
  const imageUrl = cv(advantagesContents, "advantages_image", "", lang);
  const imageSrc = imageUrl ? `${API_BASE}${imageUrl}` : "/images/advantages-hero.webp";

  // Dynamic item indices from DB content
  const itemIndices: number[] = [];
  if (advantagesContents) {
    advantagesContents.forEach((c) => {
      const match = c.key.match(/^advantages_item_(\d+)$/);
      if (match) itemIndices.push(parseInt(match[1], 10));
    });
    itemIndices.sort((a, b) => a - b);
  }
  // Fallback to default 6 items if no DB content
  const indices = itemIndices.length > 0 ? itemIndices : [0, 1, 2, 3, 4, 5];

  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <Container>
        {/* Section title - centered above */}
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl text-center mb-8 sm:mb-12">
          {cv(advantagesContents, "advantages_title", s("home.advantages_title", lang), lang)}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          {/* Left: Image */}
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl sm:rounded-3xl sm:max-w-120 md:max-w-none">
            <Image
              src={imageSrc}
              alt={s("adv.image_alt", lang)}
              fill
              className="object-cover"
              sizes="640px"
              priority={false}
            />
          </div>

          {/* Right: Content panel */}
          <div className="rounded-2xl lg:rounded-3xl bg-gray-50 p-6 sm:p-8 lg:p-14 space-y-6 sm:space-y-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-900 lg:text-[32px] leading-tight">
              {cv(advantagesContents, "advantages_subtitle", s("home.advantages_subtitle", lang), lang)}
            </h3>

            <ul className="flex flex-col gap-4 lg:gap-6 pb-2">
              {indices.map((index) => {
                const gIdx = index % GRADIENT_POOL.length;
                const IconComp = AVAILABLE_ICONS[index % AVAILABLE_ICONS.length];
                const style = GRADIENT_POOL[gIdx];
                return (
                  <li key={index} className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 lg:h-13 lg:w-13 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${style.gradient} ${style.shadow} shadow-md`}>
                      <IconComp className="h-5 w-5 lg:h-6 lg:w-6 text-white" strokeWidth={2} />
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight lg:text-xl">
                      {cv(advantagesContents, `advantages_item_${index}`, DEFAULT_TITLES[index] || `${s("adv.fallback", lang)} ${index + 1}`, lang)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
