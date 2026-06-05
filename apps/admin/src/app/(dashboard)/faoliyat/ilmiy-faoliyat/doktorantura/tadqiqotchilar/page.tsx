"use client";

import StaticPageAdmin from "@/components/templates/StaticPageAdmin";

export default function TadqiqotchilarPage() {
  return (
    <StaticPageAdmin
      slug="tadqiqotchilar"
      title="Tadqiqotchilar"
      description="Doktorantura va mustaqil tadqiqotchilar ro'yxati"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Doktorantura", href: "/faoliyat/ilmiy-faoliyat/doktorantura" },
        { label: "Tadqiqotchilar" },
      ]}
    />
  );
}
