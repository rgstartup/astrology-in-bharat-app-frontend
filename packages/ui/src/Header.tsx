"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import LinkComponent from "next/link";
import Image from "next/image";
import { PATHS } from "@repo/routes";
import { useCart } from "./context/CartContext";

const Link = LinkComponent as any;
const NextImage = Image as any;
import {
  Swiper as SwiperComponent,
  SwiperSlide as SwiperSlideComponent,
  useSwiper,
} from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// i18n & State
import { useLanguageStore, useAuthStore, headerTranslations } from "@repo/store";

const Swiper = SwiperComponent as any;
const SwiperSlide = SwiperSlideComponent as any;
import { getNotificationSocket, connectNotificationSocket } from "./utils/socket";
import { api } from "./utils/api";
import { CloseButton } from "./components/CloseButton";



// Swiper styles are imported in the root layout.tsx to avoid resolution issues in the shared package.
const SERVICES_DATA_KEYS = [
  {
    id: 1,
    key: "serviceMatchmaking",
    icon: "images/top-icon1.png",
    href: PATHS.MARRIAGE_AGE_CALCULATOR,
    isInternal: true,
  },
  {
    id: 2,
    key: "serviceGunaMilan",
    icon: "images/top-icon2.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
  {
    id: 3,
    key: "serviceOnlinePuja",
    icon: "images/top-icon3.png",
    href: PATHS.ONLINE_PUJA,
    isInternal: true,
  },
  {
    id: 4,
    key: "serviceLoveMatch",
    icon: "images/top-icon4.png",
    href: "/love-calculator",
    isInternal: true,
  },
  {
    id: 7,
    key: "serviceMatchAnalysis",
    icon: "images/top-icon6.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
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
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingMoreNotifications, setLoadingMoreNotifications] = useState(false);
  const [notificationsOffset, setNotificationsOffset] = useState(0);
  const [notificationsHasMore, setNotificationsHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSubMenu, setShowMobileSubMenu] = useState(false);
  const [showFullBalance, setShowFullBalance] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Use the shared auth store
  const {
    user: contextUser,
    isAuthenticated: contextIsAuthenticated,
    loading: contextLoading,
    logout: contextLogout,
    balance: contextBalance,
    refreshAuth,
    refreshBalance
  } = useAuthStore();

  const { cartCount: contextCartCount } = useCart();
  const cartCount = propCartCount ?? contextCartCount;

  // Language management
  const { lang, setLang } = useLanguageStore();
  const t = headerTranslations[lang as keyof typeof headerTranslations] || headerTranslations.en;



  // Prioritize props if available, otherwise use context
  const isAuthenticated = authState ?? contextIsAuthenticated;
  const user = userData ?? contextUser;
  const currentBalance = balance ?? contextBalance;

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

  const avatarSrc = normalizeImagePath(user?.profile_picture || user?.avatar);

  const unwrapResponse = (res: any) => res?.data ?? res;
  const normalizeNotification = (notif: any) => ({
    ...notif,
    id: notif?.id ?? notif?.notification_id,
    isRead: notif?.isRead ?? notif?.is_read ?? false,
    createdAt: notif?.createdAt ?? notif?.created_at,
  });

  const logout = async () => {
    if (logoutHandler) {
      logoutHandler();
    } else {
      await contextLogout();
    }
  };

  // Initial client mount
  useEffect(() => {
    setIsClient(true);
    console.log("🧭 [Header] Authenticated:", isAuthenticated, "User:", userData?.name);
  }, [isAuthenticated, userData]);

  // API functions for notifications
  const fetchNotifications = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMoreNotifications(true);
      else {
        setLoadingNotifications(true);
        setNotificationsOffset(0);
      }

      const limit = 10;
      const offset = isLoadMore ? notificationsOffset + limit : 0;

      const [res, error] = await api.get('/notifications', { params: { limit, offset } } as any);
      if (error) throw error;
      const payload = unwrapResponse(res);
      const rawList = Array.isArray(payload) ? payload : (payload?.data || []);
      const totalCount = payload?.meta?.totalCount || 0;

      const normalizedList = rawList.map(normalizeNotification);

      if (isLoadMore) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const newList = normalizedList.filter((n: any) => !existingIds.has(n.id));
          const updated = [...prev, ...newList];
          setNotificationsHasMore(updated.length < totalCount);
          return updated;
        });
        setNotificationsOffset(offset);
      } else {
        setNotifications(normalizedList);
        setNotificationsHasMore(normalizedList.length < totalCount);
        setNotificationsOffset(0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoadingNotifications(false);
      setLoadingMoreNotifications(false);
    }
  }, [notificationsOffset]);

  const fetchMoreNotifications = () => {
    if (!loadingMoreNotifications && notificationsHasMore) {
      fetchNotifications(true);
    }
  };

  const fetchUnreadCount = useCallback(async () => {
    try {
      const [res, error] = await api.get('/notifications/unread-count');
      if (error) throw error;
      const payload = unwrapResponse(res);
      const count = payload?.count ?? payload?.unreadCount ?? payload?.unread_count ?? 0;
      setUnreadCount(Number(count) || 0);
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const [_, error] = await api.patch(`/notifications/${id}/read`);
      if (error) throw error;
      fetchUnreadCount();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleClearAll = async () => {
    try {
      const [_, error] = await api.delete('/notifications/all');
      if (error) throw error;
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to clear notifications in header', err);
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
    if (isClient && isAuthenticated && user?.id) {
      console.log("🔌 Connecting to notification socket for user:", user.id);
      // Use profile from token as per new architecture
      connectNotificationSocket(user.profile || user.id);
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
  }, [isClient, isAuthenticated, user, fetchUnreadCount, fetchNotifications, showNotificationDropdown]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string) => {
    const userName = name || user?.name;
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

  // Close dropdown when clicking outside or scrolling
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

    const handleScroll = () => {
      // Close desktop dropdowns on main body scroll
      if (showLanguageDropdown) setShowLanguageDropdown(false);
      if (showProfileDropdown) setShowProfileDropdown(false);
      if (showNotificationDropdown) setShowNotificationDropdown(false);
    };

    if (showLanguageDropdown || showProfileDropdown || showNotificationDropdown || isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Only attach scroll close behavior to desktop dropdowns
      if (showLanguageDropdown || showProfileDropdown || showNotificationDropdown) {
        window.addEventListener("scroll", handleScroll, { passive: true });
      }
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [showLanguageDropdown, showProfileDropdown, showNotificationDropdown, isMenuOpen]);
 
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isClient && isMenuOpen) {
      document.body.style.overflow = 'hidden';
      // If using Lenis or similar, you might need to add a class
      document.body.classList.add('no-scroll');
      return () => {
        document.body.style.overflow = '';
        document.body.classList.remove('no-scroll');
      };
    }
  }, [isClient, isMenuOpen]);

  return (
    <>
      <header
        className="bg-[#301118] text-white shadow-sm relative z-[1001] overflow-visible flex items-center"
        style={{ minHeight: '52px', scrollbarWidth: 'none' }}
      >
        <div className="max-w-[1320px] mx-auto px-2 sm:px-4 md:px-8 lg:px-16 w-full" style={{ overflow: 'visible' }}>
          <div className="flex items-center w-full">
            {/* Left section: Welcome Text */}
            <div className="flex-1 hidden md:block">
              <p className="m-0 text-white text-base font-medium">
                {t.welcomeText}
              </p>
            </div>

            {/* Right section: Balance + Icons */}
            <div className="ml-auto w-full md:w-auto">
              <div className="flex justify-between md:justify-end items-center gap-1.5 sm:gap-3 md:gap-5 w-full">

                {/* Language Switcher Dropdown */}
                <div className="language-dropdown-container relative">
                  <button
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="flex items-center gap-1 sm:gap-1.5 focus:outline-none bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all border border-white/20 select-none"
                  >
                    <i className="fa-solid fa-globe text-[10px] sm:text-sm" />
                    <span className="text-[10px] sm:text-sm font-semibold">{lang === 'hi' ? 'हिंदी' : 'EN'}</span>
                    <i className={`fa-solid fa-chevron-down text-[8px] sm:text-[10px] transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showLanguageDropdown && (
                    <div className="absolute top-[120%] left-0 md:left-auto md:right-0 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden w-[120px] text-gray-800 z-[1002] border border-gray-100 flex flex-col">
                      <button
                        onClick={() => { setLang('en'); setShowLanguageDropdown(false); }}
                        className={`px-4 py-2.5 text-left text-sm transition-colors hover:bg-orange-50 hover:text-orange ${lang === 'en' ? 'font-bold bg-orange-50/50 text-orange' : 'font-medium'}`}
                      >
                        English
                      </button>
                      <hr className="m-0 border-gray-100" />
                      <button
                        onClick={() => { setLang('hi'); setShowLanguageDropdown(false); }}
                        className={`px-4 py-2.5 text-left text-sm transition-colors hover:bg-orange-50 hover:text-orange ${lang === 'hi' ? 'font-bold bg-orange-50/50 text-orange' : 'font-medium'}`}
                      >
                        हिंदी
                      </button>
                    </div>
                  )}
                </div>

                {isAuthenticated && (
                  <div
                    onMouseEnter={() => setShowFullBalance(true)}
                    onMouseLeave={() => setShowFullBalance(false)}
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-help whitespace-nowrap bg-orange hover:opacity-90 shadow-lg relative overflow-hidden"
                    style={{
                      minWidth: '75px',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* Subtle gloss effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" style={{ pointerEvents: 'none' }} />

                    <i className="fa-solid fa-coins text-white text-xs" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }} />
                    <span className="text-white font-black text-sm tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                      ₹{showFullBalance
                        ? currentBalance?.toLocaleString()
                        : (currentBalance >= 1000
                          ? `${(currentBalance / 1000).toFixed(currentBalance % 1000 === 0 ? 0 : 1)} k`
                          : currentBalance)}
                    </span>
                  </div>
                )}

                <div className="flex gap-1.5 sm:gap-3 md:gap-4 items-center">

                  {isAuthenticated ? (
                    <div className="flex gap-4 items-center justify-end">

                      {/* Cart Icon */}
                      <Link href={PATHS.CART} className="relative top-[3px] text-white hover:text-white inline-flex">
                        <i className="fa-solid fa-cart-shopping text-white text-xl" />
                        {cartCount > 0 && (
                          <span
                            className="absolute inline-flex items-center justify-center rounded-full bg-red-500 text-white"
                            style={{
                              top: '-6px',
                              right: '-10px',
                              fontSize: '9px',
                              padding: '2px 5px',
                              minWidth: '15px',
                              height: '15px',
                              border: '1px solid #331a1a'
                            }}
                          >
                            {cartCount}
                          </span>
                        )}
                      </Link>

                      {/* Notification Bell */}
                      <div className="notification-dropdown-container relative">
                        <div
                          className="cursor-pointer relative inline-flex"
                          onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                        >
                          <i className="fa-solid fa-bell text-white text-xl" />
                          {unreadCount > 0 && (
                            <span
                              className="absolute inline-flex items-center justify-center rounded-full bg-red-500 text-white"
                              style={{
                                top: '-6px',
                                right: '-10px',
                                fontSize: '9px',
                                padding: '2px 5px',
                                minWidth: '15px',
                                height: '15px',
                                border: '1px solid #331a1a'
                              }}
                            >
                              {unreadCount}
                            </span>
                          )}
                        </div>

                        {showNotificationDropdown && (
                          <div
                            className="fixed top-[65px] left-[5vw] w-[90vw] sm:absolute sm:top-[140%] sm:left-auto sm:-right-4 md:right-0 sm:w-[320px] md:w-[380px] bg-white shadow-lg rounded-2xl overflow-hidden z-[1001] border border-[#eee]"
                          >
                            <div className="px-3 py-3 border-b bg-gray-50 flex justify-between items-center">
                              <p className="mb-0 font-bold text-gray-900 text-lg">{t.notifications}</p>
                              {notifications.length > 0 && (
                                <button
                                  onClick={handleClearAll}
                                  className="text-red-500 text-sm font-bold hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-all flex items-center gap-1.5"
                                >
                                  <i className="fa-solid fa-trash-can text-xs"></i>
                                  {t.clearAll}
                                </button>
                              )}
                            </div>
                            <div data-lenis-prevent className="overflow-y-auto overscroll-contain" style={{ maxHeight: '400px' }}>
                              {loadingNotifications ? (
                                <div className="divide-y divide-gray-100">
                                  {[1, 2, 3].map((i) => (
                                    <div key={i} className="px-4 py-4 animate-pulse">
                                      <div className="flex justify-between mb-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-2 bg-gray-100 rounded w-4"></div>
                                      </div>
                                      <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
                                      <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                                      <div className="h-2 bg-orange-50 rounded w-1/4 mt-3"></div>
                                    </div>
                                  ))}
                                </div>
                              ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                                  <div className="w-16 h-16 bg-orange/5 rounded-full flex items-center justify-center mb-4 border border-orange/10 shadow-inner">
                                    <i className="fa-solid fa-bell-slash text-2xl text-orange/60"></i>
                                  </div>
                                  <h6 className="font-bold text-gray-900 text-base mb-2">
                                    {t.noNotificationsYet}
                                  </h6>
                                  <p className="text-gray-500 text-sm max-w-[250px] m-0 mx-auto leading-relaxed">
                                    {t.noNotificationsDesc}
                                  </p>
                                </div>
                              ) : (
                                notifications.map((notif: any, idx: number) => (
                                  <div
                                    key={notif.id || idx}
                                    className={`px-3 py-3 border-b cursor-pointer transition-all ${notif.isRead ? 'opacity-75' : 'bg-blue-50/30'}`}
                                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <p className="mb-0 text-gray-900 font-bold text-sm">{notif.title || 'Notification'}</p>
                                      {!notif.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />}
                                    </div>
                                    <p className="mb-0 text-gray-500" style={{ fontSize: '13px', lineHeight: '1.5' }}>{notif.message}</p>
                                    <p className="mb-0 mt-2 text-orange-500 font-medium" style={{ fontSize: '11px' }}>
                                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : t.justNow}
                                    </p>
                                  </div>
                                ))
                              )}

                              {notificationsHasMore && notifications.length > 0 && !loadingNotifications && (
                                <div className="p-2 text-center border-t border-gray-50">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      fetchMoreNotifications();
                                    }}
                                    disabled={loadingMoreNotifications}
                                    className="w-full py-2 text-xs font-bold text-gray-500 hover:text-orange hover:bg-orange-50 rounded-lg transition-all border-0 bg-transparent flex items-center justify-center gap-2"
                                  >
                                    {loadingMoreNotifications ? (
                                      <>
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                        {lang === 'hi' ? 'और लोड हो रहा है...' : 'Loading...'}
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa-solid fa-chevron-down"></i>
                                        {lang === 'hi' ? 'और देखें' : 'Load More'}
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="px-3 py-3 border-t text-center bg-gray-50">
                              <Link
                                href={`${PATHS.PROFILE}?tab=notifications`}
                                className="no-underline text-orange-500 font-bold text-sm hover:text-orange-600"
                                onClick={() => setShowNotificationDropdown(false)}
                              >
                                {t.viewAll}
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* User Profile & Dropdown */}
                      <div className="profile-dropdown-container relative">
                        <div className="flex items-center gap-2">
                          <div
                            className="cursor-pointer"
                            onClick={() => setShowImageModal(true)}
                            title="View Profile Picture"
                            style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              border: "2px solid #f25e0a",
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
                              className="object-cover w-full h-full rounded-full"
                            />
                          </div>
                          <i
                            className="fa-solid fa-ellipsis-vertical text-white cursor-pointer p-1"
                            style={{ fontSize: '18px' }}
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                          />
                        </div>

                        {showProfileDropdown && (
                          <div
                            className="absolute bg-white shadow-2xl rounded-2xl overflow-hidden"
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
                            {/* User Header Section */}
                            <div className="p-3 mb-1 bg-orange" style={{ color: "white" }}>
                              <div className="flex items-center gap-3">
                                <div
                                  className="rounded-full overflow-hidden border-2 border-white shadow-sm"
                                  style={{ width: "50px", height: "50px", backgroundColor: "white" }}
                                >
                                  <NextImage
                                    src={avatarSrc}
                                    alt="User"
                                    width={50}
                                    height={50}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="mb-0 font-bold truncate" style={{ fontSize: '16px', letterSpacing: '0.2px' }}>
                                    {user?.name || 'User Name'}
                                  </p>
                                  <div className="flex items-center gap-1 opacity-90">
                                    <i className="fa-solid fa-envelope" style={{ fontSize: '10px' }} />
                                    <p className="mb-0 truncate" style={{ fontSize: '11px' }}>
                                      {user?.email || user?.phone || 'Verified Profile'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                              <Link
                                href={PATHS.PROFILE}
                                className="flex items-center gap-3 px-3 py-2 no-underline text-gray-800 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all mb-1"
                                onClick={() => setShowProfileDropdown(false)}
                                style={{ fontSize: '14px' }}
                              >
                                <div className="rounded-full flex items-center justify-center shadow-sm bg-orange/10 text-orange" style={{ width: "34px", height: "34px" }}>
                                  <i className="fa-solid fa-user-circle" />
                                </div>
                                <span className="font-medium">{t.myProfile}</span>
                              </Link>

                              <Link
                                href={`${PATHS.PROFILE}?tab=wallet`}
                                className="flex items-center gap-3 px-3 py-2 no-underline text-gray-800 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all mb-1"
                                onClick={() => setShowProfileDropdown(false)}
                                style={{ fontSize: '14px' }}
                              >
                                <div className="rounded-full flex items-center justify-center shadow-sm bg-orange/10 text-orange" style={{ width: "34px", height: "34px" }}>
                                  <i className="fa-solid fa-wallet" />
                                </div>
                                <span className="font-medium">{t.myWallet}</span>
                              </Link>

                              <div className="my-2 border-b opacity-50 mx-2" />

                              <button
                                onClick={() => {
                                  setShowProfileDropdown(false);
                                  handleLogout();
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 border-0 bg-transparent text-red-600 rounded-xl hover:bg-red-50 transition-all"
                                style={{ fontSize: '14px' }}
                              >
                                <div className="bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-sm" style={{ width: "34px", height: "34px" }}>
                                  <i className="fa-solid fa-arrow-right-from-bracket" />
                                </div>
                                <span className="font-bold">{t.logout}</span>
                              </button>
                            </div>

                            <style>{`
                              @keyframes fadeInUp {
                                from { opacity: 0; transform: translateY(10px); }
                                to { opacity: 1; transform: translateY(0); }
                              }
                            `}</style>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-1.5 sm:gap-3">
                      <a
                        href={`${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(pathname)}`}
                        className="bg-orange text-white rounded-xl sm:rounded-[14px] px-2.5 sm:px-[15px] py-1.5 sm:py-[6px] text-[10px] sm:text-sm font-semibold inline-block no-underline transition-all hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(pathname)}`);
                        }}
                      >
                        {t.signIn}
                      </a>

                      <a
                        href={`${PATHS.REGISTER}?callbackUrl=${encodeURIComponent(pathname)}`}
                        className="bg-orange text-white rounded-xl sm:rounded-[14px] px-2.5 sm:px-[15px] py-1.5 sm:py-[6px] text-[10px] sm:text-sm font-semibold inline-block no-underline transition-all hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`${PATHS.REGISTER}?callbackUrl=${encodeURIComponent(pathname)}`);
                        }}
                      >
                        {t.register}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <header
        className="main-head sticky top-0 z-50 bg-white border-b border-[#FF6B002e] shadow-[0_8px_11px_#0000000d]"
        style={{ backdropFilter: 'saturate(160%) blur(8px)' }}
      >
        <div className="max-w-[1320px] mx-auto px-2 sm:px-4 md:px-8 lg:px-16 py-3">
          <div className="flex items-center justify-between">
            {/* Logo + Nav — takes most of the space */}
            <div className="flex-1">
              <nav className="flex items-center">
                {/* Logo */}
                <Link className="flex-shrink-0 mr-2 sm:mr-4 w-[160px] sm:w-[210px] lg:w-[240px] flex items-center" href="/">
                  <NextImage
                    src="/images/web-logo.png"
                    alt="logo"
                    width={240}
                    height={80}
                    loading="eager"
                    priority
                    quality={100}
                    unoptimized
                    style={{ width: '100%', height: 'auto', maxHeight: '65px' }}
                    className="object-contain"
                  />
                </Link>

                {/* Hamburger — mobile only */}
                <button
                  className="ml-auto lg:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10 border-2 border-orange/50 bg-[#FAE8D6] hover:border-orange hover:bg-[#F2D9C1] transition-all"
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle navigation"
                >
                  <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? 'rotate-45 translate-y-[8px] bg-orange' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-[8px] bg-orange' : ''}`} />
                </button>

                {/* Nav links */}
                 <div
                  data-lenis-prevent
                  className={`lg:flex lg:items-center lg:justify-center lg:flex-1 ${isMenuOpen
                    ? 'block absolute left-0 right-0 bg-brown w-full shadow-2xl border-t border-white/10 z-[1000] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                    : 'hidden'
                    }`}
                  style={isMenuOpen ? { top: '100%', maxHeight: 'calc(100vh - 70px)', overflowY: 'auto', overscrollBehavior: 'contain' } : {}}
                >
                  <ul
                    className={`flex items-center gap-2 xl:gap-8 translate-y-2 ${isMenuOpen
                      ? 'flex-col items-start w-full py-2 px-3 gap-0'
                      : 'flex-row mx-auto'
                      }`}
                  >
                    {/* Home */}
                    <li className={isMenuOpen ? 'w-full border-b border-white/5' : ''}>
                      <Link
                        className={`text-[15px] no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors ${isMenuOpen ? 'text-white/90' : 'text-[#1e0b0f]'}`}
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t.navHome}
                      </Link>
                    </li>

                    {/* Daily Horoscope */}
                    <li className={isMenuOpen ? 'w-full border-b border-white/5' : ''}>
                      <Link
                        className={`text-[15px] no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors ${isMenuOpen ? 'text-white/90' : 'text-[#1e0b0f]'}`}
                        href={PATHS.HOROSCOPE}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t.navDailyHoroscope}
                      </Link>
                    </li>

                    {/* Astrology Consult dropdown */}
                    <li className={`relative group ${isMenuOpen ? 'w-full border-b border-white/5' : ''}`}>
                      {isMenuOpen ? (
                        /* Mobile accordion toggle */
                        <>
                          <button
                            className={`text-[15px] no-underline px-3 py-[10px] font-medium w-full text-left bg-transparent border-0 flex justify-between items-center ${isMenuOpen ? 'text-white/90' : 'text-[#1e0b0f]'}`}
                            onClick={() => setShowMobileSubMenu(!showMobileSubMenu)}
                          >
                            {t.navAstrologyConsult}
                            <i
                              className={`fa-solid fa-chevron-${showMobileSubMenu ? 'up' : 'down'} ${isMenuOpen ? 'text-white/40' : 'text-gray-400'}`}
                              style={{ fontSize: '12px' }}
                            />
                          </button>
                          {showMobileSubMenu && (
                            <ul className="list-none pl-3 pb-2" style={{ borderLeft: '3px solid var(--primary-color, #e67e22)' }}>
                              {[
                                { label: t.dropHoroscope, href: PATHS.HOROSCOPE },
                                { label: t.dropLoveCalc, href: PATHS.LOVE_CALCULATOR },
                                { label: t.dropDahejCalc, href: PATHS.DAHEJ_CALCULATOR },
                                { label: t.dropFlamesCalc, href: PATHS.FLAMES_CALCULATOR },
                                { label: t.dropLoveCompat, href: PATHS.LOVE_COMPATIBILITY_CALCULATOR },
                                { label: t.dropMarriageAge, href: PATHS.MARRIAGE_AGE_CALCULATOR },
                                { label: t.dropSoulmateInitials, href: PATHS.SOULMATE_NAME_INITALS_CALCULATOR },
                                { label: t.dropLuckyNumber, href: PATHS.LUCKY_NUMBER_CALCULATOR },
                                { label: t.dropLifePath, href: PATHS.LIFE_PATH_CALCULATOR },
                                { label: t.dropNameNumerology, href: PATHS.NAME_NUMEROLOGY_CALCULATOR },
                                { label: t.dropZodiacCompat, href: PATHS.ZODIAC_SIGN_CALCULATOR },
                                { label: t.dropNakshatra, href: PATHS.NAKSHATRA_FINDER },
                                { label: t.dropLoyalPartner, href: PATHS.LOYAL_PARTNER_CALCULATOR },
                                { label: t.dropBreakup, href: PATHS.BREAKUP_PATCHUP_CALCULATOR },
                                { label: t.dropOnlinePuja, href: PATHS.ONLINE_PUJA },
                              ].map((item) => (
                                  <li key={item.href} className="py-2.5 border-b border-white/5 last:border-0 ml-4">
                                    <Link
                                      href={item.href}
                                      className="no-underline text-white/70 hover:text-orange transition-all"
                                      style={{ fontSize: '14px' }}
                                      onClick={() => { setIsMenuOpen(false); setShowMobileSubMenu(false); }}
                                    >
                                      {item.label}
                                    </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Desktop hover dropdown — no external JS needed */}
                          <a
                            className="text-[15px] text-[#1e0b0f] no-underline px-3 py-[7px] font-medium flex items-center gap-1 cursor-pointer hover:text-orange-600 transition-colors"
                            href="#"
                          >
                            {t.navAstrologyConsult}
                            <i className="fa-solid fa-chevron-down text-xs opacity-60" />
                          </a>
                          {/* Dropdown — visible on group hover */}
                          <div className="absolute top-full left-0 bg-brown shadow-xl rounded-xl border border-brown z-[1001] min-w-[280px] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                            <ul
                              data-lenis-prevent
                              className="list-none py-3 max-h-[450px] overflow-y-auto overflow-x-hidden overscroll-contain [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-brown [&::-webkit-scrollbar-thumb]:bg-orange [&::-webkit-scrollbar-thumb]:rounded-full"
                            >
                              {[
                                { label: t.dropHoroscope, href: PATHS.HOROSCOPE },
                                { label: t.dropLoveCalc, href: PATHS.LOVE_CALCULATOR },
                                { label: t.dropDahejCalc, href: PATHS.DAHEJ_CALCULATOR },
                                { label: t.dropFlamesCalc, href: PATHS.FLAMES_CALCULATOR },
                                { label: t.dropLoveCompat, href: PATHS.LOVE_COMPATIBILITY_CALCULATOR },
                                { label: t.dropMarriageAge, href: PATHS.MARRIAGE_AGE_CALCULATOR },
                                { label: t.dropSoulmateInitials, href: PATHS.SOULMATE_NAME_INITALS_CALCULATOR },
                                { label: t.dropLuckyNumber, href: PATHS.LUCKY_NUMBER_CALCULATOR },
                                { label: t.dropLifePath, href: PATHS.LIFE_PATH_CALCULATOR },
                                { label: t.dropNameNumerology, href: PATHS.NAME_NUMEROLOGY_CALCULATOR },
                                { label: t.dropZodiacCompat, href: PATHS.ZODIAC_SIGN_CALCULATOR },
                                { label: t.dropNakshatra, href: PATHS.NAKSHATRA_FINDER },
                                { label: t.dropLoyalPartner, href: PATHS.LOYAL_PARTNER_CALCULATOR },
                                { label: t.dropBreakup, href: PATHS.BREAKUP_PATCHUP_CALCULATOR },
                                { label: t.dropOnlinePuja, href: PATHS.ONLINE_PUJA },
                              ].map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    className="block px-6 py-2.5 text-sm text-white/90 no-underline hover:text-orange transition-all border-b border-white/5 last:border-0 hover:translate-x-1"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </li>

                    {/* Famous Places */}
                    <li className={isMenuOpen ? 'w-full border-b border-white/5' : ''}>
                      <Link
                        className={`text-[15px] no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors ${isMenuOpen ? 'text-white/90' : 'text-[#1e0b0f]'}`}
                        href={PATHS.FAMOUS_PLACES}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t.navFamousPlaces}
                      </Link>
                    </li>

                    {/* Kundali Matching */}
                    <li className={isMenuOpen ? 'w-full' : ''}>
                      <Link
                        className={`text-[15px] no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors ${isMenuOpen ? 'text-white/90' : 'text-[#1e0b0f]'}`}
                        href={PATHS.KUNDALI_MATCHING}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {lang === 'hi' ? 'कुण्डली मिलान' : 'Kundali Matching'}
                      </Link>
                    </li>

                    {/* Mobile Only: Profile and Auth */}
                    <li className={`lg:hidden w-full mt-2 pt-2 ${isMenuOpen ? 'border-t border-white/20 pb-4' : 'hidden'}`}>
                      {isAuthenticated ? (
                        <>
                          <Link
                            className="text-[15px] text-white/90 no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors"
                            href={PATHS.PROFILE}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="flex items-center gap-3">
                              <i className="fa-solid fa-user-circle"></i>
                              {t.myProfile || "My Profile"}
                            </div>
                          </Link>
                          <Link
                            className="text-[15px] text-white/90 no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors"
                            href={`${PATHS.PROFILE}?tab=wallet`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="flex items-center gap-3">
                              <i className="fa-solid fa-wallet"></i>
                              {t.myWallet || "My Wallet"}
                            </div>
                          </Link>
                          <button
                            className="text-[15px] text-red-400 no-underline px-3 py-[10px] font-medium block w-full text-left hover:text-red-300 transition-colors bg-transparent border-0"
                            onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                          >
                            <div className="flex items-center gap-3">
                              <i className="fa-solid fa-arrow-right-from-bracket"></i>
                              {t.logout || "Logout"}
                            </div>
                          </button>
                        </>
                      ) : (
                        <div className="flex gap-2 px-3 py-2">
                           <button onClick={() => { setIsMenuOpen(false); router.push(PATHS.SIGN_IN); }} className="flex-1 bg-orange text-white py-2 rounded-xl font-bold border-0">{t.signIn || "Sign In"}</button>
                           <button onClick={() => { setIsMenuOpen(false); router.push(PATHS.REGISTER); }} className="flex-1 bg-white/10 border border-white/20 text-white py-2 rounded-xl font-bold">{t.register || "Register"}</button>
                        </div>
                      )}
                    </li>
                  </ul>
                </div>
              </nav>
            </div>

            {/* Ask Expert CTA */}
            <div className="flex-shrink-0 hidden md:block">
              <Link
                href="/our-experts"
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
                  style={{ width: 'auto', filter: "brightness(0) invert(1)" }}
                />
                {t.askExpert}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <header className="bg-orange shadow-[0_4px_15px_rgba(0,0,0,0.1)] z-10 relative">
        <div className="max-w-[1320px] mx-auto px-2 lg:px-4 py-[5px]">
          <div className="flex items-center gap-2">
            <div className="custom-swiper-prev flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#ce4c04] cursor-pointer transition-all duration-300 shadow-md hover:bg-[#301118] hover:text-white hover:scale-110">
              <i className="fa-solid fa-chevron-left text-xs" />
            </div>
            
            <div className="flex-1 overflow-hidden">
              {!isClient ? (
                /* Static fallback for SSR to prevent layout shift */
                <div className="flex items-center gap-[10px] sm:gap-[25px] overflow-hidden">
                  {SERVICES_DATA_KEYS.slice(0, 5).map((service) => (
                    <div key={service.id} className="flex-1 min-w-[45%] sm:min-w-0" style={{ flexBasis: '20%' }}>
                      <div className="flex justify-center w-full p-[2px] sm:p-[5px]">
                        <div className="flex items-center justify-center bg-[#301118] border border-[#fd9d69] px-2 sm:px-3 py-1.5 sm:py-[10px] rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-semibold text-white w-full h-[40px] sm:h-[52px] opacity-80">
                          <NextImage
                            src={`/${service.icon}`}
                            className="w-[20px] sm:w-[30px] mr-1 flex-shrink-0"
                            alt={(t as any)[service.key] || service.key}
                            width={40}
                            height={40}
                          />
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis tracking-[0.3px]">
                            {(t as any)[service.key] || service.key}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Full Swiper for Client */
                <Swiper
                  modules={[Navigation, Autoplay]}
                  navigation={{
                    prevEl: '.custom-swiper-prev',
                    nextEl: '.custom-swiper-next',
                  }}
                  spaceBetween={10}
                  slidesPerView={2}
                  grabCursor={true}
                  loop={SERVICES_DATA_KEYS.length > 5}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    640: { slidesPerView: 3, spaceBetween: 15 },
                    768: { slidesPerView: 4, spaceBetween: 20 },
                    1024: { slidesPerView: 5, spaceBetween: 25 },
                  }}
                  className="w-full relative"
                >
                  {SERVICES_DATA_KEYS.map((service) => (
                    <SwiperSlide key={service.id}>
                      <div className="flex justify-center w-full p-[2px] sm:p-[5px]">
                        <a
                          href={service.href}
                          onClick={(e) => {
                            if (service.isInternal && (service.href as any) !== "#") {
                              e.preventDefault();
                              router.push(service.href);
                            }
                          }}
                          className="flex items-center justify-center bg-[#301118] border border-[#fd9d69] px-2 sm:px-3 py-1.5 sm:py-[10px] rounded-lg sm:rounded-xl text-white w-full h-[40px] sm:h-[52px] transition-all duration-300 hover:bg-[#4a1923] hover:border-white hover:-translate-y-0.5 hover:shadow-lg no-underline cursor-pointer"
                        >
                          <NextImage
                            src={`/${service.icon}`}
                            className="w-[20px] sm:w-[30px] mr-1 flex-shrink-0"
                            alt={(t as any)[service.key] || service.key}
                            width={40}
                            height={40}
                          />
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis tracking-[0.3px] text-[10px] sm:text-sm font-bold sm:font-semibold">
                            {(t as any)[service.key] || service.key}
                          </span>
                        </a>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            <div className="custom-swiper-next flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#ce4c04] cursor-pointer transition-all duration-300 shadow-md hover:bg-[#301118] hover:text-white hover:scale-110">
              <i className="fa-solid fa-chevron-right text-xs" />
            </div>
          </div>
        </div>
      </header>

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
            <CloseButton 
              onClick={() => setShowImageModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 10,
              }}
            />
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
            .close-modal-btn:hover {
              transform: rotate(90deg) scale(1.1);
              background-color: #301118 !important;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Header;



