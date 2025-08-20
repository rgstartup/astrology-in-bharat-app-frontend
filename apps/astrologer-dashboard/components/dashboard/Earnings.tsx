"use client";

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
  }, [payoutHistory, earningsData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
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
        <div className="bg-white rounded-2xl shadow p-6 h-80">
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

      <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Withdrawal History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <th className="p-4 font-semibold rounded-l-lg">Date</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ease-in-out"
                >
                  <td className="p-4 text-sm text-gray-700 bg-gray-50 rounded-l-lg">
                    {row.date}
                  </td>
                  <td className="p-4 text-sm text-gray-700 bg-gray-50">
                    {row.amount}
                  </td>
                  <td
                    className={`p-4 text-sm font-medium bg-gray-50 rounded-r-lg ${row.status === "Processed"
                      ? "text-green-600"
                      : row.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                      }`}
                  >
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === "Processed"
                        ? "bg-green-100"
                        : row.status === "Pending"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                        }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Request Withdrawal */}
        <div className="mt-8 flex justify-end">
          <button
            className="px-6 py-2.5 bg-yellow-600 text-white font-medium rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
          >
            Request Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}