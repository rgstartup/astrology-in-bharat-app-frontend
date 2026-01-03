"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiBell, FiMenu } from "react-icons/fi";
import Link from "next/link";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const isHoveringIcon = useRef(false);
  const isHoveringPopup = useRef(false);

  const notifications = [
    { id: 1, message: "New user registered", time: "2m ago" },
    { id: 2, message: "System update available", time: "10m ago" },
    { id: 3, message: "Task assigned to you", time: "1h ago" },
  ];

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);

      // Fetch current status
      axios.get("http://localhost:4000/api/v1/expert/profile", { withCredentials: true })
        .then(res => {
          if (res.data) {
            setIsOnline(res.data.is_available);
          }
        })
        .catch(err => console.error("Error fetching profile status:", err));

      // Initialize socket
      const socket = io("http://localhost:4000");
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Connected to status socket");
        // Notify server this expert is online if they were already online in DB
        if (isOnline) {
          socket.emit("expert_online", { userId: user.id });
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  // Effect to sync socket when isOnline changes
  useEffect(() => {
    if (socketRef.current && userId) {
      if (isOnline) {
        socketRef.current.emit("expert_online", { userId });
      } else {
        socketRef.current.emit("expert_offline", { userId });
      }
    }
  }, [isOnline, userId]);

  const checkClosePopup = () => {
    if (!isHoveringIcon.current && !isHoveringPopup.current) {
      setIsNotificationOpen(false);
    }
  };

  const handleToggle = async () => {
    const newStatus = !isOnline;
    try {
      // Update DB
      await axios.patch("http://localhost:4000/api/v1/expert/profile/status",
        { is_available: newStatus },
        { withCredentials: true }
      );

      setIsOnline(newStatus);
    } catch (err: any) {
      console.error("Failed to toggle status:", err);
      const errorMsg = err.response?.data?.message || "Failed to update status. Please try again.";
      alert(errorMsg);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
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

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-40 sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200"
                aria-label="Search dashboard"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-sm font-bold hidden sm:inline ${isOnline ? "text-green-600" : "text-red-600"}`}>
                {isOnline ? "ONLINE" : "OFFLINE"}
              </span>
              <button
                onClick={handleToggle}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-inner ${isOnline
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
                <button
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="Notifications"
                >
                  <FiBell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                    {notifications.length}
                  </span>
                </button>

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
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Notifications
                      </h3>
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

          <button
            className="p-0 hover:bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
            aria-label="User Menu"
          >
            <Link href="/dashboard/profilemanagement">
              <img
                src="/images/profile.jpg"
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
