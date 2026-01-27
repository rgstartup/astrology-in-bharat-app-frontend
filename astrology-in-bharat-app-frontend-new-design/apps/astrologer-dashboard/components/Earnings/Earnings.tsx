"use client";

import React, { useState, useMemo } from "react";
import EarningsStats from "./EarningsStats";
import EarningsCharts from "./EarningsCharts";
import EarningsTable from "./EarningsTable";
import { EarningsDashboardData } from "./types";
import { ChevronDown, Calendar, Download } from "lucide-react";

// Initial Mock Data to see the Premium UI
const MOCK_DATA: EarningsDashboardData = {
  stats: {
    totalRevenue: 125480,
    walletBalance: 8240,
    totalWithdrawn: 117240,
    revenueGrowth: 15.2,
    balanceGrowth: 4.5,
    withdrawalGrowth: 18.8
  },
  incomeTrends: [
    { label: "Jan", value: 45000 },
    { label: "Feb", value: 52000 },
    { label: "Mar", value: 48000 },
    { label: "Apr", value: 61000 },
    { label: "May", value: 98560 },
    { label: "Jun", value: 85000 }
  ],
  revenueBreakdown: [
    { category: "Chat", amount: 56466, percentage: 45, color: "#f59e0b" },
    { category: "Call", amount: 43918, percentage: 35, color: "#300c56" },
    { category: "Reports", amount: 25096, percentage: 20, color: "#d97706" }
  ],
  recentTransactions: [
    { id: "1", date: "2024-06-15", description: "Withdrawal to HDFC Bank", type: "debit", amount: 12000, status: "completed" },
    { id: "2", date: "2024-06-14", description: "Chat Revenue - User #8421", type: "credit", amount: 450, status: "received" },
    { id: "3", date: "2024-06-14", description: "Call Revenue - User #9103", type: "credit", amount: 1200, status: "received" },
    { id: "4", date: "2024-06-13", description: "Detailed Report Purchase", type: "credit", amount: 850, status: "received" },
    { id: "5", date: "2024-06-12", description: "Withdrawal to HDFC Bank", type: "debit", amount: 5000, status: "pending" }
  ]
};

export default function EarningsPage() {
  const [timeRange, setTimeRange] = useState("Last 6 Months");
  const [isExporting, setIsExporting] = useState(false);

  // In a real implementation, this data would come from an API call
  // and would NOT be calculated on the frontend.
  const data = MOCK_DATA;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Earnings Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor your performance and financial growth</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 shadow-sm hover:border-amber-400 transition-all active:scale-95">
              <Calendar className="w-4 h-4 text-amber-500" />
              {timeRange}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-amber-200 transition-all active:scale-95 translate-y-0 hover:-translate-y-0.5"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
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

        {/* Transactions Table Section */}
        <div className="pb-12">
          <EarningsTable transactions={data.recentTransactions} />
        </div>
      </div>
    </div>
  );
}