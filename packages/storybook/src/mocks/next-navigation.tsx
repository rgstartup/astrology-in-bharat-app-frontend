/**
 * Storybook mock for `next/navigation` hooks and routing utilities.
 */

export function usePathname(): string {
  return "/dashboard";
}

export function useRouter() {
  return {
    push: (_url: string) => undefined,
    replace: (_url: string) => undefined,
    back: () => undefined,
    forward: () => undefined,
    prefetch: (_url: string) => Promise.resolve(),
    refresh: () => undefined,
  };
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}

export function useParams(): Record<string, string> {
  return { locale: "en", id: "1" };
}

export function redirect(_url: string) {
  // no-op
}

export function notFound() {
  // no-op
}
