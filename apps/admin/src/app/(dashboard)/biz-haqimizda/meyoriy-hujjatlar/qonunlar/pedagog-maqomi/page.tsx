import DocumentDetailAdmin from "@/components/templates/DocumentDetailAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedagogning maqomi to'g'risida Qonun — Admin",
};

export default function PedagogMaqomiPage() {
  return (
    <DocumentDetailAdmin
      title="O'zbekiston Respublikasining Qonuni Pedagogning maqomi to'g'risida"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "O'zbekiston Respublikasi Qonunlari", href: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar" },
        { label: "O'zbekiston Respublikasining Qonuni Pedagogning maqomi to'g'risida" },
      ]}
      documents={[
        {
          title: "O'zbekiston Respublikasining Qonuni Pedagogning maqomi to'g'risida",
          linkText: "O'zbekiston Respublikasining Qonuni Pedagogning maqomi to'g'risida",
          linkUrl: "https://lex.uz/uz/docs/-6786401",
        },
      ]}
    />
  );
}
