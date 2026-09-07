"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";

// Components
import { StatsCards } from "@repo/ui";

// Icons
import {
  Calendar,
  Clock,
  Users,
  Wallet,
  MoreVertical,
} from "lucide-react";

import { getDashboardStats, getRevenueTrend } from "@/services/admin.service";
import adminData from "../../../../public/data/admin_data.json";
import { RevenueChart } from "@/app/components/analytics/RevenueChart";

const MoreVerticalIcon = MoreVertical as any;


export default function DashboardPage() {
  console.log("DashboardPage - Rendering started");
  // HMR Trigger: Refreshing route map
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [data, error] = await getDashboardStats();
      if (error) {
        console.error("Failed to fetch dashboard stats", error);
      } else {
        setDashboardData(data);
      }

      const [revData] = await getRevenueTrend(7);
      if (revData) {
        const formattedRev = revData.map((d: any) => ({
          ...d,
          date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
        setRevenueTrend(formattedRev);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);


  const formatCompactNumber = (number: number) => {
    if (!number) return "0";
    if (number >= 10000000) return parseFloat((number / 10000000).toFixed(2)) + "Cr";
    if (number >= 100000) return parseFloat((number / 100000).toFixed(2)) + "Lakh";
    if (number >= 1000) return parseFloat((number / 1000).toFixed(2)) + "k";
    return parseFloat(number.toFixed(2)).toString();
  };

  // Stats data (memoized for performance)
  const stats = useMemo(
    () => [
      {
        title: "Admin Earnings (Commission)",
        value: loading ? "..." : `₹${formatCompactNumber(dashboardData?.adminEarnings || 0)}`,
        tooltipValue: `₹${dashboardData?.adminEarnings ? parseFloat(Number(dashboardData.adminEarnings).toFixed(2)) : "0"}`,
        icon: Wallet,
        iconColor: "text-indigo-600",
        iconBgColor: "bg-indigo-100",
        trend: { value: "+0%", isPositive: true, period: "today" },
      },
      {
        title: "Total Experts",
        value: loading ? "..." : (dashboardData?.totalExperts?.toString() || "0"),
        icon: Clock,
        iconColor: "text-orange-600",
        iconBgColor: "bg-orange-100",
        trend: { value: dashboardData?.trends?.total?.value || "+0%", isPositive: true, period: "last week" },
      },
      {
        title: "Total Users",
        value: loading ? "..." : (dashboardData?.totalUsers?.toString() || "0"),
        icon: Users,
        iconColor: "text-green-600",
        iconBgColor: "bg-green-100",
        trend: { value: dashboardData?.trends?.active?.value || "+0%", isPositive: true, period: "last week" },
      },
      {
        title: "Earnings This Month",
        value: loading ? "..." : `₹${formatCompactNumber(dashboardData?.totalEarnings || 0)}`,
        tooltipValue: `₹${dashboardData?.totalEarnings ? parseFloat(Number(dashboardData.totalEarnings).toFixed(2)) : "0"}`,
        icon: Wallet,
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-100",
        trend: { value: "+0%", isPositive: true, period: "last week" },
      },
    ],
    [dashboardData, loading]
  );

  // Recent activities data (memoized)
  const activities = useMemo(
    () => dashboardData?.activities || [],
    [dashboardData]
  );

  return (
    <main className="space-y-6" role="main">
      {/* Stats cards - Consultations, Experts, Users, and Earnings */}
      <StatsCards stats={stats} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Recent Activity Feed (4 columns) */}
        <section className="lg:col-span-4" aria-labelledby="recent-activity-heading">
          <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Activity header */}
            <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 id="recent-activity-heading" className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="More options for recent activity"
              >
                <MoreVerticalIcon className="w-5 h-5" />
              </button>
            </header>

            {/* Activity list */}
            <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto" role="list">
              {activities.map((activity: any) => (
                <li
                  key={activity.id}
                  className="flex items-center space-x-3 sm:space-x-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className={`${activity.color || 'bg-gray-200'} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 overflow-hidden`}
                    aria-hidden="true"
                  >
                    {activity.profile_picture || activity.profile_pic || activity.image || activity.avatar_url || (activity.avatar && activity.avatar.length > 5) ? (
                      <img 
                        src={activity.profile_picture || activity.profile_pic || activity.image || activity.avatar_url || activity.avatar} 
                        alt={activity.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      activity.avatar || activity.name?.charAt(0) || 'U'
                    )}
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
            <RevenueChart data={revenueTrend} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}



