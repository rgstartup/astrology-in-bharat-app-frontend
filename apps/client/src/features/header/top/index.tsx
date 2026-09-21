"use client";

import React from "react";
import { useTranslations } from "next-intl";

import NotificationComponent from "@/features/notification";
import UserProfileDropdown from "@/features/profile";

import LanguageSwitcherDropdown from "./language-switcher.button";
import BalanceIndicator from "./balance-indicator.button";
import CartComponent from "./cart";

const TopHeader = () => {
  const t = useTranslations("Header");

  return (
    <header
      className="bg-[#301118] text-white shadow-xs relative z-[1001] overflow-visible flex items-center py-2.5 sm:py-2 min-h-[48px] sm:min-h-[44px]"
      style={{ scrollbarWidth: "none" }}
    >
      <div
        className="max-w-[1320px] mx-auto px-3 sm:px-4 md:px-8 lg:px-16 w-full"
        style={{ overflow: "visible" }}
      >
        <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
          {/* Left section: Language Switcher on mobile/tablet, Welcome Text on desktop */}
          <div className="flex items-center">
            <div className="block lg:hidden">
              <LanguageSwitcherDropdown />
            </div>
            <div className="hidden lg:block truncate">
              <p className="m-0 text-white/90 text-[12.5px] font-medium truncate">
                {t("welcomeText")}
              </p>
            </div>
          </div>

          {/* Right section: Actions (Language on desktop, Wallet, Cart, Notification, Avatar) */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-3.5 ml-auto">
            {/* Language Switcher (desktop) */}
            <div className="hidden lg:block">
              <LanguageSwitcherDropdown />
            </div>

            {/* Wallet Balance Indicator */}
            <BalanceIndicator />

            {/* Cart */}
            <CartComponent />

            {/* Notifications (renders when authenticated) */}
            <NotificationComponent />

            {/* User Profile / Guest Avatar Dropdown */}
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
