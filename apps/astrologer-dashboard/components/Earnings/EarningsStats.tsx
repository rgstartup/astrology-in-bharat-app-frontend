import React from "react";
import { Landmark, Wallet, ArrowUpRight, TrendingUp } from "lucide-react";
import { StatsCards } from "@repo/ui";
import { EarningsStatsData } from "./types";

interface EarningsStatsProps {
    stats: EarningsStatsData;
}

export default function EarningsStats({ stats }: EarningsStatsProps) {
    const totalRevenue = stats?.totalRevenue || 0;
    const walletBalance = stats?.walletBalance || 0;
    const totalWithdrawn = stats?.totalWithdrawn || 0;

    const statsData = [
        {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString('en-IN')}`,
            icon: Landmark,
            iconBgColor: "bg-amber-100",
            iconColor: "text-amber-600",
            trend: {
                value: `${stats?.revenueGrowth || 0}%`,
                isPositive: (stats?.revenueGrowth || 0) >= 0,
                period: "Last 30 days"
            }
        },
        {
            title: "Wallet Balance",
            value: `₹${walletBalance.toLocaleString('en-IN')}`,
            icon: Wallet,
            iconBgColor: "bg-purple-100",
            iconColor: "text-purple-600",
            trend: {
                value: `${stats?.balanceGrowth || 0}%`,
                isPositive: (stats?.balanceGrowth || 0) >= 0,
                period: "Available"
            }
        },
        {
            title: "Successful Withdrawals",
            value: `₹${totalWithdrawn.toLocaleString('en-IN')}`,
            icon: ArrowUpRight,
            iconBgColor: "bg-emerald-100",
            iconColor: "text-emerald-600",
            trend: {
                value: `${stats?.withdrawalGrowth || 0}%`,
                isPositive: (stats?.withdrawalGrowth || 0) >= 0,
                period: "Paid Out"
            }
        },
    ];

    return (
        <div className="mb-8">
            <StatsCards stats={statsData} columns={3} />
        </div>
    );
}


