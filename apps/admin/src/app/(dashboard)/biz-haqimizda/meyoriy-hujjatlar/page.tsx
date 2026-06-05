import NavHubAdmin from "@/components/templates/NavHubAdmin";
import type { NavItem } from "@/components/templates/NavHubAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Me'yoriy hujjatlar — Admin",
};

const items: NavItem[] = [
  { title: "Nizom", description: "Institut nizomi va tashkiliy tuzilma (2 hujjat)", href: "/biz-haqimizda/meyoriy-hujjatlar/nizom", icon: "ScrollText", color: "blue" },
  { title: "Vazirlik hujjatlari", description: "Stipendiya buyrug'i va reglamenti (2 hujjat)", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlik-hujjatlari", icon: "Building", color: "green" },
  { title: "Vazirlar Mahkamasi", description: "Qabul, tanlov, sirtqi ta'lim va akademik ta'til nizomi (4 hujjat)", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi", icon: "Shield", color: "purple" },
  { title: "Prezident qarorlari", description: "Taraqqiyot strategiyasi va ma'muriy islohotlar (2 hujjat)", href: "/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari", icon: "Award", color: "orange" },
  { title: "Ichki hujjatlar", description: "Odob-axloq, halollik, kengash, tanlov, sifat siyosati (7 hujjat)", href: "/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar", icon: "FileText", color: "red" },
  { title: "Qonunlar", description: "Ta'lim, pedagog maqomi va litsenziyalash qonunlari (3 hujjat)", href: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar", icon: "Scale", color: "teal" },
  { title: "Ishga qabul", description: "Ishga qabul nizomi va kadrlar siyosati (2 hujjat)", href: "/biz-haqimizda/meyoriy-hujjatlar/ishga-qabul", icon: "Briefcase", color: "indigo" },
  { title: "Akademik hujjatlar", description: "Kengash, qabul, malaka, nazorat nizomlar (10 hujjat)", href: "/biz-haqimizda/meyoriy-hujjatlar/akademik-hujjatlar", icon: "BookOpen", color: "cyan" },
  { title: "E'lonlar", description: "Strategiya, handbook, audit va akademik jarayonlar (5 hujjat)", href: "/biz-haqimizda/meyoriy-hujjatlar/elonlar", icon: "FileText", color: "yellow" },
];

export default function MeyoriyHujjatlarPage() {
  return <NavHubAdmin title="Me'yoriy hujjatlar" subtitle="Qonun va normativ hujjatlar" items={items} />;
}
