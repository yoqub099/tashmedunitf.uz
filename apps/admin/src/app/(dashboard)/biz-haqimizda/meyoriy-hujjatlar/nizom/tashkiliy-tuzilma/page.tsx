import DocumentDetailAdmin from "@/components/templates/DocumentDetailAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tashkiliy tuzilma — Admin",
};

export default function TashkiliyTuzilmaPage() {
  return (
    <DocumentDetailAdmin
      title="Tashkiliy tuzilma"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Filial nizomi", href: "/biz-haqimizda/meyoriy-hujjatlar/nizom" },
        { label: "Tashkiliy tuzilma" },
      ]}
      documents={[
        {
          title: "Tashkiliy tuzilma",
          downloadUrl: "#",
        },
      ]}
    />
  );
}
