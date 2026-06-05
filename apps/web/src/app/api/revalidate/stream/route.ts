/**
 * Revalidation version endpoint — polling uchun
 * 
 * Frontend brauzer har 2 soniyada bu endpoint'ni tekshiradi.
 * Version o'zgarsa — sahifani yangilaydi.
 * 
 * GET /api/revalidate/stream → { version: number }
 */

// Global version tracker
// globalThis ishlatamiz chunki Next.js dev mode'da module scope qayta yuklanishi mumkin
const globalStore = globalThis as unknown as { __revalidateVersion?: number };
if (!globalStore.__revalidateVersion) {
  globalStore.__revalidateVersion = Date.now();
}

/**
 * Yangi versiya signal yuborish (revalidate route dan chaqiriladi)
 */
export function notifyUpdate() {
  globalStore.__revalidateVersion = Date.now();
}

/**
 * Hozirgi versiyani olish
 */
export function getVersion() {
  return globalStore.__revalidateVersion!;
}

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { version: globalStore.__revalidateVersion },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
