import React from "react";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
}

/**
 * Storybook mock for `@/i18n/navigation` Link component.
 * Renders a plain accessible HTML anchor element without requiring NextIntl context.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} href={href} {...rest}>
      {children}
    </a>
  );
});

/**
 * Storybook mock for `@/i18n/navigation` usePathname hook.
 * Returns "/dashboard" as a deterministic default without throwing useLocale errors.
 */
export function usePathname(): string {
  return "/dashboard";
}

/**
 * Storybook mock for `@/i18n/navigation` useRouter hook.
 */
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

/**
 * Storybook mock for `@/i18n/navigation` redirect function.
 */
export function redirect(_url: string) {
  // no-op in storybook
}

/**
 * Storybook mock for `@/i18n/navigation` getPathname function.
 */
export function getPathname({ href }: { href: string }): string {
  return href;
}

/**
 * Storybook mock for `createNavigation` from `next-intl/navigation`.
 */
export function createNavigation(_routing?: unknown) {
  return {
    Link,
    redirect,
    usePathname,
    useRouter,
    getPathname,
  };
}

