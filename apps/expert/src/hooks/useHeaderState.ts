"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useUnreadCount, useNotifications, useNotificationActions } from "@/features/notifications";
import { useAuthStore } from "@/store/auth.store";
import { useExpertAvailability } from "./useExpertAvailability";
import { getErrorMessage } from "@repo/lib";

export const useHeaderState = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { isOnline, loading, toggleAvailability } = useExpertAvailability();
  const notifications = useNotifications();
  const unreadCount = useUnreadCount();
  const { deleteAllNotifications } = useNotificationActions();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showKycNotice, setShowKycNotice] = useState(true);

  const isHoveringIcon = useRef(false);
  const isHoveringPopup = useRef(false);

  const loadNotifications = useCallback(async () => {
    // Data is hydrated by NotificationProvider on auth change; nothing to fetch here.
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleClearNotifications = async () => {
    const dismissedStatus = typeof window !== "undefined" ? localStorage.getItem("dismissed-kyc-status") : null;
    const currentStatus = (user?.kycStatus || "").toLowerCase();

    await deleteAllNotifications();

    if (user?.kycStatus) {
      localStorage.setItem("dismissed-kyc-status", user.kycStatus.toLowerCase());
    }

    setShowKycNotice(false);
    setIsNotificationOpen(false);
    toast.success("Notifications cleared");
  };

  const checkClosePopup = () => {
    if (!isHoveringIcon.current && !isHoveringPopup.current) {
      setIsNotificationOpen(false);
    }
  };

  return {
    isOnline,
    loading,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadCount,
    isNotificationOpen,
    setIsNotificationOpen,
    isHoveringIcon,
    isHoveringPopup,
    handleToggleAvailability: toggleAvailability,
    handleClearNotifications,
    checkClosePopup,
    user,
  };
};

export default useHeaderState;
