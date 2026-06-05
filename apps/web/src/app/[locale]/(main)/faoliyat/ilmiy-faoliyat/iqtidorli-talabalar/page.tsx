import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import { getTalentedStudents } from "@/lib/services";
import { decodeHtml } from "@/lib/utils";
import type { TalentedStudent } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("iqtidorli-talabalar", { path: "/faoliyat/ilmiy-faoliyat/iqtidorli-talabalar", locale: lang });
}

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || "?";
}

export default async function IqtidorliTalabalarPage() {
  const lang = await getLanguage();

  let students: TalentedStudent[] = [];
  try {
    const res = await getTalentedStudents({ per_page: 100 });
    students = Array.isArray(res?.data) ? res.data.filter((item) => item.is_active !== false) : [];
  } catch {
    students = [];
  }

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.iqtidorli_talabalar", lang)}
        </h2>

        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
            { label: s("nav.iqtidorli_talabalar", lang) },
          ]}
          className="mt-3"
        />

        {students.length === 0 ? (
          <div className="mt-8 rounded-md bg-gray-50 p-8 text-center text-gray-500">
            Ma&apos;lumot yo&apos;q
          </div>
        ) : (
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => {
              const name = decodeHtml(student.name?.[lang] ?? student.name?.uz);
              const description = decodeHtml(student.description?.[lang] ?? student.description?.uz);
              const photo = student.photo ?? null;

              return (
                <div
                  key={student.id}
                  className="rounded-md bg-gray-100 p-4 h-full"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-gray-200">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-3xl font-semibold text-gray-500">
                        {getInitials(name)}
                      </div>
                    )}
                  </div>

                  <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg mt-4">
                    {name}
                  </h6>

                  {description && (
                    <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                      {description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
