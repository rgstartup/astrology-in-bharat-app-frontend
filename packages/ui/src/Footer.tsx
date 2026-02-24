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
              {/* sdklfja */}
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
              <h4 className="aib-footer-title text-orange-600">Free Calculator</h4>
              <ul className="aib-footer-links">
                <li>
                  <Link href={PATHS.MARRIAGE_AGE_CALCULATOR}>Marriage Age </Link>
                </li>
                <li>
                  <Link href={PATHS.DAHEJ_CALCULATOR}>Dahej Calculator</Link>
                </li>
                <li>
                  <Link href={PATHS.LOVE_COMPATIBILITY_CALCULATOR}>Love Compatibility </Link>
                </li>
                <li>
                  <Link href={PATHS.LUCKY_NUMBER_CALCULATOR}>Lucky Number  </Link>
                </li>
                <li>
                  <Link href={PATHS.LIFE_PATH_CALCULATOR}>Life Path  </Link>
                </li>
                <li>
                  <Link href={PATHS.NAKSHATRA_FINDER}>Nakshatra Finder  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6">
              <h4 className="aib-footer-title text-orange-600">Astrology Services</h4>
              <ul className="aib-footer-links">
                <li>
                  <Link href={PATHS.ONLINE_PUJA}>Online Puja</Link>
                </li>
                <li>
                  <a href="/our-astrologers">Talk to Astrologer</a>
                </li>
                <li>
                  <a href="#">Video Consultation</a>
                </li>
                <li>
                  <Link href={PATHS.KUNDALI_MATCHING}>Kundli Matching</Link>
                </li>
                <li>
                  <Link href={PATHS.KUNDALI_MATCHING}>Kundli Prediction</Link>
                </li>
                <li>
                  <a href="/calculator/name-numerology">Numerology  Report</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6">
              <h4 className="aib-footer-title text-orange-600 ">Important Links</h4>
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
              <h4 className="aib-footer-title text-orange-600">Helpful Info</h4>
              <ul className="aib-footer-links">
                <li>
                  <Link href={PATHS.REFUND_POLICY}>Refund Policy</Link>
                </li>
                <li>
                  <Link href={PATHS.PRIVACY_POLICY}>Privacy Policy</Link>
                </li>
                <li>
                  <Link href={PATHS.TERMS_AND_CONDITIONS}>Terms & Conditions</Link>
                </li>
                <li>
                  <Link href={PATHS.COPYRIGHT}>Copyright Notice</Link>
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



