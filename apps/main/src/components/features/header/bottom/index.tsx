"use client";

import CompanyLogo from "./company-logo";
import HamburgerButton from "./navigation/mobile/hamburger.menu";
import { useLanguageStore, headerTranslations } from "@repo/store";
import { useEffect, useRef, useState } from "react";
import AskExpertCTA from "./ask-expert.cta";
import NavigationMenu from "./navigation";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useScrollClose } from "@/hooks/use-scroll-close";
import { useAuth } from "@/store/useAuthStore";

const BottomHeaderComponent = () => {
    const { isAuthenticated } = useAuth();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);


    useClickOutside(ref, () => {
        setIsMobileMenuOpen(false)
    }, isMobileMenuOpen);

    useScrollClose(() => setIsMobileMenuOpen(false), isMobileMenuOpen);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isAuthenticated && isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
            // If using Lenis or similar, you might need to add a class
            document.body.classList.add("no-scroll");
            return () => {
                document.body.style.overflow = "";
                document.body.classList.remove("no-scroll");
            };
        }
    }, [isAuthenticated, isMobileMenuOpen]);

    return (
        <header
            className="main-head sticky top-0 z-50 bg-white border-b border-[#FF6B002e] shadow-[0_8px_11px_#0000000d]"
            style={{ backdropFilter: "saturate(160%) blur(8px)" }}
            ref={ref}
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
                                setIsMobileMenuOpen={setIsMobileMenuOpen} />
                        </nav>
                    </div>

                    {/* Ask Expert CTA */}
                    <AskExpertCTA />
                </div>
            </div>
        </header>
    )
}

export default BottomHeaderComponent;