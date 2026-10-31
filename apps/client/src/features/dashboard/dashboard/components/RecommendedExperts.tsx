"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { fetchRecommendedExperts } from "../api/dashboard.api";
import { SAMPLE_RECOMMENDED_EXPERTS } from "../data";
import { Star, MessageSquare, ArrowRight, ShieldCheck } from "@repo/design/lucide";
import { formatSpecializationsString } from "@/utils/expert-utils";
import { usePresenceStore } from "@/store/presenceStore";
import Image from "next/image";

/** Section header shared by every experts-for-you state. */
function RecommendedExpertsHeader() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-sans text-xl sm:text-2xl font-medium tracking-tight text-[#111111]">
          Experts for you
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#626260]">
          Handpicked verified experts aligned with your Vedic requirements
        </p>
      </div>

      <Link
        href={PATHS.DASHBOARD.EXPERTS}
        className="no-underline font-sans text-xs sm:text-sm font-medium text-[#111111] hover:underline flex items-center gap-1 group"
      >
        <span>View all</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

/** Skeleton grid shown while expert picks load. */
function RecommendedExpertsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-full" />
        </Card>
      ))}
    </div>
  );
}

/** Empty state shown when no expert picks are available. */
function RecommendedExpertsEmpty() {
  return (
    <Card className="p-8 text-center">
      <p className="font-sans text-xs sm:text-sm text-[#626260] mb-3">
        Explore our community of verified astrology experts.
      </p>
      <Link href={PATHS.DASHBOARD.EXPERTS} className="no-underline">
        <Button variant="default" size="sm">
          <span>Browse all experts</span>
        </Button>
      </Link>
    </Card>
  );
}

/** Live presence dot: success green when online, surface tone when offline. */
function ExpertStatusDot({ isOnline }: { isOnline: boolean }) {
  if (isOnline) {
    return (
      <span
        className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white bg-[#0bdf50]"
        title="Online"
      />
    );
  }
  return (
    <span
      className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white bg-[#ebe7e1]"
      title="Offline"
    />
  );
}

/** Consult CTA: charcoal pill when the expert is online, hairline otherwise. */
function ExpertConsultButton({ isOnline }: { isOnline: boolean }) {
  if (isOnline) {
    return (
      <Button variant="pill" size="sm" className="w-full justify-center rounded-full text-xs">
        <MessageSquare className="w-3 h-3 mr-1" />
        <span>Consult</span>
      </Button>
    );
  }
  return (
    <Button variant="outline" size="sm" className="w-full justify-center rounded-full text-xs">
      <MessageSquare className="w-3 h-3 mr-1" />
      <span>Consult</span>
    </Button>
  );
}

/** Filled expert grid for the loaded state. */
function RecommendedExpertsGrid({ experts }: { experts: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {experts.slice(0, 4).map((expert: any) => {
        const name = expert.user?.name || expert.name || "Astrology expert";
        const specialization = formatSpecializationsString(
          expert.specializations || expert.specialization || expert.expertise,
          "Vedic astrology",
        );
        const rating = Number(expert.ratings || 4.9).toFixed(1);
        const statusValue =
          expert.isAvailableForConsultation ??
          (expert.status === "online" || Boolean(expert.is_available));
        const isOnline = Boolean(statusValue);
        const price = expert.chat_price || expert.price || 25;
        const avatar = expert.user?.avatar || expert.avatar || "/images/dummy-expert.jpg";

        return (
          <Card
            key={expert.id}
            className="hover:border-[#111111] p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#d3cec6] bg-[#ebe7e1]">
                    <Image
                      src={avatar}
                      alt={name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/dummy-expert.jpg";
                      }}
                    />
                  </div>
                  <ExpertStatusDot isOnline={isOnline} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h4 className="font-sans text-sm font-medium text-[#111111] truncate">{name}</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                  </div>
                  <p className="font-sans text-[11px] text-[#626260] truncate">{specialization}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-[#111111] fill-[#111111]" />
                    <span className="font-sans text-[11px] font-medium text-[#111111]">{rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-t border-[#ebe7e1] my-2">
                <span className="font-sans text-[#626260]">Rate:</span>
                <span className="font-sans font-medium text-[#111111]">
                  ₹{price}
                  <span className="text-[10px] text-[#7b7b78]">/min</span>
                </span>
              </div>
            </div>

            <Link
              href={`/consultants/${expert.id || expert.userId}`}
              className="no-underline mt-2 block"
            >
              <ExpertConsultButton isOnline={isOnline} />
            </Link>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Curated expert picks for the dashboard. Fetches top-rated experts,
 * syncs their presence status, and falls back to sample picks on error.
 */
export const RecommendedExperts: React.FC = () => {
  const [experts, setExperts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadExperts = async () => {
      setIsLoading(true);
      const [res, err] = await fetchRecommendedExperts(4, "rating");
      if (!isMounted) return;

      if (!err && res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const store = usePresenceStore.getState();
        store.batchSetExpertStatus(
          res.data.map((item: any) => ({
            expertId: item.id,
            status:
              item.status ||
              (item.isAvailableForConsultation
                ? "online"
                : item.is_available
                  ? "online"
                  : "offline"),
            lastSeenAt: item.lastSeenAt ?? item.last_seen_at ?? null,
          })),
        );
        store.subscribeManyToExperts(res.data.map((item: any) => item.id));
        setExperts(res.data);
      } else {
        setExperts(SAMPLE_RECOMMENDED_EXPERTS);
      }
      setIsLoading(false);
    };

    loadExperts();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mb-8 sm:mb-10">
        <RecommendedExpertsHeader />
        <RecommendedExpertsLoading />
      </div>
    );
  }

  if (!experts || experts.length === 0) {
    return (
      <div className="mb-8 sm:mb-10">
        <RecommendedExpertsHeader />
        <RecommendedExpertsEmpty />
      </div>
    );
  }

  return (
    <div className="mb-8 sm:mb-10">
      <RecommendedExpertsHeader />
      <RecommendedExpertsGrid experts={experts} />
    </div>
  );
};

export default RecommendedExperts;
