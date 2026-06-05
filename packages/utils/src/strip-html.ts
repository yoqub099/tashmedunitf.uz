/**
 * Remove all HTML tags from a string.
 *
 * For displaying news excerpts, search results, plain-text previews.
 * NOT for sanitization — use DOMPurify for that.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Truncate a string to N characters, appending ellipsis.
 */
export function truncate(text: string | null | undefined, max: number): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}
