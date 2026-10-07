import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { stripLocale } from "@/utils/getPathnameOrDefault";
import { AUTH_COOKIE_NAMES } from "@/actions";

/**
 * GET /api/auth/set-tokens?accessToken=...&refreshToken=...&redirect=...
 *
 * Called by frontend after Google OAuth callback to set HttpOnly cookies
 * from URL params (because backend sets secure-only cookies that don't
 * work on HTTP localhost).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN);
  const refreshToken = searchParams.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN);
  const redirect = searchParams.get("redirect") || "/client/profile";

  console.log("[set-tokens] Called with:", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    redirect,
  });

  if (!accessToken || !refreshToken) {
    console.error("[set-tokens] Missing tokens!");
    return NextResponse.redirect(
      new URL("/login?error=missing_tokens", request.url),
    );
  }

  // Clean redirect path
  const cleanRedirect = stripLocale(redirect);
  const redirectUrl = new URL(cleanRedirect, request.url);

  const response = NextResponse.redirect(redirectUrl);

  // Set HttpOnly cookies server-side (works on both HTTP and HTTPS)
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set(AUTH_COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  response.cookies.set(AUTH_COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
