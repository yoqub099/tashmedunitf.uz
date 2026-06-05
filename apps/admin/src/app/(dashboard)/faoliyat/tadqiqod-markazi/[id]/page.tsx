import StaticPageAdmin from "@/components/templates/StaticPageAdmin";

export default async function TadqiqodMarkaziDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <StaticPageAdmin
      slug={id}
      title="Maqola"
      description="Tadqiqot markazi maqolasi — tahrirlash, rasm va hujjat yuklash"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Tadqiqot markazi", href: "/faoliyat/tadqiqod-markazi" },
        { label: "Maqola" },
      ]}
    />
  );
}
