"use client";

import { PATHS } from "@repo/routes";
import { useTranslations } from "next-intl";

const ServiceDataKeys = () => {
  const t = useTranslations("Header");

  return [
    {
      id: 1,
      key: t("services.Matchmaking"),
      icon: "images/top-icon1.png",
      href: PATHS.ASTROLOGY.CALCULATOR.MARRIAGE_AGE_CALCULATOR,
      isInternal: true,
    },
    {
      id: 2,
      key: t("services.GunaMilan"),
      icon: "images/top-icon2.png",
      href: PATHS.ASTROLOGY.KUNDALI_MATCHING,
      isInternal: true,
    },
    {
      id: 3,
      key: t("services.OnlinePuja"),
      icon: "images/top-icon3.png",
      href: PATHS.ONLINE_PUJA,
      isInternal: true,
    },
    {
      id: 4,
      key: t("services.LoveMatch"),
      icon: "images/top-icon4.png",
      href: PATHS.ASTROLOGY.LOVE_CALCULATOR,
      isInternal: true,
    },
    {
      id: 7,
      key: t("services.MatchAnalysis"),
      icon: "images/top-icon6.png",
      href: PATHS.ASTROLOGY.KUNDALI_MATCHING,
      isInternal: true,
    },
  ];
};

export default ServiceDataKeys;
