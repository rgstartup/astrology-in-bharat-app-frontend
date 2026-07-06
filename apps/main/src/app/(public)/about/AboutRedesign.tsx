"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle,
  Flag,
  Flower2,
  Headphones,
  HeartHandshake,
  Home,
  Landmark,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UserCheck,
  Users,
} from "lucide-react";
import { ChevronRight } from 'lucide-react';
import AboutSeoContent from './about-seo.component';
import GuidanceCTA from "@/components/ui/GuidanceCTA";

const storyHighlights = [
  { icon: UserCheck, label: "Verified Experts" },
  { icon: Flower2, label: "Authentic Guidance" },
  { icon: Lock, label: "Privacy First" },
  { icon: Sparkles, label: "Modern Technology" },
];

const journey = [
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

const features = [
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

const principles = [
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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#ff5c00]">
    <span className="h-px w-7 bg-[#ff5c00]"></span>
    {children}
  </div>
);

const IconBubble = ({
  icon: Icon,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) => (
  <div
    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#fff5ed] text-[#ff5c00] ring-1 ring-[#ffd5bd] ${className}`}
  >
    <Icon className="h-7 w-7" />
  </div>
);

export default function AboutRedesign({ children }: { children: React.ReactNode }) {
  const [platformStats, setPlatformStats] = useState<{
    totalUsers: number;
    verifiedAstrologers: number;
    totalConsultations: number;
    totalProductsSold: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/public/stats/platform-stats')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setPlatformStats(res.data);
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);
  return (
    <main className="bg-[#fffaf5] text-[#2f1119] overflow-x-hidden w-full max-w-[100vw]">
      <section className="mx-auto max-w-[1180px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">

        <div className="flex flex-col items-center w-full max-w-full">
          <div className="relative w-full max-w-full overflow-hidden rounded-[24px] md:rounded-[36px] border border-[#ffd8c0] shadow-[0_18px_45px_rgba(105,47,16,0.12)] mb-8">
            <Image
              src="/images/about-banner-full.png"
              alt="About Astrology in Bharat"
              width={1200}
              height={500}
              priority
              className="w-full max-w-full h-auto object-cover"
            />
            
            {/* Absolute Buttons over Image */}
            <div className="absolute bottom-2 left-4 md:bottom-8 md:left-12 lg:bottom-10 lg:left-16 flex flex-row gap-2 sm:gap-3">
              <Link
                href="/our-experts"
                className="inline-flex h-7 sm:h-12 lg:h-14 items-center justify-center gap-1 sm:gap-3 rounded-lg sm:rounded-xl bg-[#ff5c00] px-3 sm:px-6 lg:px-9 text-[9px] sm:text-sm font-extrabold text-white no-underline shadow-[0_4px_12px_rgba(255,92,0,0.22)] sm:shadow-[0_12px_24px_rgba(255,92,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e95300]"
              >
                <MessageSquare className="h-3 w-3 sm:h-5 sm:w-5" />
                Talk to Expert
              </Link>
              <Link
                href="/our-experts"
                className="inline-flex h-7 sm:h-12 lg:h-14 items-center justify-center gap-1 sm:gap-3 rounded-lg sm:rounded-xl border border-[#ff8b4d] bg-white px-3 sm:px-6 lg:px-9 text-[9px] sm:text-sm font-extrabold text-[#ff5c00] no-underline transition hover:-translate-y-0.5 hover:bg-[#fff3eb]"
              >
                Explore Services
                <ArrowRight className="h-3 w-3 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-[#ffd8c0] bg-white/80 p-5 shadow-[0_12px_32px_rgba(105,47,16,0.08)]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, value: platformStats?.totalUsers, title: "Happy Users", desc: "Registered Clients" },
              { icon: Award, value: platformStats?.verifiedAstrologers, title: "Verified Astrologers", desc: "Expert & Experienced" },
              { icon: CalendarDays, value: platformStats?.totalConsultations, title: "Consultations Done", desc: "Chat & Call Sessions" },
              { icon: ShieldCheck, value: platformStats?.totalProductsSold, title: "Products Sold", desc: "From Our Shop" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-5 px-2 py-3"
              >
                <IconBubble icon={item.icon} />
                <div>
                  <div className="text-3xl font-black leading-none text-[#32131b]">
                    {statsLoading ? (
                      <span className="inline-block h-8 w-16 animate-pulse rounded-md bg-[#ffd8c0]" />
                    ) : (
                      <>{(item.value ?? 0).toLocaleString('en-IN')}</>  
                    )}
                  </div>
                  <div className="mt-2 text-sm font-extrabold text-[#32131b]">
                    {item.title}
                  </div>
                  <div className="mt-1 text-xs font-medium text-[#8b7770]">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-4 py-8 sm:px-6 lg:grid-cols-[0.82fr_1fr] lg:px-8">
        <div className="overflow-hidden rounded-[24px] border border-[#ffc9aa] bg-white shadow-[0_14px_34px_rgba(105,47,16,0.09)]">
          <Image
            src="/images/famous-temples-banner.png"
            alt="Temple and astrology story"
            width={1200}
            height={720}
            className="h-[310px] w-full object-cover object-[72%_center] lg:h-[390px]"
          />
        </div>

        <div>
          <div className="mb-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#ff5c00]">
            Our Story
          </div>
          <h2 className="mb-5 font-serif text-4xl font-bold text-[#32131b]">
            Our Story
          </h2>
          <div className="space-y-5 text-sm font-medium leading-7 text-[#6f5c58]">
            <p>
              Astrology In Bharat was founded with a simple yet powerful vision
              - to make authentic Vedic astrology accessible to everyone.
            </p>
            <p>
              Our team of learned astrologers brings decades of wisdom in Vedic
              scriptures, combined with deep understanding of planetary
              influences, to offer solutions that are practical and easy to
              follow.
            </p>
            <p>
              With thousands of satisfied users, we continue to be a trusted
              companion in your journey towards happiness, prosperity and
              success.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {storyHighlights.map((item) => (
              <div key={item.label} className="text-center">
                <IconBubble
                  icon={item.icon}
                  className="mx-auto h-12 w-12 rounded-xl"
                />
                <div className="mt-3 text-xs font-extrabold text-[#32131b]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[#ffd8c0] bg-white/70 px-5 py-10 shadow-[0_12px_32px_rgba(105,47,16,0.06)]">
          <div className="mb-10 text-center text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#ff5c00]">
            Our Journey
          </div>
          <div className="relative grid gap-8 lg:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-[#ffb286] lg:block"></div>
            {journey.map((item) => (
              <div key={item.year} className="relative text-center">
                <IconBubble
                  icon={item.icon}
                  className="relative z-10 mx-auto mb-4 h-16 w-16 bg-white"
                />
                <div className="text-xs font-extrabold text-[#ff5c00]">
                  {item.year}
                </div>
                <div className="mt-2 text-sm font-black text-[#32131b]">
                  {item.title}
                </div>
                <p className="mx-auto mt-2 max-w-[190px] text-xs font-medium leading-6 text-[#6f5c58]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7 text-center text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#ff5c00]">
          Why Choose Us
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex min-h-[126px] gap-5 rounded-xl border border-[#ffd8c0] bg-white/75 p-6 shadow-[0_10px_26px_rgba(105,47,16,0.04)] transition hover:-translate-y-1 hover:bg-white"
            >
              <IconBubble icon={feature.icon} className="rounded-xl" />
              <div>
                <h3 className="mb-2 text-base font-black text-[#32131b]">
                  {feature.title}
                </h3>
                <p className="text-sm font-medium leading-6 text-[#6f5c58]">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {children}

      <section className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#ffd8c0] bg-white/75 p-8 shadow-[0_10px_26px_rgba(105,47,16,0.04)]"
            >
              <item.icon className="mb-5 h-14 w-14 text-[#ff5c00]" />
              <h3 className="mb-4 text-xl font-black text-[#32131b]">
                {item.title}
              </h3>
              {item.desc ? (
                <p className="text-sm font-medium leading-7 text-[#4f403d]">
                  {item.desc}
                </p>
              ) : (
                <ul className="space-y-2 text-sm font-medium text-[#4f403d]">
                  {item.list?.map((value) => (
                    <li key={value} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#32131b]"></span>
                      {value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <GuidanceCTA />
      </section>

      {/* --- SEO Section --- */}
      <AboutSeoContent />
    </main>
  );
}
