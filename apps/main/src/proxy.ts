import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { decodeToken } from "@repo/lib";
import { api } from "./actions";
import { setAccessToken, setRefreshToken } from "./actions/cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1";

const PROTECTED_ROUTES = ["/client"];
const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((prefix) => pathname.startsWith(prefix));

const AUTH_ROUTES = ["/sign-in", "/register"];
const isAuthRoute = (pathname: string) => AUTH_ROUTES.includes(pathname);

async function refreshSession(
  refreshToken: string,
  request: NextRequest,
  pathname: string,
) {
  const [data, error] = await api.post<{
    accessToken: string;
    refreshToken: string;
  }>(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

  if (error || !data?.accessToken || !data.refreshToken) {
    return redirectToLogin(request, pathname);
  }

  const newAccessToken = data?.accessToken;
  const newRefreshToken = data?.refreshToken;

  const response = NextResponse.next();
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

const redirectToClientProfile = (request: NextRequest): NextResponse => {
  const url = new URL("/client/profile", request.url);
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

  const bothTokens = accessToken && refreshToken;

  if (!bothTokens && isPathProtected) {
    console.log("no tokens");

    return redirectToLogin(request, pathname);
  }

  const onlyRefreshToken = !accessToken && refreshToken;
  if (onlyRefreshToken && isPathProtected) {
    console.log("only refresh token");
    return refreshSession(refreshToken, request, pathname);
  }

  if (bothTokens && isPathProtected) {
    const tokenAboutToExpire = checkTokenAboutToExpire(accessToken);
    if (tokenAboutToExpire) {
      console.log("token about to expire");
      return refreshSession(refreshToken, request, pathname);
    }
  }

  if (isPathAuth && accessToken) {
    return redirectToClientProfile(request);
  }

  return NextResponse.next();
}

// Matcher configuration for proxy
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
