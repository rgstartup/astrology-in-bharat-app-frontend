import { PATHS } from "@repo/routes";
import {
  Compass,
  Sun,
  FileText,
  HeartHandshake,
  MessageSquare,
  Users,
  ShoppingBag,
  Wallet,
  Heart,
  Bell,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const ASTROLOGY_SUB_LINKS: NavItem[] = [
  {
    name: "Daily Horoscope",
    href: PATHS.DASHBOARD.HOROSCOPE,
    icon: Sun,
  },
  {
    name: "Saved Kundli",
    href: PATHS.DASHBOARD.KUNDLI,
    icon: Compass,
  },
  {
    name: "Kundli Milan",
    href: PATHS.DASHBOARD.MATCHING,
    icon: HeartHandshake,
  },
  {
    name: "My Reports",
    href: PATHS.DASHBOARD.REPORTS,
    icon: FileText,
  },
];

export const MAIN_SERVICES_NAV: NavItem[] = [
  {
    name: "Consultations",
    href: PATHS.DASHBOARD.CONSULTATIONS,
    icon: MessageSquare,
  },
  {
    name: "Top Astrologers",
    href: PATHS.DASHBOARD.EXPERTS,
    icon: Users,
  },
  {
    name: "My Orders",
    href: PATHS.DASHBOARD.ORDERS,
    icon: ShoppingBag,
  },
  {
    name: "Wallet & Credits",
    href: PATHS.DASHBOARD.WALLET,
    icon: Wallet,
  },
  {
    name: "Saved / Wishlist",
    href: PATHS.DASHBOARD.WISHLIST,
    icon: Heart,
  },
  {
    name: "Notifications",
    href: PATHS.DASHBOARD.NOTIFICATIONS,
    icon: Bell,
  },
];

export const ACCOUNT_NAV_ITEMS: NavItem[] = [
  {
    name: "Vedic Profile",
    href: PATHS.DASHBOARD.PROFILE,
    icon: User,
  },
  {
    name: "Preferences & Settings",
    href: PATHS.DASHBOARD.SETTINGS,
    icon: Settings,
  },
];
