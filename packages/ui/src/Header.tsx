"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import LinkComponent from "next/link";
import Image from "next/image";
import { PATHS } from "@repo/routes";
import { useClientAuth } from "./context/ClientAuthContext";
import { useCart } from "./context/CartContext";

const Link = LinkComponent as any;
const NextImage = Image as any;
import {
  Swiper as SwiperComponent,
  SwiperSlide as SwiperSlideComponent,
  useSwiper,
} from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

const Swiper = SwiperComponent as any;
const SwiperSlide = SwiperSlideComponent as any;
import { getNotificationSocket, connectNotificationSocket } from "./utils/socket";

// Custom Navigation Buttons Component
const SwiperNavButtons = () => {
  const swiper = useSwiper();
  return (
    <>
      <div className="swiper-nav-prev  " style={{ marginLeft: "-10px" }} onClick={() => swiper.slidePrev()}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>
      <div className="swiper-nav-next " style={{ marginRight: "-10px" }} onClick={() => swiper.slideNext()}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </>
  );
};

// Swiper styles are imported in the root layout.tsx to avoid resolution issues in the shared package.
const SERVICES_DATA = [
  {
    id: 1,
    label: "Matchmaking",
    icon: "images/top-icon1.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
  {
    id: 2,
    label: "Guna Milan",
    icon: "images/top-icon2.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
  {
    id: 3,
    label: "Online Puja",
    icon: "images/top-icon3.png",
    href: PATHS.ONLINE_PUJA,
    isInternal: true,
  },
  {
    id: 4,
    label: "Love Match",
    icon: "images/top-icon4.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
  /* {
    id: 5,
    label: "Match Check",
    icon: "images/top-icon5.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
  {
    id: 6,
    label: "Vedic Match",
    icon: "images/top-icon6.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  }, */
  {
    id: 7,
    label: "Match Analysis",
    icon: "images/top-icon6.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
  /* {
    id: 8,
    label: "Match Analysis",
    icon: "images/top-icon6.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  }, */
];

interface HeaderProps {
  authState?: boolean;
  userData?: any;
  logoutHandler?: () => void;
  balance?: number;
  cartCount?: number;
}

const Header: React.FC<HeaderProps> = ({ authState, userData, logoutHandler, balance, cartCount: propCartCount }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSubMenu, setShowMobileSubMenu] = useState(false);
  const [showFullBalance, setShowFullBalance] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Use the authentication context
  const {
    clientUser: contextUser,
    isClientAuthenticated: contextIsAuthenticated,
    clientLoading: loading,
    clientLogout: contextLogout,
    clientBalance,
    refreshAuth,
    refreshBalance
  } = useClientAuth();

  const { cartCount: contextCartCount } = useCart();
  const cartCount = propCartCount ?? contextCartCount;



  // Prioritize props if available, otherwise use context
  const isAuthenticated = authState ?? contextIsAuthenticated;
  const clientUser = userData ?? contextUser;
  const currentBalance = balance ?? clientBalance;

  const legacyUploadsOrigin = process.env.NEXT_PUBLIC_ADMIN_UPLOADS_ORIGIN || "http://localhost:3001";

  const normalizeImagePath = (value: string | null | undefined): string => {
    if (!value) return "/images/aa.webp";
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:") || value.startsWith("blob:")) {
      return value;
    }
    if (value.startsWith("/uploads/")) return value; // Use relative path to trigger Next.js proxy
    if (value.startsWith("/")) return value;
    return `${legacyUploadsOrigin}/uploads/${value}`;
  };

  const avatarSrc = normalizeImagePath(clientUser?.profile_picture || clientUser?.avatar);

  const unwrapResponse = (res: any) => res?.data ?? res;
  const normalizeNotification = (notif: any) => ({
    ...notif,
    id: notif?.id ?? notif?.notification_id,
    isRead: notif?.isRead ?? notif?.is_read ?? false,
    createdAt: notif?.createdAt ?? notif?.created_at,
  });

  const clientLogout = async () => {
    if (logoutHandler) {
      logoutHandler();
    } else {
      await contextLogout();
    }
  };

  // Initial client mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // API functions for notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const { apiClient } = require("./context/ClientAuthContext");
      const res = await apiClient.get('/notifications');
      const payload = unwrapResponse(res);
      const rawList = Array.isArray(payload) ? payload : (payload?.items || payload?.data || []);
      setNotifications(rawList.map(normalizeNotification));
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { apiClient } = require("./context/ClientAuthContext");
      const res = await apiClient.get('/notifications/unread-count');
      const payload = unwrapResponse(res);
      const count = payload?.count ?? payload?.unreadCount ?? payload?.unread_count ?? 0;
      setUnreadCount(Number(count) || 0);
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const { apiClient } = require("./context/ClientAuthContext");
      await apiClient.patch(`/notifications/${id}/read`);
      fetchUnreadCount();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isClient && isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isClient, isAuthenticated, fetchUnreadCount]);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (showNotificationDropdown) {
      fetchNotifications();
    }
  }, [showNotificationDropdown, fetchNotifications]);

  // Notification Socket Connection
  useEffect(() => {
    if (isClient && isAuthenticated && clientUser?.id) {
      console.log("🔌 Connecting to notification socket for user:", clientUser.id);
      connectNotificationSocket(clientUser.id);
      const socket = getNotificationSocket();

      const handleUpdate = (data: any) => {
        console.log("🔔 Real-time Notification received:", data);
        // Show success toast
        const { toast } = require("react-toastify");
        toast.success(data.message || "Order Status Updated!");

        // Refresh counts and lists
        fetchUnreadCount();
        if (showNotificationDropdown) fetchNotifications();
      };

      // Listen for backend events
      socket.on("order_status_updated", handleUpdate);
      socket.on("notification", handleUpdate);
      socket.on("new_notification", handleUpdate);

      return () => {
        socket.off("order_status_updated", handleUpdate);
        socket.off("notification", handleUpdate);
        socket.off("new_notification", handleUpdate);
      };
    }
  }, [isClient, isAuthenticated, clientUser, fetchUnreadCount, fetchNotifications, showNotificationDropdown]);

  // Handle logout
  const handleLogout = async () => {
    await clientLogout();
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string) => {
    const userName = name || clientUser?.name;
    if (userName) {
      return userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    // If no name, return user icon
    return "U";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Language dropdown
      if (!target.closest(".language-dropdown-container")) {
        setShowLanguageDropdown(false);
      }
      // Profile dropdown
      if (!target.closest(".profile-dropdown-container")) {
        setShowProfileDropdown(false);
      }
      // Notification dropdown
      if (!target.closest(".notification-dropdown-container")) {
        setShowNotificationDropdown(false);
      }
      // Mobile menu — close when clicking outside the navbar
      if (!target.closest(".main-head")) {
        setIsMenuOpen(false);
      }
    };

    if (showLanguageDropdown || showProfileDropdown || showNotificationDropdown || isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showLanguageDropdown, showProfileDropdown, showNotificationDropdown, isMenuOpen]);

  return (
    <>
      <header className="top-head bg-brown text-white shadow-sm relative z-[1001]" style={{ height: 'auto', minHeight: '52px' }}>
        <div className="container" style={{ overflow: 'visible' }}>
          <div className="row align-items-center">
            {/* Left section: Welcome Text */}
            <div className="col-lg-8 col-md-6 d-none d-md-block">
              <p className="top-text mb-0 text-white">
                Connect with Verified Astrology Experts for Online Predictions.
              </p>
            </div>

            {/* Right section: Balance + Icons */}
            <div className="col-lg-4 col-md-6 col-12">
              <div className="d-flex justify-content-end align-items-center gap-4 gap-md-5">
                {isAuthenticated && (
                  <div
                    onMouseEnter={() => setShowFullBalance(true)}
                    onMouseLeave={() => setShowFullBalance(false)}
                    className="d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-help whitespace-nowrap bg-orange hover:opacity-90 shadow-lg"
                    style={{
                      minWidth: '75px',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* Subtle gloss effect */}
                    <div className="position-absolute top-0 start-0 w-100 h-50 bg-white/10" style={{ pointerEvents: 'none' }}></div>

                    <i className="fa-solid fa-coins text-white text-xs" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}></i>
                    <span className="text-white font-black text-sm tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                      ₹{showFullBalance
                        ? currentBalance?.toLocaleString()
                        : (currentBalance >= 1000
                          ? `${(currentBalance / 1000).toFixed(currentBalance % 1000 === 0 ? 0 : 1)} k`
                          : currentBalance)}
                    </span>
                  </div>
                )}

                <div className="d-flex gap-3 gap-md-4 align-items-center">
                  {isAuthenticated ? (
                    <div className="d-flex gap-4 align-items-center justify-content-end">

                      {/* Cart Icon */}
                      <Link href={PATHS.CART} className="cart-top position-relative d-inline-flex">
                        <i className="fa-solid fa-cart-shopping text-white text-xl"></i>
                        {cartCount > 0 && (
                          <span
                            className="position-absolute badge rounded-pill bg-danger"
                            style={{
                              top: '-6px',
                              right: '-10px',
                              fontSize: '9px',
                              padding: '2px 5px',
                              minWidth: '15px',
                              height: '15px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid #331a1a'
                            }}
                          >
                            {cartCount}
                          </span>
                        )}
                      </Link>

                      {/* Notification Bell */}
                      <div className="notification-dropdown-container position-relative">
                        <div
                          className="cursor-pointer position-relative d-inline-flex"
                          onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                        >
                          <i className="fa-solid fa-bell text-white text-xl"></i>
                          {unreadCount > 0 && (
                            <span
                              className="position-absolute badge rounded-pill bg-danger"
                              style={{
                                top: '-6px',
                                right: '-10px',
                                fontSize: '9px',
                                padding: '2px 5px',
                                minWidth: '15px',
                                height: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #331a1a'
                              }}
                            >
                              {unreadCount}
                            </span>
                          )}
                        </div>

                        {showNotificationDropdown && (
                          <div
                            className="position-absolute bg-white shadow-lg rounded-3 overflow-hidden"
                            style={{
                              top: "140%",
                              right: "0",
                              width: "380px",
                              zIndex: 1001,
                              border: "1px solid #eee"
                            }}
                          >
                            <div className="px-3 py-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                              <p className="mb-0 fw-bold text-dark fs-5">Notifications</p>
                              {notifications.length > 0 && (
                                <button
                                  onClick={() => setNotifications([])}
                                  className="btn btn-link p-0 text-decoration-none text-muted"
                                  style={{ fontSize: '13px' }}
                                >
                                  Clear All
                                </button>
                              )}
                            </div>
                            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                              {notifications.length === 0 ? (
                                <div className="px-3 py-5 text-center">
                                  <i className="fa-solid fa-bell-slash text-muted mb-3 d-block fa-3x"></i>
                                  <p className="mb-0 text-muted fs-6">No new notifications</p>
                                </div>
                              ) : (
                                notifications.map((notif: any, idx: number) => (
                                  <div
                                    key={notif.id || idx}
                                    className={`px-3 py-3 border-bottom hover-bg-light transition-all cursor-pointer ${notif.isRead ? 'opacity-75' : 'bg-blue-50/30'}`}
                                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                                  >
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                      <p className="mb-0 text-dark fw-bold fs-6">{notif.title || 'Notification'}</p>
                                      {!notif.isRead && <span className="p-1 bg-blue-500 rounded-circle"></span>}
                                    </div>
                                    <p className="mb-0 text-muted" style={{ fontSize: '13px', lineHeight: '1.5' }}>{notif.message}</p>
                                    <p className="mb-0 mt-2 text-orange-500 fw-medium" style={{ fontSize: '11px' }}>
                                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Just now'}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="px-3 py-3 border-top text-center bg-light">
                              <Link
                                href={`${PATHS.PROFILE}?tab=notifications`}
                                className="text-decoration-none text-orange-500 fw-bold fs-6"
                                onClick={() => setShowNotificationDropdown(false)}
                              >
                                View All
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* User Profile & Dropdown */}
                      <div className="profile-dropdown-container position-relative">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="cursor-pointer"
                            onClick={() => setShowImageModal(true)}
                            title="View Profile Picture"
                            style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              border: "2px solid var(--primary-color, black)",
                              padding: "2px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "transform 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <NextImage
                              src={avatarSrc}
                              alt="Profile"
                              width={35}
                              height={35}
                              className="object-cover w-100 h-100 rounded-circle"
                            />
                          </div>
                          <i
                            className="fa-solid fa-ellipsis-vertical text-white cursor-pointer p-1"
                            style={{ fontSize: '18px' }}
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                          ></i>
                        </div>

                        {showProfileDropdown && (
                          <div
                            className="position-absolute bg-white shadow-2xl rounded-4 overflow-hidden border-0"
                            style={{
                              top: "140%",
                              right: "0",
                              minWidth: "280px",
                              zIndex: 1000,
                              animation: "fadeInUp 0.3s ease-out",
                              boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
                              border: "1px solid rgba(242, 94, 10, 0.1)"
                            }}
                          >
                            {/* User Header Section - Tailwind Orange */}
                            <div
                              className="p-3 mb-1 bg-orange"
                              style={{
                                color: "white"
                              }}
                            >
                              <div className="d-flex align-items-center gap-3">
                                <div
                                  className="rounded-circle overflow-hidden border-2 border-white shadow-sm"
                                  style={{ width: "50px", height: "50px", backgroundColor: "white" }}
                                >
                                  <NextImage
                                    src={avatarSrc}
                                    alt="User"
                                    width={50}
                                    height={50}
                                    className="object-cover w-100 h-100"
                                  />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="mb-0 fw-bold text-truncate" style={{ fontSize: '16px', letterSpacing: '0.2px' }}>
                                    {clientUser?.name || 'User Name'}
                                  </p>
                                  <div className="d-flex align-items-center gap-1 opacity-90">
                                    <i className="fa-solid fa-envelope" style={{ fontSize: '10px' }}></i>
                                    <p className="mb-0 text-truncate" style={{ fontSize: '11px' }}>
                                      {clientUser?.email || clientUser?.phone || 'Verified Profile'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                              <Link
                                href={PATHS.PROFILE}
                                className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none text-dark rounded-3 hover-bhagwa-light transition-all mb-1"
                                onClick={() => setShowProfileDropdown(false)}
                                style={{ fontSize: '14px' }}
                              >
                                <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm bg-orange bg-opacity-10 text-orange" style={{ width: "34px", height: "34px" }}>
                                  <i className="fa-solid fa-user-circle"></i>
                                </div>
                                <span className="fw-medium">My Profile</span>
                              </Link>

                              <Link
                                href={`${PATHS.PROFILE}?tab=wallet`}
                                className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none text-dark rounded-3 hover-bhagwa-light transition-all mb-1"
                                onClick={() => setShowProfileDropdown(false)}
                                style={{ fontSize: '14px' }}
                              >
                                <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm bg-orange bg-opacity-10 text-orange" style={{ width: "34px", height: "34px" }}>
                                  <i className="fa-solid fa-wallet"></i>
                                </div>
                                <span className="fw-medium">My Wallet</span>
                              </Link>

                              <div className="my-2 border-bottom opacity-50 mx-2"></div>

                              <button
                                onClick={() => {
                                  setShowProfileDropdown(false);
                                  handleLogout();
                                }}
                                className="w-100 d-flex align-items-center gap-3 px-3 py-2 border-0 bg-transparent text-danger rounded-3 hover-bg-red-50 transition-all"
                                style={{ fontSize: '14px' }}
                              >
                                <div className="bg-red-100 text-red-600 rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "34px", height: "34px" }}>
                                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </div>
                                <span className="fw-bold">Logout Session</span>
                              </button>
                            </div>

                            <style>{`
                              @keyframes fadeInUp {
                                from { opacity: 0; transform: translateY(10px); }
                                to { opacity: 1; transform: translateY(0); }
                              }
                              .hover-bhagwa-light:hover { background-color: rgba(242, 94, 10, 0.05); color: #f25e0a !important; }
                              .hover-bg-red-50:hover { background-color: #fff5f5; }
                            `}</style>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex gap-3">
                      <Link
                        href={PATHS.SIGN_IN}
                        className="bg-orange text-white rounded-[5px] px-[15px] py-[6px] text-sm font-semibold inline-block no-underline transition-all hover:opacity-90 active:scale-95"
                      >
                        Sign In
                      </Link>

                      <Link
                        href={PATHS.REGISTER}
                        className="bg-orange text-white rounded-[5px] px-[15px] py-[6px] text-sm font-semibold inline-block no-underline transition-all hover:opacity-90 active:scale-95"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <header className="main-head">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-10 col-md-7">
              <nav className="navbar navbar-expand-lg navbar-light">
                <Link className="navbar-brand" href="/">
                  <NextImage
                    src="/images/web-logo.png"
                    alt="logo"
                    width={180}
                    height={60}
                    className="logo object-contain"
                  />
                </Link>
                <button
                  className="navbar-toggler ms-auto"
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-controls="navbarSupportedContent"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className={`flex-grow-1 ${isMenuOpen ? "d-block position-absolute bg-white w-100 start-0 shadow-sm border-top no-scrollbar" : "d-none d-lg-flex align-items-center justify-content-center"}`}
                  id="navbarSupportedContent"
                  style={isMenuOpen ? { top: '100%', zIndex: 1000, maxHeight: '80vh', overflowY: 'auto' } : { zIndex: 1000 }}
                >
                  <ul
                    className={`navbar-nav mx-auto top-menu-main d-flex align-items-center gap-2 gap-xl-4 ${isMenuOpen
                      ? "flex-column align-items-start w-100 py-2 px-3 gap-0"
                      : "flex-row"
                      }`}
                  >
                    {/* Home */}
                    <li className={`nav-item ${isMenuOpen ? "w-100 border-bottom" : ""}`}>
                      <Link
                        className="nav-link"
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Home
                      </Link>
                    </li>

                    {/* Daily Horoscope */}
                    <li className={`nav-item ${isMenuOpen ? "w-100 border-bottom" : ""}`}>
                      <Link
                        className="nav-link"
                        href={PATHS.HOROSCOPE}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Daily Horoscope
                      </Link>
                    </li>

                    {/* Astrology Consult — Bootstrap dropdown on desktop, accordion on mobile */}
                    <li className={`nav-item dropdown ${isMenuOpen ? "w-100 border-bottom" : ""}`}>
                      {isMenuOpen ? (
                        /* Mobile accordion toggle */
                        <>
                          <button
                            className="nav-link w-100 text-start bg-transparent border-0 d-flex justify-content-between align-items-center"
                            style={{ fontWeight: 500 }}
                            onClick={() => setShowMobileSubMenu(!showMobileSubMenu)}
                          >
                            Astrology Consult
                            <i
                              className={`fa-solid fa-chevron-${showMobileSubMenu ? "up" : "down"} text-muted`}
                              style={{ fontSize: "12px" }}
                            />
                          </button>
                          {showMobileSubMenu && (
                            <ul className="list-unstyled ps-3 pb-2" style={{ borderLeft: "3px solid var(--primary-color, #e67e22)" }}>
                              {[
                                { label: "Horoscope", href: PATHS.HOROSCOPE },
                                { label: "Love Calculator", href: PATHS.LOVE_CALCULATOR },
                                { label: "Dahej Calculator", href: PATHS.DAHEJ_CALCULATOR },
                                { label: "Flames Calculator", href: PATHS.FLAMES_CALCULATOR },
                                { label: "Love Compatibility Calculator", href: PATHS.LOVE_COMPATIBILITY_CALCULATOR },
                                { label: "Marriage Age Calculator", href: PATHS.MARRIAGE_AGE_CALCULATOR },
                                { label: "Soulmate Name Initials Calculator", href: PATHS.SOULMATE_NAME_INITALS_CALCULATOR },
                                { label: "Lucky Number & Colour Calculator", href: PATHS.LUCKY_NUMBER_CALCULATOR },
                                { label: "Life Path Calculator", href: PATHS.LIFE_PATH_CALCULATOR },
                                { label: "Name Numerology Calculator", href: PATHS.NAME_NUMEROLOGY_CALCULATOR },
                                { label: "Zodiac Sign Compatibility Calculator", href: PATHS.ZODIAC_SIGN_CALCULATOR },
                                { label: "Nakshatra Finder", href: PATHS.NAKSHATRA_FINDER },
                                { label: "Loyal Partner Calculator", href: PATHS.LOYAL_PARTNER_CALCULATOR },
                                { label: "Breakup Patchup Calculator", href: PATHS.BREAKUP_PATCHUP_CALCULATOR },
                                { label: "Online Puja", href: PATHS.ONLINE_PUJA },
                              ].map((item) => (
                                <li key={item.href} className="py-1">
                                  <Link
                                    href={item.href}
                                    className="text-decoration-none text-dark"
                                    style={{ fontSize: "14px" }}
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      setShowMobileSubMenu(false);
                                    }}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        /* Desktop Bootstrap dropdown */
                        <>
                          <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Astrology Consult
                          </a>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="navbarDropdown"
                          >
                            <li><Link className="dropdown-item" href={PATHS.HOROSCOPE}>Horoscope</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.LOVE_CALCULATOR}>Love Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.DAHEJ_CALCULATOR}>Dahej Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.FLAMES_CALCULATOR}>Flames Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.LOVE_COMPATIBILITY_CALCULATOR}>Love Compatibility Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.MARRIAGE_AGE_CALCULATOR}>Marriage Age Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.SOULMATE_NAME_INITALS_CALCULATOR}>Soulmate Name Initials Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.LUCKY_NUMBER_CALCULATOR}>Lucky Number & Colour Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.LIFE_PATH_CALCULATOR}>Life Path Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.NAME_NUMEROLOGY_CALCULATOR}>Name Numerology Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.ZODIAC_SIGN_CALCULATOR}>Zodiac Sign Compatibility Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.NAKSHATRA_FINDER}>Nakshatra Finder</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.LOYAL_PARTNER_CALCULATOR}>Loyal Partner Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.BREAKUP_PATCHUP_CALCULATOR}>Breakup Patchup Calculator</Link></li>
                            <li><Link className="dropdown-item" href={PATHS.ONLINE_PUJA}>Online Puja</Link></li>
                          </ul>
                        </>
                      )}
                    </li>

                    {/* Famous Places */}
                    <li className={`nav-item ${isMenuOpen ? "w-100" : ""}`}>
                      <Link
                        className="nav-link"
                        href={PATHS.FAMOUS_PLACES}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Famous Places
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
            <div className="col-lg-2 col-md-5 mobile-none">
              <Link
                href="/our-astrologers"
                className="btn-ask-expert bg-orange text-white transition-all hover:scale-105 active:scale-95"
                style={{
                  padding: "10px 20px",
                  borderRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "14px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  whiteSpace: "nowrap"
                }}
              >
                <NextImage
                  src="/images/chat.svg"
                  className="chat-icon filter-white"
                  alt="chat"
                  width={20}
                  height={20}
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                Ask Astrologer
              </Link>
            </div>
          </div>
        </div>
      </header>

      {
        isClient && (
          <header className="services-list-card bg-orange">
            <div className="container position-relative">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={25}
                slidesPerView={2}
                grabCursor={true}
                loop={SERVICES_DATA.length > 5}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 4,
                  },
                  1024: {
                    slidesPerView: 5,
                  },
                }}
                className="services-swiper"
              >
                <SwiperNavButtons />

                {SERVICES_DATA.map((service) => (
                  <SwiperSlide key={service.id}>
                    <div className="flx-icon-item swiperSliders">
                      <a
                        href={service.href}
                        onClick={(e) => {
                          if (service.isInternal && (service.href as any) !== "#") {
                            e.preventDefault();
                            router.push(service.href);
                          }
                        }}
                        className="flx-icon text-decoration-none text-dark"
                        style={{ cursor: "pointer" }}
                      >
                        <NextImage
                          src={`/${service.icon}`}
                          className="icon-top-flx"
                          alt={service.label}
                          width={40}
                          height={40}
                        />
                        <span>{service.label}</span>
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </header>
        )
      }

      {/* Profile Image Preview Modal */}
      {showImageModal && (
        <div
          onClick={() => setShowImageModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(3px)',
            padding: '20px'
          }}
        >
          <div
            className="bg-white rounded-4 shadow-lg"
            style={{
              position: 'relative',
              padding: '10px',
              maxWidth: 'min(500px, 95vw)',
              maxHeight: '95vh',
              animation: 'zoomIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '35px',
                height: '35px',
                zIndex: 10,
                border: '1px solid #ddd',
                backgroundColor: '#fff'
              }}
              onClick={() => setShowImageModal(false)}
            >
              <i className="fa-solid fa-xmark text-dark fs-5"></i>
            </button>

            <div
              className="overflow-hidden rounded-3 d-flex align-items-center justify-content-center"
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                backgroundColor: '#f8f9fa'
              }}
            >
              <img
                src={avatarSrc}
                alt="Profile Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          </div>
          <style>{`
            @keyframes zoomIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Header;



