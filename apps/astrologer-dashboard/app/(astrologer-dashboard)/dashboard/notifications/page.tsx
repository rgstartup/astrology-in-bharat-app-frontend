"use client";

import React, { useState, useEffect } from "react";
import { Bell, XCircle, CheckCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import type { FC } from "react";

interface Notification {
    id: string;
    title: string;
    description: string;
    createdAt: string; // ISO date string
    read: boolean;
    type: "info" | "success" | "error";
}

interface NotificationPageProps {
    initialNotifications?: Notification[];
}

const dummyNotifications: Notification[] = [
    {
        id: "1",
        title: "Welcome to the dashboard",
        description: "Thank you for joining us! Explore the features we offer.",
        createdAt: new Date().toISOString(),
        read: false,
        type: "info",
    },
    {
        id: "2",
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
        read: true,
        type: "success",
    },
    {
        id: "3",
        title: "Error processing your payment",
        description:
            "There was an issue processing your last payment. Please check your billing info.",
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
        read: false,
        type: "error",
    },
];

const NotificationItem: FC<{
    notification: Notification;
    onMarkRead: (id: string) => void;
}> = ({ notification, onMarkRead }) => {
    // Map notification type to icon and colors
    const iconMap = {
        info: <Bell className="w-5 h-5 text-blue-500" aria-hidden="true" />,
        success: (
            <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
        ),
        error: <XCircle className="w-5 h-5 text-red-500" aria-hidden="true" />,
    };

    const bgColorMap = {
        info: notification.read
            ? "bg-white border-gray-200"
            : "bg-blue-50 border-blue-300",
        success: notification.read
            ? "bg-white border-gray-200"
            : "bg-green-50 border-green-300",
        error: notification.read
            ? "bg-white border-gray-200"
            : "bg-red-50 border-red-300",
    };

    const titleColorMap = {
        info: notification.read ? "text-gray-900" : "text-blue-800",
        success: notification.read ? "text-gray-900" : "text-green-800",
        error: notification.read ? "text-gray-900" : "text-red-800",
    };

    const buttonColorMap = {
        info: "text-blue-700 hover:text-blue-900 focus:ring-blue-400",
        success: "text-green-700 hover:text-green-900 focus:ring-green-400",
        error: "text-red-700 hover:text-red-900 focus:ring-red-400",
    };

    return (
        <li
            key={notification.id}
            className={cn(
                "flex items-start space-x-4 p-4 rounded-lg border transition-colors",
                bgColorMap[notification.type]
            )}
            aria-live="polite"
            role="listitem"
            tabIndex={0}
        >
            <div className="shrink-0">{iconMap[notification.type]}</div>
            <div className="flex-1">
                <h3
                    className={cn(
                        "text-sm font-semibold tracking-wide",
                        titleColorMap[notification.type]
                    )}
                >
                    {notification.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{notification.description}</p>
                <time
                    dateTime={notification.createdAt}
                    className="mt-1 inline-block text-xs text-gray-400"
                >
                    {new Date(notification.createdAt).toLocaleString()}
                </time>
            </div>
            {!notification.read && (
                <button
                    onClick={() => onMarkRead(notification.id)}
                    className={cn(
                        "ml-4 focus:outline-none focus:ring-2 rounded",
                        buttonColorMap[notification.type]
                    )}
                    aria-label={`Mark notification '${notification.title}' as read`}
                >
                    Mark Read
                </button>
            )}
        </li>
    );
};

const NotificationPage: FC<NotificationPageProps> = ({
    initialNotifications = dummyNotifications,
}) => {
    const [notifications, setNotifications] =
        useState<Notification[]>(initialNotifications);
    const [isMounted, setIsMounted] = useState(false);

    // Fix hydration error by rendering after mount
    useEffect(() => {
        setIsMounted(true);

        const container = document.getElementById("notifications-list");
        container?.focus();
    }, []);

    const handleMarkRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
        );
    };

    if (!isMounted) {
        return null; // Or a skeleton/loading placeholder for SEO-friendly SSR
    }

    return (
        <main
            className="mx-auto space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen"
            aria-label="Notifications"
        >
            <h1 className="text-3xl font-bold text-gray-900 sm:mb-0">
                Notifications
            </h1>
            {notifications.length === 0 ? (
                <p className="text-center text-gray-500">You have no notifications.</p>
            ) : (
                <ul
                    id="notifications-list"
                    className="space-y-4 outline-none mt-4"
                    tabIndex={-1}
                    role="list"
                    aria-live="polite"
                >
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkRead={handleMarkRead}
                        />
                    ))}
                </ul>
            )}
        </main>
    );
};

export default NotificationPage;
