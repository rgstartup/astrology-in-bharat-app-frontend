"use client";

import { PATHS } from "@repo/routes";
import { headerTranslations, useLanguageStore } from "@repo/store";
import Link from "next/link";

interface MobileSubMenuProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMobileSubMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showMobileSubMenu: boolean;
}

const MobileSubMenu = (props: MobileSubMenuProps) => {
  const { lang } = useLanguageStore();
  const t =
    headerTranslations[lang as keyof typeof headerTranslations] ||
    headerTranslations.en;

  const closeMenu = () => {
    props.setIsMenuOpen(false);
    props.setShowMobileSubMenu(false);
  };

  if (!props.showMobileSubMenu) return null;

  return (
    <ul
      className="list-none pl-3 pb-2"
      style={{
        borderLeft: "3px solid var(--primary-color, #e67e22)",
      }}
    >
      {[
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
      ].map((item) => (
        <li
          key={item.href}
          className="py-2.5 border-b border-white/5 last:border-0 ml-4"
        >
          <Link
            href={item.href}
            className="no-underline text-white/70 hover:text-orange transition-all"
            style={{ fontSize: "14px" }}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MobileSubMenu;
