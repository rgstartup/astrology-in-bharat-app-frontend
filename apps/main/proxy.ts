import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  iat?: number;
  userId?: number;
  role?: string;
}

const debug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[AuthDebug][proxy]", ...args);
  }
};

const protectedPaths = [
  "/profile",
  "/wallet",
  "/settings",
  "/session-history",
  "/user-detail-form",
];

// ─── Utilities ────────────────────────────────────────────────────────────────
const isAccessTokenValid = (accessToken?: string) => {
  if (!accessToken) return false;
  try {
    const payload = jwtDecode<JwtPayload>(accessToken);
    if (payload?.exp) {
      return payload.exp * 1000 > Date.now();
    }
    return false;
  } catch {
    return false;
  }
};

const buildSignInUrl = (
  request: NextRequest,
  callbackUrl: string,
  extras?: Record<string, string>,
) => {
  const loginUrl = new URL("/sign-in", request.url);
  loginUrl.searchParams.set("callbackUrl", callbackUrl);
  if (extras) {
    for (const [key, value] of Object.entries(extras)) {
      loginUrl.searchParams.set(key, value);
    }
  }
  return loginUrl;
};

// ─── Main Proxy Function ──────────────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Auth Evaluation
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (accessToken && isAccessTokenValid(accessToken)) {
    // Optional role-based routing could go here
    return NextResponse.next();
  }

  if (!refreshToken) {
    const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));
    if (isProtectedRoute) {
      return NextResponse.redirect(buildSignInUrl(request, pathname));
    }
    return NextResponse.next();
  }

  // 3. Handle Social Login Callback (Failure)
  const googleError = searchParams.get("error");
  const googleErrorDescription = searchParams.get("error_description");

  if (googleError) {
    debug("social login error found, redirecting to sign-in");
    const loginUrl = buildSignInUrl(request, pathname, {
      error: googleError,
      ...(googleErrorDescription ? { error_description: googleErrorDescription } : {}),
    });
    return NextResponse.redirect(loginUrl);
  }

  // 4. Protection and Refresh Logic
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    const refreshRes = await fetch("http://localhost:6543/api/v1/auth/refresh", {
      method: "POST",
      cache: "no-store",
      credentials: "include",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    if (!refreshRes.ok) {
      return NextResponse.redirect(buildSignInUrl(request, pathname));
    }

    const response = NextResponse.next();
    const setCookieHeader = refreshRes.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }
    return response;
  } catch (error) {
    debug("refresh exception", error);
    return NextResponse.redirect(buildSignInUrl(request, pathname));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)", "/api/v1/auth/:path*", "/api/v1/client/profile/phone/:path*"],
};
