import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  iat?: number;
  userId?: number;
  role?: string;
}

import { getApiUrl } from "@/utils/api-config";

const API_BASE_URL = getApiUrl();
const debug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[AuthDebug][middleware]", ...args);
  }
};

const protectedPaths = ["/profile", "/wallet", "/settings", "/session-history"];

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

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const googleError = searchParams.get("error");
  const googleErrorDescription = searchParams.get("error_description");

  debug("token evaluation", {
    path: pathname,
    hasAccessToken: Boolean(accessToken),
    hasRefreshToken: Boolean(refreshToken),
    hasGoogleError: Boolean(googleError),
  });

  // Google OAuth callback failures can land on protected routes (e.g. /profile?error=...).
  // Redirect to sign-in and preserve the error details.
  if (googleError) {
    const loginUrl = buildSignInUrl(request, pathname, {
      error: googleError,
      ...(googleErrorDescription
        ? { error_description: googleErrorDescription }
        : {}),
    });
    return NextResponse.redirect(loginUrl);
  }

  if (isAccessTokenValid(accessToken)) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    return NextResponse.redirect(buildSignInUrl(request, pathname));
  }

  try {
    const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "GET",
      cache: "no-store",
      credentials: "include",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    debug("refresh response", {
      status: refreshRes.status,
      ok: refreshRes.ok,
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
