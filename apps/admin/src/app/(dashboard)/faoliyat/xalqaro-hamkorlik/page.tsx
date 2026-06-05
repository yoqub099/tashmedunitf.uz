import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Xalqaro hamkorlik — Admin" };

export default function XalqaroHamkorlikPage() {
  return (
    <StaticPageAdmin
      slug="xalqaro-hamkorlik"
      title="Xalqaro hamkorlik"
      description="Xalqaro aloqalar va hamkorlik dasturlari — tahrirlash, rasm va hujjat yuklash"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Xalqaro hamkorlik" },
      ]}
    />
  );
}
