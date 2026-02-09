"use client";

import React, { useState, useEffect } from "react";
import { Bell, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import type { FC } from "react";
import { getNotifications, markAsRead, deleteNotification, Notification as ApiNotification } from "@/lib/notifications";
import { toast } from "react-toastify";

interface Notification {
    id: string;
    title: string;
    description: string;
    createdAt: string; // ISO date string
    read: boolean;
    type: "info" | "success" | "error" | "warning";
}

const NotificationItem: FC<{
    notification: Notification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}> = ({ notification, onMarkRead, onDelete }) => {
    // Map notification type to icon and colors
    const isWarning = notification.type === "warning" || notification.description.toLowerCase().includes("intervention") || notification.title.toLowerCase().includes("intervention");

    const iconMap = {
        info: <Bell className="w-5 h-5 text-blue-500" aria-hidden="true" /> as any,
        success: (
            <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
        ) as any,
        error: <XCircle className="w-5 h-5 text-red-500" aria-hidden="true" /> as any,
        warning: <AlertCircle className="w-5 h-5 text-orange-500" aria-hidden="true" /> as any,
    };

    const typeKey = (isWarning ? "warning" : notification.type) as keyof typeof iconMap;

    const bgColorMap = {
        info: notification.read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-300",
        success: notification.read ? "bg-white border-gray-200" : "bg-green-50 border-green-300",
        error: notification.read ? "bg-white border-gray-200" : "bg-red-50 border-red-300",
        warning: notification.read ? "bg-white border-gray-200" : "bg-orange-50 border-orange-300",
    };

    const titleColorMap = {
        info: notification.read ? "text-gray-900" : "text-blue-800",
        success: notification.read ? "text-gray-900" : "text-green-800",
        error: notification.read ? "text-gray-900" : "text-red-800",
        warning: notification.read ? "text-gray-900" : "text-orange-800",
    };

    const buttonColorMap = {
        info: "text-blue-700 hover:text-blue-900 focus:ring-blue-400",
        success: "text-green-700 hover:text-green-900 focus:ring-green-400",
        error: "text-red-700 hover:text-red-900 focus:ring-red-400",
        warning: "text-orange-700 hover:text-orange-900 focus:ring-orange-400",
    };

    return (
        <li
            key={notification.id}
            className={cn(
                "flex items-start space-x-4 p-4 rounded-lg border transition-colors",
                bgColorMap[typeKey],
                isWarning && !notification.read && "border-2 border-orange-400 shadow-md"
            )}
            aria-live="polite"
            role="listitem"
            tabIndex={0}
        >
            <div className="shrink-0">{iconMap[typeKey]}</div>
            <div className="flex-1">
                <h3
                    className={cn(
                        "text-sm font-semibold tracking-wide",
                        titleColorMap[typeKey],
                        isWarning && "font-black"
                    )}
                >
                    {notification.title}
                </h3>
                <p className={cn("mt-1 text-sm text-gray-600", isWarning && "text-gray-800 font-bold")}>{notification.description}</p>
                <time
                    dateTime={notification.createdAt}
                    className="mt-1 inline-block text-xs text-gray-400"
                >
                    {new Date(notification.createdAt).toLocaleString()}
                </time>
            </div>
            <div className="flex flex-col gap-2">
                {!notification.read && (
                    <button
                        onClick={() => onMarkRead(notification.id)}
                        className={cn(
                            "focus:outline-none focus:ring-2 rounded text-xs py-1",
                            buttonColorMap[typeKey]
                        )}
                        aria-label={`Mark notification '${notification.title}' as read`}
                    >
                        Mark Read
                    </button>
                )}
                <button
                    onClick={() => onDelete(notification.id)}
                    className="text-gray-400 hover:text-red-500 text-xs py-1 transition-colors"
                >
                    Delete
                </button>
            </div>
        </li>
    );
};

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const data = await getNotifications();
            const mapped: Notification[] = data.map((n: ApiNotification) => ({
                id: n.id,
                title: n.title,
                description: n.message,
                createdAt: n.createdAt,
                read: n.isRead,
                type: n.type === 'error' ? 'error' : n.type === 'success' ? 'success' : 'info'
            }));
            setNotifications(mapped);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        fetchNotifications();
    }, []);

    const handleMarkRead = async (id: string) => {
        try {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
            );
        } catch (error) {
            toast.error("Failed to mark as read");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notification?")) return;
        try {
            await deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            toast.success("Notification deleted");
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
                    <p className="mt-2 text-gray-500">
                        Stay updated with your profile and activity alerts.
                    </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl">
                    <Bell className="w-8 h-8 text-orange-500" />
                </div>
            </header>

            <main>
                <div
                    id="notifications-list"
                    className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
                    tabIndex={-1}
                >
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <p className="font-medium">Loading notifications...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        <ul className="divide-y divide-gray-100" role="list">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkRead={handleMarkRead}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </ul>
                    ) : (
                        <div className="p-16 text-center text-gray-400">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Bell className="w-10 h-10 text-gray-300" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-600 mb-2">No notifications found</h2>
                            <p className="max-w-xs mx-auto">We'll let you know when something important happens.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NotificationPage;
