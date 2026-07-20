"use client";
import React, { useMemo } from "react";
import { useAgentAuthStore } from "@/store/useAgentAuthStore";
import { StatsCards, Button } from "@repo/ui";
import type { StatConfig } from "@repo/ui";
import {
    Star, Building2, ShoppingBag, BadgeIndianRupee,
    TrendingUp, Clock, CheckCircle, Plus, User
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAgentDashboardStats } from "@/services/agent.service";
import { DashboardSkeleton } from "../components/Skeleton";
import { getErrorMessage } from "@repo/lib/utils/error";

// ── Mock summary ─────────────────────────────────────────────
const SUMMARY = {
    experts: 3,
    mandirs: 2,
    pujaShops: 2,
    totalEarned: 14500,
    pendingPayout: 3200,
    paidThisMonth: 4800,
    totalListings: 7,
    recentActivity: [
        { id: 1, text: "Commission ₹450 from Pt. Rajendra Joshi", time: "2h ago", status: "paid" },
        { id: 2, text: "New expert listing approved", time: "5h ago", status: "approved" },
        { id: 3, text: "Commission ₹780 from Shiv Puja Bhandar", time: "1d ago", status: "pending" },
        { id: 4, text: "Mandir listing – Kashi Vishwanath", time: "2d ago", status: "approved" },
        { id: 5, text: "Commission ₹320 from Kashi Vishwanath Mandir", time: "3d ago", status: "paid" },
    ],
};

let cachedDashboardStats: any = null;

