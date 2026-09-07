import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi"],
  defaultLocale: "en",
  // Routes in this app are not nested under app/[locale], so keep URLs stable
  // and persist the negotiated locale in the existing cookie instead.
  localePrefix: "always",
  localeCookie: {
    name: "locale",
  },
});

export type AppLocale = (typeof routing.locales)[number];

export function isAppLocale(value: string): value is AppLocale {
  return routing.locales.includes(value as AppLocale);
}
