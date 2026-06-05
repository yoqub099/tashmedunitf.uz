/**
 * Frontend ISR keshni on-demand revalidatsiya qilish utility
 * Admin panelda ma'lumot o'zgarganda frontendni ham yangilaydi
 *
 * Admin API route orqali proxy qilinadi (server-side secret bilan)
 * FIRE-AND-FORGET: admin UI ni bloklamaydi
 *
 * Retry mexanizmi: agar birinchi so'rov xato bo'lsa, 1s keyin qayta urinadi (maks 2 marta)
 */

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

/**
 * Frontend ISR keshni revalidatsiya qilish
 * @param tags - cache tag'lar ["news", "departments", ...]
 * @param paths - sahifa path'lari ["/talabalarga", "/"] (default: ["/"])
 */
export function revalidateFrontend(tags?: string[], paths?: string | string[]): void {
  // Normalize paths — har doim array
  const pathList = !paths ? ["/"] : typeof paths === "string" ? [paths] : paths;

  // Har doim root layout'ni ham revalidate qilish (barcha sahifalar yangilansin)
  if (!pathList.includes("/")) {
    pathList.push("/");
  }

  // Fire-and-forget — admin UI ni kutkazmaymiz
  _doRevalidate(tags, pathList).catch((err) =>
    console.error("[revalidate] Error:", err)
  );
}

async function _doRevalidate(tags?: string[], paths: string[] = ["/"]): Promise<void> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags, paths }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(
          `[revalidate] ✓ tags=${(tags || []).join(",")} paths=${paths.join(",")}`,
          data.timestamp ? `(v${data.timestamp})` : ""
        );
        return; // Muvaffaqiyatli — chiqamiz
      }

      console.warn(`[revalidate] Attempt ${attempt}/${MAX_RETRIES} failed: ${res.status}`);
    } catch (err) {
      console.warn(`[revalidate] Attempt ${attempt}/${MAX_RETRIES} network error:`, err);
    }

    // Qayta urinishdan oldin kutish
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
    }
  }

  console.error(`[revalidate] ✗ Failed after ${MAX_RETRIES} attempts: tags=${(tags || []).join(",")}`);
}
