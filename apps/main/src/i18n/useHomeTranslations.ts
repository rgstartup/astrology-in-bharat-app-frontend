"use client";

import { useLocale, useMessages } from "next-intl";
import { usePathname } from "next/navigation";
import { isAppLocale, type AppLocale } from "./config";

/**
 * Transitional adapter for the homepage while its existing nested message
 * structure is migrated to individual `useTranslations` keys.
 */
export function useHomeTranslations() {
  const messages = useMessages();
  const pathname = usePathname();
  const providerLocale = useLocale() as AppLocale;
  const pathLocale = pathname.split("/")[1] ?? "";
  const lang = isAppLocale(pathLocale) ? pathLocale : providerLocale;

  return {
    lang,
    t: messages.Home,
  };
}
