import React from "react";
import { CalendarDays, CheckCircle, CircleX, ArrowUpRight } from "lucide-react";
import StatsCard from "../dashboard/StatsCard";

export default function AppointmentStats() {
    const statsData = [
        {
            title: "Total Appointments",
            value: "32",
            change: "+12%",
            changeType: "up",
            icon: CalendarDays,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Completed",
            value: "20",
            change: "+5%",
            changeType: "up",
            icon: CheckCircle,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "Cancelled",
            value: "5",
            change: "-2%",
            changeType: "down",
            icon: CircleX,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
        },
        {
            title: "Upcoming",
            value: "7",
            change: "+3%",
            changeType: "up",
            icon: ArrowUpRight,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
        },
    ];

    return (
        <section aria-labelledby="appointment-stats-heading">
            <h2 id="appointment-stats-heading" className="sr-only">
                Appointment Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map(
                    ({
                        title,
                        value,
                        change,
                        changeType,
                        icon: Icon,
                        iconBg,
                        iconColor,
                    }) => (
                        <StatsCard
                            key={title}
                            title={title}
                            value={value}
                            change={change}
                            changeType={changeType as "up" | "down"}
                            icon={Icon}
                            iconBg={iconBg}
                            iconColor={iconColor}
                        />
                    )
                )}
            </div>
        </section>
    );
}
