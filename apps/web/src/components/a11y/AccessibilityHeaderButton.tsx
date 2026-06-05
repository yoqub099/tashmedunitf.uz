"use client";

import { useA11yStore } from "@/store/useA11yStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { s, type Language } from "@/lib/i18n";
import { EyeIcon } from "./AccessibilityIcons";
import { cn } from "@/lib/utils";

interface Props {
  serverLang?: Language;
  variant?: "light" | "dark";
}

export default function AccessibilityHeaderButton({ serverLang = "uz", variant = "dark" }: Props) {
  const { language, hydrated } = useLanguageStore();
  const lang = (hydrated ? language : serverLang) as Language;
  const togglePanel = useA11yStore((st) => st.togglePanel);
  const isPanelOpen = useA11yStore((st) => st.isPanelOpen);

  const label = s("a11y.widget_label", lang);

  return (
    <button
      type="button"
      onClick={togglePanel}
      data-a11y-ui="true"
      data-a11y-trigger="header"
      aria-label={label}
      aria-expanded={isPanelOpen}
      aria-haspopup="dialog"
      title={label}
      className={cn(
        "rounded-full p-2 transition-all hover:opacity-80",
        variant === "light" ? "bg-white/15" : "bg-gray-100 hover:bg-gray-200"
      )}
    >
      <EyeIcon
        width={20}
        height={20}
        className={cn("h-5 w-5", variant === "light" ? "text-white" : "text-gray-600")}
      />
      <span className="a11y-sr-only" data-a11y-ui="true">{label}</span>
    </button>
  );
}
