import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isAppLocale, type AppLocale } from "./config";

/**
 * Request-scoped next-intl configuration.
 *
 * The locale is selected by the `locale` cookie so the initial HTML is already
 * translated on the server.
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value ?? defaultLocale;
  const locale: AppLocale = isAppLocale(cookieLocale)
    ? cookieLocale
    : defaultLocale;
  const messages = (await import(`../../messages/${locale}`)).default;

  return {
    locale,
    messages,
  };
});
