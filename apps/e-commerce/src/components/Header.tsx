"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, openCart } = useCart();
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Daily Horoscope", href: "/horoscope" },
    { name: "Astrology Consult", href: "/consult" },
    { name: "Blog", href: "/blog" },
    { name: "Kundli Prediction", href: "/kundli" },
  ];

  return (
    <>
      {/* Top Bar - Authenticity & Trust */}
      <div className="bg-orange-50 border-b border-orange-100 hidden md:block">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm font-outfit text-gray-600">
          <p>Connect with Verified Astrology Experts for Online Predictions.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:text-orange-600 transition">
              <i className="fa-solid fa-globe"></i> Eng{" "}
              <i className="fa-solid fa-angle-down text-xs"></i>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-orange-600 transition">
              <i className="fa-solid fa-user"></i> Account{" "}
              <i className="fa-solid fa-angle-down text-xs"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="/images/web-logo.png"
                alt="Astrology in Bharat"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 font-pl">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-primary-orange ${
                    pathname === link.href
                      ? "text-primary-orange"
                      : "text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Ask Astrologer CTA */}
              <a
                href="/consult"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-orange font-semibold transition"
              >
                <img src="/images/chat.svg" alt="Chat" className="w-5 h-5" />
                <span>Ask Astrologer</span>
              </a>

              {/* Desktop Cart */}
              <button
                onClick={openCart}
                className="relative text-gray-700 hover:text-primary-orange transition group"
              >
                <i className="fa-solid fa-cart-shopping text-xl"></i>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              <button onClick={openCart} className="relative text-gray-700">
                <i className="fa-solid fa-cart-shopping text-xl"></i>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-orange focus:outline-none"
              >
                <i
                  className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"} text-2xl`}
                ></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 top-20">
            <nav className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 font-semibold hover:text-primary-orange"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2"></div>
              <a
                href="/consult"
                className="flex items-center gap-2 text-gray-700 font-semibold"
              >
                <img src="/images/chat.svg" alt="Chat" className="w-5 h-5" />
                <span>Ask Astrologer</span>
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Quick Services Bar (Optional, mimicking main app) */}
      <div className="bg-white border-b hidden md:block">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
            {[
              "My Kundli",
              "Numerology",
              "Online Puja",
              "Life Horoscope",
              "Love Report",
              "Match Analysis",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary-orange transition group"
              >
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100">
                  {/* Dummy icons mapping based on index or name */}
                  <img
                    src={`/images/top-icon${idx + 1}.png`}
                    alt={item}
                    className="w-5 h-5 object-contain"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "/images/web-logo.png")
                    }
                  />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

