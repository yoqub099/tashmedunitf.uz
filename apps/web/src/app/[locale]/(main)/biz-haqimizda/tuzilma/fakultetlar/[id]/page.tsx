import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getFacultyById, getStaff, getDepartments } from "@/lib/services";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Staff } from "@/types";
import { SITE_URL, SITE_NAME_UZ, SITE_NAME_RU, SITE_NAME_EN, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { getLanguage } from "@/lib/language";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lang = await getLanguage();
  const path = `/biz-haqimizda/tuzilma/fakultetlar/${id}`;
  const ogLocale = lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "uz_UZ";
  const siteName = lang === "ru" ? SITE_NAME_RU : lang === "en" ? SITE_NAME_EN : SITE_NAME_UZ;
  const res = await getFacultyById(Number(id)).catch(() => null);
  const name = t(res?.data?.name, lang) || s("meta.faculty_fallback", lang);
  const description = t(res?.data?.description, lang)?.replace(/<[^>]*>/g, "").slice(0, 155) || `${name} — ${s("meta.faculty_desc_fallback", lang)}`;
  const title = `${name} | TdTUTF`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${lang}${path}`, languages: { uz: `${SITE_URL}/uz${path}`, ru: `${SITE_URL}/ru${path}`, en: `${SITE_URL}/en${path}` } },
    openGraph: { title, description, url: `${SITE_URL}/${lang}${path}`, siteName, locale: ogLocale, alternateLocale: ["uz_UZ", "ru_RU", "en_US"].filter((l) => l !== ogLocale), type: "website", images: [{ url: res?.data?.image || DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [res?.data?.image || DEFAULT_OG_IMAGE] },
  };
}

/* ── SVG Icons (ISFT original) ── */
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.24887 2.49805V4.99909" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7518 2.49805V4.99909" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.33283 17.5038H4.99811C3.61682 17.5038 2.49707 16.384 2.49707 15.0027V6.24909C2.49707 4.8678 3.61682 3.74805 4.99811 3.74805H15.0023C16.3836 3.74805 17.5033 4.8678 17.5033 6.24909V8.33329" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.6631 12.4863V13.9519L14.8152 14.6547" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7516 17.5031C12.7566 17.5031 11.8023 17.108 11.0987 16.4044C10.3952 15.7008 10 14.7466 10 13.7516C10.0308 11.6912 11.6945 10.029 13.7549 10C15.0952 10.0006 16.3334 10.7162 17.003 11.8772C17.6726 13.0383 17.672 14.4683 17.0013 15.6288C16.3307 16.7892 15.0919 17.5037 13.7516 17.5031" stroke="#4B4A4A" strokeWidth="1.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" />
    </svg>
  );
}

/* ── Staff card (ISFT style) ── */
function StaffCard({ staff, lang }: { staff: Staff; lang: Language }) {
  const fullName = t(staff.full_name, lang) || "";
  const position = t(staff.position, lang) || "";

  return (
    <div className="rounded-2xl bg-white p-4 md:p-6 lg:rounded-3xl col-span-full md:col-span-2">
      <div className="grid gap-6 md:grid-cols-4">
        {staff.photo ? (
          <Image
            alt={fullName}
            width={400}
            height={400}
            className="h-full w-full rounded-xl object-cover md:col-span-1"
            src={staff.photo}
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gray-200 md:col-span-1">
            <span className="text-5xl font-bold text-gray-400">{fullName.charAt(0)}</span>
          </div>
        )}

        <div className="md:col-span-3">
          <h2 className="text-[20px] font-bold text-[#00575B]">{position}</h2>
          <p className="text-gray-500">{fullName}</p>

          <div className="mt-4 flex flex-col gap-2 sm:mt-8">
            <div className="flex w-full flex-col sm:flex-row sm:justify-between">
              <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                <CalendarIcon />
                <div>{s("dept.reception", lang)}:</div>
              </div>
              <div className="mx-2 hidden flex-grow border-b border-dashed border-gray-300 sm:block" />
              <div className="text-[14px] sm:text-right">{s("dept.reception_default", lang)}</div>
            </div>

            <div className="flex w-full flex-col sm:flex-row sm:justify-between">
              <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                <PhoneIcon />
                <div>{s("dept.phone", lang)}:</div>
              </div>
              <div className="mx-2 hidden flex-grow border-b border-dashed border-gray-300 sm:block" />
              <div className="text-[14px] sm:text-right">{staff.phone || ""}</div>
            </div>

            <div className="flex w-full flex-col sm:flex-row sm:justify-between">
              <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                <EmailIcon />
                <div>{s("dept.email", lang)}:</div>
              </div>
              <div className="mx-2 hidden flex-grow border-b border-dashed border-gray-300 sm:block" />
              <div className="break-all text-[14px] sm:text-right">{staff.email || ""}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default async function FacultyDetailPage({ params }: Props) {
  const { id } = await params;
  const lang = await getLanguage();
  const facultyId = Number(id);

  const [facultyRes, staffRes, deptRes] = await Promise.all([
    getFacultyById(facultyId).catch(() => null),
    getStaff({ per_page: 50 }).catch(() => null),
    getDepartments({ per_page: 50 }).catch(() => null),
  ]);

  const faculty = facultyRes?.data;
  if (!faculty) return notFound();

  const name = t(faculty.name, lang);
  const description = t(faculty.description, lang);
  const directions = faculty.directions || [];

  const allStaff = staffRes?.data || [];
  const allDepts = deptRes?.data || [];

  // Normalize: remove common words, parentheses, numbers, split into significant words
  const stopWords = ["va", "ishi", "fanlar", "fanlar\u0131", "bolimi", "davlat", "uchun"];
  function normalize(str: string): string[] {
    return str
      .toLowerCase()
      .replace(/kafedrasi/g, "")
      .replace(/kafedra/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\d+/g, "")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.includes(w));
  }

  // Check if two names match: the primary (longest) word must match
  function namesMatch(a: string, b: string): boolean {
    const wordsA = normalize(a);
    const wordsB = normalize(b);
    if (wordsA.length === 0 || wordsB.length === 0) return false;
    // Primary word = longest word in the shorter list
    const shorter = wordsA.length <= wordsB.length ? wordsA : wordsB;
    const longer = wordsA.length <= wordsB.length ? wordsB : wordsA;
    const primary = shorter.reduce((a, b) => a.length >= b.length ? a : b, "");
    // Primary word must be found in the longer list
    const primaryFound = longer.some((w) => w.includes(primary) || primary.includes(w));
    if (!primaryFound) return false;
    // At least 50% of shorter words must match
    const shared = shorter.filter((w) => longer.some((lw) => lw.includes(w) || w.includes(lw)));
    return shared.length >= Math.max(1, Math.ceil(shorter.length * 0.5));
  }

  // Match departments to directions by word similarity
  const facultyDeptIds = allDepts
    .filter((dept) => {
      const deptName = t(dept.name, "uz") || "";
      return directions.some((dir) => namesMatch(deptName, t(dir.name, "uz") || ""));
    })
    .map((dept) => dept.id);

  // Staff from matched departments
  const facultyStaff = allStaff
    .filter((staffItem) => staffItem.department && facultyDeptIds.includes(staffItem.department.id))
    .sort((a, b) => a.sort_order - b.sort_order);

  // Matched departments
  const facultyDepts = allDepts.filter((dept) => facultyDeptIds.includes(dept.id));

  // Build kafedra list: matched depts + unmatched directions as additional items
  const unmatchedDirections = directions.filter((dir) => {
    const dirName = t(dir.name, "uz") || "";
    return !facultyDepts.some((dept) => namesMatch(t(dept.name, "uz") || "", dirName));
  });

  return (
    <div className="pt-20 lg:pt-24">
      <Container as="section" className="py-6">
        {/* Title + Breadcrumb */}
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {name}
        </h2>
        <Breadcrumb
          items={[
            { label: s("breadcrumb.home", lang), href: `/${lang}` },
            { label: s("breadcrumb.structure", lang), href: `/${lang}/biz-haqimizda/tuzilma` },
            { label: s("breadcrumb.faculties", lang), href: `/${lang}/biz-haqimizda/tuzilma/fakultetlar` },
            { label: name },
          ]}
          className="mt-3"
        />

        <div className="mt-6 space-y-6">
          {/* Hero Banner */}
          {faculty.image ? (
            <div className="relative my-6 h-[200px] sm:h-[300px] md:h-[400px]">
              <Image
                src={faculty.image}
                alt={name}
                fill
                priority
                sizes="100vw"
                className="rounded-2xl object-cover lg:rounded-3xl"
              />
              {description && (
                <div className="absolute bottom-6 right-6 top-6 hidden w-[496px] flex-col items-start gap-4 self-stretch rounded-2xl bg-[rgba(13,13,13,0.20)] p-6 text-white backdrop-blur-[36px] lg:flex">
                  <h4 className="font-serif text-2xl font-semibold flex gap-3">
                    <span>{s("faculty.description", lang)}</span>
                  </h4>
                  <div className="line-clamp-[10] text-sm leading-relaxed">
                    {description}
                  </div>
                </div>
              )}
            </div>
          ) : description ? (
            <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
              <h4 className="font-serif text-2xl font-semibold flex gap-3 mb-4">
                <span>{s("faculty.description", lang)}</span>
              </h4>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          ) : null}

          {/* Faculty Administration */}
          {facultyStaff.length > 0 && (
            <>
              <h3 className="font-serif text-2xl font-semibold lg:text-[32px]">
                {s("faculty.administration", lang)}
              </h3>
              <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl space-y-4 bg-gray-100 md:col-span-2">
                <div className="grid gap-6 md:grid-cols-4">
                  {facultyStaff.map((staffItem) => (
                    <StaffCard key={staffItem.id} staff={staffItem} lang={lang} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Faculty Departments */}
          {(facultyDepts.length > 0 || unmatchedDirections.length > 0) && (
            <>
              <h3 className="font-serif text-2xl font-semibold lg:text-[32px]">
                {s("faculty.departments", lang)}
              </h3>
              <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
                <div className="grid w-full gap-4 md:gap-6 md:grid-cols-4">
                  <div className="flex h-auto flex-col md:col-span-2">
                    <h5 className="font-serif text-lg font-semibold sm:text-xl">{name}</h5>
                  </div>
                  <div className="flex items-start md:items-center md:col-span-2">
                    <div className="mx-4 h-24 w-px border-l-2 hidden md:block" />
                    <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2">
                      {facultyDepts.map((dept) => (
                        <Link
                          key={`dept-${dept.id}`}
                          href={`/${lang}/biz-haqimizda/tuzilma/kafedralar/${dept.slug}`}
                          className="min-h-[44px] flex items-center text-[#00575B] mr-4 text-sm hover:underline"
                        >
                          {t(dept.name, lang)}
                        </Link>
                      ))}
                      {unmatchedDirections.map((dir) => (
                        <Link
                          key={`dir-${dir.id}`}
                          href={`/${lang}/abiturientlarga/${dir.level || "bakalavriat"}/${dir.id}`}
                          className="min-h-[44px] flex items-center text-[#00575B] mr-4 text-sm hover:underline"
                        >
                          {t(dir.name, lang)} {s("faculty.dept_kafedrasi", lang)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
