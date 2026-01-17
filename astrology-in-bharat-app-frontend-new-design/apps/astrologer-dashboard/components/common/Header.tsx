import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiMenu } from "react-icons/fi";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

import { SearchInput } from "../../../shared/components/SearchInput";

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

  // Track whether mouse is on icon or on popup
  const isHoveringIcon = useRef(false);
  const isHoveringPopup = useRef(false);

  // Sample notifications data
  const notifications = [
    { id: 1, message: "New user registered", time: "2m ago" },
    { id: 2, message: "System update available", time: "10m ago" },
    { id: 3, message: "Task assigned to you", time: "1h ago" },
  ];

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
      await apiClient.patch('/expert/status', { is_available: newStatus });
      setIsOnline(newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update online status");
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
                <button
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="Notifications"
                >
                  <FiBell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                    {notifications.length}
                  </span>
                </button>

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
                          className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
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
            className="p-0 hover:bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
            aria-label="User Menu"
          >
            <Link href="/dashboard/profilemanagement">
              <img
                src={(user as any)?.avatar || (user as any)?.profilePic || "/images/profile.jpg"}
                alt="Profile"
                className="w-10 h-10 text-gray-600 object-cover rounded-full border-2 border-yellow-500 shadow-md bg-top"
              />
            </Link>
          </button>
        </div>
      </div>
    </header>
  );
};
