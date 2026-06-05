import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { t } from "@/lib/translate";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  uz: {
    title: "O'qishni ko'chirish va tiklash",
    description: "ToshDTU Termiz filialida o'qishni ko'chirish va tiklash tartibi — kerakli hujjatlar, muddatlar, shartlar.",
  },
  ru: {
    title: "Перевод и восстановление обучения",
    description: "Порядок перевода и восстановления обучения в Термезском филиале ТашГосМУ — документы, сроки, условия.",
  },
  en: {
    title: "Transfer and Restoration of Studies",
    description: "Transfer and restoration of studies at TashSMU Termez Branch — required documents, deadlines, conditions.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const meta = META_BY_LOCALE[lang] || META_BY_LOCALE.uz;
  return buildMetadata("oqishni-kochirish", {
    path: "/abiturientlarga/oqishni-kochirish-va-tiklash",
    locale: lang,
    title: meta.title,
    description: meta.description,
  });
}

async function getTransferContent(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/v1/site-contents/applicants`,
      { next: { revalidate: 60, tags: ["site-contents"] } }
    );
    if (!res.ok) return { title: "", text: "" };
    const json = await res.json();
    const contents = json.data || [];
    const titleItem = contents.find((c: { key: string }) => c.key === "applicants_transfer_title");
    const textItem = contents.find((c: { key: string }) => c.key === "applicants_transfer_text");
    return {
      title: titleItem ? t(titleItem.value, lang) : "",
      text: textItem ? t(textItem.value, lang) : "",
    };
  } catch {
    return { title: "", text: "" };
  }
}

export default async function OqishniKochirishPage() {
  const lang = await getLanguage();
  const { title, text } = await getTransferContent(lang);

  const displayTitle = title || s("nav.oqishni_kochirish", lang);
  const displayText = text || s("applicants.transfer_text_fallback", lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <section aria-labelledby="transfer-heading">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { label: s("nav.abiturientlarga", lang), href: `/${lang}/abiturientlarga` },
                { label: s("nav.oqishni_kochirish", lang) },
              ]}
            />
          </div>

          <h1 id="transfer-heading" className="font-serif text-2xl font-semibold leading-tight sm:text-[32px] lg:text-5xl first-letter:capitalize mb-6">
            {displayTitle}
          </h1>

          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
            <div
              lang={lang}
              className="text-base text-gray-700 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-2 [&_li]:mb-1.5 [&_strong]:font-semibold [&_strong]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayText) }}
            />
          </div>
        </section>
      </Container>
    </div>
  );
}
