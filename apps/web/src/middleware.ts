import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["uz", "ru", "en"];
const defaultLocale = "uz";

const redirects: Record<string, string> = {
  "/abiturientlarga/qabul-komissiyasi": "/abiturientlarga",
  "/biz-haqimizda/umumiy-malumot": "/biz-haqimizda",
};

function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  return locales.includes(maybeLocale) ? maybeLocale : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal/static paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon-") ||
    pathname.startsWith("/apple-icon") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/opengraph-image") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const locale = getLocaleFromPathname(pathname);

  // No locale prefix → redirect to /{defaultLocale}{path}
  if (!locale) {
    // Check old redirects first
    const target = redirects[pathname];
    if (target) {
      const url = request.nextUrl.clone();
      url.pathname = `/${defaultLocale}${target}`;
      return NextResponse.redirect(url, 308);
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 308);
  }

  // Check old redirects (with locale prefix)
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
  const target = redirects[pathWithoutLocale];
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${target}`;
    return NextResponse.redirect(url, 308);
  }

  // Set x-locale header for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Set cookie for backward compatibility
  response.cookies.set("lang", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 365 * 24 * 60 * 60,
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|icon-|apple-icon|manifest|api/).*)",
  ],
};
