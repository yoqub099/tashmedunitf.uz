"use client";

import { useEffect, useState } from "react";
import { useA11yStore } from "@/store/useA11yStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { readFromStorage } from "@/lib/a11y/storage";
import { applySettings } from "@/lib/a11y/apply";
import type { Language } from "@/lib/i18n";
import AccessibilityPanel from "./AccessibilityPanel";

/**
 * Mount + Panel renderer.
 * Hydrates the a11y store from localStorage on first mount, applies stored
 * settings to the DOM, sets up cross-tab sync via the storage event, and
 * renders the panel via Portal. The panel is opened by external triggers
 * (Header button / Footer link) — not by this component.
 */
interface WidgetProps {
  serverLang?: Language;
  showImagesSection?: boolean;
}

export default function AccessibilityWidget({
  serverLang = "uz",
  showImagesSection = true,
}: WidgetProps) {
  const { language, hydrated: langHydrated } = useLanguageStore();
  const lang = (langHydrated ? language : serverLang) as Language;

  const hydrate = useA11yStore((st) => st.hydrate);
  const isStoreHydrated = useA11yStore((st) => st.isHydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isStoreHydrated) return;
    const stored = readFromStorage();
    if (stored) {
      hydrate(stored);
      applySettings(stored);
    } else {
      hydrate({
        fontSize: "medium",
        scheme: "default",
        letterSpacing: "normal",
        lineHeight: "normal",
        fontFamily: "sans",
        imagesVisible: true,
        enabled: false,
        version: 1,
      });
    }
  }, [hydrate, isStoreHydrated]);

  // Cross-tab sync via storage event
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: StorageEvent) => {
      if (e.key !== "tmtu:a11y" || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        hydrate(parsed);
        applySettings(parsed);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [hydrate]);

  if (!mounted) return null;

  return <AccessibilityPanel lang={lang} showImagesSection={showImagesSection} />;
}
