"use client";
import React, { useState, useMemo, useEffect } from "react";

// Components
import { StatsCards } from "@repo/ui";
import { AnalyticsHeader } from "@/app/components//analytics/AnalyticsHeader";
import { RevenueChart } from "@/app/components/analytics/RevenueChart";
import { UserGrowthChart } from "@/app/components/analytics/UserGrowthChart";
import { ConsultationTypesPie } from "@/app/components/analytics/ConsultationTypesPie";
import { TimeSlotChart } from "@/app/components/analytics/TimeSlotChart";
import { TopExpertsList } from "@/app/components/analytics/TopExpertsList";
import { RecentActivityFeed } from "@/app/components/analytics/RecentActivityFeed";

// Data config
import { getAnalyticsData } from "@/app/components/analytics/analyticsConfig";

import { getUserGrowthStats } from "@/src/services/admin.service";

export default function AnalyticsPage() {
  // Time filter state (7days, 30days, etc.)
  const [timeFilter, setTimeFilter] = useState("7days");
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [isLoadingGrowth, setIsLoadingGrowth] = useState(false);

  // Get analytics data (memoized for performance)
  const data = useMemo(() => getAnalyticsData(), []);

  useEffect(() => {
    const fetchGrowth = async () => {
      setIsLoadingGrowth(true);
      try {
        let days = 7;
        if (timeFilter === "30days") days = 30;
        if (timeFilter === "90days") days = 90;
        if (timeFilter === "year") days = 365;

        const growthData = await getUserGrowthStats(days);
        setUserGrowthData(growthData);
      } catch (error) {
        console.error("Failed to fetch growth data", error);
      } finally {
        setIsLoadingGrowth(false);
      }
    };
    fetchGrowth();
  }, [timeFilter]);

  return (
    <main className="space-y-6">
      {/* Header with time filter */}
      <AnalyticsHeader timeFilter={timeFilter} setTimeFilter={setTimeFilter} />

      {/* Stats cards - Revenue, Users, Consultations, Conversion */}
      <StatsCards stats={data.stats} columns={4} />

      {/* Revenue & User Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data.revenueData} />
        <UserGrowthChart data={userGrowthData} />
      </div>

      {/* Consultation Types & Time Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsultationTypesPie data={data.consultationTypes} />
        <TimeSlotChart data={data.timeSlotData} />
      </div>

      {/* Top Experts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopExpertsList experts={data.topExperts} />
        <RecentActivityFeed activities={data.recentActivities} />
      </div>
    </main>
  );
}



