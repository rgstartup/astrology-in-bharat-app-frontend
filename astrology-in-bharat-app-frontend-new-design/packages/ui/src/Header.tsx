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
       <div className="col-lg-8 col-md-6">
         <p className="top-text">Connect with Verified Astrology Experts for Online Predictions.</p>      
       </div>
       <div className="col-lg-4 col-md-6">
         <div className="right-part-top">
           <div className="row align list-top-bar-mobile">
             <div className="col-4 mobile-space"> 
                <div className="account-dropdown w-100">
                <button className="account-btn w-100" id="accountToggle">
                  <i className="fa-solid fa-globe"></i> Eng <i className="fa-solid fa-angle-down"></i>
                </button>
                <div className="account-menu" id="accountMenu">
                  <a href="#">English</a>
                    <a href="#">हिंदी</a>
                </div>
              </div>
             </div>

             <div className="col-3 mobile-space text-center">
               <a href="#" className="cart-top"><i className="fa-solid fa-cart-shopping"></i> Cart <span className="value">10</span></a>
             </div>
             <div className="col-5 mobile-space">
               <div className="account-dropdown w-100">
                <div className="account-dropdown w-100">
                  <button className="account-btn w-100" id="accountToggle">
                    <i className="fa-solid fa-user"></i> Account <i className="fa-solid fa-angle-down"></i>
                  </button>
                  <div className="account-menu" id="accountMenu">
                    <a href="#">Sign In</a>
                    <a href="#">Register</a>
                  </div>
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
            <a className="navbar-brand" href="#"> 
              <img src="images/web-logo.png" alt="logo" className="logo  "/>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto  top-menu-main">
                 <li className="nav-item">
                  <a className="nav-link" href="#">Home</a>
                </li> 
                <li className="nav-item">
                  <a className="nav-link" href="#">Daily Horoscope</a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Astrology Consult
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="#">Horoscope</a></li>
                    <li><a className="dropdown-item" href="#">Kundali Matching</a></li> 
                    <li><a className="dropdown-item" href="#">Nakshatra Milan</a></li>
                    <li><a className="dropdown-item" href="#">Kundali Matching By Name</a></li>
                    <li><a className="dropdown-item" href="#">Mangal Dosha</a></li>
                    <li><a className="dropdown-item" href="#">Kaal Sarp Dosh</a></li>
                    <li><a className="dropdown-item" href="#">Love Calculator</a></li>
                    <li><a className="dropdown-item" href="#">Sun Sign</a></li>
                    <li><a className="dropdown-item" href="#">Moon Sign</a></li>
                    <li><a className="dropdown-item" href="#">Nakshatra</a></li> 
                    <li><a className="dropdown-item" href="#">Buy Products</a></li> 
                    <li><a className="dropdown-item" href="#">Free Services</a></li> 
                    <li><a className="dropdown-item" href="#">Online Puja</a></li> 
                  </ul>
                </li>
                 
                 <li className="nav-item">
                  <a className="nav-link" href="#">  Blog</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Kundli Prediction </a>
                </li>
              </ul> 
            </div> 
        </nav>
       </div> 
       <div className="col-lg-2 col-md-5 mobile-none">
         <a href="#" className="btn-link"><img src="images/chat.svg" className="chat-icon" /> Ask Astrologer</a>
       </div>
     </div>
  </div>
</header>

<header className="services-list-card">
  <div className="container">
    <div className="row">
      <div className="col-lg-2 col-md-4 col-6">
        <div className="flx-icon">
          <img src="images/top-icon1.png" className="icon-top-flx"/>
          <span>My Kundli</span>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-6">
        <div className="flx-icon">
          <img src="images/top-icon2.png" className="icon-top-flx"/>
          <span>Numerology </span>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-6">
        <div className="flx-icon">
          <img src="images/top-icon3.png" className="icon-top-flx"/>
          <span>Online Puja</span>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-6">
        <div className="flx-icon">
          <img src="images/top-icon4.png" className="icon-top-flx"/>
          <span>Life Horoscope</span>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-6">
        <div className="flx-icon">
          <img src="images/top-icon5.png" className="icon-top-flx"/>
          <span>Love Report</span>
        </div>
      </div>
      <div className="col-lg-2 col-md-4 col-6">
        <div className="flx-icon">
          <img src="images/top-icon6.png" className="icon-top-flx"/>
          <span>Match Analysis</span>
        </div>
      </div>

    </div>
  </div>
</header>
    </>
  );
};

export default Header;