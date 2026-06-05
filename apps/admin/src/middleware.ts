import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/forgot-password", "/reset-password"];

// Redirect mappings — these pages open their parent instead
const redirects: Record<string, string> = {
  "/abiturientlarga/qabul-komissiyasi": "/abiturientlarga",
  "/biz-haqimizda/umumiy-malumot": "/biz-haqimizda",
};

// Static file extensions that should bypass auth
const STATIC_EXT = /\.(?:webp|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|css|js|map|json|xml|txt)$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static file requests (public assets)
  if (STATIC_EXT.test(pathname)) {
    return NextResponse.next();
  }

  // Redirect mappings
  const redirectTarget = redirects[pathname];
  if (redirectTarget) {
    return NextResponse.redirect(new URL(redirectTarget, request.url), 308);
  }

  // Allow public paths
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    // Login sahifasiga kelganda — eski admin-token cookie ni o'chirish
    // Bu localStorage/cookie desync loopni oldini oladi
    const response = NextResponse.next();
    response.cookies.delete("admin-token");
    return response;
  }

  // Server-side auth guard: cookie orqali token mavjudligini tekshirish
  const token = request.cookies.get("admin-token")?.value;
  // Sanctum tokens are typically "id|base64hash" — validate format
  const isValidFormat = token && token.length >= 20 && /^[0-9]+\|[A-Za-z0-9+/=]+$/.test(token);
  if (!token || !isValidFormat) {
    // Token yo'q yoki format noto'g'ri — login sahifasiga yo'naltirish
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    // Eski cookie ni tozalash
    response.cookies.delete("admin-token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api).*)",
  ],
};
