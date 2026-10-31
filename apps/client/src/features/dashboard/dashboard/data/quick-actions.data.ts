import { PATHS } from "@repo/routes";
import {
  MessageSquare,
  Compass,
  HeartHandshake,
  Sun,
  type LucideIcon,
} from "@repo/design/lucide";

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
    title: "Talk to astrologer",
    desc: "Live 1-on-1 chat or call with top verified Vedic experts",
    href: PATHS.DASHBOARD.EXPERTS,
    icon: MessageSquare,
    color: "from-slate-500/10 to-slate-500/5",
    iconColor: "text-[#111111] bg-[#ebe7e1]",
    badge: "Instant connect",
  },
  {
    title: "Kundli Milan",
    desc: "Comprehensive 36 Guna Milan & Manglik dosha evaluation",
    href: PATHS.DASHBOARD.MATCHING,
    icon: HeartHandshake,
    color: "from-slate-500/10 to-slate-500/5",
    iconColor: "text-[#111111] bg-[#ebe7e1]",
    badge: "Compatibility",
  },
  {
    title: "Saved Kundli chart",
    desc: "Explore D1 birth chart, planetary houses & current dasha",
    href: PATHS.DASHBOARD.KUNDLI,
    icon: Compass,
    color: "from-slate-500/10 to-slate-500/5",
    iconColor: "text-[#111111] bg-[#ebe7e1]",
    badge: "D1 birth chart",
  },
  {
    title: "Today's horoscope",
    desc: "Daily planetary aspects, transit analysis & remedial gemstones",
    href: PATHS.DASHBOARD.HOROSCOPE,
    icon: Sun,
    color: "from-slate-500/10 to-slate-500/5",
    iconColor: "text-[#111111] bg-[#ebe7e1]",
    badge: "Transit today",
  },
];
