"use client";

import CompanyLogo from "./company-logo";
import HamburgerButton from "./navigation/mobile/hamburger.menu";
import { useState } from "react";
import AskExpertCTA from "./ask-expert.cta";
import NavigationMenu from "./navigation";

const BottomHeaderComponent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className="main-head sticky top-0 z-50 bg-white border-b border-[#FF6B002e] shadow-[0_8px_11px_#0000000d]"
      style={{ backdropFilter: "saturate(160%) blur(8px)" }}
    >
      <div className="max-w-[1320px] mx-auto px-2 sm:px-4 md:px-8 lg:px-16 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Nav — takes most of the space */}
          <div className="flex-1">
            <nav className="flex items-center">
              {/* Logo */}
              <CompanyLogo />

              {/* Hamburger — mobile only */}
              <HamburgerButton
                isMenuOpen={isMobileMenuOpen}
                setIsMenuOpen={setIsMobileMenuOpen}
              />

              {/* Nav links */}
              <NavigationMenu
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </nav>
          </div>

          {/* Ask Expert CTA */}
          <AskExpertCTA />
        </div>
      </div>
    </header>
  );
};

export default BottomHeaderComponent;
