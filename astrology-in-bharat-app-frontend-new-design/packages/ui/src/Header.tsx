"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import LinkComponent from "next/link";
import Image from "next/image";
import { PATHS } from "@repo/routes";

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

// Custom Navigation Buttons Component
const SwiperNavButtons = () => {
  const swiper = useSwiper();
  return (
    <>
      <div className="swiper-nav-prev" onClick={() => swiper.slidePrev()}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>
      <div className="swiper-nav-next" onClick={() => swiper.slideNext()}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </>
  );
};

// Swiper styles are imported in the root layout.tsx to avoid resolution issues in the shared package.
const SERVICES_DATA = [
  {
    id: 1,
    label: "My Kundli",
    icon: "images/top-icon1.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
  {
    id: 2,
    label: "Numerology",
    icon: "images/top-icon2.png",
    href: "#",
    isInternal: false,
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
    label: "Life Horoscope",
    icon: "images/top-icon4.png",
    href: "#",
    isInternal: false,
  },
  {
    id: 5,
    label: "Love Report",
    icon: "images/top-icon5.png",
    href: "#",
    isInternal: false,
  },
  {
    id: 6,
    label: "Match Analysis",
    icon: "images/top-icon6.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
  {
    id: 7,
    label: "Match Analysis",
    icon: "images/top-icon6.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
  {
    id: 8,
    label: "Match Analysis",
    icon: "images/top-icon6.png",
    href: PATHS.KUNDALI_MATCHING,
    isInternal: true,
  },
];

interface UserProfile {
  id: number;
  date_of_birth?: string;
  gender?: string;
  preferences?: string;
  addresses?: any[];
  createdAt?: string;
  updatedAt?: string;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

interface HeaderProps {
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userProfile?: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({
  onLogout,
  isAuthenticated: propIsAuthenticated,
  userProfile: propUserProfile
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(propIsAuthenticated || false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(propUserProfile || null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [loading, setLoading] = useState(!propIsAuthenticated);

  // Sync internal state with props if they change
  useEffect(() => {
    if (propIsAuthenticated !== undefined) {
      setIsAuthenticated(propIsAuthenticated);
    }
  }, [propIsAuthenticated]);

  useEffect(() => {
    if (propUserProfile !== undefined) {
      setUserProfile(propUserProfile);
    }
  }, [propUserProfile]);

  // Use useEffect to ensure this part only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user is authenticated by fetching profile
  const checkAuthentication = useCallback(async () => {
    // If we already have authentication information from props, don't fetch again unless explicitly needed
    if (propIsAuthenticated !== undefined && propUserProfile !== undefined) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const response = await axios.get(
        `${apiUrl}/client/profile`,
        {
          withCredentials: true,
        }
      );

      // If profile exists (has an id), user is authenticated
      if (response.data && response.data.id) {
        setUserProfile(response.data);
        setIsAuthenticated(true);

        console.log("Profile data:", response.data);
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication on mount and when pathname changes
  useEffect(() => {
    if (isClient) {
      console.log("🔄 Checking authentication - Pathname:", pathname);
      checkAuthentication();
    }
  }, [isClient, pathname, checkAuthentication]);

  // Log profile state changes
  useEffect(() => { }, [isAuthenticated, userProfile, loading]);

  // Also check authentication when window regains focus (e.g., after login in another tab)
  useEffect(() => {
    if (!isClient) return;

    const handleFocus = () => {
      checkAuthentication();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isClient, checkAuthentication]);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call external logout if provided (e.g. from AuthContext)
      if (onLogout) {
        onLogout();
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      // Try to call logout endpoint
      await axios.post(
        `${apiUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      // Even if logout endpoint fails, clear local state
      console.log("Logout endpoint error:", error);
    } finally {
      // Manually clear all possible auth cookies
      const cookiesToClear = ['access_token', 'accessToken', 'refreshToken'];
      cookiesToClear.forEach(name => {
        document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      });

      // Clear authentication state in Header
      setIsAuthenticated(false);
      setUserProfile(null);
      setShowProfileDropdown(false);
      setShowAccountDropdown(false);

      // Redirect to home page
      router.push("/");

      // Reload to ensure clean state across the app
      window.location.reload();
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
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

      // Profile dropdown
      if (
        !target.closest(".profile-dropdown-container") &&
        !target.closest("#profileToggle")
      ) {
        setShowProfileDropdown(false);
      }

      // Account dropdown
      if (!target.closest(".account-dropdown-container")) {
        setShowAccountDropdown(false);
      }

      // Language dropdown
      if (!target.closest(".language-dropdown-container")) {
        setShowLanguageDropdown(false);
      }
    };

    if (showProfileDropdown || showAccountDropdown || showLanguageDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showProfileDropdown, showAccountDropdown, showLanguageDropdown]);

  return (
    <>
      <header className="top-head">
        <div className="container">
          <div className="row align">
            <div className="col-lg-8 col-md-6">
              <p className="top-text">
                Connect with Verified Astrology Experts for Online Predictions.
              </p>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="right-part-top">
                <div className="row align list-top-bar-mobile">
                  <div className="col-4 mobile-space">
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
                  </div>

                  <div className="col-3 mobile-space text-center">
                    <Link href={PATHS.CART} className="cart-top">
                      <i className="fa-solid fa-cart-shopping"></i> Cart{" "}
                      <span className="value">4</span>
                    </Link>
                  </div>
                  <div className="col-5 mobile-space">
                    <div
                      className={`account-dropdown account-dropdown-container w-100 ${showAccountDropdown ? "show" : ""}`}
                    >
                      <button
                        className="account-btn w-100"
                        onClick={() =>
                          setShowAccountDropdown(!showAccountDropdown)
                        }
                      >
                        <i className="fa-solid fa-user"></i> Account{" "}
                        <i className="fa-solid fa-angle-down"></i>
                      </button>
                      <div className="account-menu" style={{ zIndex: 60 }}>
                        {isAuthenticated ? (
                          <>
                            <Link
                              href={PATHS.PROFILE}
                              onClick={() => setShowAccountDropdown(false)}
                            >
                              My Profile
                            </Link>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                              }}
                            >
                              Logout
                            </a>
                          </>
                        ) : (
                          <>
                            <Link
                              href={PATHS.SIGN_IN}
                              className="register-sign-in-btn"
                              onClick={() => setShowAccountDropdown(false)}
                            >
                              Sign In
                            </Link>
                            <Link
                              href={PATHS.REGISTER}
                              className="register-sign-in-btn"
                              onClick={() => setShowAccountDropdown(false)}
                            >
                              Register
                            </Link>
                          </>
                        )}
                      </div>
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
          <div className="row align">
            <div className="col-lg-10 col-md-7">
              <nav className="navbar navbar-expand-lg navbar-light ">
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
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav ms-auto  top-menu-main">
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
                            href={PATHS.KUNDALI_MATCHING}
                          >
                            Kundali Matching
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.NAKSHATRA_MILAN}
                          >
                            Nakshatra Milan
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.KUNDALI_MATCHING_BY_NAME}
                          >
                            Kundali Matching By Name
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.MANGAL_DOSHA}
                          >
                            Mangal Dosha
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.KAAL_SARP_DOSH}
                          >
                            Kaal Sarp Dosh
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
                          <Link className="dropdown-item" href={PATHS.SUN_SIGN}>
                            Sun Sign
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.MOON_SIGN}
                          >
                            Moon Sign
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.NAKSHATRA}
                          >
                            Nakshatra
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.BUY_PRODUCTS}
                          >
                            Buy Products
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href={PATHS.FREE_SERVICES}
                          >
                            Free Services
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

                    <li className="nav-item">
                      <Link className="nav-link" href={PATHS.BLOG}>
                        Blog
                      </Link>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Kundli Prediction{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
            <div className="col-lg-2 col-md-5 mobile-none">
              <Link href="/our-astrologers" className="btn-link">
                <NextImage
                  src="/images/chat.svg"
                  className="chat-icon"
                  alt="chat"
                  width={24}
                  height={24}
                />{" "}
                Ask Astrologer
              </Link>
            </div>
          </div>
        </div>
      </header>

      {isClient && (
        <header className="services-list-card">
          <div className="container position-relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={15}
              slidesPerView={2}
              grabCursor={true}
              loop={true}
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
                  slidesPerView: 6,
                },
              }}
              className="services-swiper"
            >
              <SwiperNavButtons />

              {SERVICES_DATA.map((service) => (
                <SwiperSlide key={service.id}>
                  <div className="flx-icon-item">
                    {service.isInternal ? (
                      <Link
                        href={service.href}
                        className="flx-icon text-decoration-none text-dark"
                      >
                        <NextImage
                          src={`/${service.icon}`}
                          className="icon-top-flx"
                          alt={service.label}
                          width={40}
                          height={40}
                        />
                        <span>{service.label}</span>
                      </Link>
                    ) : (
                      <a
                        href={service.href}
                        className="flx-icon text-decoration-none text-dark"
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
                    )}
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
