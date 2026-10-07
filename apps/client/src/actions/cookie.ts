import { cookies } from "next/headers";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { AUTH_COOKIE_NAMES, type AuthTokens } from "@/lib/constants/auth";

export { AUTH_COOKIE_NAMES };
export type { AuthTokens, AuthCookieName } from "@/lib/constants/auth";

const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};

/**
 * Get auth tokens (accessToken, refreshToken) from cookies in Server Actions / Server Components.
 */
export async function getAuthTokens(): Promise<AuthTokens> {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value,
    refreshToken: cookieStore.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value,
  };
}

/**
 * Get accessToken string from cookies in Server Actions / Server Components.
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value;
}

/**
 * Get refreshToken string from cookies in Server Actions / Server Components.
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value;
}

export const setAccessToken = (cookieStore: ResponseCookies, accessToken?: string) => {
  if (!accessToken) return;

  cookieStore.set(AUTH_COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const setRefreshToken = (cookieStore: ResponseCookies, refreshToken?: string) => {
  if (!refreshToken) return;

  cookieStore.set(AUTH_COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const clearAuthCookies = (cookieStore: ResponseCookies): void => {
  const options = {
    ...cookieOptions,
    maxAge: 0,
    expires: new Date(0),
  };

  cookieStore.set(AUTH_COOKIE_NAMES.ACCESS_TOKEN, "", options);
  cookieStore.set(AUTH_COOKIE_NAMES.REFRESH_TOKEN, "", options);
  cookieStore.delete(AUTH_COOKIE_NAMES.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIE_NAMES.REFRESH_TOKEN);
};
