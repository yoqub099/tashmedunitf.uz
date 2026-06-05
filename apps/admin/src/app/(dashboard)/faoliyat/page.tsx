import NavHubAdmin from "@/components/templates/NavHubAdmin";
import type { NavItem } from "@/components/templates/NavHubAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faoliyat — Admin",
};

const items: NavItem[] = [
  { title: "O'quv faoliyati", description: "Ta'lim jarayoni va o'quv ishlari", href: "/faoliyat/oquv-faoliyati", icon: "BookOpen", color: "blue" },
  { title: "Ilmiy faoliyat", description: "Ilmiy tadqiqotlar va nashrlar", href: "/faoliyat/ilmiy-faoliyat", icon: "Microscope", color: "green" },
  { title: "Xalqaro hamkorlik", description: "Xalqaro aloqalar va hamkorlik", href: "/faoliyat/xalqaro-hamkorlik", icon: "Globe", color: "purple" },
  { title: "Tadqiqod markazi", description: "Ilmiy tadqiqot markazi", href: "/faoliyat/tadqiqod-markazi", icon: "FlaskConical", color: "orange" },
];

export default function FaoliyatPage() {
  return <NavHubAdmin title="Faoliyat" subtitle="Filial faoliyati yo'nalishlari" items={items} />;
}
