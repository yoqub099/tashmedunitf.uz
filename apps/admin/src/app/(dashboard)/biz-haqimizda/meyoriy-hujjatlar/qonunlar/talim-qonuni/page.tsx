import DocumentDetailAdmin from "@/components/templates/DocumentDetailAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O'zbekiston Respublikasining Ta'lim to'g'risidagi Qonuni — Admin",
};

export default function TalimQonuniPage() {
  return (
    <DocumentDetailAdmin
      title="O'zbekiston Respublikasining Ta'lim to'g'risidagi Qonuni"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "O'zbekiston Respublikasi Qonunlari", href: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar" },
        { label: "O'zbekiston Respublikasining Ta'lim to'g'risidagi Qonuni" },
      ]}
      documents={[
        {
          title: "O'zbekiston Respublikasining Ta'lim to'g'risidagi Qonuni",
          linkText: "O'zbekiston Respublikasining Ta'lim to'g'risidagi Qonuni",
          linkUrl: "https://lex.uz/docs/-5013007",
        },
      ]}
    />
  );
}
