import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { decodeToken } from "@repo/lib";
import { api, API_ROUTES } from "./actions";
import {
  setAccessToken,
  setRefreshToken,
  clearAuthCookies,
} from "./actions/cookie";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * Auth redirects end the middleware chain before `handleI18nRouting` can
 * return its response. Copy its locale cookie onto those redirects so locale
 * negotiation works on the very first redirected request as well.
 */
function withI18nCookies(response: NextResponse, request: NextRequest) {
  const i18nResponse = handleI18nRouting(request);

  for (const cookie of i18nResponse.cookies.getAll()) {
    response.cookies.set(cookie);
  }

  return response;
}

const PROTECTED_ROUTES = ["/client", "/dashboard"];
const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((prefix) => pathname.startsWith(prefix));

const AUTH_ROUTES = ["/sign-in", "/register"];
const isAuthRoute = (pathname: string) => AUTH_ROUTES.includes(pathname);

const getPathnameWithoutLocale = (pathname: string) => {
  const segments = pathname.split("/");
  if (segments[1] && routing.locales.includes(segments[1] as any)) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
};

async function refreshSession(
  refreshToken: string,
  request: NextRequest,
  pathname: string,
  isProtected: boolean,
  redirect = false,
) {
  const [data, error] = await api
    .extend({
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    })
    .post<{
      accessToken: string;
      refreshToken: string;
    }>(API_ROUTES.AUTH.CLIENT.REFRESH, { refreshToken });

  if (error || !data?.accessToken || !data.refreshToken) {
    // Don't mutate request cookies.
    // request.cookies represents the incoming request.

    const response = isProtected
      ? redirectToLogin(request, pathname)
      : handleI18nRouting(request);

    clearAuthCookies(response.cookies);

    return response;
  }

  const response = redirect
    ? redirectToCallback(request)
    : handleI18nRouting(request);

  setAccessToken(response.cookies, data.accessToken);
  setRefreshToken(response.cookies, data.refreshToken);

  return response;
}

const redirectToLogin = (
  request: NextRequest,
  pathname: string,
): NextResponse => {
  const normalized = getPathnameWithoutLocale(pathname);
  const url = new URL("/sign-in", request.url);
  if (normalized && normalized !== "/") {
    url.searchParams.set("callbackUrl", normalized);
  }
  return withI18nCookies(NextResponse.redirect(url), request);
};

const redirectToCallback = (request: NextRequest): NextResponse => {
  let redirectRoute = "/client/profile";
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");

  if (callbackUrl && callbackUrl !== "/") {
    redirectRoute = getPathnameWithoutLocale(callbackUrl);
  }

  const url = new URL(redirectRoute, request.url);

  return withI18nCookies(NextResponse.redirect(url), request);
};

const checkTokenAboutToExpire = (accessToken: string) => {
  const payload = decodeToken(accessToken);

  if (!payload || !payload.exp) return true;

  const expiryTime = payload.exp * 1000;
  const currentTime = Date.now();
  const fiveMinutesInMs = 5 * 60 * 1000;

  return expiryTime - currentTime < fiveMinutesInMs;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalizedPathname = getPathnameWithoutLocale(pathname);

  const isPathProtected = isProtectedRoute(normalizedPathname);
  const isPathAuth = isAuthRoute(normalizedPathname);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  /*
   * 1. Auth routes (/sign-in, /register)
   *
   * If already authenticated with a valid token, don't allow /sign-in or /register.
   * If access token is expired/invalid:
   *   - If refresh token exists, try refreshing.
   *   - If no refresh token or refresh fails, clear cookies and allow viewing auth page.
   */
  if (isPathAuth) {
    if (accessToken) {
      const isExpired = checkTokenAboutToExpire(accessToken);
      if (!isExpired) {
        return redirectToCallback(request);
      }

      if (refreshToken) {
        return refreshSession(
          refreshToken,
          request,
          pathname,
          isPathProtected,
          true,
        );
      }

      // Expired accessToken and no refreshToken -> clear cookies and allow viewing auth page
      const response = handleI18nRouting(request);
      clearAuthCookies(response.cookies);
      return response;
    }

    if (refreshToken) {
      return refreshSession(
        refreshToken,
        request,
        pathname,
        isPathProtected,
        true,
      );
    }

    return handleI18nRouting(request);
  }

  /*
   * 2. Access token exists
   *
   * Check whether it needs rotation or is expired.
   */
  if (accessToken) {
    const tokenAboutToExpire = checkTokenAboutToExpire(accessToken);

    if (!tokenAboutToExpire) {
      return handleI18nRouting(request);
    }

    /*
     * Access token is about to expire or already expired.
     * Try refresh regardless of the route.
     */
    if (refreshToken) {
      console.log("refresh token initiate");
      return refreshSession(refreshToken, request, pathname, isPathProtected);
    }

    /*
     * No refresh token available to refresh with!
     * Refreshing the token has failed.
     * Clear the expired/invalid accessToken cookie!
     */
    const response = isPathProtected
      ? redirectToLogin(request, pathname)
      : handleI18nRouting(request);

    clearAuthCookies(response.cookies);
    return response;
  }

  /*
   * 3. No access token
   *
   * Try refresh if refresh token exists,
   * regardless of whether the route is protected.
   */
  if (refreshToken) {
    return refreshSession(refreshToken, request, pathname, isPathProtected);
  }

  /*
   * 4. No tokens
   *
   * Protected → login
   * Public → continue
   */
  if (isPathProtected) {
    return redirectToLogin(request, pathname);
  }

  return handleI18nRouting(request);
}

// Matcher configuration for proxy
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|\\.well-known).*)",
  ],
};
