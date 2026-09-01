"use client";

import { useLocale, useMessages } from "next-intl";
import type { AppLocale } from "./config";

export function usePujaTranslations() {
  const messages = useMessages();

  return {
    lang: useLocale() as AppLocale,
    translations: messages.PujaTranslations as any,
    content: messages.PujaContent as any,
  };
}
