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
