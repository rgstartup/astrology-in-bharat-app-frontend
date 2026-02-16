import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiMenu } from "react-icons/fi";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { socket } from "@/lib/socket";
import { toast } from "react-toastify";

import { SearchInput } from "@repo/ui";
import { Avatar } from "@repo/ui";
import { NotificationBell } from "@repo/ui";

interface HeaderProps {
  toggleSidebar: () => void;
}

import { useAuth } from "../../context/AuthContext";

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false); // Toggle state
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.is_available !== undefined) {
      setIsOnline(user.is_available);
    }
  }, [user]);

  // WebSocket Listener for status sync (across sessions/devices) - RESTORED
  useEffect(() => {
    console.log("[Socket] Dashboard Header initialized. Socket status:", socket.connected ? "Connected" : "Disconnected");

    const handleStatusSync = (data: any) => {
      console.log("[Socket] 🔔 Dashboard received event:", data);

      const expertId = data.expert_id || data.userId || data.id;
      const isAvailable = data.is_available !== undefined
        ? data.is_available
        : (data.status === 'online');

      const currentExpertId = user?.id;
      const altId = user?.userId;

      if (String(currentExpertId) === String(expertId) || String(altId) === String(expertId)) {
        console.log(`[Socket] 🔄 Dashboard Syncing Status for ID ${expertId} to ${isAvailable}`);
        setIsOnline(isAvailable);
      }
    };

    // Global KYC Status Update Listener
    const handleKycUpdate = (data: any) => {
      console.log("[Socket] 🛡️ KYC Status Update RECEIVED:", data);

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
      const actualUserId = user?.userId || user?.id; // userId is preferred as it maps to the User table ID
      if (isAuthenticated && actualUserId) {
        console.log(`[Socket] 🌐 Registering expert ${actualUserId} as online...`);
        socket.emit("expert_online", { userId: actualUserId });
      }
    };

    // Initial registration
    registerExpertOnline();

    // Re-register on socket reconnection
    const handleReconnection = () => {
      console.log("[Socket] 🔄 Socket reconnected, re-registering expert...");
      registerExpertOnline();
    };
    socket.on("connect", handleReconnection);

    return () => {
      socket.off("expert_status_changed", handleStatusSync);
      socket.off("kyc_status_updated", handleKycUpdate);
      socket.off("connect", handleReconnection);
    };
  }, [user, isAuthenticated]);

  // Track whether mouse is on icon or on popup
  const isHoveringIcon = useRef(false);
  const isHoveringPopup = useRef(false);

  // Dynamic notifications state
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Initial notifications with a priority rejection notice
    const initial = [
      { id: 1, message: "New user registered", time: "2m ago", type: 'info' },
      { id: 2, message: "System update available", time: "10m ago", type: 'info' },
    ];

    const status = (user?.status || user?.kycStatus || user?.kyc_status || user?.kyc_details?.status || "").toLowerCase();
    if (status === 'rejected') {
      initial.unshift({
        id: Date.now(),
        message: "❌ Profile Rejected: " + (user?.rejectionReason || "Check profile for details"),
        time: "Just now",
        type: 'error'
      });
    } else if (status === 'active' || status === 'approved') {
      initial.unshift({
        id: Date.now(),
        message: "✅ Account Approved: Your profile is now live!",
        time: "Active",
        type: 'success'
      });
    }

    setNotifications(initial);
  }, [user]);

  const checkClosePopup = () => {
    // Close only if mouse on neither icon nor popup
    if (!isHoveringIcon.current && !isHoveringPopup.current) {
      setIsNotificationOpen(false);
    }
  };

  const handleToggle = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const newStatus = !isOnline;

      // DEBUG LOGS
      const token = typeof window !== "undefined" ? localStorage.getItem('accessToken') : "window_undefined";
      console.log("[AuthDebug] Attempting status update. Token length:", token?.length || 0);
      console.log("[AuthDebug] Token preview:", token ? token.substring(0, 10) + "..." : "null");
      console.log("[AuthDebug] Sending payload:", { is_available: newStatus });

      await apiClient.patch('/expert/status', { is_available: newStatus });
      setIsOnline(newStatus);

      // Sync presence with backend socket mapping
      const actualUserId = user?.userId || user?.id;
      if (actualUserId) {
        if (newStatus) {
          socket.emit("expert_online", { userId: actualUserId });
        } else {
          socket.emit("expert_offline", { userId: actualUserId });
        }
      }

      toast.success(`You are now ${newStatus ? 'Online' : 'Offline'}`);
    } catch (err: any) {
      console.error("Failed to update status:", err);

      // Extract backend error message robustly
      let errorMessage = "Failed to update status";
      if (err.response?.data?.message) {
        errorMessage = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Detailed error log for development
      if (err.response) {
        console.error("[AuthDebug] Response Data:", err.response.data);
        console.error("[AuthDebug] Response Status:", err.response.status);
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Open Sidebar"
          >
            <FiMenu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-wide">
            Dashboard
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search Bar */}
            <div className="hidden md:block w-40 sm:w-64">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search..."
                className="w-full"
              />
            </div>

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
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Notifications
                      </h3>
                      {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">No new notifications</p>
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
          <button
            className="p-0 rounded-full focus:outline-none ring-2 ring-transparent focus:ring-purple-200 transition-all duration-200"
            aria-label="User Menu"
          >
            <Link href="/dashboard/profilemanagement">
              <Avatar
                src={(user as any)?.avatar || (user as any)?.profilePic}
                alt="Profile"
                className="border-2 border-orange-500 shadow-md bg-top hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </button>
        </div>
      </div>
    </header>
  );
};


