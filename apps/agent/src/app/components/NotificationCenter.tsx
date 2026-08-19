"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Bell, Trash2, CheckCircle2, BellOff, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useAgentAuthStore } from "@/store/useAgentAuthStore";
import { connectNotificationSocket, getNotificationSocket, NotificationBell } from "@repo/ui";
import { toast } from "react-toastify";

export const NotificationCenter = () => {
    const { agent } = useAgentAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const [res, error] = await api.get<any>("/notifications/unread-count");
            if (!error && res) {
                setUnreadCount(res.count || 0);
            }
        } catch (err) {
            console.error("Failed to fetch unread count", err);
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const [res, error] = await api.get<any>("/notifications", { params: { limit: 5 } });
            if (!error && res) {
                setNotifications(res.data || []);
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
            fetchUnreadCount();
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const clearAll = async () => {
        try {
            await api.delete("/notifications/all");
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to clear all", err);
        }
    };

    useEffect(() => {
        if (agent?.id) {
            connectNotificationSocket(agent.id);
            const socket = getNotificationSocket();

            const handleNewNotification = (data: any) => {
                console.log("🔔 Real-time notification received:", data);
                toast.info(data.message || "New notification received!", {
                    icon: <Bell className="w-4 h-4 text-primary" />
                });
                fetchUnreadCount();
                if (isOpen) fetchNotifications();
            };

            socket.on("new_notification", handleNewNotification);
            socket.on("notification", handleNewNotification);

            return () => {
                socket.off("new_notification", handleNewNotification);
                socket.off("notification", handleNewNotification);
            };
        }
    }, [agent?.id, isOpen, fetchUnreadCount, fetchNotifications]);

    useEffect(() => {
        fetchUnreadCount();
    }, [fetchUnreadCount]);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <NotificationBell 
                count={unreadCount} 
                onClick={() => setIsOpen(!isOpen)}
                isActive={isOpen}
                className="hover:bg-white/20 text-gray-700 bg-white/10"
            />

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Notifications</h3>
                        {notifications.length > 0 && (
                            <button 
                                onClick={clearAll}
                                className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                            >
                                <Trash2 className="w-3 h-3" />
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                        {loading ? (
                            <div className="p-8 flex flex-col items-center justify-center gap-2">
                                <Loader2 className="w-6 h-6 text-primary-hover animate-spin" />
                                <p className="text-xs text-gray-1000 font-medium">Fetching updates...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-10 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <BellOff className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-sm font-bold text-gray-900">No new notifications</p>
                                <p className="text-xs text-gray-1000 mt-1">We'll let you know when something happens.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        className={cn(
                                            "p-4 transition-colors hover:bg-gray-50 cursor-pointer relative group",
                                            !n.is_read && "bg-blue-50/30"
                                        )}
                                        onClick={() => !n.is_read && markAsRead(n.id)}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{n.title}</p>
                                                <p className="text-xs text-gray-1000 mt-1 leading-relaxed line-clamp-2">{n.message}</p>
                                                <span className="text-[10px] text-gray-1000 mt-2 block font-medium">
                                                    {new Date(n.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {!n.is_read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0 shadow-sm shadow-blue-200" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-50 bg-gray-50/50 text-center">
                        <Link 
                            href="/dashboard/notifications" 
                            className="text-xs font-bold text-primary-hover hover:underline"
                            onClick={() => setIsOpen(false)}
                        >
                            View All Notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
