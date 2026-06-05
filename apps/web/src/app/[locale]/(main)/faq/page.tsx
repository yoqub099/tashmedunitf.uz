import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import FAQContent from "@/components/faq/FAQContent";
import { getFaqs } from "@/lib/services";
import type { Metadata } from "next";
import { buildMetadata, getFAQSchema } from "@/lib/seo";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { getLanguage } from "@/lib/language";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("faq", { path: "/faq", locale: lang });
}

export default async function FAQPage() {
  const lang = await getLanguage();

  const res = await getFaqs({ per_page: 50, "filter[general]": 1 }).catch(() => ({
    success: false,
    data: [] as any[],
    meta: { current_page: 1, last_page: 1, per_page: 50, total: 0 },
  }));

  const faqs = res.data;

  // FAQ schema for Google Rich Results
  const faqSchemaItems = faqs
    .filter((faq: any) => t(faq.question, lang) && t(faq.answer, lang))
    .map((faq: any) => ({
      question: t(faq.question, lang) || "",
      answer: (t(faq.answer, lang) || "").replace(/<[^>]*>/g, ""),
    }));
  const faqSchema = faqSchemaItems.length > 0 ? getFAQSchema(faqSchemaItems) : null;

  return (
    <div className="pt-20 lg:pt-24">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Container as="section" className="py-8 md:py-12">
        <Breadcrumb items={[{ label: s("nav.faq", lang) }]} />

        <FAQContent faqs={faqs} />
      </Container>
    </div>
  );
}
