import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import VideoPlayer from "@/components/shared/VideoPlayer";
import StudentLifeGallery from "@/components/talabalarga/StudentLifeGallery";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { api } from "@/lib/api";
import { getLanguage } from "@/lib/language";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("talabalarga", { path: "/talabalarga", locale: lang });
}

/* ══════════════════════════════════════════════════════════
   Types & Data
   ══════════════════════════════════════════════════════════ */
interface Translatable {
  uz?: string;
  ru?: string;
  en?: string;
}

interface TalentedStudentAPI {
  id: number;
  name: Translatable;
  description: Translatable;
  is_active: boolean;
  sort_order: number;
  photo?: string;
}

interface SiteMediaAPI {
  id: number;
  key: string;
  file_url: string;
  file_mime: string | null;
}

interface CareerCenterInfoAPI {
  id: number;
  title: Translatable;
  subtitle: Translatable;
  content: Translatable;
  address: Translatable;
  phone: string;
  email: string;
  is_active: boolean;
  sort_order: number;
}

interface StudentLifePhotoAPI {
  id: number;
  title: Translatable;
  photo: string | null;
  is_active: boolean;
  sort_order: number;
}

interface LibraryResourceAPI {
  id: number;
  title: Translatable;
  slug: string;
  description: Translatable;
  category: string;
  cover: string;
  cover_thumbnail: string;
  document: string | null;
  is_published: boolean;
}

interface TalentedStudentView {
  id: number;
  name: string;
  description: string;
  initials: string;
  photo?: string;
  color: string;
}

const COLORS = [
  "bg-rose-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-cyan-500",
];

