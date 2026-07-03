import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { getNotifications, deleteAllNotifications } from "@/lib/notifications";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@repo/lib";

export const useHeaderState = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showKycNotice, setShowKycNotice] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false); // New state to block socket emits until session logic finishes

  const isHoveringIcon = useRef(false);
  const isHoveringPopup = useRef(false);

  // Sync online status with user data (Session-Aware)
  useEffect(() => {
    if (user?.isAvailable !== undefined && !isSessionReady) {
      const hasInitialized = sessionStorage.getItem("expert_session_initialized");

      // Check if we're on the chat page — if so, don't force offline mid-session
      const isOnChatPage = typeof window !== 'undefined' && window.location.pathname.includes('/chat/');

      if (!hasInitialized && !isOnChatPage) {
        
        // Force offline in state immediately
        setIsOnline(false);
        
        if (user.isAvailable) {
          api.patch('/expert/status', { is_available: false }).catch(err => {
            console.error("Failed to force initial offline status:", err);
          });
          // Also emit offline immediately as a best-effort
          socket.emit("expert_offline", { userId: String(user.userId || user.id) });
        }
        
        sessionStorage.setItem("expert_session_initialized", "true");
        setIsSessionReady(true);
      } else {
        // Either already initialized or on chat page — just use current availability
        setIsOnline(user.isAvailable ?? false);
        if (!hasInitialized) {
          sessionStorage.setItem("expert_session_initialized", "true");
        }
        setIsSessionReady(true);
      }
    }
  }, [user, isSessionReady]);

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
        ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "Just now",
      type: n.type || 'info'
    }));

    const dismissedStatus = typeof window !== 'undefined' ? localStorage.getItem('dismissed-kyc-status') : null;
    const currentStatus = (user?.kycStatus || "").toLowerCase();

    if (showKycNotice && dismissedStatus !== currentStatus) {
      if (currentStatus === 'rejected') {
        mapped.unshift({
          id: 'kyc-rejected',
          message: "❌ Profile Rejected: " + (user?.rejectionReason || "Check profile"),
          time: "Status",
          type: 'error'
        });
      } else if (currentStatus === 'active' || currentStatus === 'approved') {
        mapped.unshift({
          id: 'kyc-active',
          message: "✅ Account Approved!",
          time: "Status",
          type: 'success'
        });
      }
    }

    setNotifications(mapped);
  }, [isAuthenticated, showKycNotice, user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Socket Listeners
  useEffect(() => {
    const handleStatusSync = (data: any) => {
      console.log("[Frontend] Socket received expert_status_changed event:", data);
      const expertId = data.expert_id || data.userId || data.id;
      const isAvailable = data.is_available !== undefined
        ? data.is_available
        : (data.status === 'online');

      const currentExpertId = user?.id || user?.userId;
      if (String(currentExpertId) === String(expertId)) {
        setIsOnline(isAvailable);
      }
    };

    const handleKycUpdate = (data: any) => {
      const expertId = data.expert_id || data.id || data.userId;
      const currentExpertId = user?.id || user?.profileId;

      if (String(currentExpertId) === String(expertId)) {
        toast.info(`Profile Update: Your status is now ${data.status}`);
        loadNotifications();
        if (data.status === 'rejected' || data.status === 'active') {
          setTimeout(() => window.location.reload(), 3000);
        }
      }
    };

    socket.on("expert_status_changed", handleStatusSync);
    socket.on("kyc_status_updated", handleKycUpdate);

    // Presence registration
    const actualUserId = user?.userId || user?.id;
    const registerExpertOnline = () => {
      // CRITICAL: Only emit online if session logic is READY and isOnline state is TRUE
      if (isAuthenticated && actualUserId && isSessionReady && isOnline) {
        const handleResponse = (res: any) => {
          if (res?.status === 'error') {
            setIsOnline(false);
            toast.error(res.message || "Failed to go online");
          }
        };
        
        if (socket.connected) {
          socket.emit("expert_online", { userId: String(actualUserId) }, handleResponse);
        } else {
          socket.once("connect", () => {
            if (isOnline) {
              socket.emit("expert_online", { userId: String(actualUserId) }, handleResponse);
            }
          });
          socket.connect();
        }
      }
    };

    if (isSessionReady) {
      registerExpertOnline();
    }

    const handleReconnection = () => {
      if (isSessionReady) registerExpertOnline();
    };
    socket.on("connect", handleReconnection);

    return () => {
      socket.off("expert_status_changed", handleStatusSync);
      socket.off("kyc_status_updated", handleKycUpdate);
      socket.off("connect", handleReconnection);
    };
  }, [user, isAuthenticated, loadNotifications]);

  // Actions
  const handleToggleAvailability = async () => {
    setLoading(true);
    const newStatus = !isOnline;
    console.log(`[Frontend] User clicked toggle to set status to: ${newStatus}`);

    const [_, error] = await api.patch<{ is_available: boolean }>('/expert/status', { is_available: newStatus });

    if (error) {
      toast.error(getErrorMessage(error) || "Failed to update status");
      setLoading(false);
      return;
    }

    setIsOnline(newStatus);
    const actualUserId = user?.userId || user?.id;
    if (actualUserId) {
      socket.emit(newStatus ? "expert_online" : "expert_offline", { userId: actualUserId });
    }

    // Force end any active chats if toggling offline
    if (!newStatus) {
      const { chatSocket } = require("@/lib/socket");
      if (chatSocket && user?.profileId) {
        chatSocket.emit("force_end_active_chats", { expert_id: String(user.profileId) });
      }
    }

    setLoading(false);
  };

  const handleClearNotifications = async () => {
    const [_, error] = await deleteAllNotifications();
    if (error) {
      toast.error(getErrorMessage(error) || "Failed to clear notifications");
      return;
    }

    // Persist that we've cleared/dismissed the current status notice
    if (user?.kycStatus) {
      localStorage.setItem('dismissed-kyc-status', user.kycStatus.toLowerCase());
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
    handleToggleAvailability,
    handleClearNotifications,
    checkClosePopup,
    user,
  };
};
