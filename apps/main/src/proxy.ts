import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { decodeToken } from "@repo/lib";
import { api } from "./actions";
import { setAccessToken, setRefreshToken } from "./actions/cookie";

const PROTECTED_ROUTES = ["/client"];
const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((prefix) => pathname.startsWith(prefix));

const AUTH_ROUTES = ["/sign-in", "/register"];
const isAuthRoute = (pathname: string) => AUTH_ROUTES.includes(pathname);

async function refreshSession(
  refreshToken: string,
  request: NextRequest,
  pathname: string,
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
    }>(`/auth/refresh`);

  if (error || !data?.accessToken || !data.refreshToken) {
    return redirectToLogin(request, pathname);
  }

  const newAccessToken = data?.accessToken;
  const newRefreshToken = data?.refreshToken;

  const response = redirect ? redirectToCallback(request) : NextResponse.next();
  setAccessToken(response.cookies, newAccessToken);
  setRefreshToken(response.cookies, newRefreshToken);

  return response;
}

const redirectToLogin = (
  request: NextRequest,
  pathname: string,
): NextResponse => {
  const url = new URL("/sign-in", request.url);
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
};

const redirectToCallback = (request: NextRequest): NextResponse => {
  let redirectRoute = "/client/profile";
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");

  if (callbackUrl && callbackUrl !== "/") {
    redirectRoute = callbackUrl;
  }

  const url = new URL(redirectRoute, request.url);

  return NextResponse.redirect(url);
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

  console.log({ isPathProtected, isPathAuth });

  // 1. Get tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (isPathProtected) {
    if (accessToken) {
      const tokenAboutToExpire = checkTokenAboutToExpire(accessToken);

      if (!tokenAboutToExpire) return NextResponse.next();

      if (!refreshToken) return redirectToLogin(request, pathname);
      return refreshSession(refreshToken, request, pathname);
    }

    if (refreshToken) {
      return refreshSession(refreshToken, request, pathname);
    }

    return redirectToLogin(request, pathname);
  }

  if (isPathAuth) {
    if (accessToken) {
      return redirectToCallback(request);
    }

    if (refreshToken) {
      return refreshSession(refreshToken, request, pathname, true);
    }
  }

  return NextResponse.next();
}

// Matcher configuration for proxy
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
