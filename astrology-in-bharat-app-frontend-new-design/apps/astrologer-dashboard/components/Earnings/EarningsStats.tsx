import React from "react";
import { Wallet, Landmark, ArrowUpRight } from "lucide-react";
import { StatsCards } from "../../../shared/components/StatsCard";

interface EarningsStatsProps {
    totalEarnings: number;
    currentBalance: number;
    totalWithdrawn: number;
}

export default function EarningsStats({
    totalEarnings,
    currentBalance,
    totalWithdrawn,
}: EarningsStatsProps) {
    const statsData = [
        {
            title: "Total Earnings",
            value: `₹${totalEarnings.toLocaleString()}`,
            icon: Landmark,
            iconBgColor: "bg-yellow-100",
            iconColor: "text-yellow-600",
            trend: { value: "Lifetime", isPositive: true }
        },
        {
            title: "Current Balance",
            value: `₹${currentBalance.toLocaleString()}`,
            icon: Wallet,
            iconBgColor: "bg-green-100",
            iconColor: "text-green-600",
            trend: { value: "Available", isPositive: true }
        },
        {
            title: "Total Withdrawn",
            value: `₹${totalWithdrawn.toLocaleString()}`,
            icon: ArrowUpRight,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-600",
            trend: { value: "Paid Out", isPositive: true }
        },
    ];

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Earnings & Finance
            </h1>
            <StatsCards stats={statsData} columns={3} />
        </div>
    );
}
