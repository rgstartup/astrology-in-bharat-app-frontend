"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { api } from "@/actions";
import Skeleton from "@/components/ui/Skeleton";
import { Expert } from "@repo/lib";
import { useExpertListStore } from "@/store/useExpertListStore";

const GreenDot = ({ isOnline }: { isOnline: boolean }) => {
  if (!isOnline) return null;

  return (
    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
  );
};

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
    <div className="mt-8 mb-8 md:mb-0">
      <h3 className="text-2xl font-black text-[#301118] mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center">
          <i className="fa-solid fa-crown text-orange text-sm"></i>
        </span>
        Top Rated Experts
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {loading || experts.length === 0
          ? [1, 2, 3].map((_, idx) => (
              <div className="w-full" key={idx}>
                <div className="bg-white rounded-3xl border-2 border-orange/50 p-4 text-center animate-pulse">
                  <div className="relative inline-block mb-3">
                    <Skeleton
                      variant="circular"
                      width={80}
                      height={80}
                      className="border-2 border-orange/20 p-1"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <Skeleton width="70%" height={16} className="rounded-md" />
                    <Skeleton width={40} height={12} className="rounded-full" />
                  </div>
                  <Skeleton
                    width="50%"
                    height={10}
                    className="rounded-md mx-auto"
                  />
                </div>
              </div>
            ))
          : experts.map((expert, idx) => (
              <div className="group" key={`${expert.id}-${idx}`}>
                <div className="bg-white rounded-3xl border-2 border-orange p-4 text-center hover:shadow-[0_10px_30px_rgba(255,107,0,0.15)] transition-all duration-300">
                  <div className="relative inline-block mb-3">
                    <Image
                      src={expert.avatar || "/images/dummy-expert.jpg"}
                      alt={expert.name || "Expert"}
                      height={80}
                      width={80}
                      className="w-20 h-20 rounded-full object-cover border-2 border-orange/20 p-1 group-hover:scale-105 transition-transform duration-300"
                    />
                    <GreenDot isOnline={expert.is_available} />
                  </div>
                  <h6 className="font-bold text-[#301118] leading-tight mb-1 truncate px-1">
                    {expert.name || "Expert"}
                  </h6>
                  <div className="flex items-center justify-center gap-1 mb-1 bg-orange/5 rounded-full py-0.5 px-2 w-fit mx-auto">
                    <i className="fa-solid fa-star text-orange text-[10px]"></i>
                    <span className="text-xs font-black text-orange">
                      {expert.rating || "5.0"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider truncate block">
                    {expert.specialization || "Astrology"}
                  </span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default TopExpertsSection;
