import DocumentDetailAdmin from "@/components/templates/DocumentDetailAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institut nizomi — Admin",
};

export default function InstitutNizomiPage() {
  return (
    <DocumentDetailAdmin
      title="Institut nizomi"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Filial nizomi", href: "/biz-haqimizda/meyoriy-hujjatlar/nizom" },
        { label: "Institut nizomi" },
      ]}
      documents={[
        {
          title: "Institut nizomi",
          downloadUrl: "#",
        },
      ]}
    />
  );
}
