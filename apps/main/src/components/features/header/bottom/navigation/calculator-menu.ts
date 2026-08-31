"use client";

import { PATHS } from "@repo/routes"
import { headerTranslations, useLanguageStore } from "@repo/store";

const CalculatorMenu = () => {

    const { lang } = useLanguageStore();
    const t = headerTranslations[lang];

    return [
        {
            label: t.dropHoroscope,
            href: PATHS.HOROSCOPE,
        },
        {
            label: t.dropLoveCalc,
            href: PATHS.LOVE_CALCULATOR,
        },
        {
            label: t.dropDahejCalc,
            href: PATHS.DAHEJ_CALCULATOR,
        },
        {
            label: t.dropFlamesCalc,
            href: PATHS.FLAMES_CALCULATOR,
        },
        {
            label: t.dropLoveCompat,
            href: PATHS.LOVE_COMPATIBILITY_CALCULATOR,
        },
        {
            label: t.dropMarriageAge,
            href: PATHS.MARRIAGE_AGE_CALCULATOR,
        },
        {
            label: t.dropSoulmateInitials,
            href: PATHS.SOULMATE_NAME_INITALS_CALCULATOR,
        },
        {
            label: t.dropLuckyNumber,
            href: PATHS.LUCKY_NUMBER_CALCULATOR,
        },
        {
            label: t.dropLifePath,
            href: PATHS.LIFE_PATH_CALCULATOR,
        },
        {
            label: t.dropNameNumerology,
            href: PATHS.NAME_NUMEROLOGY_CALCULATOR,
        },
        {
            label: t.dropZodiacCompat,
            href: PATHS.ZODIAC_SIGN_CALCULATOR,
        },
        {
            label: t.dropNakshatra,
            href: PATHS.NAKSHATRA_FINDER,
        },
        {
            label: t.dropLoyalPartner,
            href: PATHS.LOYAL_PARTNER_CALCULATOR,
        },
        {
            label: t.dropBreakup,
            href: PATHS.BREAKUP_PATCHUP_CALCULATOR,
        },
        {
            label: t.dropOnlinePuja,
            href: PATHS.ONLINE_PUJA,
        },
    ]
}

export default CalculatorMenu;