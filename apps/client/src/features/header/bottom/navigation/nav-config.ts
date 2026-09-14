import { PATHS } from "@repo/routes";
import {
  Sparkles,
  Sun,
  CalendarDays,
  Clock,
  UserCheck,
  Compass,
  Flame,
  ShieldCheck,
  Landmark,
  Radio,
  Flower2,
  ShoppingBag,
  Binary,
  HeartHandshake,
  Gem,
  Hash,
  Palette,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItemConfig {
  id: string;
  titleKey: string;
  descKey: string;
  badgeKey?: string;
  href: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export interface NavMenuSectionConfig {
  id: string;
  titleKey: string;
  descKey?: string;
  href?: string;
  icon?: LucideIcon;
  items?: NavSubItemConfig[];
}

export const NAV_ITEMS_CONFIG: NavMenuSectionConfig[] = [
  {
    id: "astrology",
    titleKey: "astrology.title",
    descKey: "astrology.description",
    items: [
      {
        id: "kundli",
        titleKey: "astrology.items.kundli.title",
        descKey: "astrology.items.kundli.description",
        badgeKey: "astrology.items.kundli.badge",
        href: PATHS.ASTROLOGY.KUNDLI,
        icon: Sparkles,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-50 group-hover:bg-amber-100",
      },
      {
        id: "horoscope",
        titleKey: "astrology.items.horoscope.title",
        descKey: "astrology.items.horoscope.description",
        href: PATHS.ASTROLOGY.HOROSCOPE,
        icon: Sun,
        iconColor: "text-orange-600",
        iconBg: "bg-orange-50 group-hover:bg-orange-100",
      },
      {
        id: "panchang",
        titleKey: "astrology.items.panchang.title",
        descKey: "astrology.items.panchang.description",
        href: PATHS.ASTROLOGY.PANCHANG,
        icon: CalendarDays,
        iconColor: "text-rose-600",
        iconBg: "bg-rose-50 group-hover:bg-rose-100",
      },
      {
        id: "muhurat",
        titleKey: "astrology.items.muhurat.title",
        descKey: "astrology.items.muhurat.description",
        href: PATHS.ASTROLOGY.MUHURAT,
        icon: Clock,
        iconColor: "text-indigo-600",
        iconBg: "bg-indigo-50 group-hover:bg-indigo-100",
      },
    ],
  },
  {
    id: "calculators",
    titleKey: "calculators.title",
    descKey: "calculators.description",
    items: [
      {
        id: "loveCompatibility",
        titleKey: "calculators.items.loveCompatibility.title",
        descKey: "calculators.items.loveCompatibility.description",
        badgeKey: "calculators.items.loveCompatibility.badge",
        href: PATHS.ASTROLOGY.CALCULATOR.LOVE_COMPATIBILITY_CALCULATOR,
        icon: HeartHandshake,
        iconColor: "text-rose-600",
        iconBg: "bg-rose-50 group-hover:bg-rose-100",
      },
      {
        id: "marriageAge",
        titleKey: "calculators.items.marriageAge.title",
        descKey: "calculators.items.marriageAge.description",
        href: PATHS.ASTROLOGY.CALCULATOR.MARRIAGE_AGE_CALCULATOR,
        icon: Gem,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-50 group-hover:bg-amber-100",
      },
      {
        id: "nameNumerology",
        titleKey: "calculators.items.nameNumerology.title",
        descKey: "calculators.items.nameNumerology.description",
        href: PATHS.ASTROLOGY.CALCULATOR.NAME_NUMEROLOGY_CALCULATOR,
        icon: Hash,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50 group-hover:bg-blue-100",
      },
      {
        id: "luckyNumber",
        titleKey: "calculators.items.luckyNumber.title",
        descKey: "calculators.items.luckyNumber.description",
        href: PATHS.ASTROLOGY.CALCULATOR.LUCKY_NUMBER_CALCULATOR,
        icon: Palette,
        iconColor: "text-teal-600",
        iconBg: "bg-teal-50 group-hover:bg-teal-100",
      },
      {
        id: "soulmateInitials",
        titleKey: "calculators.items.soulmateInitials.title",
        descKey: "calculators.items.soulmateInitials.description",
        href: PATHS.ASTROLOGY.CALCULATOR.SOULMATE_NAME_INITALS_CALCULATOR,
        icon: Sparkles,
        iconColor: "text-purple-600",
        iconBg: "bg-purple-50 group-hover:bg-purple-100",
      },
      {
        id: "flames",
        titleKey: "calculators.items.flames.title",
        descKey: "calculators.items.flames.description",
        href: PATHS.ASTROLOGY.CALCULATOR.FLAMES_CALCULATOR,
        icon: Flame,
        iconColor: "text-orange-600",
        iconBg: "bg-orange-50 group-hover:bg-orange-100",
      },
    ],
  },
  {
    id: "experts",
    titleKey: "experts.title",
    descKey: "experts.description",
    items: [
      {
        id: "astrologers",
        titleKey: "experts.items.astrologers.title",
        descKey: "experts.items.astrologers.description",
        href: PATHS.EXPERTS.ASTROLOGERS,
        icon: UserCheck,
        iconColor: "text-orange-600",
        iconBg: "bg-orange-50 group-hover:bg-orange-100",
      },
      {
        id: "numerologists",
        titleKey: "experts.items.numerologists.title",
        descKey: "experts.items.numerologists.description",
        href: PATHS.EXPERTS.NUMEROLOGISTS,
        icon: Binary,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50 group-hover:bg-blue-100",
      },
      {
        id: "vastu",
        titleKey: "experts.items.vastuExperts.title",
        descKey: "experts.items.vastuExperts.description",
        href: PATHS.EXPERTS.VASTU,
        icon: Compass,
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
      },
      {
        id: "pandit",
        titleKey: "experts.items.pandit.title",
        descKey: "experts.items.pandit.description",
        href: PATHS.EXPERTS.PANDIT,
        icon: Flame,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-50 group-hover:bg-amber-100",
      },
      {
        id: "purohit",
        titleKey: "experts.items.purohit.title",
        descKey: "experts.items.purohit.description",
        href: PATHS.EXPERTS.PUROHIT,
        icon: ShieldCheck,
        iconColor: "text-purple-600",
        iconBg: "bg-purple-50 group-hover:bg-purple-100",
      },
    ],
  },
  {
    id: "ritualsPuja",
    titleKey: "ritualsPuja.title",
    descKey: "ritualsPuja.description",
    href: PATHS.ONLINE_PUJA,
    icon: Flower2,
  },
  {
    id: "products",
    titleKey: "products.title",
    descKey: "products.description",
    href: PATHS.PRODUCTS,
    icon: ShoppingBag,
  },
  {
    id: "devotion",
    titleKey: "devotion.title",
    descKey: "devotion.description",
    items: [
      {
        id: "temples",
        titleKey: "devotion.items.temples.title",
        descKey: "devotion.items.temples.description",
        href: PATHS.DEVOTION.TEMPLES,
        icon: Landmark,
        iconColor: "text-amber-700",
        iconBg: "bg-amber-50 group-hover:bg-amber-100",
      },
      {
        id: "live",
        titleKey: "devotion.items.live.title",
        descKey: "devotion.items.live.description",
        badgeKey: "devotion.items.live.badge",
        href: PATHS.DEVOTION.LIVE,
        icon: Radio,
        iconColor: "text-red-600",
        iconBg: "bg-red-50 group-hover:bg-red-100",
      },
    ],
  },
];