export default function AgentDashboardHome() {
    const { agent } = useAgentAuthStore();
    const [statsData, setStatsData] = useState<any>(cachedDashboardStats);
    const [loading, setLoading] = useState(!cachedDashboardStats);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setMounted(true);
        const fetchDashboardData = async () => {
            if (!cachedDashboardStats) setLoading(true);
            const [data, error] = await getAgentDashboardStats();
            
            if (!isMounted) return;
            
            if (error) {
                const msg = getErrorMessage(error).toLowerCase();
                if (!msg.includes("abort") && !msg.includes("cancel") && !msg.includes("timeout")) {
                    console.error("Failed to fetch agent dashboard stats", getErrorMessage(error));
                }
            } else {
                cachedDashboardStats = data;
                setStatsData(data);
            }
            setLoading(false);
        };
        fetchDashboardData();
        
        return () => { isMounted = false; };
    }, []);

    const stats: StatConfig[] = useMemo(() => [
        {
            title: "Experts Listed",
            value: loading ? "..." : (statsData?.experts_count || 0),
            icon: Star,
            iconColor: "text-yellow-600",
            iconBgColor: "bg-yellow-100",
        },
        {
            title: "Mandirs Listed",
            value: loading ? "..." : (statsData?.mandirs_count || 0),
            icon: Building2,
            iconColor: "text-orange-600",
            iconBgColor: "bg-orange-100",
        },
        {
            title: "Puja Shops Listed",
            value: loading ? "..." : (statsData?.puja_shops_count || 0),
            icon: ShoppingBag,
            iconColor: "text-purple-600",
            iconBgColor: "bg-purple-100",
        },
        {
            title: "Pending Payout",
            value: loading ? "..." : `₹${(statsData?.pending_payout || 0).toLocaleString("en-IN")}`,
            icon: BadgeIndianRupee,
            iconColor: "text-green-600",
            iconBgColor: "bg-green-100",
            valueColor: "text-green-700",
        },
    ], [statsData, loading]);

    if (loading && !statsData) return <DashboardSkeleton />;

    return (
        <div className="space-y-8">

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-primary to-primary-hover text-white shadow-xl">
                <div className="absolute -right-12 -top-12 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
                <div className="absolute -right-4 top-12 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <p className="text-orange-200 text-sm font-bold uppercase tracking-widest mb-1">Welcome back 🙏</p>
                    <h2 className="text-3xl font-black text-white mb-1">{mounted ? (agent?.name ?? "Agent") : "Agent"}</h2>
                    <p className="text-orange-100 text-sm font-medium font-mono bg-white/10 w-fit px-2 py-0.5 rounded-md">ID: <span className="text-white font-black">{mounted ? (agent?.uid || "...") : "..."}</span></p>
                    <div className="mt-6 flex flex-wrap items-center gap-6">
                        <div>
                            <p className="text-orange-200 text-xs font-bold uppercase tracking-widest">Total Earned</p>
                            <p className="text-2xl font-black">₹{(statsData?.total_listings_earnings || 0).toLocaleString("en-IN")}</p>
                        </div>
                        <div className="w-px h-10 bg-white/20 hidden sm:block" />
                        <div>
                            <p className="text-orange-200 text-xs font-bold uppercase tracking-widest">Wallet Balance</p>
                            <p className="text-2xl font-black">₹{(statsData?.total_earned || 0).toLocaleString("en-IN")}</p>
                        </div>
                        <div className="w-px h-10 bg-white/20 hidden sm:block" />
                        <div>
                            <p className="text-orange-200 text-xs font-bold uppercase tracking-widest">Total Listings</p>
                            <p className="text-2xl font-black">{statsData?.total_listings || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* @repo/ui StatsCards */}
            <StatsCards stats={stats} columns={4} />
            

            {/* Commission Structure Section */}
            <div className="bg-white rounded-[2rem] border-2 border-[#F25E0A] shadow-sm p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Commission Structure</h3>
                        <p className="text-xs font-medium text-gray-400">Your current earnings percentage for each referral type.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 max-w-2xl">
                        {[
                            { label: "Expert", value: statsData?.commission_rates?.expert || 3, icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
                            { label: "Puja Shop", value: statsData?.commission_rates?.shop || 13, icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50" },
                        ].map((rate) => (
                            <div key={rate.label} className="bg-white rounded-2xl p-4 border-2 border-[#F25E0A] shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-[1.05] transition-all duration-500 group/rate relative overflow-hidden">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`p-1.5 ${rate.bg} rounded-lg`}>
                                        <rate.icon className={`w-3 h-3 ${rate.color}`} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight">{rate.label}</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-gray-900">{rate.value}%</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">Comm.</span>
                                </div>
                                
                                {/* Hover Orange Line */}
                                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[#F25E0A] transform scale-x-0 group-hover/rate:scale-x-100 transition-transform duration-500 origin-center" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions + Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border-2 border-[#F25E0A] p-6">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5">Quick Actions</h3>
                    <div className="space-y-3">
                        {[
                            { label: "Add New Astrologer", href: "/dashboard/registration", icon: Star },
                            { label: "Add New Mandir", href: "/dashboard/registration", icon: Building2 },
                            { label: "Add New Puja Shop", href: "/dashboard/registration", icon: ShoppingBag },
                        ].map(({ label, href, icon: Icon }) => (
                            <Link key={label} href={href} className="block">
                                {/* @repo/ui Button */}
                                <Button variant="outline" fullWidth icon={Icon} className="!rounded-xl justify-start !text-sm !font-semibold">
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border-2 border-[#F25E0A] p-6">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5">Recent Activity</h3>
                    <div className="space-y-4">
                        {(statsData?.recent_activity || []).length > 0 ? (
                            statsData.recent_activity.map((item: any) => (
                                <div key={item.id} className="flex items-start gap-3">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${(item.status === "paid" || item.action === "Listing") ? "bg-green-100 text-green-600" :
                                        item.status === "approved" ? "bg-blue-100 text-blue-600" :
                                            "bg-orange-100 text-orange-600"
                                        }`}>
                                        {(item.status === "paid" || item.action === "Listing") ? <CheckCircle className="w-3.5 h-3.5" /> :
                                            item.status === "approved" ? <TrendingUp className="w-3.5 h-3.5" /> :
                                                <Clock className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 leading-snug">
                                            {item.text || `${item.action}: ${item.name}`}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {item.time || new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </p>
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
