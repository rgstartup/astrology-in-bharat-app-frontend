export function getPathnameOrDefault(
  pathname: string,
  defaultPathname: string,
): string {
  const segments = pathname.split("/").filter(Boolean);

  // "/en", "/hi", etc.
  if (segments.length === 1) {
    return `/${segments[0]}/${defaultPathname.replace(/^\/+/, "")}`;
  }

  return pathname;
}
