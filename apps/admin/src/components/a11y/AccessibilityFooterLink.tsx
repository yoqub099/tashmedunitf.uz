"use client";

import { useA11yStore } from "@/store/useA11yStore";
import { A11Y_LABELS } from "@/lib/a11y/labels";
import { EyeIcon } from "./AccessibilityIcons";

export default function AccessibilityFooterLink() {
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
      className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1d4ed8] transition-colors"
    >
      <EyeIcon width={16} height={16} aria-hidden="true" />
      <span data-a11y-ui="true">{A11Y_LABELS.title}</span>
    </button>
  );
}
