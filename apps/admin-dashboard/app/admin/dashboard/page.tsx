"use client";
import React, { useState } from "react";
import { StatsCards } from "@/app/components/admin/StatsCard";
import {
  Calendar,
  Clock,
  Users,
  Wallet,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
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

export default function DashboardPage() {
  // Stats configuration for StatsCards component
  const stats = [
    {
      title: "Total Consultations",
      value: "12.5k",
      icon: Calendar,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
      trend: {
        value: "+2.3%",
        isPositive: true,
        period: "last week",
      },
    },
    {
      title: "Total Astrologers",
      value: "9.1k",
      icon: Clock,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
      trend: {
        value: "+9.1%",
        isPositive: true,
        period: "last week",
      },
    },
    {
      title: "Total Users",
      value: "3.2k",
      icon: Users,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      trend: {
        value: "-19%",
        isPositive: false,
        period: "last week",
      },
    },
    {
      title: "Earnings This Month",
      value: "₹945k",
      icon: Wallet,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
      trend: {
        value: "+12%",
        isPositive: true,
        period: "last week",
      },
    },
  ];

  // Recent activities
  const activities = [
    {
      name: "Avni Pandit",
      action: "Booked a consultation",
      time: "2h ago",
      avatar: "A",
      color: "bg-yellow-600",
    },
    {
      name: "Mahesh Joshi",
      action: "Completed a session",
      time: "5h ago",
      avatar: "M",
      color: "bg-yellow-600",
    },
    {
      name: "Vijay Sharma",
      action: "Rescheduled consultation",
      time: "6h ago",
      avatar: "V",
      color: "bg-yellow-600",
    },
    {
      name: "Priya Desai",
      action: "Left a 5-star review",
      time: "8h ago",
      avatar: "P",
      color: "bg-yellow-600",
    },
    {
      name: "Rahul Gupta",
      action: "Payment received",
      time: "10h ago",
      avatar: "R",
      color: "bg-yellow-600",
    },
  ];

  // Revenue data for Area Chart
  const revenueData = [
    { month: "Jan", revenue: 45000, consultations: 120 },
    { month: "Feb", revenue: 52000, consultations: 145 },
    { month: "Mar", revenue: 48000, consultations: 130 },
    { month: "Apr", revenue: 61000, consultations: 170 },
    { month: "May", revenue: 55000, consultations: 155 },
    { month: "Jun", revenue: 67000, consultations: 190 },
    { month: "Jul", revenue: 73000, consultations: 210 },
  ];

  // Consultation types data for Bar Chart
  const consultationData = [
    { type: "Horoscope", count: 450 },
    { type: "Palm Reading", count: 320 },
    { type: "Tarot", count: 280 },
    { type: "Numerology", count: 190 },
    { type: "Vastu", count: 150 },
  ];

  // User growth data for Line Chart
  const userGrowthData = [
    { month: "Jan", users: 1200, astrologers: 45 },
    { month: "Feb", users: 1450, astrologers: 52 },
    { month: "Mar", users: 1680, astrologers: 58 },
    { month: "Apr", users: 1920, astrologers: 65 },
    { month: "May", users: 2350, astrologers: 71 },
    { month: "Jun", users: 2780, astrologers: 78 },
    { month: "Jul", users: 3200, astrologers: 85 },
  ];

  const [activeTab, setActiveTab] = useState("revenue");

  return (
    <div className="space-y-6">
      {/* Stats Cards - Using Reusable Component */}
      <StatsCards stats={stats} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h5>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`${activity.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}
                  >
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.name}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
     <div className="lg:col-span-8">
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h5 className="text-lg font-semibold text-gray-900">
          Analytics Overview
        </h5>
        
        {/* Mobile: Dropdown, Desktop: Buttons */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <button
            onClick={() => setActiveTab("revenue")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === "revenue"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveTab("consultations")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === "consultations"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Consultations
          </button>
          <button
            onClick={() => setActiveTab("growth")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              activeTab === "growth"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Growth
          </button>
        </div>
      </div>
    </div>

    <div className="p-4 sm:p-6">
      {/* Revenue Chart */}
      {activeTab === "revenue" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div>
              <h6 className="text-sm font-medium text-gray-600">
                Monthly Revenue & Consultations
              </h6>
              <p className="text-xs text-gray-500 mt-1">
                Last 7 months performance
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
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
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
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
        <div>
          <div className="mb-4">
            <h6 className="text-sm font-medium text-gray-600">
              Consultation Types Distribution
            </h6>
            <p className="text-xs text-gray-500 mt-1">
              Most popular services
            </p>
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
        <div>
          <div className="mb-4">
            <h6 className="text-sm font-medium text-gray-600">
              User & Astrologer Growth
            </h6>
            <p className="text-xs text-gray-500 mt-1">
              Platform expansion over time
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "12px" }}
                iconType="line"
              />
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
  </div>
</div>
      </div>
    </div>
  );
}