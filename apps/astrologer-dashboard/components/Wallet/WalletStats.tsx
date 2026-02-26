import React from "react";
import { Wallet, Landmark, Clock, ArrowUpRight } from "lucide-react";
import { StatsCards } from "@repo/ui";
import { WalletStatsData } from "./types";

interface WalletStatsProps {
    stats: WalletStatsData;
}

export default function WalletStats({ stats }: WalletStatsProps) {
    const statsData = [
        {
            title: "Available Balance",
            value: `₹${stats.availableBalance.toLocaleString('en-IN')}`,
            icon: Wallet,
            iconBgColor: "bg-emerald-100",
            iconColor: "text-emerald-600",
            trend: {
                value: "Ready to Withdraw",
                isPositive: true,
                period: "Current"
            }
        },
        {
            title: "Total Withdrawn",
            value: `₹${stats.totalWithdrawn.toLocaleString('en-IN')}`,
            icon: Landmark,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-600",
            trend: {
                value: "To Bank Account",
                isPositive: true,
                period: "Lifetime"
            }
        },
        {
            title: "Processing",
            value: `₹${stats.pendingWithdrawals.toLocaleString('en-IN')}`,
            icon: Clock,
            iconBgColor: "bg-amber-100",
            iconColor: "text-amber-600",
            trend: {
                value: "In Progress",
                isPositive: false,
                period: "Pending"
            }
        },
    ];

    return (
        <div className="mb-8">
            <StatsCards stats={statsData} columns={3} />
        </div>
    );
}


