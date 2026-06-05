import BannersCrudAdmin from "@/components/templates/BannersCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bannerlar — Admin",
  description: "Bosh sahifa Hero slider boshqaruvi",
};

export default function BannerlarPage() {
  return <BannersCrudAdmin />;
}
