/**
 * ============================================================
 * CLIENT ERROR REPORTER (web) — /look kuzatuv markazi
 * ============================================================
 *
 * Brauzerda chiqqan JS xatolarini backend'ga yuboradi:
 *   POST {API}/v1/client-errors  { source: "web", message, stack, ... }
 *
 * - window.onerror + unhandledrejection global tutadi
 * - error.tsx boundary'lar ham shu funksiyani chaqiradi
 * - Client-side dedup + throttle (jadval to'lib ketmasligi uchun)
 * - Reporter HECH QACHON ilovani buzmaydi (hammasi try/catch)
 * ============================================================
 */

const RAW_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
// web base = .../api  →  client-errors: .../api/v1/client-errors
const ENDPOINT = `${RAW_API.replace(/\/$/, "")}/v1/client-errors`;
const SOURCE = "web";

type Payload = {
  message: string;
  type?: string;
  stack?: string;
  componentStack?: string;
  file?: string;
  line?: number;
  url?: string;
  level?: "error" | "warning" | "critical" | "info";
  extra?: Record<string, unknown>;
};

// Client-side dedup + flood guard
const seen = new Map<string, number>();
const DEDUP_MS = 30_000;
let windowStart = Date.now();
let sentInWindow = 0;
const MAX_PER_MINUTE = 20;

// Next.js ichki "xatolari" va shovqinni e'tiborsiz qoldirish
const IGNORE = /NEXT_REDIRECT|NEXT_NOT_FOUND|ResizeObserver loop|Hydration failed|Minified React error/i;

function isThrottled(): boolean {
  const now = Date.now();
  if (now - windowStart > 60_000) {
    windowStart = now;
    sentInWindow = 0;
  }
  if (sentInWindow >= MAX_PER_MINUTE) return true;
  sentInWindow++;
  return false;
}

export function reportClientError(payload: Payload): void {
  try {
    if (typeof window === "undefined") return;

    const message = (payload.message || "").trim().slice(0, 1000);
    if (!message || IGNORE.test(message)) return;

    const fp = `${payload.type || ""}|${message}|${payload.line ?? ""}`;
    const now = Date.now();
    const last = seen.get(fp);
    if (last && now - last < DEDUP_MS) return;
    seen.set(fp, now);
    if (seen.size > 100) seen.clear();

    if (isThrottled()) return;

    const body = JSON.stringify({
      source: SOURCE,
      level: payload.level || "error",
      message,
      type: payload.type ? String(payload.type).slice(0, 255) : undefined,
      stack: payload.stack ? String(payload.stack).slice(0, 20000) : undefined,
      componentStack: payload.componentStack ? String(payload.componentStack).slice(0, 10000) : undefined,
      file: payload.file ? String(payload.file).slice(0, 1000) : undefined,
      line: payload.line,
      url: payload.url || window.location.href,
      extra: payload.extra,
    });

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  } catch {
    // reporter hech qachon ilovani buzmasin
  }
}

let installed = false;

export function installGlobalErrorReporting(): void {
  if (typeof window === "undefined" || installed) return;
  installed = true;

  // capture=true — resurs (img/script/link) yuklash xatolarini ham tutadi
  window.addEventListener(
    "error",
    (event) => {
      const target = event.target as (HTMLElement & { src?: string; href?: string }) | null;
      const isResource = !!target && target !== (window as unknown as HTMLElement) && (!!target.src || !!target.href);
      if (isResource) {
        reportClientError({
          message: `Resurs yuklanmadi: ${target!.src || target!.href}`,
          type: "ResourceError",
          level: "warning",
        });
        return;
      }
      if (!event.message) return;
      reportClientError({
        message: event.message,
        type: event.error?.name || "Error",
        stack: event.error?.stack,
        file: event.filename,
        line: event.lineno,
      });
    },
    true
  );

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason as { message?: string; name?: string; stack?: string } | undefined;
    reportClientError({
      message: reason?.message || String(reason ?? "Unhandled promise rejection"),
      type: reason?.name || "UnhandledRejection",
      stack: reason?.stack,
    });
  });
}
