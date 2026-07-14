"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiMenu, FiMoreVertical, FiUser, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, NotificationBell } from "@repo/ui";
import { useHeaderState } from "@/hooks/useHeaderState";
import { useAuthStore } from "@/store/useAuthStore";

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

  const router = useRouter();
  const { logout } = useAuthStore();
  const [showImageModal, setShowImageModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    if (user && isOnline) {
      const actualUserId = user?.userId || user?.id;
      const { socket } = require("@/lib/socket");
      socket.emit("expert_offline", { userId: String(actualUserId) });
    }
    await logout();
    router.push("/");
  };

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

          <div className="relative flex items-center gap-2">
            <button
              className="p-0 rounded-full focus:outline-none ring-2 ring-transparent focus:ring-orange-300 transition-all duration-200 cursor-pointer hover:cursor-pointer hover:scale-110"
              aria-label="View Profile Picture"
              onClick={() => setShowImageModal(true)}
              title="Click to view profile picture"
            >
              <Avatar
                src={user?.profilePic}
                alt="Profile"
                className="border-2 border-orange-500 shadow-md bg-top transition-transform duration-200"
              />
            </button>

            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer hover:cursor-pointer"
              aria-label="Profile Options"
            >
              <FiMoreVertical className="w-5 h-5" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div 
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <Link 
                  href="/dashboard/profilemanagement"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <FiUser className="w-4 h-4" />
                  <span>View Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Profile Picture Modal — rendered via Portal at body level */}
          {showImageModal && typeof document !== 'undefined' && createPortal(
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                backgroundColor: 'rgba(0,0,0,0.65)',
              }}
              onClick={() => setShowImageModal(false)}
            >
              {/* Modal Content */}
              <div
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowImageModal(false)}
                  style={{
                    position: 'absolute',
                    top: '-52px',
                    right: '-4px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  ✕
                </button>

                {/* Big Profile Pic */}
                <div style={{
                  width: '256px',
                  height: '256px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '4px solid #f97316',
                  boxShadow: '0 0 60px rgba(249,115,22,0.5)',
                }}>
                  {user?.profilePic ? (
                    <Image
                      src={user.profilePic}
                      alt={user?.name || 'Profile'}
                      width={256}
                      height={256}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', fontWeight: 900, color: '#f97316' }}>
                      {(user?.name || 'E').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name & Link */}
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '22px', margin: 0 }}>{user?.name || 'Expert'}</p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', marginTop: '4px' }}>{user?.email || ''}</p>

                </div>


              </div>
            </div>,
            document.body
          )}
        </div>
      </div>
    </header>
  );
};
