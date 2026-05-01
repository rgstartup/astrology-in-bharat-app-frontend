import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import safeFetch from "@repo/safe-fetch";

const AUTH_ROUTES = [
  "/sign-in",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];
const PUBLIC_ROUTES = ["/product", "/astrologer", "/blog"];
const IGNORED_PREFIXES = ["/.well-known", "/images", "/uploads"];
const SESSION_COOKIE = "better-auth.session_token";

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function getSafeCallbackPath(rawValue: string | null | undefined) {
  if (!rawValue || !rawValue.startsWith("/") || rawValue.startsWith("//")) {
    return "/profile";
  }

  return rawValue;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (matchesRoute(pathname, IGNORED_PREFIXES)) {
    return NextResponse.next();
  }

  const isAuthRoute = matchesRoute(pathname, AUTH_ROUTES);
  const isPublicRoute =
    pathname === "/" || matchesRoute(pathname, PUBLIC_ROUTES);

  // Logged-in user visiting an auth page → redirect to callbackUrl or profile
  if (session && isAuthRoute) {
    const callbackUrl = getSafeCallbackPath(
      request.nextUrl.searchParams.get("callbackUrl"),
    );
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // Logged-in user visiting /onboarding → redirect to /profile if they already have a profile
  if (session && pathname === "/onboarding") {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (apiBase) {
      const [profile] = await safeFetch(`${apiBase}/client/profile`, {
        headers: { Cookie: request.headers.get("cookie") ?? "" },
      });
      if (profile) {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }
  }

  // Not logged in, accessing a protected route → redirect to sign-in
  if (!session && !isAuthRoute && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
    return NextResponse.redirect(
      new URL(`/sign-in?callbackUrl=${callbackUrl}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2|ttf)$).*)",
  ],
};
