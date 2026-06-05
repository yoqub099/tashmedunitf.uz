import type { A11ySettings } from "./types";

const HTML_CLASSES = [
  "a11y-scheme-default",
  "a11y-scheme-bw",
  "a11y-scheme-wb",
  "a11y-scheme-yb",
  "a11y-scheme-by",
  "a11y-scheme-sepia",
  "a11y-font-sans",
  "a11y-font-serif",
  "a11y-fs-small",
  "a11y-fs-medium",
  "a11y-fs-large",
];

const BODY_CLASSES = [
  "a11y-active",
  "a11y-ls-normal",
  "a11y-ls-wide",
  "a11y-ls-extra-wide",
  "a11y-lh-normal",
  "a11y-lh-comfortable",
];

export function applySettings(s: A11ySettings): void {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const body = document.body;
  if (!body) return;

  html.classList.remove(...HTML_CLASSES);
  body.classList.remove(...BODY_CLASSES);
  html.removeAttribute("data-a11y-pending");

  if (!s.enabled) {
    html.removeAttribute("data-a11y-images");
    return;
  }

  html.classList.add(
    `a11y-scheme-${s.scheme}`,
    `a11y-font-${s.fontFamily}`,
    `a11y-fs-${s.fontSize}`
  );
  body.classList.add(
    "a11y-active",
    `a11y-ls-${s.letterSpacing}`,
    `a11y-lh-${s.lineHeight}`
  );
  html.setAttribute("data-a11y-images", s.imagesVisible ? "visible" : "hidden");
}
