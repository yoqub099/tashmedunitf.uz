import CareerCenterInfosCrudAdmin from "@/components/templates/CareerCenterInfosCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karyera markazi — Admin",
  description: "Karyera markazi haqida bo'limlar",
};

export default function KaryeraMalumotlariPage() {
  return <CareerCenterInfosCrudAdmin />;
}
