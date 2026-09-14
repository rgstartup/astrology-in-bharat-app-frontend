"use client";

import { useLocale, useMessages } from "next-intl";
import type { AppLocale } from "./routing";

/**
 * Transitional adapter for the homepage while its existing nested message
 * structure is migrated to individual `useTranslations` keys.
 */
export function useHomeTranslations() {
  const messages = useMessages();
  const lang = useLocale() as AppLocale;

  return {
    lang,
    t: messages.Home,
  };
}
