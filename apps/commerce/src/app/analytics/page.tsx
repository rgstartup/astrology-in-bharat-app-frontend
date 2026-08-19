"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { RevenueChart, ProductShareChart, StockChart } from "@/features/shop-dashboard/components/AnalyticsCharts";
import { AnalyticsSkeleton } from "@/features/shop-dashboard/components/AnalyticsSkeleton";
import { BarChart3, TrendingUp, Package, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["merchantAnalytics"],
    queryFn: async () => {
      const [data, error] = await dashboardService.getAnalytics();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  const lowStockCount = analytics?.stockLevels?.filter((p: any) => p.stock < 10 && p.stock > 0).length || 0;
  const outOfStockCount = analytics?.stockLevels?.filter((p: any) => p.stock === 0).length || 0;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
            <BarChart3 className="w-10 h-10 text-[#fd6410]" />
            Business Insights
          </h2>
          <p className="text-gray-700 text-sm mt-1.5 flex items-center">In-depth analysis of your shop performance and inventory.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-[#fd6410] shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Product</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-2">{analytics?.topProducts?.[0]?.name || "N/A"}</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-[#fd6410]" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-[#fd6410] shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Inventory</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-2">{analytics?.stockLevels?.length || 0} Products</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-[#fd6410] shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Alerts</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-2">{lowStockCount + outOfStockCount} Urgent</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <RevenueChart data={analytics?.revenueTimeline || []} />
        <ProductShareChart data={analytics?.topProducts || []} />
        <div className="lg:col-span-2">
           <StockChart data={analytics?.stockLevels || []} />
        </div>
      </div>
    </div>
  );
}
