import DOMPurify from "dompurify";

/**
 * Server/client-safe HTML sanitizer.
 * Removes <script>, inline handlers (onerror=...), javascript: URLs, etc.
 * Allows safe formatting tags used by TipTap rich editor.
 */
export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "span", "strong", "em", "u", "s", "code", "pre", "blockquote",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "a", "img",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class", "style"],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  });
}
