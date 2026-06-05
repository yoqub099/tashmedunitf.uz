"use client";

import dynamic from "next/dynamic";
import EditableHeroSection from "@/components/sections/EditableHeroSection";

// Lazy load — faqat viewport'ga yetganda yuklanadi (Hero darhol ko'rinadi)
const EditableDirectionsSection = dynamic(() => import("@/components/sections/EditableDirectionsSection"), { ssr: false });
const EditableAdvantagesSection = dynamic(() => import("@/components/sections/EditableAdvantagesSection"), { ssr: false });
const EditableTestimonialsSection = dynamic(() => import("@/components/sections/EditableTestimonialsSection"), { ssr: false });
const EditableNewsSection = dynamic(() => import("@/components/sections/EditableNewsSection"), { ssr: false });
const EditablePartnersSection = dynamic(() => import("@/components/sections/EditablePartnersSection"), { ssr: false });
const EditableLocationSection = dynamic(() => import("@/components/sections/EditableLocationSection"), { ssr: false });

export default function HomePage() {
  return (
    <>
      <EditableHeroSection />
      <EditableDirectionsSection />
      <EditableAdvantagesSection />
      <EditableTestimonialsSection />
      <EditableNewsSection />
      <EditableLocationSection />
      <EditablePartnersSection />
    </>
  );
}
