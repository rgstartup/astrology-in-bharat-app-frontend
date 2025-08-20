import React, { useState } from "react";
import { FiSearch, FiBell, FiMenu, FiUser } from "react-icons/fi";
import Link from "next/link";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Sample notifications data
  const notifications = [
    { id: 1, message: "New user registered", time: "2m ago" },
    { id: 2, message: "System update available", time: "10m ago" },
    { id: 3, message: "Task assigned to you", time: "1h ago" },
  ];

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
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
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-40 sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200"
                aria-label="Search dashboard"
              />
            </div>

            {/* Notifications & User Profile */}
            <div className="flex items-center space-x-2">
              {/* Notifications Button */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
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
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
                          href="/notifications"
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
            {/* <FiUser className="w-5 h-5 text-gray-600" /> */}
            <Link href="/dashboard/profilemanagement">  <img
              src="/images/profile.jpg"
              alt="Profile"
              className="w-10 h-10 text-gray-600 object-cover rounded-full border-2 border-yellow-500 shadow-md bg-top
                "
            /></Link>
          </button>
        </div>
      </div>
    </header>
  );
};