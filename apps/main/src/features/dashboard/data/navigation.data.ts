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
    href: PATHS.DASHBOARD_HOROSCOPE,
    icon: Sun,
  },
  {
    name: "Saved Kundli",
    href: PATHS.DASHBOARD_KUNDLI,
    icon: Compass,
  },
  {
    name: "Kundli Milan",
    href: PATHS.DASHBOARD_MATCHING,
    icon: HeartHandshake,
  },
  {
    name: "My Reports",
    href: PATHS.DASHBOARD_REPORTS,
    icon: FileText,
  },
];

export const MAIN_SERVICES_NAV: NavItem[] = [
  {
    name: "Consultations",
    href: PATHS.DASHBOARD_CONSULTATIONS,
    icon: MessageSquare,
  },
  {
    name: "Top Astrologers",
    href: PATHS.DASHBOARD_EXPERTS,
    icon: Users,
  },
  {
    name: "My Orders",
    href: PATHS.DASHBOARD_ORDERS,
    icon: ShoppingBag,
  },
  {
    name: "Wallet & Credits",
    href: PATHS.DASHBOARD_WALLET,
    icon: Wallet,
  },
  {
    name: "Saved / Wishlist",
    href: PATHS.DASHBOARD_WISHLIST,
    icon: Heart,
  },
  {
    name: "Notifications",
    href: PATHS.DASHBOARD_NOTIFICATIONS,
    icon: Bell,
  },
];

export const ACCOUNT_NAV_ITEMS: NavItem[] = [
  {
    name: "Vedic Profile",
    href: PATHS.DASHBOARD_PROFILE,
    icon: User,
  },
  {
    name: "Preferences & Settings",
    href: PATHS.DASHBOARD_SETTINGS,
    icon: Settings,
  },
];
