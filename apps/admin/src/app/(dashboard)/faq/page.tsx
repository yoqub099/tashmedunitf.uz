import FaqCrudAdmin from "@/components/templates/FaqCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Admin",
  description: "Ko'p beriladigan savollarni boshqarish",
};

export default function FaqPage() {
  return <FaqCrudAdmin />;
}
