import NavHubAdmin from "@/components/templates/NavHubAdmin";
import type { NavItem } from "@/components/templates/NavHubAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tuzilma — Admin",
};

const items: NavItem[] = [
  { title: "Rektorat", description: "Rektorat rahbariyati", href: "/biz-haqimizda/tuzilma/rektorat", icon: "Crown", color: "blue" },
  { title: "Xodimlar", description: "Barcha xodimlar ro'yxati", href: "/biz-haqimizda/tuzilma/xodimlar", icon: "Users", color: "green" },
  { title: "Kafedralar", description: "Kafedralar va bo'limlar", href: "/biz-haqimizda/tuzilma/kafedralar", icon: "Building2", color: "purple" },
  { title: "Fakultetlar", description: "Fakultetlar haqida", href: "/biz-haqimizda/tuzilma/fakultetlar", icon: "GraduationCap", color: "orange" },
  { title: "Konsultativ organlar", description: "Maslahat va kengash organlari", href: "/biz-haqimizda/tuzilma/konsultativ-organlar", icon: "Landmark", color: "teal" },
  { title: "Filiallar", description: "Filiallar va vakolatxonalar", href: "/biz-haqimizda/tuzilma/filiallar", icon: "GitBranch", color: "indigo" },
];

export default function TuzilmaPage() {
  return <NavHubAdmin title="Tuzilma" subtitle="Universitet tashkiliy tuzilmasi" items={items} />;
}
