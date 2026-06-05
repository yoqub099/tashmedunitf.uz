import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import StudentWorkForm from "./StudentWorkForm";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("talaba-ishlari", { path: "/talabalarga/talaba-ishlari", locale: lang });
}

export default async function TalabaIshlariPage() {
  const lang = await getLanguage();

  return (
    <div className="pt-20 lg:pt-24">
      <Container as="section" className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.talaba_ishlari", lang)}
        </h2>
        <Breadcrumb
          items={[
            { label: s("nav.talabalarga", lang), href: `/${lang}/talabalarga` },
            { label: s("nav.talaba_ishlari", lang) },
          ]}
        />
        <div className="mt-6">
          <div className="space-y-6 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
            <h5 className="font-serif text-xl font-semibold">
              {s("students.work_subtitle", lang)}
            </h5>
            <StudentWorkForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
