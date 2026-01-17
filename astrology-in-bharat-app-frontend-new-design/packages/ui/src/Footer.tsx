"use client";
import React from "react";
import Link from "next/link";
import { PATHS, URLS } from "@repo/routes";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="aib-footer-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <img
                src="/images/web-logo-white.png"
                alt="Astrology in Bharat Logo"
                className="web-logo-white mb-2 w-75"
              />
              <p className="aib-footer-text">
                Astrology in Bharat is India’s trusted astrology platform
                offering accurate guidance through verified astrologers using
                authentic Indian astrology systems.
              </p>
              <ul className="social-icons">
                <li>
                  <a href="#">
                    <i className="fa-brands fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa-brands fa-youtube"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa-brands fa-pinterest"></i>
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6">
              <h4 className="aib-footer-title">Horoscope</h4>
              <ul className="aib-footer-links">
                <li>
                  <Link href={PATHS.HOROSCOPE}>Daily Horoscope</Link>
                </li>
                <li>
                  <a href="#">Weekly Horoscope</a>
                </li>
                <li>
                  <a href="#">Monthly Horoscope</a>
                </li>
                <li>
                  <a href="#">Yearly Horoscope</a>
                </li>
                <li>
                  <a href="#">Zodiac Signs</a>
                </li>
                <li>
                  <a href="#">Love Horoscope</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6">
              <h4 className="aib-footer-title">Astrology Services</h4>
              <ul className="aib-footer-links">
                <li>
                  <a href="#">Chat with Astrologer</a>
                </li>
                <li>
                  <a href="#">Talk to Astrologer</a>
                </li>
                <li>
                  <a href="#">Video Consultation</a>
                </li>
                <li>
                  <Link href={PATHS.KUNDALI_MATCHING}>Kundli Matching</Link>
                </li>
                <li>
                  <a href="#">Kundli Prediction</a>
                </li>
                <li>
                  <a href="#">Numerology Report</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6">
              <h4 className="aib-footer-title">Important Links</h4>
              <ul className="aib-footer-links">
                <li>
                  <a href="#">Astrologer Login</a>
                </li>
                <li>
                  <a href="#">Astrologer Registration</a>
                </li>
                <li>
                  <a href="#">Shubh Muhurat 2026</a>
                </li>
                <li>
                  <Link href={PATHS.BUY_PRODUCTS}>Shop Our Products</Link>
                </li>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6">
              <h4 className="aib-footer-title">Helpful Info</h4>
              <ul className="aib-footer-links">
                <li>
                  <a href="#">Refund Policy</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms & Conditions</a>
                </li>
                <li>
                  <a href="#">Copyright Notice</a>
                </li>
                <li>
                  <Link href={PATHS.HELP}>Help & Support</Link>
                </li>
                <li>
                  <Link href={PATHS.SESSION_HISTORY}>Seassion</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="aib-footer-bottom">
                © 2026 Astrology in Bharat (Powered by Astrology in Bharat
                Services). All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
