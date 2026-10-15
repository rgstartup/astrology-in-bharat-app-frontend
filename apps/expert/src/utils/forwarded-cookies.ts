import type { NextResponse } from "next/server";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

type ForwardedCookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
  maxAge?: number;
  expires?: Date;
};

/**
 * Splits a combined `Set-Cookie` header value into individual cookie strings.
 * Only used when `Headers.getSetCookie()` is unavailable (older runtimes).
 * Splits on commas that begin a new `name=` pair, so `Expires=Wed, 21 ...`
 * commas are preserved. Safe for our cookies: JWT values are base64url
 * (never contain commas).
 *
 * @param header Combined `set-cookie` header value (may hold N cookies).
 * @returns Individual `Set-Cookie` strings, in order.
 */
function splitSetCookieHeader(header: string): string[] {
  return header.split(/,(?=[^;,=\s]+=)/).map((part) => part.trim());
}

/**
 * Reads every `Set-Cookie` value from backend response headers.
 * Prefers `Headers.getSetCookie()` and falls back to splitting the combined
 * `set-cookie` header on runtimes without it.
 *
 * @param headers Fetch response headers from the backend call.
 * @returns Individual `Set-Cookie` strings (empty when the backend set none).
 */
export function captureSetCookies(headers: Headers): string[] {
  const withGetter = headers as Headers & {
    getSetCookie?: () => string[];
  };
  if (typeof withGetter.getSetCookie === "function") {
    return withGetter.getSetCookie();
  }
  const combined = headers.get("set-cookie");
  if (!combined) return [];
  return splitSetCookieHeader(combined);
}

/**
 * Parses one `Set-Cookie` string into name/value plus Next.js cookie options.
 * Wire `Max-Age` is already in seconds, matching Next.js `maxAge` units, so
 * no conversion is applied — values pass through untouched.
 *
 * @param cookie Single `Set-Cookie` string as sent by the backend.
 * @returns Parsed name, value, and options, or null when unparseable.
 */
function parseSetCookie(cookie: string): {
  name: string;
  value: string;
  options: ForwardedCookieOptions;
} | null {
  const segments = cookie.split(";");
  const pair = segments.shift();
  if (!pair) return null;
  const eq = pair.indexOf("=");
  if (eq <= 0) return null;
  const name = pair.slice(0, eq).trim();
  const value = pair.slice(eq + 1).trim();
  if (!name) return null;

  const options: ForwardedCookieOptions = {};
  for (const attr of segments) {
    const attrEq = attr.indexOf("=");
    const key = (attrEq < 0 ? attr : attr.slice(0, attrEq)).trim().toLowerCase();
    const val = attrEq < 0 ? "" : attr.slice(attrEq + 1).trim();
    if (key === "httponly") {
      options.httpOnly = true;
    } else if (key === "secure") {
      options.secure = true;
    } else if (key === "path" && val) {
      options.path = val;
    } else if (key === "max-age") {
      const secs = parseInt(val, 10);
      if (!Number.isNaN(secs)) options.maxAge = secs;
    } else if (key === "expires" && val && options.maxAge === undefined) {
      const date = new Date(val);
      if (!Number.isNaN(date.getTime())) options.expires = date;
    } else if (key === "samesite") {
      const site = val.toLowerCase();
      if (site === "strict" || site === "lax" || site === "none") {
        options.sameSite = site;
      }
    }
  }
  return { name, value, options };
}

/**
 * Forwards backend `Set-Cookie` strings onto a proxy response byte-for-byte.
 * The backend owns every attribute (maxAge, Secure, SameSite, Path); the
 * frontend adds nothing of its own.
 *
 * @param response Outgoing proxy response to carry the cookies.
 * @param cookies `Set-Cookie` strings captured from the backend response.
 */
export function appendSetCookiesToResponse(
  response: NextResponse,
  cookies: string[],
): void {
  for (const cookie of cookies) {
    response.headers.append("set-cookie", cookie);
  }
}

/**
 * Mirrors backend `Set-Cookie` strings into a Next.js cookie store
 * (login server action). Each cookie is parsed and re-set with the exact
 * attributes the backend sent.
 *
 * @param cookieStore Writable cookie store (`cookies()` in a server action).
 * @param cookies `Set-Cookie` strings captured from the backend response.
 * @returns Names of the cookies that were mirrored.
 */
export function mirrorSetCookies(
  cookieStore: ResponseCookies,
  cookies: string[],
): string[] {
  const mirrored: string[] = [];
  for (const cookie of cookies) {
    const parsed = parseSetCookie(cookie);
    if (!parsed) continue;
    cookieStore.set(parsed.name, parsed.value, parsed.options);
    mirrored.push(parsed.name);
  }
  return mirrored;
}
