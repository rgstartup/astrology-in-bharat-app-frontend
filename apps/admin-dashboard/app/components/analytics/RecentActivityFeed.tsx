"use client";
import { Activity } from "lucide-react";

interface ActivityItem {
  type: "consultation" | "signup";
  user: string;
  expert?: string;
  time: string;
  amount?: number;
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-500">Live platform activity</p>
        </div>
        <Activity className="w-6 h-6 text-green-600" />
      </div>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div
              className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === "consultation" ? "bg-green-500" : "bg-blue-500"
              }`}
            />
            <div className="flex-1">
              {activity.type === "consultation" ? (
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{activity.user}</span> booked
                  consultation with{" "}
                  <span className="font-semibold">{activity.expert}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{activity.user}</span> signed up
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {activity.time}
                {activity.amount && (
                  <span className="ml-2 text-green-600 font-semibold">
                    ₹{activity.amount}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



