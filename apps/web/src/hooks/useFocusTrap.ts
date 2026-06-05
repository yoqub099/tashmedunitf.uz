"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap<T extends HTMLElement>(
  enabled: boolean
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof document === "undefined") return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const container = ref.current;
    if (!container) return;

    const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const first = focusables[0];
    if (first) {
      requestAnimationFrame(() => first.focus());
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === firstItem || !container.contains(active)) {
          e.preventDefault();
          lastItem.focus();
        }
      } else {
        if (active === lastItem) {
          e.preventDefault();
          firstItem.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      const prev = previouslyFocused.current;
      if (prev && typeof prev.focus === "function") {
        prev.focus();
      }
    };
  }, [enabled]);

  return ref;
}
