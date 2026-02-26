"use client";
import React, { useState, useMemo, useEffect } from "react";
import { StatsCards, NotFound, Loading } from "@repo/ui";
import type { StatConfig } from "@repo/ui";
import { IndianRupee, CheckCircle, Clock, Filter, BadgeIndianRupee } from "lucide-react";

import { getAgentDashboardStats } from "@/src/services/agent.service";

const MOCK_COMMISSIONS = [
    { id: 1, type: "astrologer", listing: "Pt. Rajendra Joshi", amount: 450, status: "paid", date: "01 Dec 2024" },
    { id: 2, type: "mandir", listing: "Kashi Vishwanath Mandir", amount: 320, status: "paid", date: "15 Dec 2024" },
    { id: 3, type: "puja_shop", listing: "Shiv Puja Bhandar", amount: 780, status: "pending", date: "05 Jan 2025" },
    { id: 4, type: "astrologer", listing: "Acharya Suresh Pandey", amount: 600, status: "paid", date: "10 Jan 2025" },
];

const TYPE_BADGE: Record<string, string> = {
    astrologer: "bg-yellow-100 text-yellow-700",
    mandir: "bg-orange-100 text-orange-700",
    puja_shop: "bg-purple-100 text-purple-700",
};
const TYPE_LABEL: Record<string, string> = {
    astrologer: "Astrologer",
    mandir: "Mandir",
    puja_shop: "Puja Shop",
};

type FilterType = "all" | "paid" | "pending";

export default function CommissionsPage() {
    const [filter, setFilter] = useState<FilterType>("all");
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAgentDashboardStats();
                setStatsData(res);
            } catch (error) {
                console.error("Failed to fetch commission stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const filtered = useMemo(() =>
        filter === "all" ? MOCK_COMMISSIONS : MOCK_COMMISSIONS.filter((c) => c.status === filter),
        [filter]
    );

    const stats: StatConfig[] = useMemo(() => [
        { title: "Total Earned", value: `₹${(statsData?.totalEarned || 0).toLocaleString("en-IN")}`, icon: BadgeIndianRupee, iconColor: "text-blue-600", iconBgColor: "bg-blue-100", valueColor: "text-blue-700" },
        { title: "Commission", value: `₹${(statsData?.commissionEarned || 0).toLocaleString("en-IN")}`, icon: CheckCircle, iconColor: "text-green-600", iconBgColor: "bg-green-100", valueColor: "text-green-700" },
        { title: "Pending", value: `₹${(statsData?.pendingPayout || 0).toLocaleString("en-IN")}`, icon: Clock, iconColor: "text-orange-600", iconBgColor: "bg-orange-100", valueColor: "text-orange-700" },
        { title: "Transactions", value: statsData?.totalListings || 0, icon: IndianRupee, iconColor: "text-gray-600", iconBgColor: "bg-gray-100" },
    ], [statsData]);

    if (loading) return <Loading fullScreen text="Loading Commissions..." />;

    return (
        <div className="space-y-6">

            {/* @repo/ui StatsCards */}
            <StatsCards stats={stats} columns={4} />

            {/* Filter + Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Transaction History</h3>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        {(["all", "paid", "pending"] as FilterType[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f
                                    ? "bg-primary text-white shadow-sm"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="p-6">
                        <NotFound
                            title="No Commissions Found"
                            returnUrl="/dashboard/commissions"
                            returnLabel="Show All"
                            imagePath="/images/Astrologer.png"
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    {["Listing", "Type", "Amount", "Status", "Date"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3.5 font-semibold text-gray-800">{c.listing}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${TYPE_BADGE[c.type]}`}>
                                                {TYPE_LABEL[c.type]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 font-black text-gray-900">₹{c.amount.toLocaleString("en-IN")}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${c.status === "paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                                }`}>
                                                {c.status === "paid" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {c.status === "paid" ? "Paid" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-gray-500 text-xs font-medium">{c.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
