/**
 * export-i18n.js
 *
 * Reads frontend/src/lib/i18n.ts and extracts the `ui` object into a JSON file
 * suitable for the Laravel TranslationSeeder.
 *
 * Output format:
 *   [{ key, group, value: { uz, ru, en } }, ...]
 *
 * Usage:
 *   node frontend/scripts/export-i18n.js
 */

const fs = require("fs");
const path = require("path");

// ── Paths ──────────────────────────────────────────────────
const I18N_PATH = path.resolve(__dirname, "../src/lib/i18n.ts");
const OUTPUT_PATH = path.resolve(
  __dirname,
  "../../backend/database/seeders/translations.json"
);

// ── Read the source file ───────────────────────────────────
const source = fs.readFileSync(I18N_PATH, "utf-8");

// ── Extract only the ui object body (between first { and matching }) ──
// Find the opening line: const ui: Record<string, Record<Language, string>> = {
const startMatch = source.match(
  /const\s+ui\s*:.*=\s*\{/
);
if (!startMatch) {
  console.error("ERROR: Could not find the `ui` object in i18n.ts");
  process.exit(1);
}

const bodyStart = startMatch.index + startMatch[0].length;

// Find the matching closing brace by counting depth
let depth = 1;
let bodyEnd = bodyStart;
for (let i = bodyStart; i < source.length; i++) {
  if (source[i] === "{") depth++;
  if (source[i] === "}") depth--;
  if (depth === 0) {
    bodyEnd = i;
    break;
  }
}

const uiBody = source.slice(bodyStart, bodyEnd);

// ── Parse each key-value entry ─────────────────────────────
//
// We match patterns like:
//   "nav.biz_haqimizda": { uz: "...", ru: "...", en: "..." },
//
// Values can be on a single line or span multiple lines (multi-line strings).
// Strategy: match each quoted key, then grab the { ... } block that follows.

const entries = [];
const keyRegex = /"([^"]+)"\s*:\s*\{/g;
let match;

while ((match = keyRegex.exec(uiBody)) !== null) {
  const key = match[1];

  // Find the closing } for this entry's value object
  const objStart = match.index + match[0].length;
  let objDepth = 1;
  let objEnd = objStart;
  for (let i = objStart; i < uiBody.length; i++) {
    if (uiBody[i] === "{") objDepth++;
    if (uiBody[i] === "}") objDepth--;
    if (objDepth === 0) {
      objEnd = i;
      break;
    }
  }

  const objBody = uiBody.slice(objStart, objEnd);

  // Extract uz, ru, en values from the object body.
  // Values can be "double-quoted" strings — potentially with escaped chars.
  // They can also span multiple lines (template-style with \n inside).
  const extractLang = (lang) => {
    // Match:  uz: "..." or uz: "...\n..."
    // We need to handle escaped quotes inside the string.
    const langRegex = new RegExp(
      lang + '\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"',
      "s"
    );
    const m = objBody.match(langRegex);
    if (m) return m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n");

    // Try single-line backtick (unlikely in this file, but just in case)
    const btRegex = new RegExp(lang + "\\s*:\\s*`([^`]*)`", "s");
    const bm = objBody.match(btRegex);
    if (bm) return bm[1];

    return "";
  };

  const uz = extractLang("uz");
  const ru = extractLang("ru");
  const en = extractLang("en");

  // Derive group from key: everything before the first dot
  const dotIndex = key.indexOf(".");
  const group = dotIndex > 0 ? key.substring(0, dotIndex) : "general";

  entries.push({
    key,
    group,
    value: { uz, ru, en },
  });
}

// ── Write output ───────────────────────────────────────────
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2), "utf-8");

console.log(`Exported ${entries.length} translation keys to:`);
console.log(`  ${OUTPUT_PATH}`);

// Show group breakdown
const groups = {};
for (const e of entries) {
  groups[e.group] = (groups[e.group] || 0) + 1;
}
console.log("\nGroup breakdown:");
for (const [g, count] of Object.entries(groups).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${g}: ${count}`);
}
