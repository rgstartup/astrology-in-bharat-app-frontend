import {
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle,
  Flag,
  Flower2,
  Headphones,
  HeartHandshake,
  Landmark,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  Users,
} from "lucide-react";
import type { IPlatformStat } from "@repo/lib/src/types/platform-status";

export const storyHighlights = [
  { icon: UserCheck, label: "Verified Experts" },
  { icon: Flower2, label: "Authentic Guidance" },
  { icon: Lock, label: "Privacy First" },
  { icon: Sparkles, label: "Modern Technology" },
];

export const journey = [
  {
    icon: Flag,
    year: "2020",
    title: "Founded",
    desc: "Started our mission to bring authentic astrology to everyone.",
  },
  {
    icon: Users,
    year: "2021",
    title: "10K+ Users",
    desc: "Grew our community and earned the trust of thousands.",
  },
  {
    icon: BadgeCheck,
    year: "2022",
    title: "Verified Experts",
    desc: "Onboarded experienced astrologers and professionals for accurate guidance.",
  },
  {
    icon: Landmark,
    year: "2023+",
    title: "Nationwide Services",
    desc: "Now serving clients across India with love and dedication.",
  },
];

export const features = [
  {
    icon: ShieldCheck,
    title: "Verified Experts",
    desc: "All astrologers are verified, experienced and highly trusted.",
  },
  {
    icon: MessageSquare,
    title: "Instant Consultation",
    desc: "Connect instantly via chat, call or video with our experts.",
  },
  {
    icon: CheckCircle,
    title: "Accurate Predictions",
    desc: "Get precise and accurate predictions and remedies.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    desc: "100% secure payments with multiple payment options.",
  },
  {
    icon: Headphones,
    title: "24x7 Support",
    desc: "Our support team is always here to help you.",
  },
  {
    icon: Landmark,
    title: "Vedic Knowledge",
    desc: "Guidance based on authentic Vedic scriptures and practices.",
  },
];

export const principles = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To provide accurate, reliable and authentic astrology guidance that empowers people to make informed decisions and lead a happy, blessed and successful life.",
  },
  {
    icon: Flower2,
    title: "Our Vision",
    desc: "To be India's most trusted astrology platform that combines ancient Vedic wisdom with modern technology, helping millions of lives with clarity and positivity.",
  },
  {
    icon: HeartHandshake,
    title: "Our Values",
    list: ["Authenticity", "Compassion", "Tradition", "Innovation"],
  },
];

export const platformStats = (stat: IPlatformStat) => {
  return [
    {
      icon: Users,
      value: stat.clients,
      title: "Happy Users",
      desc: "Registered Clients",
    },
    {
      icon: Award,
      value: stat.verified_experts,
      title: "Verified Astrologers",
      desc: "Expert & Experienced",
    },
    {
      icon: CalendarDays,
      value: stat.chat_sessions,
      title: "Consultations Done",
      desc: "Chat & Call Sessions",
    },
    {
      icon: ShieldCheck,
      value: stat.successful_orders,
      title: "Products Sold",
      desc: "From Our Shop",
    },
  ];
};
