"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
    getNotifications,
    markNotificationAsRead,
    clearAllNotifications,
    getMyRewards,
    getSupportSettings,
    SupportSettings,
} from "@/libs/api-profile";
import {
    getNotificationSocket,
    connectNotificationSocket,
} from "@packages/ui/src/utils/socket";

export const useProfileOtherLogic = (
    isAuthenticated: boolean,
    user: any,
    activeTab: string,
    setOrders: React.Dispatch<React.SetStateAction<any[]>>,
) => {
    // Notifications
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [notificationsPage, setNotificationsPage] = useState(1);
    const [notificationsHasMore, setNotificationsHasMore] = useState(true);
    const [loadingMoreNotifications, setLoadingMoreNotifications] = useState(false);

    // Rewards
    const [rewards, setRewards] = useState<any[]>([]);
    const [loadingRewards, setLoadingRewards] = useState(false);

    // Support
    const [supportSettings, setSupportSettings] = useState<SupportSettings>({
        email: "support@astrologyinbharat.com",
        phone: "+919876543210",
        whatsapp: "+919876543210",
    });
    const [loadingSupportSettings, setLoadingSupportSettings] = useState(false);

    // Load Notifications
    const loadNotifications = useCallback(async (pageNumber = 1) => {
        if (activeTab === "notifications" && isAuthenticated) {
            if (pageNumber === 1) setLoadingNotifications(true);
            else setLoadingMoreNotifications(true);

            try {
                const limit = 10;
                const offset = (pageNumber - 1) * limit;
                const [result, error] = await getNotifications({ limit, offset }) as any;
                
                if (!error && result) {
                    const myNotifs = result.data || [];
                    const totalCount = result.meta?.totalCount || 0;

                    if (pageNumber === 1) {
                        setNotifications(myNotifs);
                        setNotificationsHasMore(myNotifs.length < totalCount);
                    } else {
                        setNotifications(prev => {
                            const existingIds = new Set(prev.map(n => n.id));
                            const newNotifs = myNotifs.filter((n: any) => !existingIds.has(n.id));
                            const updatedList = [...prev, ...newNotifs];
                            setNotificationsHasMore(updatedList.length < totalCount);
                            return updatedList;
                        });
                    }
                    setNotificationsPage(pageNumber);
                }
            } catch (error) {
                console.error("Failed to load notifications:", error);
            } finally {
                setLoadingNotifications(false);
                setLoadingMoreNotifications(false);
            }
        }
    }, [activeTab, isAuthenticated]);

    const loadMoreNotifications = () => {
        if (!loadingMoreNotifications && notificationsHasMore) {
            loadNotifications(notificationsPage + 1);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const handleMarkAsRead = async (id: string) => {
        try {
            const [, error] = await markNotificationAsRead(id) as any;
            if (error) {
                console.error("Failed to mark as read:", error);
                return;
            }
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
            );
        } catch (error) {
            console.error("Unexpected error marking as read:", error);
        }
    };

    const handleClearAllNotifs = async () => {
        if (!window.confirm("Are you sure you want to clear all notifications?"))
            return;
        try {
            const [, error] = await clearAllNotifications() as any;
            if (error) {
                console.error("Failed to clear notifications:", error);
                toast.error("Failed to clear notifications");
                return;
            }
            setNotifications([]);
            toast.success("All notifications cleared");
        } catch (error) {
            console.error("Unexpected error clearing notifications:", error);
        }
    };

    // Load Rewards
    const loadRewards = useCallback(async () => {
        if (activeTab === "rewards" && isAuthenticated) {
            setLoadingRewards(true);
            try {
                const [data, error] = await getMyRewards() as any;
                if (!error && data) {
                    setRewards(Array.isArray(data) ? data : data.data || []);
                }
            } catch (error) {
                console.error("Failed to load rewards:", error);
            } finally {
                setLoadingRewards(false);
            }
        }
    }, [activeTab, isAuthenticated]);

    useEffect(() => {
        loadRewards();
    }, [loadRewards]);

    // Load Support
    useEffect(() => {
        const loadSupport = async () => {
            if (activeTab === "support") {
                setLoadingSupportSettings(true);
                try {
                    const [data, error] = await getSupportSettings() as any;
                    if (!error && data) {
                        setSupportSettings(data);
                    }
                } catch (error) {
                    console.error("Failed to load support:", error);
                } finally {
                    setLoadingSupportSettings(false);
                }
            }
        };
        loadSupport();
    }, [activeTab]);

    // Socket Integration
    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        connectNotificationSocket(user.profile || user.id);
        const socket = getNotificationSocket();

        const handleOrderUpdate = (data: any) => {
            toast.success(data.message || "Order status updated");
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === data.orderId
                        ? {
                            ...order,
                            status: data.status,
                            cancellationReason: data.cancellationReason,
                        }
                        : order,
                ),
            );
        };

        socket.on("order_status_updated", handleOrderUpdate);
        socket.on("notification", (data) => {
            if (activeTab === "notifications") {
                loadNotifications();
            }
        });

        return () => {
            socket.off("order_status_updated", handleOrderUpdate);
            socket.off("notification");
        };
    }, [
        isAuthenticated,
        user?.id,
        activeTab,
        loadNotifications,
        setOrders,
    ]);

    return {
        notifications,
        loadingNotifications,
        notificationsHasMore,
        loadingMoreNotifications,
        loadMoreNotifications,
        handleMarkAsRead,
        handleClearAllNotifs,
        rewards,
        loadingRewards,
        supportSettings,
        loadingSupportSettings,
        loadNotifications,
    };
};
