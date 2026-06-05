"use client";

import { useA11yStore } from "@/store/useA11yStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { s, type Language } from "@/lib/i18n";
import { EyeIcon } from "./AccessibilityIcons";

export default function AccessibilityFooterLink({
  serverLang = "uz",
}: {
  serverLang?: Language;
}) {
  const { language, hydrated } = useLanguageStore();
  const lang = (hydrated ? language : serverLang) as Language;
  const togglePanel = useA11yStore((st) => st.togglePanel);
  const isPanelOpen = useA11yStore((st) => st.isPanelOpen);

  return (
    <button
      type="button"
      onClick={togglePanel}
      data-a11y-ui="true"
      data-a11y-trigger="footer"
      aria-haspopup="dialog"
      aria-expanded={isPanelOpen}
      className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#00575B] transition-colors"
    >
      <EyeIcon width={16} height={16} aria-hidden="true" />
      <span data-a11y-ui="true">{s("a11y.title", lang)}</span>
    </button>
  );
}
