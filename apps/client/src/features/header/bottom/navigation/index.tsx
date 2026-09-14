"use client";

import Link from "next/link";
import CalculatorMenu from "./calculator-menu";
import MobileSubMenu from "./mobile/sub-menu";
import React, { useState } from "react";
import { PATHS } from "@repo/routes";
import AuthCTA from "./auth.cta";
import { headerTranslations, useLanguageStore } from "@repo/store";
import { useAuth } from "@/store/useAuthStore";

interface INavigationMenu {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const NavigationMenu: React.FC<INavigationMenu> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const { lang } = useLanguageStore();
    const t = headerTranslations[lang] || headerTranslations.en;

    const { isAuthenticated, logout } = useAuth();

    const [showMobileSubMenu, setShowMobileSubMenu] = useState(false);
    const calculatorMenu = CalculatorMenu();

    const handleLogout = async () => {
        setIsMobileMenuOpen(false);
        await logout();
    };

    // Mobile Menu Return
    if (isMobileMenuOpen) {
        return (
            <div
                data-lenis-prevent
                className="block absolute left-0 right-0 bg-brown w-full shadow-2xl border-t border-white/10 z-[1000] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{
                    top: "100%",
                    maxHeight: "calc(100vh - 70px)",
                    overflowY: "auto",
                    overscrollBehavior: "contain",
                }}
            >
                <ul className="flex flex-col items-start w-full py-2 px-3 gap-0 translate-y-2">
                    {/* Daily Horoscope */}
                    <li className="w-full border-b border-white/5">
                        <Link
                            className="text-[15px] no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors text-white/90"
                            href={PATHS.HOROSCOPE}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t.navDailyHoroscope}
                        </Link>
                    </li>

                    {/* Astrology Consult dropdown */}
                    <li className="relative group w-full border-b border-white/5">
                        <button
                            className="text-[15px] no-underline px-3 py-[10px] font-medium w-full text-left bg-transparent border-0 flex justify-between items-center text-white/90"
                            onClick={() => setShowMobileSubMenu(!showMobileSubMenu)}
                        >
                            {t.navAstrologyConsult}
                            <i
                                className={`fa-solid fa-chevron-${showMobileSubMenu ? "up" : "down"} text-white/40`}
                                style={{ fontSize: "12px" }}
                            />
                        </button>
                        <MobileSubMenu
                            setIsMenuOpen={setIsMobileMenuOpen}
                            setShowMobileSubMenu={setShowMobileSubMenu}
                            showMobileSubMenu={showMobileSubMenu}
                        />
                    </li>

                    {/* Famous Places */}
                    <li className="w-full border-b border-white/5">
                        <Link
                            className="text-[15px] no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors text-white/90"
                            href={PATHS.FAMOUS_PLACES}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t.navFamousPlaces}
                        </Link>
                    </li>

                    {/* Kundali Matching */}
                    <li className="w-full">
                        <Link
                            className="text-[15px] no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors text-white/90"
                            href={PATHS.KUNDALI_MATCHING}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {lang === "hi" ? "कुण्डली मिलान" : "Kundali Matching"}
                        </Link>
                    </li>

                    {/* Mobile Only: Profile and Auth */}
                    <li className="w-full mt-2 pt-2 border-t border-white/20 pb-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    className="text-[15px] text-white/90 no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors"
                                    href={PATHS.PROFILE}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        <i className="fa-solid fa-user-circle"></i>
                                        {t.myProfile || "My Profile"}
                                    </div>
                                </Link>
                                <Link
                                    className="text-[15px] text-white/90 no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors"
                                    href={`${PATHS.PROFILE}?tab=wallet`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        <i className="fa-solid fa-wallet"></i>
                                        {t.myWallet || "My Wallet"}
                                    </div>
                                </Link>
                                <button
                                    className="text-[15px] text-red-400 no-underline px-3 py-[10px] font-medium block w-full text-left hover:text-red-300 transition-colors bg-transparent border-0"
                                    onClick={handleLogout}
                                >
                                    <div className="flex items-center gap-3">
                                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                        {t.logout || "Logout"}
                                    </div>
                                </button>
                            </>
                        ) : (
                            <AuthCTA setIsMenuOpen={setIsMobileMenuOpen} />
                        )}
                    </li>
                </ul>
            </div>
        );
    }

    // Desktop Menu Return
    return (
        <div
            data-lenis-prevent
            className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1"
        >
            <ul className="flex flex-row items-center gap-2 xl:gap-8 translate-y-2 mx-auto">
                {/* Daily Horoscope */}
                <li>
                    <Link
                        className="text-[15px] no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors text-[#1e0b0f]"
                        href={PATHS.HOROSCOPE}
                    >
                        {t.navDailyHoroscope}
                    </Link>
                </li>

                {/* Astrology Consult dropdown */}
                <li className="relative group">
                    {/* Desktop hover dropdown */}
                    <a
                        className="text-[15px] text-[#1e0b0f] no-underline px-3 py-[7px] font-medium flex items-center gap-1 cursor-pointer hover:text-orange-600 transition-colors"
                        href="#"
                    >
                        {t.navAstrologyConsult}
                        <i className="fa-solid fa-chevron-down text-xs opacity-60" />
                    </a>
                    {/* Dropdown — visible on group hover */}
                    <div className="absolute top-full left-0 bg-brown shadow-xl rounded-xl border border-brown z-[1001] min-w-[280px] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                        <ul
                            data-lenis-prevent
                            className="list-none py-3 max-h-[450px] overflow-y-auto overflow-x-hidden overscroll-contain [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-brown [&::-webkit-scrollbar-thumb]:bg-orange [&::-webkit-scrollbar-thumb]:rounded-full"
                        >
                            {calculatorMenu.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="block px-6 py-2.5 text-sm text-white/90 no-underline hover:text-orange transition-all border-b border-white/5 last:border-0 hover:translate-x-1"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>

                {/* Famous Places */}
                <li>
                    <Link
                        className="text-[15px] no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors text-[#1e0b0f]"
                        href={PATHS.FAMOUS_PLACES}
                    >
                        {t.navFamousPlaces}
                    </Link>
                </li>

                {/* Kundali Matching */}
                <li>
                    <Link
                        className="text-[15px] no-underline px-3 py-[10px] font-medium block hover:text-orange transition-colors text-[#1e0b0f]"
                        href={PATHS.KUNDALI_MATCHING}
                    >
                        {lang === "hi" ? "कुण्डली मिलान" : "Kundali Matching"}
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default NavigationMenu;