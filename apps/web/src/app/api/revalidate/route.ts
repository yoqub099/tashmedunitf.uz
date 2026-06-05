import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { notifyUpdate } from "./stream/route";

/**
 * On-demand ISR Revalidation API
 * Admin paneldan ma'lumot o'zgarganda frontend keshni tozalaydi
 * + SSE orqali brauzerga signal yuboradi (avtomatik yangilanish)
 *
 * POST /api/revalidate
 * Body: { tags?: string[], path?: string }
 */

// CORS preflight — faqat admin va backend dan ruxsat
const ALLOWED_ORIGIN = process.env.ADMIN_URL || "http://localhost:3001";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tags, paths, path, secret } = body as {
      tags?: string[];
      paths?: string[];
      path?: string;
      secret?: string;
    };

    // Shared secret orqali himoyalash (majburiy)
    const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;
    if (!REVALIDATION_SECRET) {
      console.error('REVALIDATION_SECRET environment variable is not set!');
      return NextResponse.json(
        { revalidated: false, error: "Server misconfiguration: secret not set" },
        { status: 500 }
      );
    }
    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { revalidated: false, error: "Invalid secret" },
        { status: 401 }
      );
    }

    // Tag bo'yicha revalidatsiya
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag, "default");
      }
    }

    // Path bo'yicha revalidatsiya — barcha locale variantlarini ham revalidate qilish
    const locales = ["uz", "ru", "en"];
    const allPaths = paths || (path ? [path] : []);
    if (allPaths.length > 0) {
      for (const p of allPaths) {
        for (const locale of locales) {
          revalidatePath(`/${locale}${p}`, "layout");
        }
        revalidatePath(p, "layout");
      }
    }

    // Hech narsa ko'rsatilmagan bo'lsa — xatolik qaytarish (DoS himoyasi)
    if (!tags?.length && !allPaths.length) {
      return NextResponse.json(
        { revalidated: false, error: "At least one tag or path is required" },
        { status: 400, headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN } }
      );
    }

    // SSE orqali barcha frontend brauzerlariga signal yuborish
    notifyUpdate();

    const response = NextResponse.json({
      revalidated: true,
      tags: tags || [],
      paths: allPaths.length > 0 ? allPaths : ["/"],
      timestamp: Date.now(),
    });
    response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    return response;
  } catch {
    const response = NextResponse.json(
      { revalidated: false, error: "Invalid request" },
      { status: 400 }
    );
    response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    return response;
  }
}
