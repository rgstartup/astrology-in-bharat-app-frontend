"use client";
import React, { useEffect } from "react";
import { useRecentActivityStore } from "@/features/dashboard/store/recent-activity.store";
import { User as UserIcon, Clock as ClockIcon } from "@repo/design/lucide";
import { format, formatDistanceToNow } from "date-fns";
import { ActivitySkeleton } from "./DashboardSkeletons";
import RecentActivityEmpty from "@/app/[locale]/dashboard/@recent-activity/RecentActivityEmpty";

const User = UserIcon as any;
const Clock = ClockIcon as any;

interface Activity {
  name: string;
  action: string;
  time: string;
  relativeTime: string;
  avatar?: string;
}

interface ActivityFeedClientProps {
  initialData: any[];
}

export function ActivityFeedClient({ initialData }: ActivityFeedClientProps) {
  const { data, loading, error, fetch } = useRecentActivityStore();

  // Hydrate store from server-provided initial data
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      useRecentActivityStore.setState({ data: initialData });
    } else {
      fetch();
    }
  }, [initialData, fetch]);

  const activities: Activity[] = (data || []).slice(0, 5).map((session) => {
    const date = new Date(
      session.created_at || session.createdAt || Date.now(),
    );
    return {
      name:
        session.user?.name ||
        session.client?.user?.name ||
        session.client?.name ||
        "Client",
      action: "consultation",
      time: format(date, "h:mm a"),
      relativeTime: formatDistanceToNow(date, { addSuffix: true }),
      avatar:
        session.client?.profile_picture ||
        session.client?.avatar ||
        session.user?.profile_picture ||
        session.user?.avatar ||
        undefined,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-500 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#fd6410]" />
        Recent Activity
      </h3>
      <div className="space-y-2">
        {loading && !data.length ? (
          <ActivitySkeleton />
        ) : activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-3 rounded-xl hover:bg-orange-50/50 transition border border-transparent hover:border-orange-100"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                {activity.avatar ? (
                  <img src={activity.avatar} alt={activity.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-[#fd6410]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-tight">
                  <span className="font-bold text-[#fd6410]">{activity.time}</span> consult to <span className="font-semibold text-gray-900">{activity.name}</span>
                </p>
                <p className="text-[10px] font-medium text-gray-700 mt-1 flex items-center gap-1">
                  {activity.relativeTime}
                </p>
              </div>
            </div>
          ))
        ) : (
          <RecentActivityEmpty />
        )}
      </div>
    </div>
  );
}
