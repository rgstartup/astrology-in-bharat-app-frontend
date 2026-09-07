"use client";

import { PATHS } from "@repo/routes";
import { useTranslations } from "next-intl";

const CalculatorMenu = () => {
  const t = useTranslations("Header");

  return [
    {
      label: t("dropdownItems.Horoscope"),
      href: PATHS.HOROSCOPE,
    },
    {
      label: t("dropdownItems.LoveCalc"),
      href: PATHS.LOVE_CALCULATOR,
    },
    {
      label: t("dropdownItems.DahejCalc"),
      href: PATHS.DAHEJ_CALCULATOR,
    },
    {
      label: t("dropdownItems.FlamesCalc"),
      href: PATHS.FLAMES_CALCULATOR,
    },
    {
      label: t("dropdownItems.LoveCompat"),
      href: PATHS.LOVE_COMPATIBILITY_CALCULATOR,
    },
    {
      label: t("dropdownItems.MarriageAge"),
      href: PATHS.MARRIAGE_AGE_CALCULATOR,
    },
    {
      label: t("dropdownItems.SoulmateInitials"),
      href: PATHS.SOULMATE_NAME_INITALS_CALCULATOR,
    },
    {
      label: t("dropdownItems.LuckyNumber"),
      href: PATHS.LUCKY_NUMBER_CALCULATOR,
    },
    {
      label: t("dropdownItems.LifePath"),
      href: PATHS.LIFE_PATH_CALCULATOR,
    },
    {
      label: t("dropdownItems.NameNumerology"),
      href: PATHS.NAME_NUMEROLOGY_CALCULATOR,
    },
    {
      label: t("dropdownItems.ZodiacCompat"),
      href: PATHS.ZODIAC_SIGN_CALCULATOR,
    },
    {
      label: t("dropdownItems.Nakshatra"),
      href: PATHS.NAKSHATRA_FINDER,
    },
    {
      label: t("dropdownItems.LoyalPartner"),
      href: PATHS.LOYAL_PARTNER_CALCULATOR,
    },
    {
      label: t("dropdownItems.Breakup"),
      href: PATHS.BREAKUP_PATCHUP_CALCULATOR,
    },
    {
      label: t("dropdownItems.OnlinePuja"),
      href: PATHS.ONLINE_PUJA,
    },
  ];
};

export default CalculatorMenu;
