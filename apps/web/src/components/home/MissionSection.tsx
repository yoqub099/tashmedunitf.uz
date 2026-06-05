"use client";

import Container from "@/components/shared/Container";
import { Page } from "@/types";
import { t, stripHtml } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

interface MissionSectionProps {
  page?: Page;
}

export default function MissionSection({ page }: MissionSectionProps) {
  const { language } = useLanguageStore();
  const title = page ? t(page.title, language) : s("mission.default_title", language);
  const content = page
    ? stripHtml(t(page.content, language)).slice(0, 600)
    : s("mission.default_content", language);

  return (
    <section className="py-10 sm:py-16 bg-white">
      <Container>
        <div className="max-w-4xl">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            {content}
          </p>
        </div>
      </Container>
    </section>
  );
}
