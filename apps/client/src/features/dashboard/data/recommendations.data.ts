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
    cta: "Explore Guidance",
    href: PATHS.DASHBOARD_MATCHING,
    icon: HeartHandshake,
    badge: "Astrology Insight",
    bgColor: "from-rose-500/10 to-orange-500/5",
    iconColor: "text-rose-600 bg-rose-100",
  },
  {
    title: "Your Kundli Chart Report",
    desc: "Deep dive into your D1 birth chart, planetary houses, Mahadasha cycles, and remedies.",
    cta: "View Full Chart",
    href: PATHS.DASHBOARD_KUNDLI,
    icon: Scroll,
    badge: "Vedic Chart",
    bgColor: "from-indigo-500/10 to-purple-500/5",
    iconColor: "text-indigo-600 bg-indigo-100",
  },
];
