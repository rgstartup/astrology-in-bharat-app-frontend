"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";


const Header: React.FC = () => {
  const [showAstrologer, setShowAstrologer] = useState(false);
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
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
                <Navbar.Collapse id="navbarSupportedContent">
                  <Nav className="ms-auto top-menu-main">
                    <Nav.Link as={Link} href="/">Home</Nav.Link>
                    <Nav.Link href="/our-astrologers">Our Astrologers</Nav.Link>

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
