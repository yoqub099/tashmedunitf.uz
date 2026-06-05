"use client";

import { useA11yStore } from "@/store/useA11yStore";
import { A11Y_LABELS } from "@/lib/a11y/labels";
import { EyeIcon } from "./AccessibilityIcons";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "light" | "dark";
}

export default function AccessibilityHeaderButton({ variant = "dark" }: Props) {
  const togglePanel = useA11yStore((st) => st.togglePanel);
  const isPanelOpen = useA11yStore((st) => st.isPanelOpen);

  return (
    <button
      type="button"
      onClick={togglePanel}
      data-a11y-ui="true"
      data-a11y-trigger="header"
      aria-label={A11Y_LABELS.widget}
      aria-expanded={isPanelOpen}
      aria-haspopup="dialog"
      title={A11Y_LABELS.widget}
      className={cn(
        "rounded-full p-2 transition-all hover:opacity-80",
        variant === "light" ? "bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
      )}
    >
      <EyeIcon width={20} height={20} className="w-5 h-5" />
      <span className="a11y-sr-only" data-a11y-ui="true">{A11Y_LABELS.widget}</span>
    </button>
  );
}
