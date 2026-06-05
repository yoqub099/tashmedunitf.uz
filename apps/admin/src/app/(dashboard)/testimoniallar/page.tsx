import TestimonialsCrudAdmin from "@/components/templates/TestimonialsCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimoniallar — Admin",
  description: "Bitiruvchilar va talabalar fikrlari boshqaruvi",
};

export default function TestimoniallarPage() {
  return <TestimonialsCrudAdmin />;
}
