import SiteMediaCrudAdmin from "@/components/templates/SiteMediaCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayt media — Admin",
  description: "Kalit asosida saqlanadigan rasmlar va videolar",
};

export default function SaytMediaPage() {
  return <SiteMediaCrudAdmin />;
}
