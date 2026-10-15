"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ArrowRight, Clock } from "lucide-react";
import { useRecentActivity, type ActivityItem } from "../hooks/useRecentActivity";

/** Section header shared by every activity state. */
function ActivityHeader() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-sans text-xl sm:text-2xl font-medium tracking-tight text-[#111111]">
          Recent sanctuary activity
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#626260]">
          Timeline of your latest consultations, orders, and generated reports
        </p>
      </div>
    </div>
  );
}

/** Skeleton rows shown while activity loads. */
function ActivityLoading() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-md" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/** Empty state shown when the user has no activity yet. */
function ActivityEmpty() {
  return (
    <Card className="p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-[#ebe7e1] text-[#111111] flex items-center justify-center mx-auto mb-3">
        <Clock className="w-6 h-6" />
      </div>
      <h3 className="font-sans text-base font-medium tracking-tight text-[#111111] mb-1">
        No recent activity yet
      </h3>
      <p className="font-sans text-xs text-[#626260] max-w-sm mx-auto">
        Your consultations, generated Kundli reports, and astrology orders will appear in your timeline here.
      </p>
    </Card>
  );
}

/** Timeline rows linking each activity to its destination. */
function ActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.link}
          className="no-underline group block"
        >
          <Card className="p-4 hover:border-[#111111] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className="w-10 h-10 rounded-full bg-[#ebe7e1] text-[#111111] flex items-center justify-center shrink-0"
              >
                <i className={`${item.icon} text-sm`} />
              </div>
              <div className="min-w-0">
                <h4 className="font-sans text-xs sm:text-sm font-medium text-[#111111] truncate">
                  {item.title}
                </h4>
                <p className="font-sans text-[11px] text-[#626260] truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-sans text-[11px] text-[#7b7b78]">
                {item.relativeTime}
              </span>
              <div className="w-6 h-6 rounded-md bg-[#f5f1ec] group-hover:bg-[#ebe7e1] flex items-center justify-center text-[#7b7b78] group-hover:text-[#111111] transition-colors">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

/**
 * Timeline of the user's latest consultations, orders, and
 * generated reports on the dashboard.
 */
export const RecentActivity: React.FC = () => {
  const { data: activities, isLoading } = useRecentActivity();

  if (isLoading) {
    return (
      <div className="mb-8">
        <ActivityHeader />
        <ActivityLoading />
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="mb-8">
        <ActivityHeader />
        <ActivityEmpty />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <ActivityHeader />
      <ActivityList items={activities} />
    </div>
  );
};

export default RecentActivity;
