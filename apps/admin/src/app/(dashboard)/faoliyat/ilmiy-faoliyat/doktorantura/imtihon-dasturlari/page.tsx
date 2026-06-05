"use client";

import StaticPageAdmin from "@/components/templates/StaticPageAdmin";

export default function ImtihonDasturlariPage() {
  return (
    <StaticPageAdmin
      slug="imtihon-dasturlari"
      title="Imtihon dasturlari"
      description="Doktoranturaga kirish imtihon dasturlari"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Doktorantura", href: "/faoliyat/ilmiy-faoliyat/doktorantura" },
        { label: "Imtihon dasturlari" },
      ]}
    />
  );
}
