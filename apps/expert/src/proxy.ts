import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "@repo/lib";
import api from "@/actions/api";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import {
  setAccessToken,
  setRefreshToken,
  clearAuthCookies,
} from "@/actions/cookie";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { API_ROUTES } from "./utils/api.routes";
import {
  appendSetCookiesToResponse,
  captureSetCookies,
} from "./utils/forwarded-cookies";

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

const PROTECTED_ROUTES = ["/dashboard"];
const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((prefix) => pathname.startsWith(prefix));

const AUTH_ROUTES = ["/", "/login", "/register", "/forgot-password"];
const isAuthRoute = (pathname: string) => AUTH_ROUTES.includes(pathname);

const getPathnameWithoutLocale = (pathname: string) => {
  const segments = pathname.split("/");
  if (segments[1] && routing.locales.includes(segments[1] as any)) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
};

/** First 8 chars of a token for logs — never prints full secrets. */
const tok = (v?: string) => (v ? `${v.slice(0, 8)}…` : "(none)");

async function refreshSession(
  refreshToken: string,
  request: NextRequest,
  pathname: string,
  isProtected: boolean,
  redirect = false,
) {
  console.log(
    `[Proxy:refresh:start] for "${pathname}" (redirect=${redirect}): presenting ${tok(refreshToken)}`,
  );
  let backendSetCookies: string[] = [];
  const result = await api
    .extend({
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      onResponse: (_data, res) => {
        backendSetCookies = captureSetCookies(res.headers);
      },
    })
    .post<{
      accessToken: string;
      refreshToken: string;
    }>(API_ROUTES.AUTH.REFRESH, { refreshToken });

  if (!result.ok) {
    console.log(
      `[Proxy:refresh:fail] for "${pathname}": presented ${tok(refreshToken)}, error:`,
      result.error,
    );
    return redirectToLogout(request, pathname, isProtected);
  }

  const data = result.data;
  const response = redirect
    ? redirectToCallback(request)
    : handleI18nRouting(request);

  if (backendSetCookies.length > 0) {
    appendSetCookiesToResponse(response, backendSetCookies);
  } else {
    console.log(
      `[Proxy:refresh:ok] for "${pathname}": backend sent no Set-Cookie, using manual fallback`,
    );
    setAccessToken(response.cookies, data.accessToken);
    if (data.refreshToken) {
      setRefreshToken(response.cookies, data.refreshToken);
    }
  }

  console.log(
    `[Proxy:refresh:ok] for "${pathname}":`,
    "presented:",
    `${refreshToken.slice(0, 8)}…`,
    "rotated:",
    data.refreshToken ? `${data.refreshToken.slice(0, 8)}…` : "(missing!)",
    "forwarded:",
    backendSetCookies.length,
    "cookies:",
    response.cookies.getAll().map((c) => c.name),
  );

  return response;
}

/**
 * Background requests (Server Action POSTs, RSC navigations/prefetches) also
 * pass through this proxy, but a redirect response to a background `fetch`
 * never navigates the SPA — while its `Set-Cookie` headers still clear the
 * cookies. That leaves cleared cookies + stale auth store + no redirect.
 * Answer those with 401 JSON (cookies still cleared) so the client store —
 * the only thing that can reset SPA state — picks it up via `init()`.
 */
const isBackgroundRequest = (request: NextRequest): boolean =>
  request.headers.has("next-action") || request.headers.has("rsc");

const sessionExpiredResponse = (request: NextRequest): NextResponse => {
  const response = NextResponse.json(
    { code: "SESSION_EXPIRED", message: "Session expired. Please login again." },
    { status: 401 },
  );
  clearAuthCookies(response.cookies);
  return response;
};

const redirectToLogout = (
  request: NextRequest,
  pathname: string,
  isProtected: boolean,
): NextResponse => {
  const normalized = getPathnameWithoutLocale(pathname);
  if (isBackgroundRequest(request)) {
    return sessionExpiredResponse(request);
  }
  const baseTarget = isProtected ? "/login" : normalized || "/login";
  const callback =
    isProtected &&
    normalized &&
    normalized !== "/" &&
    normalized !== "/login" &&
    normalized !== "/register" &&
    normalized !== "/forgot-password"
      ? normalized
      : null;

  const targetUrlStr = withCallbackUrl(baseTarget, callback);
  const url = new URL(targetUrlStr, request.url);
  url.searchParams.set("logout", "1");

  console.log(
    `[Proxy:redirectToLogout] Clearing auth cookies and redirecting to: ${url.pathname}${url.search}`,
  );

  const response = withI18nCookies(NextResponse.redirect(url), request);
  clearAuthCookies(response.cookies);
  return response;
};

const redirectToLogin = (
  request: NextRequest,
  pathname: string,
): NextResponse => {
  if (isBackgroundRequest(request)) {
    return sessionExpiredResponse(request);
  }
  const normalized = getPathnameWithoutLocale(pathname);
  const target = withCallbackUrl(
    "/login",
    normalized && normalized !== "/" && normalized !== "/login"
      ? normalized
      : null,
  );
  const url = new URL(target, request.url);
  return withI18nCookies(NextResponse.redirect(url), request);
};

