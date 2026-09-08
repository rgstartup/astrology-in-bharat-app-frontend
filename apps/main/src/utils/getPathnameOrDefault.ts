import { routing } from "@/i18n/routing";

export function stripLocale(pathname?: string | null): string {
  if (!pathname) return "/";
  const segments = pathname.split("/").filter(Boolean);
  if (
    segments.length > 0 &&
    (routing.locales as readonly string[]).includes(segments[0])
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
