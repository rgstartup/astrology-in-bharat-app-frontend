"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { getNotifications, deleteAllNotifications } from "@/lib/notifications";
import { useAuthStore } from "@/store/auth.store";
import { useExpertAvailability } from "./useExpertAvailability";
import { getErrorMessage } from "@repo/lib";

export const useHeaderState = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { isOnline, loading, toggleAvailability } = useExpertAvailability();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showKycNotice, setShowKycNotice] = useState(true);

  const isHoveringIcon = useRef(false);
  const isHoveringPopup = useRef(false);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    const [data, error] = await getNotifications();
    if (error) {
      console.error("Failed to fetch notifications:", error);
      return;
    }

    const mapped = (data || []).map((n: any) => ({
      id: n.id,
      message: n.message || n.title,
      time: n.created_at
        ? new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Just now",
      type: n.type || "info",
    }));

    const dismissedStatus = typeof window !== "undefined" ? localStorage.getItem("dismissed-kyc-status") : null;
    const currentStatus = (user?.kycStatus || "").toLowerCase();

    if (showKycNotice && dismissedStatus !== currentStatus) {
      if (currentStatus === "rejected") {
        mapped.unshift({
          id: "kyc-rejected",
          message: "❌ Profile Rejected: " + (user?.rejectionReason || "Check profile"),
          time: "Status",
          type: "error",
        });
      } else if (currentStatus === "active" || currentStatus === "approved") {
        mapped.unshift({
          id: "kyc-active",
          message: "✅ Account Approved!",
          time: "Status",
          type: "success",
        });
      }
    }

    setNotifications(mapped);
  }, [isAuthenticated, showKycNotice, user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleClearNotifications = async () => {
    const [_, error] = await deleteAllNotifications();
    if (error) {
      toast.error(getErrorMessage(error) || "Failed to clear notifications");
      return;
    }

    if (user?.kycStatus) {
      localStorage.setItem("dismissed-kyc-status", user.kycStatus.toLowerCase());
    }

    setNotifications([]);
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
