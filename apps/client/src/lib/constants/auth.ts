export const AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export type AuthCookieName =
  (typeof AUTH_COOKIE_NAMES)[keyof typeof AUTH_COOKIE_NAMES];

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}
