"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ArrowRight, Clock } from "lucide-react";
import { useRecentActivity } from "../hooks/useRecentActivity";

export const RecentActivity: React.FC = () => {
  const { data: activities, isLoading } = useRecentActivity();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#301118] font-outfit">
            Recent Sanctuary Activity
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Timeline of your latest consultations, orders, and generated reports
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 border-orange-100 bg-white">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl bg-orange-100" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-48 bg-orange-100" />
                  <Skeleton className="h-3 w-32 bg-orange-100" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : !activities || activities.length === 0 ? (
        <Card className="border-orange-100/80 bg-white p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ff6b00] flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-outfit mb-1">
            No Recent Activity Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your consultations, generated Kundli reports, and astrology orders will appear in your timeline here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {activities.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="no-underline group block"
            >
              <Card className="p-4 border-orange-100/90 bg-white hover:border-[#ff6b00]/40 hover:shadow-xs transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
                  >
                    <i className={`${item.icon} text-sm`} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-[#ff6b00] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {item.relativeTime}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-orange-50 flex items-center justify-center text-slate-400 group-hover:text-[#ff6b00] transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
