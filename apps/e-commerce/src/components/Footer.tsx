import React from "react";

const Footer = () => {
  return (
    <footer className="bg-theme-brown text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-white/10">
          {/* Logo & About */}
          <div className="lg:col-span-1">
            <img
              src="/images/web-logo-white.png"
              alt="Astrology in Bharat"
              className="h-12 w-auto mb-6"
            />
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-outfit">
              Astrology in Bharat is India’s trusted astrology platform offering
              accurate guidance through verified astrologers using authentic
              Indian astrology systems.
            </p>
            <div className="flex gap-4">
              {[
                "fa-facebook",
                "fa-instagram",
                "fa-youtube",
                "fa-linkedin",
                "fa-pinterest",
              ].map((icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-theme-orange transition-colors duration-300"
                >
                  <i className={`fa-brands ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-xl font-bold mb-6 font-pl text-theme-orange">
              Horoscope
            </h4>
            <ul className="space-y-3 text-sm text-gray-300 font-outfit">
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Daily Horoscope
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Weekly Horoscope
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Monthly Horoscope
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Yearly Horoscope
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Zodiac Signs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Love Horoscope
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 font-pl text-theme-orange">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-gray-300 font-outfit">
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Chat with Astrologer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Talk to Astrologer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Video Consultation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Kundli Matching
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Kundli Prediction
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Numerology Report
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 font-pl text-theme-orange">
              Important Links
            </h4>
            <ul className="space-y-3 text-sm text-gray-300 font-outfit">
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Astrologer Login
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Astrologer Registration
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Shubh Muhurat 2026
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Shop Our Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 font-pl text-theme-orange">
              Helpful Info
            </h4>
            <ul className="space-y-3 text-sm text-gray-300 font-outfit">
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Copyright Notice
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-theme-orange transition">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-center text-sm text-gray-400 font-outfit">
          <p>
            © 2026 Astrology in Bharat (Powered by Astrology in Bharat
            Services). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

