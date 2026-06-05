import DocumentDetailAdmin from "@/components/templates/DocumentDetailAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2022 — 2026-yillarga mo'ljallangan Yangi O'zbekistonning taraqqiyot strategiyasi — Admin",
};

export default function TaraqqiyotStrategiyasiPage() {
  return (
    <DocumentDetailAdmin
      title="2022 — 2026-yillarga mo'ljallangan Yangi O'zbekistonning taraqqiyot strategiyasi"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Prezident qarorlari", href: "/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari" },
        { label: "2022 — 2026-yillarga mo'ljallangan Yangi O'zbekistonning taraqqiyot strategiyasi" },
      ]}
      documents={[
        {
          title: "2022 — 2026-yillarga mo'ljallangan Yangi O'zbekistonning taraqqiyot strategiyasi",
          linkText: "O'zbekiston Respublikasi Prezidentining Farmoni, 28.01.2022 yildagi PF-60-son",
          linkUrl: "https://lex.uz/ru/docs/-5841063",
        },
      ]}
    />
  );
}
