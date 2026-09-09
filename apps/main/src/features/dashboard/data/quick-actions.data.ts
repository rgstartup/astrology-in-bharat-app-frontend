import { PATHS } from "@repo/routes";
import {
  MessageSquare,
  Compass,
  HeartHandshake,
  Sun,
  type LucideIcon,
} from "lucide-react";

export interface QuickActionItem {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
  badge: string;
}

export const DASHBOARD_QUICK_ACTIONS: QuickActionItem[] = [
  {
    title: "Talk to Astrologer",
    desc: "Live 1-on-1 chat or call with top verified Vedic experts",
    href: PATHS.DASHBOARD_EXPERTS,
    icon: MessageSquare,
    color: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-[#ff6b00] bg-orange-100/80",
    badge: "Instant Connect",
  },
  {
    title: "Kundli Milan",
    desc: "Comprehensive 36 Guna Milan & Manglik dosha evaluation",
    href: PATHS.DASHBOARD_MATCHING,
    icon: HeartHandshake,
    color: "from-rose-500/10 to-pink-500/10",
    iconColor: "text-rose-600 bg-rose-100/80",
    badge: "Compatibility",
  },
  {
    title: "Saved Kundli Chart",
    desc: "Explore D1 birth chart, planetary houses & current dasha",
    href: PATHS.DASHBOARD_KUNDLI,
    icon: Compass,
    color: "from-indigo-500/10 to-blue-500/10",
    iconColor: "text-indigo-600 bg-indigo-100/80",
    badge: "D1 Birth Chart",
  },
  {
    title: "Today's Horoscope",
    desc: "Daily planetary aspects, transit analysis & remedial gemstones",
    href: PATHS.DASHBOARD_HOROSCOPE,
    icon: Sun,
    color: "from-amber-500/10 to-yellow-500/10",
    iconColor: "text-amber-600 bg-amber-100/80",
    badge: "Transit Today",
  },
];
