import ConferenceRegistrationsAdmin from "./ConferenceRegistrationsAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konferensiya ro'yxatlari — Admin",
  description: "Konferensiyaga ro'yxatdan o'tganlarni ko'rish va boshqarish",
};

export default function ConferenceRegistrationsPage() {
  return <ConferenceRegistrationsAdmin />;
}
