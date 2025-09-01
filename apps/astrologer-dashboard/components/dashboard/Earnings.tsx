"use client";

import { cn } from "@/utils/cn";
import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


// Mock Earnings Data
const earningsData = [
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

const commissionData = [
  { name: "Platform Fee", value: 20 },
  { name: "Your Share", value: 80 },
];

const COLORS = ["#d08700", "#300c56"];

const payoutHistory = [
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
    // This is a simple mock; in a real app, this would come from a database
    const totalProcessed = payoutHistory
      .filter(p => p.status === "Processed")
      .reduce((sum, p) => sum + parseInt(p.amount.replace('₹', '')), 0);
    const totalReceived = earningsData.reduce((sum, item) => sum + item.earnings, 0);
    return totalReceived - totalProcessed;
  }, []);

  const CustomTooltip = ({ active, payload, label }:any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-md text-sm">
          <p className="font-semibold">{`Date: ${label}`}</p>
          <p className="text-yellow-600">{`Earnings: ₹${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Title & Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Earnings & Finance</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-yellow-500">
            <p className="text-sm font-medium text-gray-500">Total Earnings (This Period)</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">₹{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-500">Current Balance</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">₹{currentBalance.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-500">Average Session Earnings</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              ₹{filteredData.length > 0 ? (totalEarnings / filteredData.length).toFixed(0) : "0"}
            </p>
          </div>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {[
          { key: "lastWeek", label: "Last Week" },
          { key: "thisWeek", label: "This Week" },
          { key: "lastMonth", label: "Last Month" },
          { key: "thisMonth", label: "This Month" },
          { key: "lastYear", label: "Last Year" },
          { key: "thisYear", label: "This Year" },
        ].map((range) => (
          <button
            key={range.key}
            onClick={() => setTimeRange(range.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${timeRange === range.key
              ? "bg-yellow-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white rounded-2xl shadow p-6 h-80 pb-10">
          <h2 className="text-lg font-semibold mb-4">
            Earnings Overview
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}

              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Commission Breakdown */}
        <div className="bg-white rounded-2xl shadow p-6 h-80 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-4 text-center">Commission Breakdown</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={commissionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}

              // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {commissionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-gray-200">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-wide">
          Withdrawal History
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-xs uppercase tracking-wider">
                <th className="p-5 font-semibold rounded-tl-lg">Date</th>
                <th className="p-5 font-semibold">Amount</th>
                <th className="p-5 font-semibold rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payoutHistory.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors duration-300"
                >
                  <td className="p-5 text-sm text-gray-800 font-medium  rounded-l-lg">
                    {row.date}
                  </td>
                  <td className="p-5 text-sm text-gray-700 ">
                    {row.amount}
                  </td>
                  <td className="p-5 text-sm font-semibold rounded-r-lg ">
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset",
                        row.status === "Processed"
                          ? "bg-green-50 text-green-700 ring-green-600"
                          : row.status === "Pending"
                            ? "bg-yellow-50 text-yellow-700 ring-yellow-600"
                            : "bg-red-50 text-red-700 ring-red-600"
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Request Withdrawal Button */}
        <div className="mt-10 flex justify-end">
          <button
            className="px-8 py-3 bg-yellow-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-yellow-700 focus:outline-none focus:ring-4  focus:ring-opacity-50 transform transition-all duration-300 "
            type="button"
            aria-label="Request Withdrawal"
          >
            Request Withdrawal
          </button>
        </div>
      </div>

    </div>
  );
}