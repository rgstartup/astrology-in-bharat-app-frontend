"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { fetchRecommendedExperts } from "../api/dashboard.api";
import { SAMPLE_RECOMMENDED_EXPERTS } from "../data";
import { Star, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

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

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#301118] font-outfit">
            Experts For You
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Handpicked verified experts aligned with your Vedic requirements
          </p>
        </div>

        <Link
          href={PATHS.DASHBOARD_EXPERTS}
          className="no-underline text-xs sm:text-sm font-bold text-[#ff6b00] hover:text-[#e65100] flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 border-orange-100/80 bg-white space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full bg-orange-100" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-24 bg-orange-100" />
                  <Skeleton className="h-3 w-16 bg-orange-100" />
                </div>
              </div>
              <Skeleton className="h-8 w-full bg-orange-100" />
            </Card>
          ))}
        </div>
      ) : !experts || experts.length === 0 ? (
        <Card className="border-orange-100 bg-orange-50/30 p-8 text-center">
          <p className="text-xs sm:text-sm text-slate-600 font-medium mb-3">
            Explore our community of verified astrology experts.
          </p>
          <Link href={PATHS.DASHBOARD_EXPERTS} className="no-underline">
            <Button variant="default" size="sm">
              <span>Browse All Experts</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {experts.slice(0, 4).map((expert: any) => {
            const name = expert.user?.name || expert.name || "Astrology Expert";
            const specialization =
              expert.specialization || "Vedic Astrology";
            const rating = Number(expert.ratings || 4.9).toFixed(1);
            const isOnline = Boolean(expert.is_available);
            const price = expert.chat_price || expert.price || 25;
            const avatar =
              expert.user?.avatar ||
              expert.avatar ||
              "/images/dummy-expert.jpg";

            return (
              <Card
                key={expert.id}
                className="border-orange-100/90 bg-white hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-orange-200 bg-amber-50">
                        <Image
                          src={avatar}
                          alt={name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/images/dummy-expert.jpg";
                          }}
                        />
                      </div>
                      {/* Real online status indicator */}
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          isOnline ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                        title={isOnline ? "Online" : "Offline"}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {name}
                        </h4>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {specialization}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                        <span className="text-[11px] font-bold text-slate-700">
                          {rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100 my-2">
                    <span className="text-slate-500 font-medium">Rate:</span>
                    <span className="font-bold text-slate-900">
                      ₹{price}
                      <span className="text-[10px] text-slate-400 font-normal">
                        /min
                      </span>
                    </span>
                  </div>
                </div>

                <Link
                  href={`/experts/${expert.id || expert.userId}`}
                  className="no-underline mt-2 block"
                >
                  <Button
                    variant={isOnline ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-center text-xs font-bold"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    <span>Consult</span>
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendedExperts;
