"use client";
import React, { useEffect } from "react";
import { useStatsStore } from "@/features/dashboard/store/stats.store";
import { StatsCards } from "@repo/ui";
import { StatsSkeleton } from "@/components/dashboard/DashboardSkeletons";
import StatsEmpty from "@/app/[locale]/dashboard/@stats/StatsEmpty";
import { CalendarCheck, CheckCircle, Wallet, Coins } from "@repo/design/lucide";

interface StatsClientProps {
  initialData: any;
  initialPeriod: string;
}

export function StatsClient({ initialData, initialPeriod }: StatsClientProps) {
  const { data, period, loading, error, fetch, setPeriod } = useStatsStore();

  // Hydrate store from server-provided initial data
  useEffect(() => {
    if (initialData) {
      useStatsStore.setState({ data: initialData, period: initialPeriod });
    }
  }, [initialData, initialPeriod]);

  const handlePeriodChange = (p: string) => {
    setPeriod(p);
    fetch(p);
  };

  if (loading && !data) return <StatsSkeleton />;
  if (!data) return <StatsEmpty />;

  const d = data;
  const stats = [
    {
      title: "Total Sessions",
      value: (d.total_chat_sessions || 0).toString(),
      trend: { value: d.trends?.sessions || "+0%", isPositive: true, period: "total" },
      icon: CalendarCheck,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Reviews",
      value: (d.total_reviews || 0).toString(),
      trend: { value: "Feedback", isPositive: true, period: "total" },
      icon: CheckCircle,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Wallet Balance",
      value: `₹${(d.wallet_balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: { value: "Withdrawable", isPositive: true, period: "current" },
      icon: Wallet,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Earnings",
      value: `₹${(d.total_earnings || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: { value: d.trends?.earnings || "+0%", isPositive: true, period: "all time" },
      icon: Coins,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return <StatsCards stats={stats} columns={4} />;
}
