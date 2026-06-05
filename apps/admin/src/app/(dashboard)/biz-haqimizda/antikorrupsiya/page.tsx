import Container from "@/components/shared/Container";
import type { Metadata } from "next";
import AntiCard from "./AntiCard";

export const metadata: Metadata = { title: "Antikorrupsiya — Admin" };

const ANTI_CARDS = [
  {
    title: "Aloqa kanallari",
    href: "/biz-haqimizda/antikorrupsiya/aloqa-kanallari",
  },
  {
    title: "Korrupsiyaga qarshi kurashish bo'yicha idoraviy hujjatlar",
    href: "/biz-haqimizda/antikorrupsiya/idoraviy-hujjatlar",
  },
];

export default function AntikorrupsiyaPage() {
  return (
    <Container className="py-6">
      <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">Antikorrupsiya</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {ANTI_CARDS.map((card) => (
          <AntiCard key={card.href} title={card.title} href={card.href} />
        ))}
      </div>
    </Container>
  );
}
