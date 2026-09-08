import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

export const setAccessToken = (
  cookieStore: ResponseCookies,
  accessToken?: string,
) => {
  if (!accessToken) return;

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const setRefreshToken = (
  cookieStore: ResponseCookies,
  refreshToken?: string,
) => {
  if (!refreshToken) return;

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const clearAuthCookies = (cookieStore: ResponseCookies) => {
  const isProd = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };

  cookieStore.set("accessToken", "", options);
  cookieStore.set("refreshToken", "", options);
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};
