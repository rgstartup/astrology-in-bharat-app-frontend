"use client";

import React, { useState, useMemo } from "react";
import EarningsStats from "./EarningsStats";
import EarningsFilter from "./EarningsFilter";
import EarningsCharts from "./EarningsCharts";
import WithdrawalHistory from "./WithdrawalHistory";
import { EarningsData, PayoutHistory, CommissionData } from "./types";

// Mock Earnings Data
const earningsData: EarningsData[] = [
  { date: "2025-08-01", earnings: 120 },
  { date: "2025-08-02", earnings: 300 },
  { date: "2025-08-03", earnings: 250 },
  { date: "2025-08-04", earnings: 500 },
  { date: "2025-08-05", earnings: 450 },
  { date: "2025-08-06", earnings: 700 },
  { date: "2025-08-07", earnings: 400 },
  { date: "2025-07-15", earnings: 200 },
  { date: "2025-07-20", earnings: 350 },
  { date: "2025-06-10", earnings: 800 },
  { date: "2025-01-10", earnings: 1200 },
];

const commissionData: CommissionData[] = [
  { name: "Platform Fee", value: 20 },
  { name: "Your Share", value: 80 },
];

const payoutHistory: PayoutHistory[] = [
  { date: "Aug 10", amount: "₹1500", status: "Processed" },
  { date: "Aug 15", amount: "₹2000", status: "Pending" },
  { date: "Aug 20", amount: "₹1800", status: "Processed" },
];

export default function EarningsPage() {
  const [timeRange, setTimeRange] = useState("thisMonth");

  // Filter Function
  const getFilteredData = (range: string) => {
    const now = new Date("2025-08-20"); // Using a fixed date for consistent mock data filtering
    return earningsData.filter((item) => {
      const date = new Date(item.date);
      let startDate, endDate;

      switch (range) {
        case "lastWeek":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 14);
          endDate = new Date(now);
          endDate.setDate(now.getDate() - 7);
          return date >= startDate && date <= endDate;
        case "thisWeek":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay());
          return date >= startDate && date <= now;
        case "lastMonth":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          return date >= startDate && date <= endDate;
        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          return date >= startDate && date <= now;
        case "lastYear":
          startDate = new Date(now.getFullYear() - 1, 0, 1);
          endDate = new Date(now.getFullYear() - 1, 11, 31);
          return date >= startDate && date <= endDate;
        case "thisYear":
          startDate = new Date(now.getFullYear(), 0, 1);
          return date >= startDate && date <= now;
        default:
          return true;
      }
    });
  };

  const filteredData = useMemo(() => getFilteredData(timeRange), [timeRange]);

  const totalEarnings = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.earnings, 0);
  }, [filteredData]);

  const currentBalance = useMemo(() => {
    const totalProcessed = payoutHistory
      .filter((p) => p.status === "Processed")
      .reduce((sum, p) => sum + parseInt(p.amount.replace("₹", "")), 0);
    const totalReceived = earningsData.reduce((sum, item) => sum + item.earnings, 0);
    return totalReceived - totalProcessed;
  }, []);

  const averageEarnings =
    filteredData.length > 0 ? Number((totalEarnings / filteredData.length).toFixed(0)) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Title & Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Earnings & Finance</h1>
        <EarningsStats
          totalEarnings={totalEarnings}
          currentBalance={currentBalance}
          averageEarnings={averageEarnings}
        />
      </div>

      {/* Time Range Filter */}
      <EarningsFilter timeRange={timeRange} setTimeRange={setTimeRange} />

      {/* Charts */}
      <EarningsCharts filteredData={filteredData} commissionData={commissionData} />

      {/* Withdrawal History */}
      <WithdrawalHistory payoutHistory={payoutHistory} />
    </div>
  );
}