"use client";

import React, { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { ShoppingBag, Users, TrendingUp, Package, AlertTriangle, CheckCircle, Info, Calendar, Wallet, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { StatsCards } from "@repo/ui";
import { ActivityFeed } from "@/features/shop-dashboard/components/ActivityFeed";
import { RecentOrders } from "@/features/shop-dashboard/components/RecentOrders";
import { useAuthStore } from "@/store/useAuthStore";
import { useMerchantProfile } from "@/hooks/useSettings";
import { dashboardService } from "@/services/dashboard.service";
import { SalesChart } from "@/features/shop-dashboard/components/SalesChart";
import { DashboardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function DashboardHome() {
  const [currentDate, setCurrentDate] = useState("");
  const { user } = useAuthStore();
  const { data: profileData } = useMerchantProfile();
  
  const status = profileData?.profile?.status ?? (user as any)?.status ?? "pending_verification";

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-US", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    }));
  }, []);

  const results = useQueries({
    queries: [
      { queryKey: ["merchantStats"], queryFn: () => dashboardService.getStats() },
      { queryKey: ["merchantOrders"], queryFn: () => dashboardService.getRecentOrders() },
      { queryKey: ["merchantActivity"], queryFn: () => dashboardService.getActivity() },
      { queryKey: ["merchantPerformance"], queryFn: () => dashboardService.getPerformance() },
    ],
  });

  const [statsData, statsLoading] = [results[0].data?.[0], results[0].isLoading];
  const [ordersData, ordersLoading] = [results[1].data?.[0], results[1].isLoading];
  const [activityData, activityLoading] = [results[2].data?.[0], results[2].isLoading];
  const [perfData, perfLoading] = [results[3].data?.[0], results[3].isLoading];

  const isLoadingInitial = statsLoading && ordersLoading;

  const stats = [
    {
      title: "Total Orders",
      value: String(statsData?.totalOrders?.value ?? "0"),
      trend: statsData?.totalOrders?.trend ?? "+0%",
      icon: ShoppingBag, color: "text-white", bgColor: "bg-[#fd6410]",
      href: "/orders"
    },
    {
      title: "Total Products",
      value: String(statsData?.totalProducts?.value ?? "0"),
      trend: statsData?.totalProducts?.trend ?? "+0",
      icon: Package, color: "text-white", bgColor: "bg-[#fd6410]",
      href: "/products"
    },
    {
      title: "Total Earnings",
      value: `₹${Number(statsData?.totalEarnings?.value ?? 0).toLocaleString("en-IN")}`,
      trend: statsData?.totalEarnings?.trend ?? "+0%",
      icon: TrendingUp, color: "text-white", bgColor: "bg-[#fd6410]",
    },
    {
      title: "Monthly Earnings",
      value: `₹${Number(statsData?.monthlyEarnings?.value ?? 0).toLocaleString("en-IN")}`,
      trend: statsData?.monthlyEarnings?.trend ?? "+0%",
      icon: TrendingUp, color: "text-white", bgColor: "bg-[#fd6410]",
    },
  ];


  if (isLoadingInitial && !statsData) {
    return (
      <div className="space-y-10 pb-20">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm animate-pulse">
           <div className="h-10 w-64 bg-gray-100 rounded-2xl mb-4" />
           <div className="h-6 w-96 bg-gray-100 rounded-xl" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
                <div className="w-20 h-6 bg-gray-100 rounded-lg" />
              </div>
              <div className="space-y-3">
                <div className="w-24 h-3 bg-gray-100 rounded-full" />
                <div className="w-40 h-10 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* Exact Reference Match: Dark Premium Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2rem] p-6 md:p-8 bg-gradient-to-r from-[#110502] via-[#2a0e06] to-[#fd6410] text-white shadow-2xl">
          {/* Subtle Circle Gradient on Right */}
          <div className="absolute -right-10 -top-10 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row h-full justify-between gap-8">
              <div className="flex flex-col h-full justify-between gap-6 flex-1">
              {/* Top Section: Welcome & Name */}
              <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-white/80 text-sm font-medium">Welcome back 🙏</p>
                  </div>
                  <h2 className="text-4xl font-bold text-white tracking-tight leading-none">
                      {profileData?.profile?.shopName || (user as any)?.shopName || (user as any)?.name || "Merchant"}
                  </h2>
                  <div className="inline-flex items-center px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                      <span className="text-xs font-medium text-gray-300">
                          ID: <span className="text-white">{profileData?.profile?.merchant_id || (user as any)?.merchantId || (user as any)?.id || "N/A"}</span>
                      </span>
                  </div>
              </div>

              {/* Bottom Section: Integrated Stats with Separators */}
              <div className="flex flex-wrap items-center gap-x-12 gap-y-4 pt-2">
                  <div className="space-y-1">
                      <p className="text-white/70 text-sm font-medium">Total Earned</p>
                      <p className="text-3xl font-bold tracking-tight text-white">
                          ₹{Number(statsData?.totalEarnings?.value ?? 0).toLocaleString("en-IN")}
                      </p>
                  </div>
                  
                  <div className="hidden md:block w-px h-10 bg-white/20" />
                  
                  <div className="space-y-1">
                      <p className="text-white/70 text-sm font-medium">Wallet Balance</p>
                      <p className="text-3xl font-bold tracking-tight text-white">
                          ₹{Number(statsData?.totalEarnings?.value ?? 0).toLocaleString("en-IN")}
                      </p>
                  </div>

                  <div className="hidden md:block w-px h-10 bg-white/20" />
                  
                  <div className="space-y-1">
                      <p className="text-white/70 text-sm font-medium">Total Listings</p>
                      <p className="text-3xl font-bold tracking-tight text-white">
                          {statsData?.totalProducts?.value ?? 0}
                      </p>
              </div>
          </div>
      </div>

      {/* Right Section: Large Growth Rate (Desktop Only) */}
          <div className="hidden lg:flex flex-col justify-center items-end text-right lg:border-l lg:border-white/10 lg:pl-16">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-[#ffcda2]" />
                  </div>
                  <span className="text-sm font-medium text-white/90">Growth Rate</span>
              </div>
              <p className="text-[4rem] xl:text-[5rem] leading-none font-bold tracking-tight text-white drop-shadow-xl">
                  {perfData?.growthRate || "+18.2%"}
              </p>
              <p className="text-sm text-[#ffcda2] font-medium mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80] animate-pulse" />
                  Vs Last Month
              </p>
          </div>
      </div>
      </div>

      {/* KYC Status Banner (Only if pending) */}
      <AnimatePresence mode="wait">
        {status === "pending_verification" && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-center gap-5 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900">Shop Verification Pending</h4>
              <p className="text-sm font-medium text-amber-700/80">
                Our team is reviewing your documents. This usually takes 24-48 hours.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Grid using shared @repo/ui component for 100% consistency */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <StatsCards 
          stats={[
            {
              title: "Total Orders",
              value: statsData?.totalOrders?.value ?? "0",
              icon: ShoppingBag,
              iconColor: "text-[#fd6410]",
              iconBgColor: "bg-orange-50",
              trend: { value: statsData?.totalOrders?.trend ?? "+0%", isPositive: true, period: "this month" }
            },
            {
              title: "Total Products",
              value: statsData?.totalProducts?.value ?? "0",
              icon: Package,
              iconColor: "text-purple-600",
              iconBgColor: "bg-purple-50",
            },
            {
              title: "Total Earnings",
              value: `₹${Number(statsData?.totalEarnings?.value ?? 0).toLocaleString("en-IN")}`,
              icon: TrendingUp,
              iconColor: "text-green-600",
              iconBgColor: "bg-green-50",
              trend: { value: statsData?.totalEarnings?.trend ?? "+0%", isPositive: true }
            },
            {
              title: "Monthly Revenue",
              value: `₹${Number(statsData?.monthlyEarnings?.value ?? 0).toLocaleString("en-IN")}`,
              icon: Wallet,
              iconColor: "text-blue-600",
              iconBgColor: "bg-blue-50",
            }
          ]} 
          columns={4} 
        />
      </section>

      {/* Two Column Layout for Actions & Orders */}
      <div className="grid lg:grid-cols-12 gap-8">
          {/* Recent Orders - 8 Cols */}
          <div className="lg:col-span-8 space-y-6 min-w-0">
              <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#fd6410]" /> Recent Orders
                  </h3>
                  <Link href="/orders" className="px-5 py-2 bg-[#fd6410] text-white rounded-xl text-xs font-semibold hover:bg-[#ea580c] transition-all shadow-md active:scale-95 hover:shadow-lg">View All</Link>
              </div>
              <RecentOrders orders={ordersData || []} isLoading={ordersLoading} />
          </div>

          {/* Quick Actions & Charts - 4 Cols */}
          <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#fd6410]" /> Quick Actions
                  </h3>
              </div>
              {/* Quick Actions Card */}
              <div className="bg-white rounded-[2rem] p-5 sm:p-8 border-2 border-orange-600 shadow-sm space-y-6">
                  <div className="grid gap-3">
                      {[
                          { label: "Add New Product", icon: Package, href: "/products/add", color: "bg-orange-50 text-[#fd6410]" },
                          { label: "View Wallet", icon: Wallet, href: "/wallet", color: "bg-green-50 text-green-600" },
                          { label: "Shop Analytics", icon: TrendingUp, href: "/analytics", color: "bg-blue-50 text-blue-600" },
                      ].map((action) => (
                          <Link key={action.label} href={action.href}>
                              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-orange-100 hover:bg-white transition-all group">
                                  <div className="flex items-center gap-4">
                                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", action.color)}>
                                          <action.icon className="w-5 h-5" />
                                      </div>
                                      <span className="text-sm font-bold text-gray-700">{action.label}</span>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#fd6410] transition-colors" />
                              </div>
                          </Link>
                      ))}
                  </div>
              </div>

              {/* Mini Performance Summary (Mobile Only) */}
              <div className="lg:hidden bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl mt-6">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
                  <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                              <TrendingUp className="w-5 h-5 text-orange-400" />
                          </div>
                          <span className="text-xs font-bold">Growth Rate</span>
                      </div>
                      <div>
                          <p className="text-3xl font-bold tracking-tighter">
                              {perfData?.growthRate || "+18.2%"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1 italic">Vs Last Month</p>
                      </div>
                      <Link href="/analytics" className="block text-center py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-[10px] font-bold border border-white/5">
                          View Deep Analytics
                      </Link>
                  </div>
              </div>

          </div>
      </div>

      {/* Main Performance Chart */}
      <section className="animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
        <div className="bg-white p-5 sm:p-8 rounded-[2.5rem] border-2 border-orange-600 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4 mb-8">
                <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                <div className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-semibold text-gray-500 border border-gray-100">Last 30 Days</div>
            </div>
            <SalesChart data={perfData?.salesData} isLoading={perfLoading} />
        </div>
      </section>
    </main>
  );
}
