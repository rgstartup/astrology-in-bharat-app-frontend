import React from "react";
import { Users, CalendarCheck, Clock, Wallet } from "lucide-react";
import StatsCard from "@/app/components/StatsCard"
import { RecentActivity } from "@/app/components/ActivityFeed";
import { UpcomingAppointments } from "@/app/components/UserTable";
import { ManageConsultaions } from "@/app/components/ManageConsultaions";
// import { MyConsultations } from "@/app/components/MyConsulation";
import { ConsultationRatings } from "@/app/components/ConsulationRating";

const page = () => {
  const statsData = [
    {
      id: 1,
      title: "Total Consultations",
      value: "12.5k",
      change: "2.3%",
      changeType: "up",
      icon: CalendarCheck,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 2,
      title: "Upcoming Sessions",
      value: "9.1k",
      change: "9.1%",
      changeType: "up",
      icon: Clock,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: 3,
      title: "Total Clients",
      value: "3.2k",
      change: "19%",
      changeType: "down",
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 4,
      title: "Earnings This Month",
      value: "945",
      change: "12%",
      changeType: "up",
      icon: Wallet,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <main className="space-y-8">
      <section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((item) => {
            return (
              <StatsCard
                key={item.id}
                title={item.title}
                value={item.value}
                change={item.change}
                changeType={item.changeType}
                icon={item.icon}
                iconBg={item.iconBg}
                iconColor={item.iconColor}
              />
            );
          })}
        </div>
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

export default page;
