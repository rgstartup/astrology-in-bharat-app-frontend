import React from "react";
import { User, Target, TrendingUp, Users } from "lucide-react";
import { TopUser, TopService } from "./types";

interface TopInsightsProps {
    topUsers: TopUser[];
    topServices: TopService[];
}

export default function TopInsights({ topUsers, topServices }: TopInsightsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Contributing Users */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            {/* @ts-ignore */}
                            <Users className="w-5 h-5 text-amber-600" /> Top Contributors
                        </h2>
                        <p className="text-xs text-gray-400 font-medium">Clients who trust you the most</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {(topUsers || []).map((user, idx) => (
                        <div key={user.id} className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-amber-50 transition-all cursor-default border border-transparent hover:border-amber-100">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center text-amber-700 font-bold text-lg border-2 border-white shadow-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
                                        <span className="text-[10px] font-black text-gray-400">#{idx + 1}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">{user.name}</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user.sessions} Total Sessions</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-900">₹{(user.totalSpent || 0).toLocaleString('en-IN')}</p>
                                <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                    {/* @ts-ignore */}
                                    <TrendingUp className="w-3 h-3" /> High Value
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Performing Services */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            {/* @ts-ignore */}
                            <Target className="w-5 h-5 text-purple-600" /> Best Performing Services
                        </h2>
                        <p className="text-xs text-gray-400 font-medium">Most popular and profitable services</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {(topServices || []).map((service) => (
                        <div key={service.id} className="p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-purple-100 hover:bg-purple-50 transition-all cursor-default">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                                    <h3 className="text-sm font-bold text-gray-800">{service.name}</h3>
                                </div>
                                <p className="text-sm font-black text-gray-900">₹{(service.revenue || 0).toLocaleString('en-IN')}</p>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            backgroundColor: service.color,
                                            width: `${((service.revenue || 0) / Math.max(1, ...(topServices || []).map(s => s.revenue || 0))) * 100}%`
                                        }}
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 whitespace-nowrap uppercase tracking-tighter">
                                    {service.usageCount} Bookings
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
