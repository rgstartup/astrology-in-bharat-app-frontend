import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { decodeToken } from "@repo/lib";
import { api } from "./actions";
import { setAccessToken, setRefreshToken } from "./actions/cookie";
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

const PROTECTED_ROUTES = ["/client"];
const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((prefix) => pathname.startsWith(prefix));

const AUTH_ROUTES = ["/sign-in", "/register"];
const isAuthRoute = (pathname: string) => AUTH_ROUTES.includes(pathname);

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
    }>("/auth/client/refresh");

  if (error || !data?.accessToken || !data.refreshToken) {
    // Don't mutate request cookies.
    // request.cookies represents the incoming request.

    const response = isProtected
      ? redirectToLogin(request, pathname)
      : handleI18nRouting(request);

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

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
  const url = new URL("/sign-in", request.url);
  url.searchParams.set("callbackUrl", pathname);
  return withI18nCookies(NextResponse.redirect(url), request);
};

const redirectToCallback = (request: NextRequest): NextResponse => {
  let redirectRoute = "/client/profile";
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");

  if (callbackUrl && callbackUrl !== "/") {
    redirectRoute = callbackUrl;
  }

  const url = new URL(redirectRoute, request.url);

  return withI18nCookies(NextResponse.redirect(url), request);
};

const checkTokenAboutToExpire = (accessToken: string) => {
  const payload = decodeToken(accessToken);

  if (!payload || !payload.exp) return false;

  const expiryTime = payload.exp * 1000;
  const currentTime = Date.now();
  const fiveMinutesInMs = 5 * 60 * 1000;

  return expiryTime - currentTime < fiveMinutesInMs;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPathProtected = isProtectedRoute(pathname);
  const isPathAuth = isAuthRoute(pathname);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  /*
   * 1. Auth routes
   *
   * If already authenticated, don't allow /sign-in or /register.
   */
  if (isPathAuth) {
    if (accessToken) {
      // return withDefaultLocaleCookie(redirectToCallback(request), request);
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

    return handleI18nRouting(request);
  }

  /*
   * 2. Access token exists
   *
   * Check whether it needs rotation.
   */
  if (accessToken) {
    const tokenAboutToExpire = checkTokenAboutToExpire(accessToken);

    if (!tokenAboutToExpire) {
      return handleI18nRouting(request);
    }

    /*
     * Access token is about to expire.
     * Try refresh regardless of the route.
     */

    if (refreshToken) {
      console.log("refresh token initiate");
      return refreshSession(refreshToken, request, pathname, isPathProtected);
    }

    /*
     * No refresh token.
     *
     * Protected → login
     * Public → continue
     */
    if (isPathProtected) {
      // return withDefaultLocaleCookie(
      //   redirectToLogin(request, pathname),
      //   request,
      // );

      return redirectToLogin(request, pathname);
    }

    // return withDefaultLocaleCookie(NextResponse.next(), request);
    return handleI18nRouting(request);
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
    // return withDefaultLocaleCookie(redirectToLogin(request, pathname), request);
    return redirectToLogin(request, pathname);
  }

  // return withDefaultLocaleCookie(NextResponse.next(), request);
  return handleI18nRouting(request);
}

// Matcher configuration for proxy
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|\\.well-known).*)",
  ],
};
