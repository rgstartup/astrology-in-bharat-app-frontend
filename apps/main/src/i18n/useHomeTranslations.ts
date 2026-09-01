"use client";

import { useLocale, useMessages } from "next-intl";
import type { AppLocale } from "./config";
import type { homeTranslations } from "@/lib/translations/home";

type HomeTranslations = (typeof homeTranslations)["en"];

/**
 * Transitional adapter for the homepage while its existing nested message
 * structure is migrated to individual `useTranslations` keys.
 */
export function useHomeTranslations() {
  const messages = useMessages();

  return {
    lang: useLocale() as AppLocale,
    t: messages.Home as HomeTranslations,
  };
}
