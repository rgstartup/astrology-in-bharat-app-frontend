"use client";

import React from "react";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";
import { SearchInput, Avatar, NotificationBell } from "@repo/ui";
import { useHeaderState } from "@/hooks/useHeaderState";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const {
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
  } = useHeaderState();

  // Handle tab closure / page hide
  React.useEffect(() => {
    const handleUnload = () => {
      const actualUserId = user?.userId || user?.id;
      if (user && actualUserId && isOnline) {
        const { socket } = require("@/lib/socket");
        socket.emit("expert_offline", { userId: String(actualUserId) });
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user, isOnline]);

  return (
    <header className="bg-transparent px-4 sm:px-6 py-3 sm:py-4 z-40">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shrink-0"
            aria-label="Open Sidebar"
          >
            <FiMenu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 tracking-wide truncate">
            Dashboard
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          {/* Search and Icons */}
          <div className="flex items-center gap-2 sm:gap-6">
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
                onClick={handleToggleAvailability}
                disabled={loading}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer hover:cursor-pointer ${
                  isOnline ? "bg-green-500 focus:ring-green-500" : "bg-red-500 focus:ring-red-500"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                aria-label={isOnline ? "Go Offline" : "Go Online"}
              >
                <span
                  className={`inline-block w-4 h-4 transform transition-transform duration-300 bg-white rounded-full shadow-md ${
                    isOnline ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Notifications & User Profile */}
            <div className="flex items-center space-x-2">
              <div
                className="relative"
                onMouseEnter={() => {
                  isHoveringIcon.current = true;
                  setIsNotificationOpen(true);
                }}
                onMouseLeave={() => {
                  isHoveringIcon.current = false;
                  setTimeout(checkClosePopup, 100);
                }}
              >
                <NotificationBell
                  count={notifications.length}
                  className="bg-transparent hover:bg-gray-100 cursor-pointer hover:cursor-pointer"
                />

                {isNotificationOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    onMouseEnter={() => {
                      isHoveringPopup.current = true;
                      setIsNotificationOpen(true);
                    }}
                    onMouseLeave={() => {
                      isHoveringPopup.current = false;
                      setTimeout(checkClosePopup, 100);
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={handleClearNotifications}
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
                              <span className="text-xs text-gray-400">{notification.time}</span>
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

          <button
            className="p-0 rounded-full focus:outline-none ring-2 ring-transparent focus:ring-purple-200 transition-all duration-200 cursor-pointer hover:cursor-pointer"
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
    </header>
  );
};
