// refund-management/components/RefundStats.tsx
import React from "react";
import { StatsCards } from "@repo/ui";
import {
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

interface RefundStatsProps {
  stats: any[]; // You can create proper type
}

export function RefundStats({ stats }: RefundStatsProps) {
  // Default stats if not provided
  const defaultStats = [
    {
      title: "Total Refunds",
      value: "24",
      icon: IndianRupee,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
      trend: { value: "+8%", isPositive: false, period: "this month" }
    },
    {
      title: "Pending",
      value: "8",
      icon: Clock,
      iconColor: "text-yellow-600",
      iconBgColor: "bg-yellow-100",
      trend: { value: "3 new", isPositive: false, period: "today" }
    },
    {
      title: "Approved",
      value: "12",
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      trend: { value: "+4", isPositive: true, period: "this week" }
    },
    {
      title: "Rejected",
      value: "4",
      icon: XCircle,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
      trend: { value: "-2", isPositive: true, period: "improved" }
    },
    {
      title: "Total Amount",
      value: "₹18,500",
      icon: IndianRupee,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
      trend: { value: "₹3,200", isPositive: false, period: "pending" }
    },
    {
      title: "Avg. Time",
      value: "2.5 days",
      icon: Clock,
      iconColor: "text-cyan-600",
      iconBgColor: "bg-cyan-100",
      trend: { value: "-0.5 days", isPositive: true, period: "faster" }
    }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Refund Overview</h2>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      <StatsCards stats={displayStats} columns={4} />
    </div>
  );
}



