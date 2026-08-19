import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiMenu } from "react-icons/fi";
import Link from "next/link";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { toast } from "react-toastify";
import { getNotifications, deleteAllNotifications } from "@/lib/notifications";
import { getErrorMessage } from "@repo/lib";

import { Avatar } from "@repo/ui";
import { NotificationBell, Loading } from "@repo/ui";

interface HeaderProps {
  toggleSidebar: () => void;
}

import { useAuthStore } from "@/store/useAuthStore";

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuthStore();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false); // Toggle state
  const [loading, setLoading] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false); // New state to block socket emits until session logic finishes

  useEffect(() => {
    if (user?.isAvailable !== undefined && !isSessionReady) {
      const hasInitialized = sessionStorage.getItem("expert_session_initialized");

      if (!hasInitialized) {
        
        // Even if DB says they are online, we want them offline for a fresh login.
        // We set state to false immediately and also notify backend.
        setIsOnline(false);
        
        if (user.isAvailable) {
          api.patch('/expert/status', { is_available: false }).catch(err => {
            console.error("Failed to force initial offline status:", err);
          });
          // We also emit offline just to be absolutely sure the Main App hears it
          socket.emit("expert_offline", { userId: String(user.userId || user.id) });
        }
        
        sessionStorage.setItem("expert_session_initialized", "true");
        setIsSessionReady(true);
      } else {
        setIsOnline(user.isAvailable);
        setIsSessionReady(true);
      }
    }
  }, [user, isSessionReady]);

  // WebSocket Listener for status sync (across sessions/devices) - RESTORED
  useEffect(() => {

    const handleStatusSync = (data: any) => {

      const expertId = data.expert_id || data.userId || data.id;
      const isAvailable = data.is_available !== undefined
        ? data.is_available
        : (data.status === 'online');

      const currentExpertId = user?.id;
      const altId = user?.userId;

      if (String(currentExpertId) === String(expertId) || String(altId) === String(expertId)) {
        setIsOnline(isAvailable);
      }
    };

    // Global KYC Status Update Listener
    const handleKycUpdate = (data: any) => {

      const expertId = data.expert_id || data.id || data.userId;
      const currentExpertId = user?.id || user?.profileId;

      if (String(currentExpertId) === String(expertId)) {
        toast.info(`Profile Update: Your status is now ${data.status}`, {
          position: "top-center",
          autoClose: 5 * 1000,
        });

        // Add to notifications list
        setNotifications(prev => [{
          id: Date.now(),
          message: `Profile status updated to ${data.status}`,
          time: "Just now",
          type: data.status === 'rejected' ? 'error' : 'success'
        }, ...prev]);

        // Refresh to apply new status and show rejection reason if any
        if (data.status === 'rejected' || data.status === 'active') {
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }
    };

    socket.on("expert_status_changed", handleStatusSync);
    socket.on("kyc_status_updated", handleKycUpdate);

    // Register expert in tracking map for tab-close detection
    const registerExpertOnline = () => {
      const actualUserId = user?.userId || user?.id;
      // CRITICAL: Only emit online if session logic is READY and isOnline is TRUE
      if (isAuthenticated && actualUserId && isSessionReady && isOnline) {
        if (socket.connected) {
          socket.emit("expert_online", { userId: String(actualUserId) });
        } else {
          socket.once("connect", () => {
            if (isOnline) { // Re-check if still online when connected
              socket.emit("expert_online", { userId: String(actualUserId) });
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

    // Handle tab closure / page hide
    const handleUnload = () => {
      const actualUserId = user?.userId || user?.id;
      if (isAuthenticated && actualUserId && isOnline) {
        socket.emit("expert_offline", { userId: String(actualUserId) });
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      socket.off("expert_status_changed", handleStatusSync);
      socket.off("kyc_status_updated", handleKycUpdate);
      socket.off("connect", handleReconnection);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user, isAuthenticated, isOnline, isSessionReady]);

  // Track whether mouse is on icon or on popup
  const isHoveringIcon = useRef(false);
  const isHoveringPopup = useRef(false);

  // Dynamic notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showKycNotice, setShowKycNotice] = useState(true);

  const loadNotifications = async () => {
    const [data, error] = await getNotifications();
    if (error) {
      console.error("Failed to fetch notifications in header:", error);
      return;
    }

    const mapped = (data || []).map((n: any) => ({
      id: n.id,
      message: n.message || n.title,
      time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
      type: n.type || 'info'
    }));

    // Add KYC status notices on top of fetched notifications if applicable
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
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [user, isAuthenticated]);

  const handleClearAll = async () => {
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
    // Close only if mouse on neither icon nor popup
    if (!isHoveringIcon.current && !isHoveringPopup.current) {
      setIsNotificationOpen(false);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    const newStatus = !isOnline;
    const [res, error] = await api.patch<{ is_available: boolean }>('/expert/status', { is_available: newStatus });

    if (error) {
      console.error("Failed to update status:", error);
      toast.error(getErrorMessage(error) || "Failed to update status");
      setLoading(false);
      return;
    }

    setIsOnline(newStatus);

    // Sync presence with backend socket mapping
    const actualUserId = user?.userId || user?.id;
    if (actualUserId) {
      if (newStatus) {
        socket.emit("expert_online", { userId: String(actualUserId) });
      } else {
        socket.emit("expert_offline", { userId: String(actualUserId) });
      }
    }

    setLoading(false);

  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shrink-0"
            aria-label="Open Sidebar"
          >
            <FiMenu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 tracking-wide truncate max-w-[120px] sm:max-w-none">
            Dashboard
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Search and Icons */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Toggle Button */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {isOnline ? "Online" : "Offline"}
              </span>
              <button
                onClick={handleToggle}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isOnline
                  ? "bg-green-500 focus:ring-green-500"
                  : "bg-red-500 focus:ring-red-500"
                  }`}
                aria-label={isOnline ? "Go Offline" : "Go Online"}
              >
                <span
                  className={`inline-block w-4 h-4 transform transition-transform duration-300 bg-white rounded-full shadow-md ${isOnline ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            {/* Notifications & User Profile */}
            <div className="flex items-center space-x-2">
              {/* Notifications Button */}
              <div
                className="relative"
                onMouseEnter={() => {
                  isHoveringIcon.current = true;
                  setIsNotificationOpen(true);
                }}
                onMouseLeave={() => {
                  isHoveringIcon.current = false;
                  // Delay slightly to allow move to popup
                  setTimeout(checkClosePopup, 100);
                }}
              >
                <NotificationBell
                  count={notifications.length}
                  className="bg-transparent hover:bg-gray-100"
                />

                {/* Notification Popup */}
                {isNotificationOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    onMouseEnter={() => {
                      isHoveringPopup.current = true;
                      setIsNotificationOpen(true);
                    }}
                    onMouseLeave={() => {
                      isHoveringPopup.current = false;
                      // Delay slightly to allow move back to icon
                      setTimeout(checkClosePopup, 100);
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Notifications
                        </h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={handleClearAll}
                            className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-tight"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4 text-center">No new notifications</p>
                      ) : (
                        <ul className="space-y-2">
                          {notifications.map((notification) => (
                            <li
                              key={notification.id}
                              className="text-sm text-gray-700 border-b border-gray-100 pb-2"
                            >
                              <p>{notification.message}</p>
                              <span className="text-xs text-gray-400">
                                {notification.time}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-3">
                        <Link
                          href="/dashboard/notifications"
                          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                          onClick={() => setIsNotificationOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile */}
          {/* Profile */}
          <button
            className="p-0 rounded-full focus:outline-none ring-2 ring-transparent focus:ring-purple-200 transition-all duration-200"
            aria-label="User Menu"
          >
            <Link href="/dashboard/profilemanagement">
              <Avatar
                src={user?.profilePic}
                alt="Profile"
                className="border-2 border-orange-500 shadow-md bg-top hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </button>
        </div>
      </div>
      {loading && <Loading fullScreen />}
    </header>
  );
};
