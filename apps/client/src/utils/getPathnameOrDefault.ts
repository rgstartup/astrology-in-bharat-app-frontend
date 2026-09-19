import { routing } from "@/i18n/routing";

export function stripLocale(pathname?: string | null): string {
  if (!pathname) return "/";
  const segments = pathname.split("/").filter(Boolean);
  if (
    segments.length > 0 &&
    (routing.locales as readonly string[]).includes(segments[0] as string)
  ) {
    const withoutLocale = "/" + segments.slice(1).join("/");
    return withoutLocale === "" ? "/" : withoutLocale;
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getPathnameOrDefault(
  pathname: string,
  defaultPathname: string,
): string {
  const cleaned = stripLocale(pathname);
  if (!cleaned || cleaned === "/") {
    return stripLocale(defaultPathname);
  }
  return cleaned;
}

/**
 * Appends a sanitized `callback_url` parameter to a destination path (e.g., PATHS.SIGN_IN or PATHS.REGISTER).
 *
 * @param destinationPath - The path to navigate to (e.g., "/sign-in", "/register")
 * @param callbackUrl - The return URL or route to attach as `callback_url`
 * @returns The destination path with the formatted `callback_url` query param, or untouched if no callback URL is provided.
 */
export function withCallbackUrl(
  destinationPath: string,
  callbackUrl?: string | null,
): string {
  if (!callbackUrl) {
    return destinationPath;
  }

  let cleaned = callbackUrl.trim();
  if (!cleaned || cleaned === "/" || cleaned === destinationPath) {
    return destinationPath;
  }

  // If internal route, strip any locale prefix for clean routing
  if (cleaned.startsWith("/")) {
    cleaned = stripLocale(cleaned);
  }

  if (cleaned === "/" || cleaned === destinationPath) {
    return destinationPath;
  }

  const separator = destinationPath.includes("?") ? "&" : "?";
  return `${destinationPath}${separator}callback_url=${encodeURIComponent(cleaned)}`;
}

export const addCallbackUrl = withCallbackUrl;