/* ══════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════ */
function ArrowIcon({ size = 20 }: { size?: number }) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15.5578 11.1104L12.0004 14.6678L8.44287 11.1104" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.0002 3.99707L12.0002 14.6685" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.0032 16.4463C20.0032 18.411 18.4105 20.0038 16.4458 20.0038H7.55406C5.58932 20.0038 3.99658 18.411 3.99658 16.4463" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookCard({ book, lang }: { book: LibraryResourceAPI; lang: string }) {
  const title = t(book.title, lang) || s("students.unnamed", lang as any);
  const description = t(book.description, lang);

  return (
    <div className="flex gap-3 sm:gap-4 rounded-2xl bg-gray-50 !p-4 text-gray-900 md:p-6 lg:rounded-3xl">
      {book.cover_thumbnail ? (
        <div className="w-24 sm:w-40 h-36 sm:h-55 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
          <img
            alt={title}
            loading="lazy"
            className="h-full w-full object-contain object-top"
            src={book.cover_thumbnail}
          />
        </div>
      ) : (
        <div className="flex h-36 sm:h-55 w-24 sm:w-40 shrink-0 items-center justify-center rounded-2xl bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        </div>
      )}
      <div className="flex flex-col">
        <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
          {title}
        </h6>
        <p className="mt-2 line-clamp-3 text-sm text-gray-500">{description}</p>
        <div className="mt-auto pt-3">
          {book.document ? (
            <a
              href={book.document}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#00575B] px-4 text-sm text-[#00575B] transition-colors hover:bg-[#00575B]/5"
            >
              <span>{s("common.download", lang as any)}</span>
              <DownloadIcon />
            </a>
          ) : (
            <span className="inline-flex h-10 items-center gap-1.5 rounded-full border border-gray-300 px-4 text-sm text-gray-400">
              <span>{s("lib.no_file", lang as any)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentCard({ student }: { student: TalentedStudentView }) {
  return (
    <div className="relative rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl bg-[url(/images/TwoChevronUp.svg)] bg-cover bg-position-[right_-112px_top_-48px] bg-no-repeat overflow-hidden">
      <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
        {student.name}
      </h6>
      <div className="flex">
        <p className="mt-2 line-clamp-5 flex-1 text-sm text-gray-500">
          {student.description}
        </p>
        {student.photo ? (
          <div className="-mb-6 -mr-6 h-36 w-28 sm:h-50 sm:w-62.5 shrink-0 overflow-hidden rounded-ee-3xl bg-gray-100">
            <img
              src={student.photo}
              alt={student.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className={`${student.color} -mb-6 -mr-6 flex h-36 w-28 sm:h-50 sm:w-62.5 shrink-0 items-center justify-center rounded-ee-3xl text-2xl sm:text-4xl font-bold text-white`}
          >
            {student.initials}
          </div>
        )}
      </div>
    </div>
  );
}



/* ══════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════ */
export default async function StudentsPage() {
  const lang = await getLanguage();

  /* ── Fetch talented students from API ── */
  let students: TalentedStudentView[] = [];
  let videoUrl: string | null = null;
  let careerInfo: CareerCenterInfoAPI | null = null;
  let galleryPhotos: StudentLifePhotoAPI[] = [];
  let libraryBooks: LibraryResourceAPI[] = [];
  try {
    const [studentsRes, videoRes, careerRes, galleryRes, libraryRes] = await Promise.all([
      api.get<{ data: TalentedStudentAPI[] }>("/v1/talented-students", {
        tags: ["talented-students"],
      }),
      api.get<{ data: SiteMediaAPI }>("/v1/site-media/talabalar_kengashi_video", {
        tags: ["site-media"],
      }),
      api.get<{ data: CareerCenterInfoAPI[] }>("/v1/career-center-infos", {
        tags: ["career-center-infos"],
      }),
      api.get<{ data: StudentLifePhotoAPI[] }>("/v1/student-life-photos", {
        tags: ["student-life-photos"],
      }),
      api.get<{ data: LibraryResourceAPI[] }>("/v1/library-resources", {
        params: { per_page: 5 },
        tags: ["library-resources"],
      }),
    ]);
    students = (studentsRes.data || []).map((st, idx) => ({
      id: st.id,
      name: t(st.name, lang) || s("students.unnamed", lang),
      description: t(st.description, lang),
      initials: (t(st.name, lang) || "?")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      photo: st.photo,
      color: COLORS[idx % COLORS.length],
    }));
    videoUrl = videoRes.data?.file_url || null;
    const activeCareer = (careerRes.data || []).find((c) => c.is_active);
    careerInfo = activeCareer || (careerRes.data || [])[0] || null;
    galleryPhotos = (galleryRes.data || []).filter((p) => p.is_active);
    libraryBooks = (libraryRes.data || []).filter((b) => b.is_published).slice(0, 5);
  } catch {
    // Fallback — show empty if API fails
  }

  return (
    <div className="pt-20 lg:pt-24">
      <Container as="section" className="py-8 sm:py-12">
        <Breadcrumb items={[{ label: s("nav.talabalarga", lang) }]} />

        {/* ═══ HERO: Students + Sidebar ═══ */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="font-serif text-2xl font-semibold leading-tight capitalize sm:text-[32px] lg:text-5xl">
              {s("students.talented", lang)}
            </h1>
            <p className="mt-4 text-gray-500">
              {s("students.talented_desc", lang)}
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {students.length > 0 ? (
                students.map((st) => (
                  <StudentCard key={st.id} student={st} />
                ))
              ) : (
                <p className="col-span-2 text-sm text-gray-400 italic">
                  {s("students.no_talented", lang)}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h5 className="font-serif text-xl font-semibold">{s("students.council", lang)}</h5>
            <p className="mt-2 text-sm text-gray-500">
              {s("students.council_desc", lang)}
            </p>

            <div className="mt-4 overflow-hidden rounded-3xl">
              {videoUrl ? (
                <VideoPlayer src={videoUrl} />
              ) : (
                <div className="flex h-56 sm:h-96 w-full items-center justify-center rounded-3xl bg-gray-200">
                  <p className="text-sm text-gray-400">{s("students.video_empty", lang)}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: Karyera markazi ═══ */}
        <section className="mt-10 sm:mt-16 lg:mt-20">
          <h2 className="text-center font-serif text-xl font-semibold leading-tight sm:text-2xl md:text-[32px] lg:text-[40px]">
            {s("career.title", lang)}
          </h2>
          <p className="text-center text-gray-500">
            {s("career.subtitle", lang)}
          </p>

          <div className="mt-5 sm:mt-8 grid items-end gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="rounded-2xl p-4 text-gray-900 md:p-6 lg:rounded-3xl bg-gray-50 lg:col-span-2">
              <div className="flex flex-col">
                <h4 className="font-serif text-lg font-semibold sm:text-2xl">
                  {t(careerInfo?.title, lang) || s("career.title", lang)}
                </h4>
                <p className="mt-4 whitespace-pre-line">
                  {t(careerInfo?.content, lang) || s("common.no_data", lang)}
                </p>
                <Link href={`/${lang}/talabalarga/karyera-markazi`} className="ml-auto mt-6 flex items-center text-sm text-[#00575B]">
                  <span className="mr-2">{s("common.view_all", lang)}</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl">
              <h4 className="font-serif text-lg font-semibold sm:text-2xl">{s("nav.aloqa", lang)}</h4>
              <div className="mb-6 mt-4 space-y-3 text-sm text-gray-500">
                <p className="flex items-start gap-2">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" className="mt-0.5 shrink-0">
                    <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
                  </svg>
                  <span>{t(careerInfo?.address, lang) || s("career.default_address", lang)}</span>
                </p>
                <p className="flex items-center gap-2">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" className="shrink-0">
                    <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" />
                  </svg>
                  <span>{careerInfo?.phone || "+998 (76) 221-00-51"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" className="shrink-0">
                    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" />
                  </svg>
                  <span>{careerInfo?.email || "info@TdTUTF.uz"}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>

      {/* ═══ SECTION 3: Talabalar hayoti (full-width Swiper) ═══ */}
      <section className="mt-10 sm:mt-16 overflow-hidden lg:mt-20">
        <div className="text-center px-4">
          <h2 className="font-serif text-xl font-semibold leading-tight sm:text-2xl md:text-[32px] lg:text-[40px]">
            {s("students.life", lang)}
          </h2>
          <p className="mb-4 mt-2 text-gray-500 lg:mb-8">
            {s("students.life_desc", lang)}
          </p>
        </div>

        {galleryPhotos.length > 0 ? (
          <StudentLifeGallery photos={galleryPhotos} />
        ) : (
          <div className="mx-auto flex h-72 max-w-3xl items-center justify-center rounded-3xl bg-gray-100">
            <p className="text-sm text-gray-400 italic">{s("students.gallery_empty", lang)}</p>
          </div>
        )}
      </section>

      {/* ═══ SECTION 4: Kutubxona ═══ */}
      <Container as="section" className="mt-10 pb-10 sm:mt-16 sm:pb-16 lg:mt-20">
        <h2 className="text-center font-serif text-xl font-semibold leading-tight sm:text-2xl md:text-[32px] lg:text-[40px]">
          {s("nav.kutubxona", lang)}
        </h2>
        <p className="text-center text-gray-500">
          {s("career.subtitle", lang)}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {libraryBooks.length > 0 ? (
            libraryBooks.map((book) => (
              <BookCard key={book.id} book={book} lang={lang} />
            ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 sm:gap-4 rounded-2xl bg-gray-50 !p-4 text-gray-900 md:p-6 lg:rounded-3xl">
                <div className="flex h-55 w-24 sm:w-40 shrink-0 items-center justify-center rounded-2xl bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <div className="h-5 w-32 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-24 rounded bg-gray-100" />
                  <div className="mt-auto pt-3">
                    <span className="inline-flex h-10 items-center gap-1.5 rounded-full border border-gray-300 px-4 text-sm text-gray-400">
                      {s("lib.no_file", lang)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Barchasini ko'rish card */}
          <div className="relative flex h-52 sm:h-63 flex-col rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl overflow-hidden">
            <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
              {s("common.view_all", lang)}
            </h6>
            <Image
              alt={s("nav.kutubxona", lang)}
              loading="lazy"
              width={292}
              height={218}
              className="absolute bottom-0 left-0 max-w-[70%] sm:max-w-none"
              src="/images/ebooks_img6.png"
              style={{ color: "transparent" }}
            />
            <div className="flex h-full w-full items-end justify-end">
              <Link
                href={`/${lang}/talabalarga/kutubxona`}
                className="mt-auto rounded-full border border-[#00575B] bg-transparent p-4 text-[#00575B] transition-colors hover:bg-[#00575B]/5"
              >
                <ArrowIcon size={36} />
              </Link>
            </div>
          </div>
        </div>
      </Container>

    </div>
  );
}
