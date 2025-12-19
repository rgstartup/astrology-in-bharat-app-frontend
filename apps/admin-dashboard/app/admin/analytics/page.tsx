"use client";
import React, { useState } from "react";
import { IndianRupee, Users, Calendar, Target } from "lucide-react";
import { StatsCards } from "@/app/components/admin/StatsCard";
import { AnalyticsHeader } from "@/app/components/analytics/AnalyticsHeader";
import { RevenueChart } from "@/app/components/analytics/RevenueChart";
import { UserGrowthChart } from "@/app/components/analytics/UserGrowthChart";
import { ConsultationTypesPie } from "@/app/components/analytics/ConsultationTypesPie";
import { TimeSlotChart } from "@/app/components/analytics/TimeSlotChart";
import { TopExpertsList } from "@/app/components/analytics/TopExpertsList";
import { RecentActivityFeed } from "@/app/components/analytics/RecentActivityFeed";

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("30days");
console.log("this is revenuechart",RevenueChart)
  
  const stats = [
    {
      title: "Total Revenue",
      value: "₹12.5L",
      icon: IndianRupee,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      trend: { value: "+23.5%", isPositive: true, period: "vs last month" },
    },
    {
      title: "Active Users",
      value: "8,432",
      icon: Users,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
      trend: { value: "+12.3%", isPositive: true, period: "vs last month" },
    },
    {
      title: "Total Consultations",
      value: "2,543",
      icon: Calendar,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
      trend: { value: "+18.2%", isPositive: true, period: "vs last month" },
    },
    {
      title: "Conversion Rate",
      value: "24.8%",
      icon: Target,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
      trend: { value: "-2.4%", isPositive: false, period: "vs last month" },
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 85000, consultations: 420, experts: 45 },
    { month: "Feb", revenue: 95000, consultations: 480, experts: 52 },
    { month: "Mar", revenue: 88000, consultations: 450, experts: 48 },
    { month: "Apr", revenue: 120000, consultations: 580, experts: 65 },
    { month: "May", revenue: 115000, consultations: 560, experts: 62 },
    { month: "Jun", revenue: 135000, consultations: 650, experts: 70 },
    { month: "Jul", revenue: 145000, consultations: 720, experts: 78 },
  ];

  const userGrowthData = [
    { date: "Week 1", new: 120, returning: 350 },
    { date: "Week 2", new: 145, returning: 380 },
    { date: "Week 3", new: 132, returning: 420 },
    { date: "Week 4", new: 168, returning: 460 },
  ];

  const consultationTypes = [
    { name: "Vedic Astrology", value: 450, color: "#f59e0b" },
    { name: "Tarot Reading", value: 320, color: "#8b5cf6" },
    { name: "Numerology", value: 280, color: "#10b981" },
    { name: "Palmistry", value: 190, color: "#3b82f6" },
    { name: "Vastu Shastra", value: 150, color: "#ef4444" },
    { name: "Others", value: 110, color: "#6b7280" },
  ];

  const topExperts = [
    { name: "Pandit Raj Kumar", consultations: 145, rating: 4.9, revenue: 72500 },
    { name: "Dr. Meera Sharma", consultations: 132, rating: 4.8, revenue: 66000 },
    { name: "Swami Ravi Patel", consultations: 128, rating: 4.9, revenue: 64000 },
    { name: "Acharya Suresh", consultations: 118, rating: 4.7, revenue: 59000 },
    { name: "Dr. Priya Bansal", consultations: 112, rating: 4.8, revenue: 56000 },
  ];

  const timeSlotData = [
    { time: "6-9 AM", bookings: 45 },
    { time: "9-12 PM", bookings: 120 },
    { time: "12-3 PM", bookings: 95 },
    { time: "3-6 PM", bookings: 145 },
    { time: "6-9 PM", bookings: 180 },
    { time: "9-12 AM", bookings: 85 },
  ];

  const recentActivities = [
    { type: "consultation" as const, user: "Rahul Sharma", expert: "Pandit Raj Kumar", time: "2 min ago", amount: 500 },
    { type: "signup" as const, user: "Priya Singh", time: "5 min ago" },
    { type: "consultation" as const, user: "Amit Kumar", expert: "Dr. Meera Sharma", time: "8 min ago", amount: 450 },
    { type: "signup" as const, user: "Sneha Patel", time: "12 min ago" },
    { type: "consultation" as const, user: "Vikram Singh", expert: "Swami Ravi Patel", time: "15 min ago", amount: 600 },
  ];

  return (
    <div className="space-y-6">
      <AnalyticsHeader timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      <StatsCards stats={stats} columns={4} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <UserGrowthChart data={userGrowthData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsultationTypesPie data={consultationTypes} />
        <TimeSlotChart data={timeSlotData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopExpertsList experts={topExperts} />
        <RecentActivityFeed activities={recentActivities} />
      </div>
    </div>
  );
}