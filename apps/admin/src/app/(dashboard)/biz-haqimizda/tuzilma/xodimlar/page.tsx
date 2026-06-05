import StaffCrudAdmin from "@/components/templates/StaffCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Xodimlar — Admin" };

export default function XodimlarPage() {
  return <StaffCrudAdmin title="Xodimlar" subtitle="Barcha xodimlar ro'yxati" />;
}
