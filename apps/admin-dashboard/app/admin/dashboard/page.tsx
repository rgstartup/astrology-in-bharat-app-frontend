"use client";
import React, { useState, useMemo, lazy, Suspense } from "react";

// Components
import { StatsCards } from "@/app/components/admin/StatsCard";

// Icons
import {
  Calendar,
  Clock,
  Users,
  Wallet,
  MoreVertical,
} from "lucide-react";

// Dynamic import for Recharts components (reduces initial bundle size)
import dynamic from "next/dynamic";

// Lazy load chart section with loading fallback
const ChartSection = dynamic(() => import("@/app/components/analytics/ChartSection"), {
  loading: () => (
    <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl" />
  ),
  ssr: false,
});

export default function DashboardPage() {
  // Active chart tab state (revenue, users, etc.)
  const [activeTab, setActiveTab] = useState("revenue");

  // Stats data (memoized for performance)
  const stats = useMemo(
    () => [
      {
        title: "Total Consultations",
        value: "12.5k",
        icon: Calendar,
        iconColor: "text-purple-600",
        iconBgColor: "bg-purple-100",
        trend: { value: "+2.3%", isPositive: true, period: "last week" },
      },
      {
        title: "Total Astrologers",
        value: "9.1k",
        icon: Clock,
        iconColor: "text-orange-600",
        iconBgColor: "bg-orange-100",
        trend: { value: "+9.1%", isPositive: true, period: "last week" },
      },
      {
        title: "Total Users",
        value: "3.2k",
        icon: Users,
        iconColor: "text-green-600",
        iconBgColor: "bg-green-100",
        trend: { value: "-19%", isPositive: false, period: "last week" },
      },
      {
        title: "Earnings This Month",
        value: "₹945k",
        icon: Wallet,
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-100",
        trend: { value: "+12%", isPositive: true, period: "last week" },
      },
    ],
    []
  );

  // Recent activities data (memoized)
  const activities = useMemo(
    () => [
      { id: 1, name: "Avni Pandit", action: "Booked a consultation", time: "2h ago", avatar: "A", color: "bg-yellow-600" },
      { id: 2, name: "Mahesh Joshi", action: "Completed a session", time: "5h ago", avatar: "M", color: "bg-yellow-600" },
      { id: 3, name: "Vijay Sharma", action: "Rescheduled consultation", time: "6h ago", avatar: "V", color: "bg-yellow-600" },
      { id: 4, name: "Priya Desai", action: "Left a 5-star review", time: "8h ago", avatar: "P", color: "bg-yellow-600" },
      { id: 5, name: "Rahul Gupta", action: "Payment received", time: "10h ago", avatar: "R", color: "bg-yellow-600" },
    ],
    []
  );

  return (
    <main className="space-y-6" role="main">
      {/* Stats cards - Consultations, Astrologers, Users, Earnings */}
      <StatsCards stats={stats} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Feed (4 columns) */}
        <section className="lg:col-span-4" aria-labelledby="recent-activity-heading">
          <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Activity header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 id="recent-activity-heading" className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="More options for recent activity"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </header>
            
            {/* Activity list */}
            <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto" role="list">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className={`${activity.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}
                    aria-hidden="true"
                  >
                    {activity.avatar}
                  </div>

                {/* Activity details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.name}</span> {activity.action}
                    </p>
                    <time className="text-xs text-gray-600 mt-1" dateTime={activity.time}>
                      {activity.time}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>

       {/* Analytics Charts Section (8 columns, lazy loaded) */}
        <section className="lg:col-span-8" aria-labelledby="analytics-heading">
          <Suspense fallback={<div className="h-[500px] bg-gray-100 animate-pulse rounded-xl" />}>
            <ChartSection activeTab={activeTab} setActiveTab={setActiveTab} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}