import DepartmentsCrudAdmin from "@/components/templates/DepartmentsCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kafedralar — Admin" };

export default function KafedralarPage() {
  return <DepartmentsCrudAdmin title="Kafedralar" subtitle="Kafedralar va bo'limlarni boshqarish" />;
}
