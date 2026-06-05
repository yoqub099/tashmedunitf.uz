"use client";

import { useEffect, useState } from "react";
import { useA11yStore } from "@/store/useA11yStore";
import { readFromStorage } from "@/lib/a11y/storage";
import { applySettings } from "@/lib/a11y/apply";
import AccessibilityPanel from "./AccessibilityPanel";

/**
 * Mount + Panel renderer for admin.
 * Hydrates the a11y store, applies settings to DOM, syncs across tabs,
 * renders the panel via Portal. The panel is opened by external triggers
 * (Header button / Footer link).
 */
export default function AccessibilityWidget() {
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: StorageEvent) => {
      if (e.key !== "tmtu:admin:a11y" || !e.newValue) return;
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

  return <AccessibilityPanel />;
}
