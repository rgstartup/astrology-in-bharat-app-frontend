"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Skeleton from "@/components/ui/Skeleton";
import { Expert } from "@repo/lib";
import { useExpertListStore } from "@/store/useExpertListStore";
import { api } from "@/actions";
import { formatSpecializationsString } from "@/utils/expert-utils";

const GreenDot = ({ isOnline }: { isOnline: boolean }) => {
  if (!isOnline) return null;

  return (
    <span className="absolute bottom-0.5 right-0.5 size-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-2xs" />
  );
};

const FALLBACK_EXPERT_AVATARS = [
  "/images/Expert.png",
  "/images/Expert-h.png",
  "/images/astro.png",
];

const TopExpertsSection: React.FC = () => {
  const { experts, loading, setLoading, setExperts } = useExpertListStore();

  useEffect(() => {
    const fetchTopExperts = async () => {
      setLoading(true);
      const [res, error] = await api
        .get<Expert[]>("/expert/account/top-rated?limit=3")
        .finally(() => setLoading(false));

      if (error || !res) {
        console.warn(
          "⚠️ Failed to fetch top experts, using dummy data.",
          error,
        );
        return;
      }

      setExperts(res);
    };

    fetchTopExperts();
  }, []);

  return (
    <div className="mt-0 mb-0">
      <h3 className="text-sm font-semibold text-foreground mb-3.5 flex items-center gap-2">
        <span className="size-5.5 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-crown text-[10px]"></i>
        </span>
        Top Rated Experts
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {loading || experts.length === 0
          ? [1, 2, 3].map((_, idx) => (
              <div className="w-full" key={idx}>
                <div className="bg-white rounded-xl border border-stone-200/80 p-3 text-center animate-pulse">
                  <div className="relative inline-block mb-2">
                    <Skeleton
                      variant="circular"
                      width={52}
                      height={52}
                      className="border border-stone-200"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1.5 mb-1.5">
                    <Skeleton width="80%" height={11} className="rounded-md" />
                    <Skeleton width={40} height={11} className="rounded-full" />
                  </div>
                  <Skeleton
                    width="60%"
                    height={9}
                    className="rounded-md mx-auto"
                  />
                </div>
              </div>
            ))
          : experts.map((expert, idx) => {
              const specialization = formatSpecializationsString(
                expert.specializations ||
                  expert.specialization ||
                  (expert as any).expertise,
                "Astrology",
              );
              const avatarSrc =
                expert.avatar ||
                FALLBACK_EXPERT_AVATARS[idx % FALLBACK_EXPERT_AVATARS.length] ||
                "/images/dummy-expert.jpg";

              return (
                <div className="group" key={`${expert.id}-${idx}`}>
                  <div className="bg-white rounded-2xl border border-stone-200 p-3 text-center shadow-xs hover:border-orange/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <div className="relative inline-block mb-2">
                      <Image
                        src={avatarSrc}
                        alt={expert.name || "Expert"}
                        height={52}
                        width={52}
                        className="size-13 rounded-full object-cover border-2 border-white shadow-2xs group-hover:scale-105 transition-transform duration-300"
                      />
                      <GreenDot isOnline={Boolean(expert.is_available)} />
                    </div>
                    <p
                      title={expert.name || "Expert"}
                      className="text-xs font-semibold text-stone-900 leading-tight line-clamp-2 min-h-[2rem] px-0.5 mb-1"
                    >
                      {expert.name || "Expert"}
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full py-0.5 px-2.5 w-fit mx-auto">
                      <i className="fa-solid fa-star text-amber-500 text-[9px]"></i>
                      <span className="text-[10px] font-bold text-amber-900 leading-none">
                        {expert.rating || "5.0"}
                      </span>
                    </div>
                    <span
                      title={specialization}
                      className="text-xs font-medium text-stone-500 line-clamp-2 leading-tight block min-h-[2rem]"
                    >
                      {specialization}
                    </span>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default TopExpertsSection;
