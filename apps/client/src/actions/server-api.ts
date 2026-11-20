import { cookies } from "next/headers";
import { createExpertApiEnvelopeInstance } from "@/lib/api-envelope";
import { API_ROUTES } from "@/lib/api-routes";
import { AUTH_COOKIE_NAMES } from "@/lib/constants/auth";
import { type Result, type ApiErrorBody, ApiError } from "@repo/safe-fetch";

const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL!;

export { API_ROUTES, AUTH_COOKIE_NAMES, type Result, type ApiErrorBody, ApiError };

/**
 * Server-only API instance that automatically forwards HTTP-only cookies
 * (accessToken/refreshToken) on every request. Do NOT import this in
 * client components — it depends on `next/headers`.
 */
export const apiV2Server = createExpertApiEnvelopeInstance({
  baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  async onRequest(_url: string, fetchInit: RequestInit) {
    try {
      const cookieHeader = await cookies();
      const headers = fetchInit.headers ? new Headers(fetchInit.headers) : new Headers();
      headers.set("Cookie", cookieHeader.toString());
      fetchInit.headers = headers;
    } catch {
      // Not in a server context
    }
  },
});