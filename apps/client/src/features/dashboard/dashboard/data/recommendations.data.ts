import React from "react";
import { PATHS } from "@repo/routes";
import { HeartHandshake, Scroll } from "lucide-react";

export interface RecItem {
  title: string;
  desc: string;
  cta: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  bgColor: string;
  iconColor: string;
}

export const PERSONALIZED_RECOMMENDATIONS: RecItem[] = [
  {
    title: "Marriage & Kundli Milan",
    desc: "Check compatibility, guna milan scores, and manglik dosha analysis with an expert.",
    cta: "Explore guidance",
    href: PATHS.DASHBOARD.MATCHING,
    icon: HeartHandshake,
    badge: "Astrology insight",
    bgColor: "from-slate-500/10 to-slate-500/5",
    iconColor: "text-[#111111] bg-[#ebe7e1]",
  },
  {
    title: "Your Kundli chart report",
    desc: "Deep dive into your D1 birth chart, planetary houses, Mahadasha cycles, and remedies.",
    cta: "View full chart",
    href: PATHS.DASHBOARD.KUNDLI,
    icon: Scroll,
    badge: "Vedic chart",
    bgColor: "from-slate-500/10 to-slate-500/5",
    iconColor: "text-[#111111] bg-[#ebe7e1]",
  },
];
