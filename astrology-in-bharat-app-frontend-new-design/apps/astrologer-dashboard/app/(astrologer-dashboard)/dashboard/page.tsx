"use client";
import React from "react";
import { Users, CalendarCheck, Clock, Wallet } from "lucide-react";
import { StatsCards } from "../../../../shared/components/StatsCard";
import { RecentActivity } from "@/components/dashboard/ActivityFeed";
import { UpcomingAppointments } from "@/components/dashboard/UserTable";
import { ManageConsultaions } from "@/components/dashboard/ManageConsultaions";
// import { MyConsultations } from "@/components/MyConsulation";
import { ConsultationRatings } from "@/components/dashboard/ConsulationRating";

import { useAuth } from "@/context/AuthContext";

const Page = () => {
  const { user } = useAuth();
  const statsData = [
    {
      title: "Total Consultations",
      value: "12.5k",
      trend: { value: "2.3%", isPositive: true, period: "last week" },
      icon: CalendarCheck,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Upcoming Sessions",
      value: "9.1k",
      trend: { value: "9.1%", isPositive: true, period: "last week" },
      icon: Clock,
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Clients",
      value: "3.2k",
      trend: { value: "19%", isPositive: false, period: "last week" },
      icon: Users,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Earnings This Month",
      value: "945",
      trend: { value: "12%", isPositive: true, period: "last week" },
      icon: Wallet,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || "Expert"}!
          </h2>
          <p className="text-gray-500">
            Here's what's happening with your consultations today.
          </p>
        </div>
      </div>

      <section>
        <StatsCards stats={statsData} columns={4} />
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RecentActivity />
          <div className="lg:col-span-2">
            <UpcomingAppointments />
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* <MyConsultations /> */}
          <ConsultationRatings averageRating={4.8}
            totalRatings={1237}
            distribution={[
              { stars: 5, count: 900 },
              { stars: 4, count: 200 },
              { stars: 3, count: 80 },
              { stars: 2, count: 40 },
              { stars: 1, count: 17 },
            ]} />
          <ManageConsultaions />
        </div>
      </section>
    </main>
  );
};

export default Page;
