import React from "react";
import { Calendar, CheckCircle, XCircle, Wallet } from "lucide-react";
import { StatsCards } from "../../../shared/components/StatsCard";
import { DashboardStats } from "@/lib/dashboard";

interface AppointmentStatsProps {
    stats: DashboardStats | null;
}

export default function AppointmentStats({ stats }: AppointmentStatsProps) {
    const statsData = [
        {
            title: "Today's Appointment",
            value: stats?.today_appointments?.toString() || "0",
            trend: { value: "Today", isPositive: true },
            icon: Calendar,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Today Complete",
            value: stats?.completed_today?.toString() || "0",
            trend: { value: "Today", isPositive: true },
            icon: CheckCircle,
            iconBgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "Today Expired",
            value: stats?.expired_today?.toString() || "0",
            trend: { value: "Today", isPositive: false },
            icon: XCircle,
            iconBgColor: "bg-red-100",
            iconColor: "text-red-600",
        },
        {
            title: "Today Earning",
            value: `₹${(stats?.today_earnings ?? stats?.total_earnings ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            trend: { value: "Today", isPositive: true },
            icon: Wallet,
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
