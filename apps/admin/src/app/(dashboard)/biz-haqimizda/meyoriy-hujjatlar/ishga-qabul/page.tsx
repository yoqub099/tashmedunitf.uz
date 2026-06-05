import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ishga qabul qilish tartibi — Admin" };

export default function IshgaQabulPage() {
  return (
    <StaticPageAdmin
      slug="ishga-qabul"
      title="Ishga qabul qilish tartibi va hujjatlari"
      description="Ishga qabul qilish nizomi va institutning kadrlar faoliyatiga oid siyosati"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Ishga qabul" },
      ]}
      defaultItems={[
        { title: "Ishga qabul qilish nizomi", description: "Asosiy hujjat", color: "indigo" },
        { title: "Institutning kadrlar faoliyatiga oid siyosati", description: "Kadrlar siyosati", color: "blue" },
      ]}
    />
  );
}
