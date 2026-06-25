import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

/**
 * Locale routing (Next.js 16 "proxy", formerly middleware). Requests without a
 * `/de` or `/en` prefix are redirected to the visitor's preferred locale,
 * derived from the `NEXT_LOCALE` cookie (an explicit choice) or the
 * `Accept-Language` header, defaulting to German.
 */
function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && (LOCALES as readonly string[]).includes(cookie)) return cookie as Locale;

  const header = request.headers.get("accept-language");
  if (header) {
    const wanted = header
      .split(",")
      .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
    for (const code of wanted) {
      if ((LOCALES as readonly string[]).includes(code)) return code as Locale;
    }
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocale) return NextResponse.next();

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals, API routes, and the metadata files
  // served from the app root (sitemap, robots, OG image, favicon, etc.).
  matcher: ["/((?!_next/|api/|opengraph-image|sitemap.xml|robots.txt|favicon.ico|.*\\..*).*)"],
};
