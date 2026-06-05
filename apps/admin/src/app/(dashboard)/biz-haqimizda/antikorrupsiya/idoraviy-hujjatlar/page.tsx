import Container from "@/components/shared/Container";
import type { Metadata } from "next";
import LawCard from "./LawCard";

export const metadata: Metadata = {
  title: "Idoraviy hujjatlar | Antikorrupsiya — Admin",
};

export default function IdoraviyHujjatlarPage() {
  return (
    <Container className="py-6">
      <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
        O&apos;zbekiston Respublikasining Korrupsiyaga qarshi kurashish
        to&apos;g&apos;risida qonuni
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <LawCard />
      </div>
    </Container>
  );
}
