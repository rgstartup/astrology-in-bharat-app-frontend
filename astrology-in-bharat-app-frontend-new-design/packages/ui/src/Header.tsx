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
}

const Header: React.FC<HeaderProps> = ({ authState, userData, logoutHandler }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

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
  const clientLogout = async () => {
    if (logoutHandler) {
      logoutHandler();
    } else {
      await contextLogout();
    }
  };

  // Use useEffect to ensure this part only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug authentication state
  useEffect(() => {
    console.log("🔍 Header Auth Debug:", {
      isAuthenticated,
      loading,
      clientUser,
      isClient
    });
  }, [isAuthenticated, loading, clientUser, isClient]);

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
    };

    if (showLanguageDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showLanguageDropdown]);

  return (
    <>
      <header className="bg-[#301118] text-[#2b1b00] py-1 px-4">

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
                  <div className="col-6 mobile-space">
                    <div className="d-flex gap-2 w-100 justify-content-end me-lg-5">


                      {isAuthenticated ? (
                        <div className="col-8 mobile-space">
                          <div className="d-flex gap-2 align-items-center">
                            <Link href={PATHS.CART} className="cart-top position-relative">
                              <i className="fa-solid fa-cart-shopping" style={{ marginLeft: "20px" }}></i> {" "}
                              {cartCount > 0 && (
                                <span
                                  className="position-absolute translate-middle badge rounded-pill bg-danger"
                                  style={{
                                    top: '5px',
                                    left: '35px',
                                    fontSize: '10px',
                                    padding: '0.25em 0.6em'
                                  }}
                                >
                                  {cartCount}
                                </span>
                              )}
                            </Link>

                            <Link
                              href={PATHS.PROFILE}
                              className="d-flex align-items-center gap-2"
                              style={{
                                color: "white",
                                borderRadius: "50%",
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <div style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "1px solid white"
                              }}>
                                <NextImage
                                  src={clientUser?.avatar || "/images/aa.webp"}
                                  alt="Profile"
                                  width={24}
                                  height={24}
                                  className="object-cover w-100 h-100"
                                />
                              </div>
                            </Link>

                            <Link
                              href={PATHS.PROFILE}
                              style={{
                                backgroundColor: "#fa6310",
                                color: "white",
                                borderRadius: "5px",
                                padding: "5px 8px",
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                                fontWeight: "bold"
                              }}
                            >
                              <i className="fa-solid fa-user"></i> <span className="d-none d-md-inline">Profile</span>
                            </Link>

                            <button
                              onClick={handleLogout}
                              type="button"
                              style={{
                                backgroundColor: "#fa6310",
                                color: "white",
                                borderRadius: "5px",
                                padding: "5px 8px",
                                border: "none",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <i className="fa-solid fa-right-from-bracket"></i> <span className="d-none d-md-inline">Logout</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="col-8 mobile-space">
                          <div className="d-flex gap-4">
                            <Link
                              href={PATHS.SIGN_IN}
                              style={{
                                backgroundColor: "#fa6310",
                                color: "white",
                                borderRadius: "5px",
                                padding: "5px 8px",
                                textDecoration: "none",
                                width: "100%",
                                textAlign: "center",
                              }}
                            >
                              SignIn
                            </Link>

                            <Link
                              href={PATHS.REGISTER}
                              style={{
                                backgroundColor: "#fa6310",
                                color: "white",
                                borderRadius: "5px",
                                padding: "5px 8px",
                                textDecoration: "none",
                                width: "100%",
                                textAlign: "center",
                              }}
                            >
                              Register
                            </Link>
                          </div>
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
                        {/* <li>
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
                        </li> */}
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
    Lucky Number Calculator
  </Link>
</li>

<li>
  <Link className="dropdown-item" href={PATHS.LUCKY_COLOR_CALCULATOR}>
    Lucky Color Calculator
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
  <Link className="dropdown-item" href={PATHS.WHO_LOVES_MORE_CALCULATOR}>
    Who Loves More Calculator
  </Link>
</li>

<li>
  <Link className="dropdown-item" href={PATHS.COMPATIBILITY_BY_ZODIAC_CALCULATOR}>
    Compatibility By Zodiac Calculator
  </Link>
</li>

                        {/* <li>
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
                        </li> */}
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
                      <Link className="nav-link" href={PATHS.FAMOUS_PLACES}>
                        Famous Places
                      </Link>
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
              spaceBetween={25}
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
