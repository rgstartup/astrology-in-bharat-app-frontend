"use client";
import React, { useMemo } from "react";
import { Button } from "./Button";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ChartSection({ activeTab, setActiveTab }: ChartSectionProps) {
  const revenueData = useMemo(
    () => [
      { month: "Jan", revenue: 45000, consultations: 120 },
      { month: "Feb", revenue: 52000, consultations: 145 },
      { month: "Mar", revenue: 48000, consultations: 130 },
      { month: "Apr", revenue: 61000, consultations: 170 },
      { month: "May", revenue: 55000, consultations: 155 },
      { month: "Jun", revenue: 67000, consultations: 190 },
      { month: "Jul", revenue: 73000, consultations: 210 },
    ],
    []
  );

  const consultationData = useMemo(
    () => [
      { type: "Horoscope", count: 450 },
      { type: "Palm Reading", count: 320 },
      { type: "Tarot", count: 280 },
      { type: "Numerology", count: 190 },
      { type: "Vastu", count: 150 },
    ],
    []
  );

  const userGrowthData = useMemo(
    () => [
      { month: "Jan", users: 1200, astrologers: 45 },
      { month: "Feb", users: 1450, astrologers: 52 },
      { month: "Mar", users: 1680, astrologers: 58 },
      { month: "Apr", users: 1920, astrologers: 65 },
      { month: "May", users: 2350, astrologers: 71 },
      { month: "Jun", users: 2780, astrologers: 78 },
      { month: "Jul", users: 3200, astrologers: 85 },
    ],
    []
  );

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <header className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 id="analytics-heading" className="text-lg font-semibold text-gray-900">
            Analytics Overview
          </h2>
          <nav className="flex flex-wrap gap-2 sm:flex-nowrap" role="tablist" aria-label="Analytics tabs">
            <Button
              variant={activeTab === "revenue" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("revenue")}
              role="tab"
              aria-selected={activeTab === "revenue"}
              aria-controls="chart-panel"
            >
              Revenue
            </Button>
            <Button
              variant={activeTab === "consultations" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("consultations")}
              role="tab"
              aria-selected={activeTab === "consultations"}
              aria-controls="chart-panel"
            >
              Consultations
            </Button>
            <Button
              variant={activeTab === "growth" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("growth")}
              role="tab"
              aria-selected={activeTab === "growth"}
              aria-controls="chart-panel"
            >
              Growth
            </Button>
          </nav>
        </div>
      </header>

      <div className="p-4 sm:p-6" id="chart-panel" role="tabpanel">
        {/* Revenue Chart */}
        {activeTab === "revenue" && (
          <div role="img" aria-label="Area chart showing monthly revenue from January to July">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Monthly Revenue & Consultations</h3>
                <p className="text-xs text-gray-600 mt-1">Last 7 months performance</p>
              </div>
              <div className="flex items-center space-x-2 text-green-600" aria-label="Growth indicator">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-semibold">+15.3%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d97706"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Consultation Types Chart */}
        {activeTab === "consultations" && (
          <div role="img" aria-label="Bar chart showing consultation type distribution">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Consultation Types Distribution</h3>
              <p className="text-xs text-gray-600 mt-1">Most popular services</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consultationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="type"
                  stroke="#9ca3af"
                  style={{ fontSize: "10px" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#d97706" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* User Growth Chart */}
        {activeTab === "growth" && (
          <div role="img" aria-label="Line chart showing user and astrologer growth">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">User & Astrologer Growth</h3>
              <p className="text-xs text-gray-600 mt-1">Platform expansion over time</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Users"
                />
                <Line
                  type="monotone"
                  dataKey="astrologers"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Astrologers"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </article>
  );
}