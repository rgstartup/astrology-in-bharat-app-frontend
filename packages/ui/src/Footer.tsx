"use client";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer-premium">
      <div className="container">
        {/* Newsletter Section - Floating Card */}
        <div className="newsletter-box">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <h3 className="fw-bold text-white mb-1">
                Join Our Cosmic Community
              </h3>
              <p className="footer-desc mb-0">
                Subscribe for exclusive horoscopes, offers, and spiritual
                insights.
              </p>
            </div>
            <div className="col-lg-6">
              <form className="d-flex gap-2">
                <input
                  type="email"
                  className="input-premium"
                  placeholder="Enter your email address"
                />
                <button className="btn-premium-gold text-nowrap">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="footer-premium-top">
          <div className="row">
            {/* About Column */}
            <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
              <img
                src="/images/logo2.png"
                alt="Astrology in Bharat"
                className="footer-logo-premium"
              />
              <p className="footer-desc pr-lg-4">
                Your trusted guide for life&apos;s journey. Connect with
                verified astrologers for personalized insights on love, career,
                and wellness. Experience the wisdom of Vedic astrology blended
                with modern convenience.
              </p>

              <div className="social-icons-premium">
                <a href="#" className="social-icon-btn">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon-btn">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-icon-btn">
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a href="#" className="social-icon-btn">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
              <h5 className="footer-heading">Quick Links</h5>
              <ul className="list-unstyled footer-links">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Our Astrologers</a>
                </li>
                <li>
                  <a href="#">Services</a>
                </li>
                <li>
                  <a href="#">Astro Store</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <h5 className="footer-heading">Our Services</h5>
              <ul className="list-unstyled footer-links">
                <li>
                  <a href="#">Kundli Matching</a>
                </li>
                <li>
                  <a href="#">Career Prediction</a>
                </li>
                <li>
                  <a href="#">Love & Relationships</a>
                </li>
                <li>
                  <a href="#">Vastu Shastra</a>
                </li>
                <li>
                  <a href="#">Numerology</a>
                </li>
                <li>
                  <a href="#">Tarot Reading</a>
                </li>
              </ul>
            </div>

            {/* Contact / App */}
            <div className="col-lg-3 col-md-6">
              <h5 className="footer-heading">Get the App</h5>
              <p className="footer-desc mb-3">
                Experience seamless consultations on the go.
              </p>
              <div className="d-flex flex-column gap-2">
                <button className="btn btn-outline-light rounded-pill px-4 text-start">
                  <i className="fab fa-google-play me-2"></i> Google Play
                </button>
                <button className="btn btn-outline-light rounded-pill px-4 text-start">
                  <i className="fab fa-apple me-2"></i> App Store
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-4 border-top border-white-10">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              <p className="footer-desc mb-0 small">
                © {new Date().getFullYear()} Astrology In Bharat. All rights
                reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="d-inline-flex gap-3">
                <a href="#" className="footer-desc small">
                  Privacy Policy
                </a>
                <a href="#" className="footer-desc small">
                  Terms of Service
                </a>
                <a href="#" className="footer-desc small">
                  Refund Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
