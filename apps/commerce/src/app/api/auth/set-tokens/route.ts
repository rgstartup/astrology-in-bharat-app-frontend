import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

/**
 * GET /api/auth/set-tokens?accessToken=...&refreshToken=...&redirect=...
 *
 * Called by frontend after Google OAuth callback to set HttpOnly cookies
 * from URL params (because backend sets secure-only cookies that don't
 * work on HTTP localhost).
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const redirect = searchParams.get("redirect") || "/dashboard";

    console.log("[set-tokens] Called with:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        redirect,
    });

    if (!accessToken || !refreshToken) {
        console.error("[set-tokens] Missing tokens!");
        return NextResponse.redirect(new URL("/login?error=missing_tokens", request.url));
    }

    // Clean redirect path
    const cleanRedirect = redirect.startsWith("/") ? redirect : `/${redirect}`;
    const redirectUrl = new URL(cleanRedirect, request.url);

    const response = NextResponse.redirect(redirectUrl);

    // Set HttpOnly cookies server-side (works on both HTTP and HTTPS)
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log("[set-tokens] Cookies set, redirecting to:", cleanRedirect);

    return response;
}
