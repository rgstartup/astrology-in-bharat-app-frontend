import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // `getLocale()` is used by the root layout, before `[locale]/layout.tsx`
  // can validate the URL. Never call `notFound()` here: Next.js disallows it
  // while resolving the root layout. The locale layout still rejects invalid
  // URL segments; this fallback only lets root-level rendering complete.
  const resolvedLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}`)).default,
  };
});
