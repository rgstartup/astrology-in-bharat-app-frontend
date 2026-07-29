"use client";

import React, { useState, useEffect } from "react";
import { Bell, BellOff, Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { NotificationSkeleton } from "@/components/dashboard/DashboardSkeletons";

const NotificationPage = () => {
    const { 
        groupedNotifications, 
        isLoading, 
        handleMarkRead, 
        handleDelete, 
        handleClearAll,
        notifications 
    } = useNotifications();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onClearAll = () => {
        if (notifications.length === 0) return;
        if (!confirm("Clear all notifications?")) return;
        handleClearAll();
    };

    const onDeleteItem = (id: string) => {
        if (!confirm("Delete this notification?")) return;
        handleDelete(id);
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-white sm:bg-[#FFF9F4] pb-12 font-sans">
            <div className="container mx-auto p-0 sm:px-4 sm:py-8 max-w-5xl">
                <div className="bg-white border-0 shadow-none sm:shadow-premium rounded-none sm:rounded-[32px] overflow-hidden mb-6">
                    <div className="px-4 sm:px-8 py-5 sm:py-7 bg-white border-b border-gray-100 flex flex-row justify-between items-center gap-4 sticky top-0 z-10 sm:shadow-sm">
                        <h5 className="text-lg sm:text-xl font-bold text-gray-900 mb-0 flex items-center">
                            <span className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mr-2 sm:mr-4 flex-shrink-0 shadow-inner">
                                <Bell className="w-4 h-4 sm:w-6 sm:h-6" />
                            </span>
                            Notifications
                        </h5>
                        {notifications.length > 0 && (
                            <button
                                onClick={onClearAll}
                                className="px-3 py-2 sm:px-5 sm:py-2.5 text-red-500 hover:text-red-600 font-bold text-xs sm:text-sm bg-red-50 hover:bg-red-100 rounded-xl sm:rounded-2xl transition-all flex items-center gap-1.5 sm:gap-2 border-0 shadow-sm cursor-pointer hover:cursor-pointer"
                            >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="px-4 sm:px-8 py-4 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar-orange">
                        {isLoading ? (
                            <NotificationSkeleton />
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8 border border-gray-100 shadow-inner rotate-12">
                                    <BellOff className="w-12 h-12 text-gray-300" />
                                </div>
                                <h6 className="font-bold text-gray-900 text-2xl mb-3 tracking-tight">
                                    Inbox Zero!
                                </h6>
                                <p className="text-gray-500 text-sm max-w-[240px] m-0 leading-relaxed font-medium">
                                    We'll notify you when something important happens.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {groupedNotifications.today.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Today</span>
                                            <div className="h-px flex-1 bg-gray-100/50"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <AnimatePresence mode='popLayout'>
                                                {groupedNotifications.today.map((n) => (
                                                    <NotificationItem
                                                        key={n.id}
                                                        notification={n}
                                                        onMarkRead={handleMarkRead}
                                                        onDelete={onDeleteItem}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </section>
                                )}

                                {groupedNotifications.earlier.length > 0 && (
                                    <section>

                                        <div className="space-y-4">
                                            <AnimatePresence mode='popLayout'>
                                                {groupedNotifications.earlier.map((n) => (
                                                    <NotificationItem
                                                        key={n.id}
                                                        notification={n}
                                                        onMarkRead={handleMarkRead}
                                                        onDelete={onDeleteItem}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;


