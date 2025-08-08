"use client";
import React from "react";

const Header: React.FC = () => {
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
                    <a href="#" className="cart-top">
                      <i className="fa-solid fa-cart-shopping"></i> Cart
                      <span className="value">10</span>
                    </a>
                  </div>
                  <div className="col-5 mobile-space">
                    <div className="account-dropdown">
                      <button className="account-btn" id="accountToggle">
                        <i className="fa-solid fa-user"></i> Account
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
      </header>

      <header className="main-head">
        <div className="container">
          <div className="row align">
            <div className="col-lg-9 col-md-7">
              <nav className="navbar navbar-expand-lg navbar-light">
                <a className="navbar-brand" href="#">
                  <img
                    src="images/logo.png"
                    alt="logo"
                    className="logo logo-dask"
                  />
                  <img
                    src="images/logo2.png"
                    alt="logo"
                    className="logo logo-mobile"
                  />
                </a>
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
                  <ul className="navbar-nav ms-auto top-menu-main">
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Home
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Daily Horoscope
                      </a>
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
                          <a className="dropdown-item" href="#">
                            Horoscope
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Kundali Matching
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Nakshatra Milan
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Kundali Matching By Name
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Mangal Dosha
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Kaal Sarp Dosh
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Love Calculator
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Sun Sign
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Moon Sign
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Nakshatra
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Buy Products
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Free Services
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Online Puja
                          </a>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        {" "}
                        Blog
                      </a>
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
            <div className="col-lg-3 col-md-5 mobile-none">
              <a href="#" className="btn-link">
                <img src="images/chat.svg" className="chat-icon" /> Chat With
                Astrologer
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
