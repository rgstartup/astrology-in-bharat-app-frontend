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
}

const Header: React.FC<HeaderProps> = ({ authState, userData, logoutHandler, balance }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFullBalance, setShowFullBalance] = useState(false);

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

  const { cartCount } = useCart();



  // Prioritize props if available, otherwise use context
  const isAuthenticated = authState ?? contextIsAuthenticated;
  const clientUser = userData ?? contextUser;
  const currentBalance = balance ?? clientBalance;

  const clientLogout = async () => {
    if (logoutHandler) {
      logoutHandler();
    } else {
      await contextLogout();
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Refresh auth when window gains focus (e.g., after login in another tab)
  useEffect(() => {
    if (!isClient) return;

    const handleFocus = () => {
      console.log("🔄 Window focused, refreshing auth...");
      refreshAuth();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isClient, refreshAuth]);

  // Refresh auth when pathname changes (e.g., after profile update)
  useEffect(() => {
    if (isClient && isAuthenticated) {
      console.log("🔄 Pathname changed, refreshing auth...");
      refreshAuth();
    }
  }, [pathname, isClient]);

  // API functions for notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const { apiClient } = require("./context/ClientAuthContext");
      const res = await apiClient.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { apiClient } = require("./context/ClientAuthContext");
      const res = await apiClient.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
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
    };

    if (showLanguageDropdown || showProfileDropdown || showNotificationDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showLanguageDropdown, showProfileDropdown, showNotificationDropdown]);

  return (
    <>
      <header className="bg-[#301118] text-white py-2 px-4 shadow-sm relative z-[1001]">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-6">
              <p className="top-text mb-0 text-white">
                Connect with Verified Astrology Experts for Online Predictions.
              </p>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="right-part-top">
                <div className="row align-items-center list-top-bar-mobile">
                  <div className="col-4 mobile-space">
                    {isAuthenticated && (
                      <div
                        onMouseEnter={() => setShowFullBalance(true)}
                        onMouseLeave={() => setShowFullBalance(false)}
                        className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-help whitespace-nowrap bg-primary hover:bg-primary-hover shadow-lg"
                        style={{
                          minWidth: '85px',
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
                    {/* Language Dropdown Commented Out
                    <div
                      className={`account-dropdown language-dropdown-container w-100 ${showLanguageDropdown ? "show" : ""}`}
                    >
                      <button
                        className="account-btn w-100"
                        onClick={() =>
                          setShowLanguageDropdown(!showLanguageDropdown)
                        }
                      >
                        <i className="fa-solid fa-globe"></i> Eng{" "}
                        <i className="fa-solid fa-angle-down"></i>
                      </button>
                      <div className="account-menu" style={{ zIndex: 60 }}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowLanguageDropdown(false);
                          }}
                        >
                          English
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowLanguageDropdown(false);
                          }}
                        >
                          हिंदी
                        </a>
                      </div>
                    </div>
                    */}
                  </div>
                  <div className="col-8 mobile-space">
                    <div className="d-flex gap-4 w-100 justify-content-end align-items-center">
                      {isAuthenticated ? (
                        <div className="d-flex gap-4 align-items-center justify-content-end">

                          {/* Cart Icon */}
                          <Link href={PATHS.CART} className="cart-top position-relative">
                            <i className="fa-solid fa-cart-shopping text-white text-xl"></i>
                            {cartCount > 0 && (
                              <span
                                className="position-absolute translate-middle badge rounded-pill bg-danger"
                                style={{
                                  top: '0px',
                                  left: '25px',
                                  fontSize: '10px',
                                  padding: '0.25em 0.6em'
                                }}
                              >
                                {cartCount}
                              </span>
                            )}
                          </Link>

                          {/* Notification Bell */}
                          <div className="notification-dropdown-container position-relative">
                            <div
                              className="cursor-pointer"
                              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                            >
                              <i className="fa-solid fa-bell text-white text-xl"></i>
                              {unreadCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px', padding: '0.25em 0.5em', marginTop: '-5px' }}>
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
                            <div
                              className="d-flex align-items-center gap-2 cursor-pointer"
                              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            >
                              <div style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "2px solid var(--primary-color, black)",
                                padding: "2px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}>
                                <NextImage
                                  src={clientUser?.avatar || "/images/aa.webp"}
                                  alt="Profile"
                                  width={35}
                                  height={35}
                                  className="object-cover w-100 h-100 rounded-circle"
                                />
                              </div>
                              <i className="fa-solid fa-ellipsis-vertical text-white" style={{ fontSize: '18px' }}></i>
                            </div>

                            {showProfileDropdown && (
                              <div
                                className="position-absolute bg-white shadow-lg rounded-3 overflow-hidden"
                                style={{
                                  top: "120%",
                                  right: "0",
                                  minWidth: "180px",
                                  zIndex: 1000,
                                  border: "1px solid #eee"
                                }}
                              >
                                <div className="px-3 py-2 border-bottom bg-light">
                                  <p className="mb-0 fw-bold text-dark small">{clientUser?.name || 'User'}</p>
                                  <p className="mb-0 text-muted" style={{ fontSize: '10px' }}>{clientUser?.phone || ''}</p>
                                </div>

                                <Link
                                  href={PATHS.PROFILE}
                                  className="d-block px-3 py-2 text-decoration-none text-dark hover-bg-light transition-all d-flex align-items-center gap-2"
                                  onClick={() => setShowProfileDropdown(false)}
                                  style={{ fontSize: '14px' }}
                                >
                                  <i className="fa-solid fa-user text-orange-500 w-5"></i>
                                  My Profile
                                </Link>

                                <button
                                  onClick={() => {
                                    setShowProfileDropdown(false);
                                    handleLogout();
                                  }}
                                  className="w-100 text-start border-0 bg-transparent px-3 py-2 text-danger hover-bg-light transition-all d-flex align-items-center gap-2"
                                  style={{ fontSize: '14px' }}
                                >
                                  <i className="fa-solid fa-right-from-bracket w-5"></i>
                                  Logout
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex gap-3">
                          <a
                            href={PATHS.SIGN_IN}
                            style={{
                              backgroundColor: "var(--primary-color, black)",
                              color: "white",
                              borderRadius: "5px",
                              padding: "6px 15px",
                              textDecoration: "none",
                              fontSize: "14px",
                              fontWeight: "600",
                              display: "inline-block"
                            }}
                          >
                            SignIn
                          </a>

                          <a
                            href={PATHS.REGISTER}
                            style={{
                              backgroundColor: "var(--primary-color, black)",
                              color: "white",
                              borderRadius: "5px",
                              padding: "6px 15px",
                              textDecoration: "none",
                              fontSize: "14px",
                              fontWeight: "600",
                              display: "inline-block"
                            }}
                          >
                            Register
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
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
                  className="navbar-toggler"
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className={`d-none d-lg-flex align-items-center justify-content-center flex-grow-1 ${isMenuOpen ? "d-block position-absolute bg-white w-100 start-0 top-100 shadow-sm p-3" : ""}`}
                  id="navbarSupportedContent"
                  style={{ zIndex: 1000 }}
                >
                  <ul
                    className="navbar-nav mx-auto top-menu-main d-flex flex-row align-items-center gap-2 gap-xl-4"
                  >
                    <li className="nav-item">
                      <Link className="nav-link" href="/">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" href={PATHS.HOROSCOPE}>
                        Daily Horoscope
                      </Link>
                    </li>
                    <li className="nav-item dropdown">
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
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.HOROSCOPE}
                          >
                            Horoscope
                          </Link>
                        </li>


                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.LOVE_CALCULATOR}
                          >
                            Love Calculator
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.DAHEJ_CALCULATOR}
                          >
                            Dahej Calculator
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.FLAMES_CALCULATOR}
                          >
                            Flames Calculator
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href={PATHS.LOVE_COMPATIBILITY_CALCULATOR}>
                            Love Compatibility Calculator
                          </Link>
                        </li>

                        <li>
                          <Link className="dropdown-item" href={PATHS.MARRIAGE_AGE_CALCULATOR}>
                            Marriage Age Calculator
                          </Link>
                        </li>

                        <li>
                          <Link className="dropdown-item" href={PATHS.SOULMATE_NAME_INITALS_CALCULATOR}>
                            Soulmate Name Initials Calculator
                          </Link>
                        </li>

                        <li>
                          <Link className="dropdown-item" href={PATHS.LUCKY_NUMBER_CALCULATOR}>
                            Lucky Number & Colour Calculator
                          </Link>
                        </li>



                        <li>
                          <Link className="dropdown-item" href={PATHS.LIFE_PATH_CALCULATOR}>
                            Life Path Calculator
                          </Link>
                        </li>

                        <li>
                          <Link className="dropdown-item" href={PATHS.NAME_NUMEROLOGY_CALCULATOR}>
                            Name Numerology Calculator
                          </Link>
                        </li>

                        <li>
                          <Link className="dropdown-item" href={PATHS.ZODIAC_SIGN_CALCULATOR}>
                            Zodiac Sign Compatibility Calculator
                          </Link>
                        </li>

                        <li>
                          <Link className="dropdown-item" href={PATHS.NAKSHATRA_FINDER}>
                            Nakshatra Finder
                          </Link>
                        </li>

                        <li>
                          <Link className="dropdown-item" href={PATHS.LOYAL_PARTNER_CALCULATOR}>
                            Loyal Partner Calculator
                          </Link>
                        </li>

                        <li>
                          <Link className="dropdown-item" href={PATHS.BREAKUP_PATCHUP_CALCULATOR}>
                            Breakup Patchup Calculator
                          </Link>
                        </li>





                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.ONLINE_PUJA}
                          >
                            Online Puja
                          </Link>
                        </li>
                      </ul>
                    </li>

                    {/* <li className="nav-item">
                      <Link className="nav-link" href={PATHS.BLOG}>
                        Blog
                      </Link>
                    </li> */}
                    <li className="nav-item">
                      <Link className="nav-link" href={PATHS.FAMOUS_PLACES}>
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
                className="btn-ask-expert"
                style={{
                  backgroundColor: "var(--primary-color, black)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "14px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
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

      {isClient && (
        <header className="services-list-card" style={{ backgroundColor: "var(--primary-color, black)" }}>
          <div className="container position-relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={25}
              slidesPerView={2}
              grabCursor={true}
              loop={SERVICES_DATA.length >= 4}
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
      )}
    </>
  );
};

export default Header;



