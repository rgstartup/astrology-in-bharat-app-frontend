"use client";
import React, { useState, useMemo, useEffect } from "react";

// Components
import { StatsCards } from "@repo/ui";
import { AnalyticsHeader } from "@/app/components//analytics/AnalyticsHeader";
import { RevenueChart } from "@/app/components/analytics/RevenueChart";
import { UserGrowthChart } from "@/app/components/analytics/UserGrowthChart";
import { ConsultationTypesPie } from "@/app/components/analytics/ConsultationTypesPie";
import { TopExpertsList } from "@/app/components/analytics/TopExpertsList";

// Data config
import { getAnalyticsData } from "@/app/components/analytics/analyticsConfig";

import { IndianRupee, Users, Calendar, Target } from "lucide-react";
import { getUserGrowthStats, getRevenueTrend, getEarningsBreakdown, getDashboardStats, getTopExperts } from "@/services/admin.service";

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("7days");
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [earningsBreakdown, setEarningsBreakdown] = useState<any[]>([]);
  const [topExperts, setTopExperts] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get days from timeFilter string
  const getDays = (filter: string) => {
    switch (filter) {
      case "30days": return 30;
      case "90days": return 90;
      case "year": return 365;
      default: return 7;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const days = getDays(timeFilter);
      try {
        const [growthData] = await getUserGrowthStats(days);
        const [revData] = await getRevenueTrend(days);
        const [earningData] = await getEarningsBreakdown(days);
        const [statsData] = await getDashboardStats();
        const [topExpData] = await getTopExperts(5);

        if (growthData) {
          const formattedGrowth = growthData.map((d: any) => ({
            ...d,
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }));
          setUserGrowthData(formattedGrowth);
        }
        if (revData) {
          const formattedRev = revData.map((d: any) => ({
            ...d,
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }));
          setRevenueTrend(formattedRev);
        }
        if (earningData) setEarningsBreakdown(earningData);
        if (statsData) setDashboardStats(statsData);
        if (topExpData) setTopExperts(topExpData);
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeFilter]);

  // Fallback to config for other parts, but map dashboardStats to StatsCards format
  const config = useMemo(() => getAnalyticsData(), []);

  const dynamicStats = useMemo(() => {
    if (!dashboardStats) {
      return [
        {
          title: "Total Revenue",
          value: "...",
          icon: IndianRupee,
          iconColor: "text-green-600",
          iconBgColor: "bg-green-100",
          trend: { value: "-", isPositive: true, period: "" },
        },
        {
          title: "Total Users",
          value: "...",
          icon: Users,
          iconColor: "text-blue-600",
          iconBgColor: "bg-blue-100",
          trend: { value: "-", isPositive: true, period: "" },
        },
        {
          title: "Total Experts",
          value: "...",
          icon: Calendar,
          iconColor: "text-purple-600",
          iconBgColor: "bg-purple-100",
          trend: { value: "-", isPositive: true, period: "" },
        },
        {
          title: "Consultations",
          value: "...",
          icon: Target,
          iconColor: "text-orange-600",
          iconBgColor: "bg-orange-100",
          trend: { value: "-", isPositive: true, period: "" },
        }
      ];
    }
    return [
      {
        title: "Total Revenue",
        value: `₹${parseFloat(dashboardStats.totalEarnings || 0).toLocaleString()}`,
        icon: IndianRupee,
        iconColor: "text-green-600",
        iconBgColor: "bg-green-100",
        trend: { value: "+12.5%", isPositive: true, period: "vs last month" },
      },
      {
        title: "Total Users",
        value: dashboardStats.totalUsers?.toLocaleString() || "0",
        icon: Users,
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-100",
        trend: { value: "+8.2%", isPositive: true, period: "vs last month" },
      },
      {
        title: "Total Experts",
        value: dashboardStats.totalExperts?.toLocaleString() || "0",
        icon: Calendar,
        iconColor: "text-purple-600",
        iconBgColor: "bg-purple-100",
        trend: { value: "+5.1%", isPositive: true, period: "vs last month" },
      },
      {
        title: "Consultations",
        value: dashboardStats.totalChatSessions?.toLocaleString() || "0",
        icon: Target,
        iconColor: "text-orange-600",
        iconBgColor: "bg-orange-100",
        trend: { value: "+15.3%", isPositive: true, period: "vs last month" },
      }
    ];
  }, [dashboardStats]);

  return (
    <main className="space-y-4 sm:space-y-6 px-4 py-4 sm:p-6">
      {/* Header with time filter */}
      <AnalyticsHeader timeFilter={timeFilter} setTimeFilter={setTimeFilter} />

      <div className="relative">
        {/* Optional overlay spinner for subsequent loads, but the layout remains */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        <div className="space-y-6">
          {/* Stats cards - Revenue, Users, Consultations, Conversion */}
          <StatsCards stats={dynamicStats} columns={4} />

          {/* Revenue & User Growth Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={revenueTrend} />
            <UserGrowthChart data={userGrowthData} />
          </div>

          {/* Consultation Types & Top Experts - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConsultationTypesPie data={earningsBreakdown.length > 0 ? earningsBreakdown : config.consultationTypes} />
            <div className="space-y-4">
              {topExperts.length > 0 ? (
                <TopExpertsList experts={topExperts} />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Experts</h3>
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <p>{isLoading ? "Loading..." : "No expert data found for this period"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
