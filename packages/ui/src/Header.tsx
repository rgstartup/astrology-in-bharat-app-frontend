"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

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

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showAstrologer, setShowAstrologer] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use useEffect to ensure this part only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user is authenticated by fetching profile
  const checkAuthentication = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/client/profile",
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
  useEffect(() => {
    
    
  }, [isAuthenticated, userProfile, loading]);

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
      // Try to call logout endpoint (adjust endpoint if different)
      await axios.post(
        "http://localhost:4000/api/v1/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      // Even if logout endpoint fails, clear local state
      console.log("Logout endpoint error:", error);
    } finally {
      // Clear authentication state
      setIsAuthenticated(false);
      setUserProfile(null);
      setShowProfileDropdown(false);
      // Redirect to home page
      router.push("/");
      // Reload to ensure clean state
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
      if (
        !target.closest(".profile-dropdown-container") &&
        !target.closest("#profileToggle")
      ) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showProfileDropdown]);

  return (
    <>
      <header className="top-head">
        <div className="container">
          <div className="row align">
            <div className="col-lg-2 col-md-12"></div>
            <div className="col-lg-6 col-md-6">
              <p className="top-text">
                Connect with Verified Astrology Experts for Online Predictions.
              </p>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="right-part-top">
                <div className="row align list-top-bar-mobile">
                  <div className="col-4 mobile-space">
                    <div className="lang-dropdown">
                      <button className="lang-toggle">
                        <i className="fa-solid fa-globe"></i> Eng
                        <i className="fa-solid fa-angle-down"></i>
                      </button>
                      <div className="lang-menu">
                        <a href="#">English</a>
                        <a href="#">हिंदी</a>
                      </div>
                    </div>
                  </div>

                  <div className="col-3 mobile-space text-center">
                    <Link href="/cart" className="cart-top">
                      <i className="fa-solid fa-cart-shopping"></i> Cart
                      <span className="value">4</span>
                    </Link>
                  </div>


                  <div className="col-5 mobile-space">
                    {isClient && (
                      <>
                        {loading ? (
                          <div style={{ padding: "6px 12px", fontSize: "14px" }}>
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          </div>
                        ) : isAuthenticated ? (
                          <div className="profile-dropdown-container" style={{ position: "relative" }}>
                            <button
                              className="account-btn"
                              id="profileToggle"
                              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "6px 12px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                              }}
                            >
                              {userProfile?.user?.avatar ? (
                                <img
                                  src={userProfile.user.avatar}
                                  alt={userProfile.user.name || "User"}
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(45deg, #daa23e, #e0a800)",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                  }}
                                >
                                  <i className="fa-solid fa-user"></i>
                                </div>
                              )}
                              <span style={{ fontSize: "14px" }}>
                                {userProfile?.user?.name?.split(" ")[0] || "Profile"}
                              </span>
                              <i className="fa-solid fa-angle-down"></i>
                            </button>
                            {showProfileDropdown && (
                              <div
                                className="lang-menu"
                                id="profileMenu"
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: "100%",
                                  marginTop: "8px",
                                  minWidth: "180px",
                                  zIndex: 1000,
                                  background: "white",
                                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                  borderRadius: "8px",
                                  padding: "8px 0",
                                }}
                              >
                                <Link
                                  href="/settings"
                                  onClick={() => setShowProfileDropdown(false)}
                                  style={{
                                    display: "block",
                                    padding: "10px 20px",
                                    color: "#333",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                  }}
                                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                                  }}
                                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  <i className="fa-solid fa-user-edit me-2" style={{ color: "#daa23e" }}></i>
                                  Edit Profile
                                </Link>
                                <Link
                                  href="/session-history"
                                  onClick={() => setShowProfileDropdown(false)}
                                  style={{
                                    display: "block",
                                    padding: "10px 20px",
                                    color: "#333",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                  }}
                                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                                  }}
                                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  <i className="fa-solid fa-clock-rotate-left me-2" style={{ color: "#daa23e" }}></i>
                                  My Sessions
                                </Link>
                                <button
                                  onClick={handleLogout}
                                  style={{
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "10px 20px",
                                    border: "none",
                                    background: "transparent",
                                    color: "#dc3545",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                  }}
                                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                                  }}
                                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  <i className="fa-solid fa-sign-out-alt me-2"></i>
                                  Logout
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="lang-dropdown">
                            <button className="account-btn" id="accountToggle">
                              <i className="fa-solid fa-user"></i> Account
                              <i className="fa-solid fa-angle-down"></i>
                            </button>
                            <div className="lang-menu" id="accountMenu">
                              <Link href="/sign-in">Sign In</Link>
                              <Link href="/register">Register</Link>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navbar */}
      <header className="main-head border-bottom border-secondary-subtle">
        <Container>
          <div className="row align">
            <div className="col-lg-9 col-md-7">
              <Navbar expand="lg" className="navbar-light">
                <Navbar.Brand href="#">
                  <img
                    src="/images/logo.png"
                    alt="logo"
                    className="logo logo-dask"
                  />
                  <img
                    src="/images/logo2.png"
                    alt="logo"
                    className="logo logo-mobile"
                  />
                </Navbar.Brand>
                {/* Conditionally render the Navbar.Toggle to fix the hydration error */}
                {isClient && <Navbar.Toggle aria-controls="navbarSupportedContent" />}
                <Navbar.Collapse id="navbarSupportedContent">
                  <Nav className="ms-auto top-menu-main">
                    <Nav.Link as={Link} href="/">Home</Nav.Link>
                    <Nav.Link as={Link} href="/our-astrologers">Our Astrologers</Nav.Link>

                    {/* DROPDOWN ON HOVER */}
                    <NavDropdown
                      title="Our Services"
                      id="navbarDropdown"
                      show={showAstrologer}
                      onMouseEnter={() => setShowAstrologer(true)}
                      onMouseLeave={() => setShowAstrologer(false)}
                    >
                      <NavDropdown.Item href="#">Horoscope</NavDropdown.Item>
                      <NavDropdown.Item href="#">Kundali Matching</NavDropdown.Item>
                      <NavDropdown.Item href="#">Nakshatra Milan</NavDropdown.Item>
                      <NavDropdown.Item href="#">Kundali Matching By Name</NavDropdown.Item>
                      <NavDropdown.Item href="#">Mangal Dosha</NavDropdown.Item>
                      <NavDropdown.Item href="#">Kaal Sarp Dosh</NavDropdown.Item>
                      <NavDropdown.Item href="#">Love Calculator</NavDropdown.Item>
                      <NavDropdown.Item href="#">Sun Sign</NavDropdown.Item>
                      <NavDropdown.Item href="#">Moon Sign</NavDropdown.Item>
                      <NavDropdown.Item href="#">Nakshatra</NavDropdown.Item>
                      <NavDropdown.Item href="#">Buy Products</NavDropdown.Item>
                      <NavDropdown.Item href="#">Free Services</NavDropdown.Item>
                      <NavDropdown.Item href="#">Online Puja</NavDropdown.Item>
                    </NavDropdown>

                    <Nav.Link href="#">Blog</Nav.Link>
                    <Nav.Link as={Link} href="/product">Products</Nav.Link>
                    <Nav.Link as={Link} href="/help">Help & Support</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </div>
            <div className="col-lg-3 col-md-5 mobile-none">
              <a href="#" className="btn-link">
                <img src="/images/chat.svg" className="chat-icon" /> Chat With
                Astrologer
              </a>
            </div>
          </div>
        </Container>
      </header>
    </>
  );
};

export default Header;