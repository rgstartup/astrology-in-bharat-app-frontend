import { Wallet, Landmark, Clock, RefreshCw } from "lucide-react";
import { StatsCards } from "@repo/ui";
import { WalletStatsData } from "@/types/wallet";

interface WalletStatsProps {
    stats: WalletStatsData;
}

export default function WalletStats({ stats }: WalletStatsProps) {
    const statsData = [
        {
            title: "Available Balance",
            value: `₹${(stats?.availableBalance ?? 0).toLocaleString('en-IN')}`,
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
            value: `₹${(stats?.totalWithdrawn ?? 0).toLocaleString('en-IN')}`,
            icon: Landmark,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-600",
            trend: {
                value: "In Bank Account",
                isPositive: true,
                period: "Lifetime"
            }
        },
        {
            title: "Pending Approval",
            value: `₹${(stats?.pendingApproval ?? 0).toLocaleString('en-IN')}`,
            icon: Clock,
            iconBgColor: "bg-amber-100",
            iconColor: "text-amber-600",
            trend: {
                value: "Awaiting Admin",
                isPositive: false,
                period: "Current"
            }
        },
        {
            title: "Processing",
            value: `₹${(stats?.processing ?? 0).toLocaleString('en-IN')}`,
            icon: RefreshCw,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-600",
            trend: {
                value: "Transfer in Progress",
                isPositive: true,
                period: "Current"
            }
        },
    ];

    return (
        <div className="mb-8">
            <StatsCards stats={statsData} columns={4} />
        </div>
    );
}


