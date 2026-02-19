"use client";
import React, { useMemo } from "react";
import { useAgentAuthStore } from "@/src/store/useAgentAuthStore";
import { StatsCards, Button } from "@repo/ui";
import type { StatConfig } from "@repo/ui";
import {
    Star, Building2, ShoppingBag, BadgeIndianRupee,
    TrendingUp, Clock, CheckCircle, Plus
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAgentDashboardStats } from "@/src/services/agent.service";
import { Loading } from "@repo/ui";

// ── Mock summary ─────────────────────────────────────────────
const SUMMARY = {
    astrologers: 3,
    mandirs: 2,
    pujaShops: 2,
    totalEarned: 14500,
    pendingPayout: 3200,
    paidThisMonth: 4800,
    totalListings: 7,
    recentActivity: [
        { id: 1, text: "Commission ₹450 from Pt. Rajendra Joshi", time: "2h ago", status: "paid" },
        { id: 2, text: "New astrologer listing approved", time: "5h ago", status: "approved" },
        { id: 3, text: "Commission ₹780 from Shiv Puja Bhandar", time: "1d ago", status: "pending" },
        { id: 4, text: "Mandir listing – Kashi Vishwanath", time: "2d ago", status: "approved" },
        { id: 5, text: "Commission ₹320 from Kashi Vishwanath Mandir", time: "3d ago", status: "paid" },
    ],
};

export default function AgentDashboardHome() {
    const { agent } = useAgentAuthStore();
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await getAgentDashboardStats();
                setStatsData(data);
            } catch (error) {
                console.error("Failed to fetch agent dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats: StatConfig[] = useMemo(() => [
        {
            title: "Astrologers Listed",
            value: loading ? "..." : (statsData?.astrologersCount || 0),
            icon: Star,
            iconColor: "text-yellow-600",
            iconBgColor: "bg-yellow-100",
        },
        {
            title: "Mandirs Listed",
            value: loading ? "..." : (statsData?.mandirsCount || 0),
            icon: Building2,
            iconColor: "text-orange-600",
            iconBgColor: "bg-orange-100",
        },
        {
            title: "Puja Shops Listed",
            value: loading ? "..." : (statsData?.pujaShopsCount || 0),
            icon: ShoppingBag,
            iconColor: "text-purple-600",
            iconBgColor: "bg-purple-100",
        },
        {
            title: "Pending Payout",
            value: loading ? "..." : `₹${(statsData?.pendingPayout || 0).toLocaleString("en-IN")}`,
            icon: BadgeIndianRupee,
            iconColor: "text-green-600",
            iconBgColor: "bg-green-100",
            valueColor: "text-green-700",
        },
    ], [statsData, loading]);

    if (loading && !statsData) return <Loading fullScreen text="Loading Dashboard..." />;

    return (
        <div className="space-y-8">

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-primary to-primary-hover text-white shadow-xl">
                <div className="absolute -right-12 -top-12 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
                <div className="absolute -right-4 top-12 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <p className="text-orange-200 text-sm font-bold uppercase tracking-widest mb-1">Welcome back 🙏</p>
                    <h2 className="text-3xl font-black text-white mb-1">{agent?.name ?? "Agent"}</h2>
                    <p className="text-orange-100 text-sm font-medium font-mono">ID: {agent?.agent_id}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-6">
                        <div>
                            <p className="text-orange-200 text-xs font-bold uppercase tracking-widest">Total Earned</p>
                            <p className="text-2xl font-black">₹{(statsData?.totalEarned || 0).toLocaleString("en-IN")}</p>
                        </div>
                        <div className="w-px h-10 bg-white/20 hidden sm:block" />
                        <div>
                            <p className="text-orange-200 text-xs font-bold uppercase tracking-widest">Commission</p>
                            <p className="text-2xl font-black">₹{(statsData?.commissionEarned || 0).toLocaleString("en-IN")}</p>
                        </div>
                        <div className="w-px h-10 bg-white/20 hidden sm:block" />
                        <div>
                            <p className="text-orange-200 text-xs font-bold uppercase tracking-widest">Total Listings</p>
                            <p className="text-2xl font-black">{statsData?.totalListings || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* @repo/ui StatsCards */}
            <StatsCards stats={stats} columns={4} />

            {/* Quick Actions + Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5">Quick Actions</h3>
                    <div className="space-y-3">
                        {[
                            { label: "Add New Astrologer", href: "/dashboard/astrologers", icon: Star },
                            { label: "Add New Mandir", href: "/dashboard/mandirs", icon: Building2 },
                            { label: "Add New Puja Shop", href: "/dashboard/puja-shops", icon: ShoppingBag },
                            { label: "View Commissions", href: "/dashboard/commissions", icon: BadgeIndianRupee },
                        ].map(({ label, href, icon: Icon }) => (
                            <Link key={href} href={href} className="block">
                                {/* @repo/ui Button */}
                                <Button variant="outline" fullWidth icon={Icon} className="!rounded-xl justify-start !text-sm !font-semibold">
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5">Recent Activity</h3>
                    <div className="space-y-4">
                        {(statsData?.recentActivity || []).length > 0 ? (
                            statsData.recentActivity.map((item: any) => (
                                <div key={item.id} className="flex items-start gap-3">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.status === "paid" ? "bg-green-100 text-green-600" :
                                        item.status === "approved" ? "bg-blue-100 text-blue-600" :
                                            "bg-orange-100 text-orange-600"
                                        }`}>
                                        {item.status === "paid" ? <CheckCircle className="w-3.5 h-3.5" /> :
                                            item.status === "approved" ? <TrendingUp className="w-3.5 h-3.5" /> :
                                                <Clock className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 leading-snug">{item.text}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
