"use client";

import React, { useState, useEffect } from "react";
import EarningsStats from "./EarningsStats";
import EarningsCharts from "./EarningsCharts";
import TopInsights from "./TopInsights";
import { EarningsDashboardData } from "./types";
import { ChevronDown, Calendar, Download } from "lucide-react";
import { getEarningsStats } from "@/lib/earnings";
import { Button } from "@repo/ui";

export default function EarningsPage() {
  const [timeRange, setTimeRange] = useState("last_6_months");
  const [isExporting, setIsExporting] = useState(false);
  const [data, setData] = useState<EarningsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const stats = await getEarningsStats(timeRange);
        setData(stats);
      } catch (error) {
        console.error("[EarningsPage] Failed to load earnings stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [timeRange]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  if (loading || !data || !data.stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const timeRangeLabels: Record<string, string> = {
    "last_6_months": "Last 6 Months",
    "today": "Today",
    "last_month": "Last Month"
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Revenue & Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed breakdown of your earnings and service performance</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Button
              variant="outline"
              className="bg-white border-gray-200 hover:border-amber-400 text-gray-700 shadow-sm rounded-xl gap-2 font-semibold"
            >
              <Calendar className="w-4 h-4 text-amber-500" />
              {timeRangeLabels[timeRange]}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>

            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 invisible group-hover:visible z-50 transition-all opacity-0 group-hover:opacity-100">
              {Object.entries(timeRangeLabels).map(([key, label]) => (
                <Button
                  key={key}
                  onClick={() => setTimeRange(key)}
                  variant="ghost"
                  className={`w-full justify-start px-4 py-2 text-sm font-medium hover:bg-amber-50 transition-colors rounded-lg ${timeRange === key ? 'text-amber-600 bg-amber-50' : 'text-gray-600'}`}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            loading={isExporting}
            variant="primary"
            className="shadow-md rounded-xl"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Section */}
        <EarningsStats stats={data.stats} />

        {/* Charts Section */}
        <EarningsCharts
          incomeTrends={data.incomeTrends}
          revenueBreakdown={data.revenueBreakdown}
        />

        {/* Top Insights Section */}
        <div className="pb-12">
          <TopInsights
            topUsers={data.topUsers}
            topServices={data.topServices}
          />
        </div>
      </div>
    </div>
  );
}