const redirectToCallback = (request: NextRequest): NextResponse => {
  let redirectRoute = "/dashboard";
  const callback_url =
    request.nextUrl.searchParams.get("callback_url") ||
    request.nextUrl.searchParams.get("callbackUrl");

  if (callback_url && callback_url !== "/") {
    redirectRoute = getPathnameWithoutLocale(callback_url);
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
  const { pathname, searchParams } = request.nextUrl;
  const normalizedPathname = getPathnameWithoutLocale(pathname);

  // Capture tokens from URL (e.g. from Social Login or OAuth redirects)
  const urlAccessToken =
    searchParams.get("accessToken") || searchParams.get("token");
  const urlRefreshToken =
    searchParams.get("refreshToken") || searchParams.get("refresh_token");

  // EXCLUDE verification and reset-password routes from stripping token
  const isTokenVerifyRoute =
    normalizedPathname.includes("/verify-email") ||
    normalizedPathname.includes("/reset-password");

  if (urlAccessToken && !isTokenVerifyRoute) {
    console.log(`[Proxy:urlTokens] setting cookies from URL for "${pathname}"`);
    const nextResponse = withI18nCookies(
      NextResponse.redirect(new URL(pathname, request.url)),
      request,
    );
    setAccessToken(nextResponse.cookies, urlAccessToken);
    if (urlRefreshToken) {
      setRefreshToken(nextResponse.cookies, urlRefreshToken);
    }
    return nextResponse;
  }

  const isPathProtected = isProtectedRoute(normalizedPathname);
  const isPathAuth = isAuthRoute(normalizedPathname);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  console.log(
    `[Proxy:req] "${pathname}" → normalized "${normalizedPathname}":`,
    `protected=${isPathProtected} auth=${isPathAuth} bg=${isBackgroundRequest(request)}`,
    `access=${tok(accessToken)} refresh=${tok(refreshToken)}`,
    urlAccessToken ? "urlTokens=yes" : "",
  );

  /*
   * 1. Auth routes (/, /register, /forgot-password)
   *
   * If already authenticated with a valid token, don't allow auth pages; redirect to dashboard.
   * If access token is expired/invalid:
   *   - If refresh token exists, try refreshing.
   *   - If no refresh token or refresh fails, clear cookies and allow viewing auth page.
   */
  if (isPathAuth) {
    console.log(`[Proxy:authRoute] "${pathname}"`);
    if (accessToken) {
      const isExpired = checkTokenAboutToExpire(accessToken);
      if (!isExpired) {
        console.log(`[Proxy:authRoute] valid access → callback`);
        return redirectToCallback(request);
      }

      if (refreshToken) {
        console.log(`[Proxy:authRoute] expired access → refresh + callback`);
        return refreshSession(
          refreshToken,
          request,
          pathname,
          isPathProtected,
          true,
        );
      }

      // Expired accessToken and no refreshToken -> clear cookies and allow viewing auth page
      console.log(`[Proxy:authRoute] expired access, no refresh → clear + pass`);
      const response = handleI18nRouting(request);
      clearAuthCookies(response.cookies);
      return response;
    }

    if (refreshToken) {
      console.log(`[Proxy:authRoute] no access → refresh + callback`);
      return refreshSession(
        refreshToken,
        request,
        pathname,
        isPathProtected,
        true,
      );
    }

    console.log(`[Proxy:authRoute] no tokens → pass`);
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
      console.log(`[Proxy:access] valid → pass ("${normalizedPathname}")`);
      return handleI18nRouting(request);
    }

    /*
     * Access token is about to expire or already expired.
     * Try refresh regardless of the route.
     */
    if (refreshToken) {
      console.log(
        `[Proxy] Access token expiring/expired for "${normalizedPathname}" -> initiating session refresh`,
      );
      return refreshSession(refreshToken, request, pathname, isPathProtected);
    }

    /*
     * No refresh token available to refresh with!
     * Refreshing the token has failed.
     * Clear the expired/invalid accessToken cookie and reset expert state!
     */
    console.log(`[Proxy:access] expired access, no refresh → logout`);
    return redirectToLogout(request, pathname, isPathProtected);
  }

  /*
   * 3. No access token
   *
   * Try refresh if refresh token exists,
   * regardless of whether the route is protected.
   */
  if (refreshToken) {
    console.log(`[Proxy:noAccess] no access, refresh present → refresh`);
    return refreshSession(refreshToken, request, pathname, isPathProtected);
  }

  /*
   * 4. No tokens
   *
   * Protected → login (root /)
   * Public → continue
   */
  if (isPathProtected) {
    console.log(`[Proxy:noTokens] protected → login`);
    return redirectToLogin(request, pathname);
  }

  console.log(`[Proxy:noTokens] public → pass`);
  return handleI18nRouting(request);
}

// Matcher configuration for proxy
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|\\.well-known).*)",
  ],
};
