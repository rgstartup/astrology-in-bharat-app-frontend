import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Suspense } from "react";
import AboutSeoContent from "./about-seo.component";
import GuidanceCTA from "@/components/ui/GuidanceCTA";
import { ArrowRight, MessageSquare } from "lucide-react";
import { api } from "@/actions";
import { platformStats } from "./data";
import type {
  IPlatformStat,
  IPlatformStatsResponse,
} from "@repo/lib/src/types/platform-status";
import PrincipleComponent from "./principle.component";
import IconBubble from "./icon.component";
import WhyChooseUs from "./why-choose-us";
import OurJourneyComponent from "./our-journey.component";
import OurStoryComponent from "./our-story.component";

// const SectionLabel = ({ children }: { children: React.ReactNode }) => (
//   <div className="mb-4 flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#ff5c00]">
//     <span className="h-px w-7 bg-[#ff5c00]"></span>
//     {children}
//   </div>
// );

interface IAboutRedesign {
  children: React.ReactNode;
}

const emptyPlatformStats: IPlatformStat = {
  clients: 0,
  verified_experts: 0,
  successful_orders: 0,
  chat_sessions: 0,
};

function PlatformStatsGrid({ data }: { data?: IPlatformStat }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {platformStats(data ?? emptyPlatformStats).map((item) => (
        <div key={item.title} className="flex items-center gap-5 px-2 py-3">
          <IconBubble icon={item.icon} />
          <div>
            <div className="text-3xl font-black leading-none text-[#32131b]">
              {data ? (
                (item.value ?? 0).toLocaleString("en-IN")
              ) : (
                <span className="inline-block h-8 w-16 animate-pulse rounded-md bg-[#ffd8c0]" />
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
  );
}

async function PlatformStats() {
  const [response] = await api.get<IPlatformStatsResponse>(
    "/public/stats/platform-stats",
    { cache: "no-store" },
  );

  return (
    <PlatformStatsGrid
      data={response?.success ? response.data : emptyPlatformStats}
    />
  );
}

const AboutRedesign: React.FC<IAboutRedesign> = ({ children }) => {
  return (
    <main className="bg-[#fffaf5] text-[#2f1119] overflow-x-hidden w-full max-w-[100vw]">
      <section className="mx-auto max-w-[1320px] px-4 pb-8 pt-4 sm:px-6 lg:px-12">
        <div className="flex flex-col items-center w-full max-w-full">
          <div className="relative w-full rounded-xl md:rounded-3xl lg:rounded-[24px] overflow-hidden bg-[#2d0f0c] shadow-xl flex flex-col md:flex-row items-stretch border border-[#ffb286]/20 mb-8">
            {/* Image Section (Top on mobile, Right on desktop) */}
            <div className="w-full md:w-[55%] h-[240px] md:h-auto md:min-h-[240px] lg:min-h-[260px] relative order-1 md:order-2 bg-[#2d0f0c]">
              {/* Soft fade overlay to blend with left background exactly like Famous Temples */}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#2d0f0c] from-0% via-[#2d0f0c]/80 via-10% md:via-15% to-transparent to-25% md:to-40% z-10" />
              <Image
                src="/images/about-bg-clean.jpg"
                alt="About Astrology in Bharat"
                fill
                priority
                className="object-cover object-center brightness-[0.85]"
              />
            </div>

            {/* Content Section (Bottom on mobile, Left on desktop) */}
            <div className="w-full md:w-[50%] p-5 md:p-6 lg:p-8 z-20 order-2 md:order-1 flex flex-col justify-center relative -mt-10 md:mt-0">
              <h1 className="text-3xl md:text-4xl lg:text-[44px] font-serif font-bold text-white mb-1 text-center md:text-left drop-shadow-md leading-tight">
                About
              </h1>

              <div className="flex flex-col items-center md:items-start mb-3">
                <h2 className="text-[#ffb286] text-xl md:text-2xl lg:text-[22px] font-serif mb-2 text-center md:text-left drop-shadow-md">
                  Astrology In Bharat
                </h2>
                {/* Decorative divider */}
                <div className="w-32 h-[1px] bg-gradient-to-r from-[#ffb286]/80 via-[#ffb286]/30 to-transparent hidden md:block mb-1"></div>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#ffb286]/80 to-transparent md:hidden mb-1"></div>
              </div>

              <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed mb-6 text-center md:text-left max-w-md mx-auto md:mx-0 drop-shadow-md">
                Discover the profound power of authentic Vedic astrology. We
                connect you with India's most trusted experts to provide
                accurate predictions, personalized remedies, and spiritual
                guidance for a brighter, more fulfilling future.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-row justify-center md:justify-start gap-3 mt-auto">
                <Link
                  href="/our-experts"
                  className="inline-flex h-10 md:h-12 items-center justify-center gap-2 rounded-xl bg-[#ff5c00] px-4 md:px-6 text-[11px] md:text-xs font-extrabold text-white no-underline shadow-[0_8px_16px_rgba(255,92,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e95300]"
                >
                  <MessageSquare className="h-4 w-4 hidden sm:block" />
                  Talk to Expert
                </Link>
                <Link
                  href="/our-experts"
                  className="inline-flex h-10 md:h-12 items-center justify-center gap-2 rounded-xl border border-[#ffb286]/40 bg-white/5 px-4 md:px-6 text-[11px] md:text-xs font-extrabold text-[#ffb286] no-underline transition hover:-translate-y-0.5 hover:bg-white/10 backdrop-blur-sm"
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4 hidden sm:block" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-[#ffd8c0] bg-white/80 p-5 shadow-[0_12px_32px_rgba(105,47,16,0.08)]">
          <Suspense fallback={<PlatformStatsGrid />}>
            <PlatformStats />
          </Suspense>
        </div>
      </section>
      <OurStoryComponent />
      <OurJourneyComponent />
      <WhyChooseUs />
      {children}
      <PrincipleComponent />
      <section className="mx-auto max-w-[1180px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <GuidanceCTA />
      </section>
      {/* --- SEO Section --- */}
      <AboutSeoContent />
    </main>
  );
};

export default AboutRedesign;
