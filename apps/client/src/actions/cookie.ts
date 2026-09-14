import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};

export const setAccessToken = (
  cookieStore: ResponseCookies,
  accessToken?: string,
) => {
  if (!accessToken) return;

  cookieStore.set("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const setRefreshToken = (
  cookieStore: ResponseCookies,
  refreshToken?: string,
) => {
  if (!refreshToken) return;

  cookieStore.set("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const clearAuthCookies = (cookieStore: ResponseCookies) => {
  const options = {
    ...cookieOptions,
    maxAge: 0,
    expires: new Date(0),
  };

  cookieStore.set("accessToken", "", options);
  cookieStore.set("refreshToken", "", options);
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};
