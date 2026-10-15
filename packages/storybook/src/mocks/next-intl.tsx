import React from "react";

/**
 * Storybook mock for `useLocale` from `next-intl`.
 * Returns default "en" without throwing uninitialized intl context errors.
 */
export function useLocale(): string {
  return "en";
}

/**
 * Storybook mock for `useTranslations` from `next-intl`.
 */
export function useTranslations(namespace?: string) {
  const t = (key: string, values?: Record<string, unknown>) => {
    if (values) {
      let result = key;
      for (const [k, v] of Object.entries(values)) {
        result = result.replace(`{${k}}`, String(v));
      }
      return result;
    }
    return key;
  };
  t.rich = (key: string) => key;
  t.raw = (key: string) => key;
  return t;
}

/**
 * Storybook mock for `useMessages` from `next-intl`.
 */
export function useMessages(): Record<string, unknown> {
  return {};
}

/**
 * Storybook mock for `useFormatter` from `next-intl`.
 */
export function useFormatter() {
  return {
    dateTime: (date: Date) => date.toLocaleDateString(),
    number: (num: number) => String(num),
    relativeTime: (_date: Date) => "recently",
  };
}

/**
 * Storybook mock for `useTimeZone` from `next-intl`.
 */
export function useTimeZone(): string {
  return "UTC";
}

/**
 * Storybook mock for `useNow` from `next-intl`.
 */
export function useNow(): Date {
  return new Date();
}

/**
 * Storybook mock for `NextIntlClientProvider`.
 */
export function NextIntlClientProvider({
  children,
}: {
  children?: React.ReactNode;
  [key: string]: unknown;
}) {
  return <>{children}</>;
}
