import Container from "@/components/shared/Container";
import type { Metadata } from "next";
import ContactCard from "./ContactCard";

export const metadata: Metadata = {
  title: "Aloqa kanallari | Antikorrupsiya — Admin",
};

const CONTACT_CARDS = [
  {
    title: "Rektor online qabulxonasi",
    description:
      'Korrupsiyani guvohi bo\'ldingizmi? <span style="color:#2563eb;text-decoration:underline">Bosing</span> va yozing.',
    href: "/biz-haqimizda/virtual-qabulxona",
  },
  {
    title: "O'zbekiston Respublikasi Korrupsiyaga qarshi agentligi",
    description:
      '<span style="color:#2563eb;text-decoration:underline">O\'zbekiston Respublikasi Korrupsiyaga qarshi agentligining</span> 1253 - Call markazi',
    externalHref: "https://anticorruption.uz/uz",
  },
];

export default function AloqaKanallariPage() {
  return (
    <Container className="py-6">
      <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
        Rektor online qabulxonasi
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {CONTACT_CARDS.map((card) => (
          <ContactCard
            key={card.title}
            title={card.title}
            description={card.description}
            href={card.href}
            externalHref={card.externalHref}
          />
        ))}
      </div>
    </Container>
  );
}
