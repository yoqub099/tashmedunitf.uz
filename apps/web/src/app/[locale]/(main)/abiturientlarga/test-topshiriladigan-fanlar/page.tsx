import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import { t } from "@/lib/translate";
import { translateExamSubject } from "@/lib/exam-subjects-i18n";

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  uz: {
    title: "Test topshiriladigan fanlar",
    description: "ToshDTU Termiz filialiga kirish uchun test topshiriladigan fanlar majmuasi — har bir yo'nalish bo'yicha imtihon fanlari ro'yxati.",
  },
  ru: {
    title: "Предметы вступительных испытаний",
    description: "Перечень предметов вступительных испытаний в Термезский филиал ТашГосМУ — по каждому направлению подготовки.",
  },
  en: {
    title: "Entrance Exam Subjects",
    description: "List of entrance exam subjects for TashSMU Termez Branch — required subjects per study program.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const meta = META_BY_LOCALE[lang] || META_BY_LOCALE.uz;
  return buildMetadata("test-topshiriladigan-fanlar", {
    path: "/abiturientlarga/test-topshiriladigan-fanlar",
    locale: lang,
    title: meta.title,
    description: meta.description,
  });
}

/* ───── Types ───── */
interface DirectionItem {
  id: number;
  name: { uz?: string; ru?: string; en?: string };
  exam_subjects?: string[];
}

interface FacultyItem {
  id: number;
  name: { uz?: string; ru?: string; en?: string };
  is_active: boolean;
  sort_order: number;
  directions?: DirectionItem[];
}

/* ───── Data fetching ───── */
async function getFaculties(): Promise<FacultyItem[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/v1/faculties?per_page=100`,
      { next: { revalidate: 60, tags: ["faculties", "directions"] } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).filter(
      (f: FacultyItem) =>
        f.is_active && f.directions && f.directions.length > 0
    );
  } catch {
    return [];
  }
}

/* ───── SVG Icons ───── */
const GlobeIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M14 24.5C8.2005 24.5 3.5 19.7995 3.5 14C3.5 8.2005 8.2005 3.5 14 3.5C19.7995 3.5 24.5 8.2005 24.5 14"
      stroke="#131313"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.09497 10.5H23.7766"
      stroke="#131313"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.09497 17.5H14"
      stroke="#131313"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.6667 14C18.6667 10.7753 17.8232 7.55062 16.1386 4.73662C15.1504 3.08812 12.8497 3.08812 11.8627 4.73662C8.49107 10.3658 8.49107 17.6353 11.8627 23.2645C12.3562 24.0881 13.1787 24.5011 14.0012 24.5011"
      stroke="#131313"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.3649 22.365L25.2874 21.196C25.8019 20.9907 25.7902 20.258 25.2699 20.0678L18.3095 17.5373C17.8289 17.3623 17.3634 17.829 17.5372 18.3097L20.0677 25.27C20.2567 25.7915 20.9894 25.802 21.1959 25.2875L22.3649 22.365Z"
      stroke="#131313"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TriangleIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M13.9 3L1 25.2H4.8L13.9 9.2L23.2 25.2H26.8L13.9 3Z"
      fill="#00575B"
    />
    <path
      d="M14 15.6L8.4 25.2H12.2L14 21.8L16.1 25.2H19.7L14 15.6Z"
      fill="#00575B"
    />
  </svg>
);

/* ───── Page component ───── */
export default async function TestFanlarPage() {
  const lang = await getLanguage();
  const faculties = await getFaculties();

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: s("nav.abiturientlarga", lang), href: `/${lang}/abiturientlarga` },
              { label: s("applicants.test_subjects_title", lang) },
            ]}
          />
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px] mb-6">
          {s("applicants.test_subjects_title", lang)}
        </h1>

        {/* Faculty groups */}
        <div className="space-y-6">
          {faculties.length === 0 && (
            <div className="rounded-2xl bg-gray-100 p-8 text-center text-gray-700">
              <p className="text-lg font-medium">
                {s("applicants.no_data_yet", lang)}
              </p>
            </div>
          )}

          {faculties.map((faculty) => (
            <section
              key={faculty.id}
              className="rounded-2xl p-4 md:p-6 lg:rounded-3xl w-full bg-gray-100"
              aria-labelledby={`faculty-${faculty.id}`}
            >
              {/* Faculty name */}
              <h2 id={`faculty-${faculty.id}`} className="font-serif text-lg font-semibold sm:text-2xl flex gap-2 sm:gap-3 items-start">
                <GlobeIcon />
                <span>{t(faculty.name, lang)}</span>
              </h2>

              {/* Directions grid */}
              <div className="mt-6 grid gap-4 md:grid-cols-2 auto-rows-fr">
                {(faculty.directions || []).map((direction) => (
                  <div
                    key={direction.id}
                    className="rounded-[20px] p-4 md:p-6 bg-white h-full"
                  >
                    {/* Direction name */}
                    <h3 className="font-serif text-sm font-semibold leading-tight sm:text-base lg:text-lg text-[#00575B] flex items-start gap-1.5 mb-4">
                      <TriangleIcon />
                      {t(direction.name, lang)}
                    </h3>

                    {/* Exam subjects */}
                    <ul className="mt-4 list-inside list-disc">
                      {(direction.exam_subjects || []).map(
                        (subject, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 sm:text-base"
                          >
                            {translateExamSubject(subject, lang)}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
