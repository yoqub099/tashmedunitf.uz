import ContactsAdmin from "@/components/templates/ContactsAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aloqa xabarlari — Admin",
  description: "Sayt orqali yuborilgan xabarlarni ko'rish va boshqarish",
};

export default function AloqaPage() {
  return <ContactsAdmin />;
}
