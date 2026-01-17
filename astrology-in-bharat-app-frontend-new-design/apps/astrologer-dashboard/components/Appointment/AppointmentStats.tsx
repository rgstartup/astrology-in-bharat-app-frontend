import React from "react";
import { CalendarDays, CheckCircle, CircleX, ArrowUpRight } from "lucide-react";
import { StatsCards } from "../../../shared/components/StatsCard";

export default function AppointmentStats() {
    const statsData = [
        {
            title: "Total Appointments",
            value: "32",
            trend: { value: "+12%", isPositive: true },
            icon: CalendarDays,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Completed",
            value: "20",
            trend: { value: "+5%", isPositive: true },
            icon: CheckCircle,
            iconBgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "Cancelled",
            value: "5",
            trend: { value: "-2%", isPositive: false },
            icon: CircleX,
            iconBgColor: "bg-red-100",
            iconColor: "text-red-600",
        },
        {
            title: "Upcoming",
            value: "7",
            trend: { value: "+3%", isPositive: true },
            icon: ArrowUpRight,
            iconBgColor: "bg-purple-100",
            iconColor: "text-purple-600",
        },
    ];

    return (
        <section aria-labelledby="appointment-stats-heading">
            <h2 id="appointment-stats-heading" className="sr-only">
                Appointment Statistics
            </h2>
            <StatsCards stats={statsData} columns={4} />
        </section>
    );
}
