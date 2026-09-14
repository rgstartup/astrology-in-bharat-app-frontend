"use client";

import { PATHS } from "@repo/routes";
import { useTranslations } from "next-intl";

const CalculatorMenu = () => {
  const t = useTranslations("Header");

  return [
    {
      label: t("dropdownItems.LoveCalc"),
      href: PATHS.ASTROLOGY.LOVE_CALCULATOR,
    },
    {
      label: t("dropdownItems.DahejCalc"),
      href: PATHS.ASTROLOGY.CALCULATOR.DAHEJ_CALCULATOR,
    },
    {
      label: t("dropdownItems.FlamesCalc"),
      href: PATHS.ASTROLOGY.CALCULATOR.FLAMES_CALCULATOR,
    },
    {
      label: t("dropdownItems.LoveCompat"),
      href: PATHS.ASTROLOGY.CALCULATOR.LOVE_COMPATIBILITY_CALCULATOR,
    },
    {
      label: t("dropdownItems.MarriageAge"),
      href: PATHS.ASTROLOGY.CALCULATOR.MARRIAGE_AGE_CALCULATOR,
    },
    {
      label: t("dropdownItems.SoulmateInitials"),
      href: PATHS.ASTROLOGY.CALCULATOR.SOULMATE_NAME_INITALS_CALCULATOR,
    },
    {
      label: t("dropdownItems.LuckyNumber"),
      href: PATHS.ASTROLOGY.CALCULATOR.LUCKY_NUMBER_CALCULATOR,
    },
    {
      label: t("dropdownItems.LifePath"),
      href: PATHS.ASTROLOGY.CALCULATOR.LIFE_PATH_CALCULATOR,
    },
    {
      label: t("dropdownItems.NameNumerology"),
      href: PATHS.ASTROLOGY.CALCULATOR.NAME_NUMEROLOGY_CALCULATOR,
    },
    {
      label: t("dropdownItems.ZodiacCompat"),
      href: PATHS.ASTROLOGY.CALCULATOR.ZODIAC_SIGN_CALCULATOR,
    },
    {
      label: t("dropdownItems.Nakshatra"),
      href: PATHS.ASTROLOGY.CALCULATOR.NAKSHATRA_FINDER,
    },
    {
      label: t("dropdownItems.LoyalPartner"),
      href: PATHS.ASTROLOGY.CALCULATOR.LOYAL_PARTNER_CALCULATOR,
    },
    {
      label: t("dropdownItems.Breakup"),
      href: PATHS.ASTROLOGY.CALCULATOR.BREAKUP_PATCHUP_CALCULATOR,
    },
    {
      label: t("dropdownItems.OnlinePuja"),
      href: PATHS.ONLINE_PUJA,
    },
  ];
};

export default CalculatorMenu;
