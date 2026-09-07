"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, Trash2, CheckCircle2, BellOff, Loader2, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/cn";

let cachedNotifications: any = null;

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>(cachedNotifications?.data || []);
    const [loading, setLoading] = useState(!cachedNotifications);
    const [totalCount, setTotalCount] = useState(cachedNotifications?.total || 0);

    const fetchNotifications = useCallback(async () => {
        if (!cachedNotifications) setLoading(true);
        try {
            const [res, error] = await api.get<any>("/notifications", { params: { limit: 50 } });
            if (!error && res) {
                setNotifications(res.data || []);
                setTotalCount(res.meta?.totalCount || 0);
                cachedNotifications = { data: res.data || [], total: res.meta?.totalCount || 0 };
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const clearAll = async () => {
        if (!confirm("Are you sure you want to clear all notifications?")) return;
        try {
            await api.delete("/notifications/all");
            setNotifications([]);
            setTotalCount(0);
        } catch (err) {
            console.error("Failed to clear all", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
                    <p className="text-gray-1000 mt-1 font-medium">Manage your alerts and system updates</p>
                </div>

                <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-100"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border-2 border-[#F25E0A] shadow-xl shadow-orange-500/10 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-[#F25E0A] animate-spin" />
                        <p className="text-gray-1000 font-bold uppercase tracking-widest text-xs">Loading Notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                            <BellOff className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">All caught up!</h3>
                        <p className="text-gray-1000 mt-2 max-w-xs mx-auto">You don't have any notifications at the moment.</p>
                        <Link 
                            href="/dashboard"
                            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-orange-200"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    "p-6 sm:p-8 transition-all hover:bg-gray-50/50 cursor-pointer group relative",
                                    !n.is_read && "bg-blue-50/20"
                                )}
                                onClick={() => !n.is_read && markAsRead(n.id)}
                            >
                                <div className="flex gap-6">
                                    <div className={cn(
                                        "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                        !n.is_read ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-1000"
                                    )}>
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4 mb-2">
                                            <h4 className={cn(
                                                "text-lg font-bold truncate",
                                                !n.is_read ? "text-gray-900" : "text-gray-1000"
                                            )}>
                                                {n.title}
                                            </h4>
                                            {!n.is_read && (
                                                <span className="shrink-0 px-2 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">New</span>
                                            )}
                                        </div>
                                        <p className="text-gray-1000 leading-relaxed mb-4">{n.message}</p>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-gray-1000">
                                                {new Date(n.created_at).toLocaleString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            {!n.is_read && (
                                                <button 
                                                    className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(n.id);
                                                    }}
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="text-center pb-10">
                <p className="text-sm text-gray-1000 font-medium">Showing {notifications.length} of {totalCount} notifications</p>
            </div>
        </div>
    );
}
