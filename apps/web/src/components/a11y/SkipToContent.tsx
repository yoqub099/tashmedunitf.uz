"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { s, type Language } from "@/lib/i18n";

export default function SkipToContent({ serverLang }: { serverLang?: Language }) {
  const { language, hydrated } = useLanguageStore();
  const lang = (hydrated ? language : serverLang ?? "uz") as Language;

  return (
    <a href="#main-content" className="a11y-skip-link" data-a11y-ui="true">
      {s("a11y.skip_to_content", lang)}
    </a>
  );
}
