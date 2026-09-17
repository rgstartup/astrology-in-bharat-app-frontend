"use client";

import React from "react";
import { useTranslations } from "next-intl";

import NotificationComponent from "@/features/notification";
import UserProfileDropdown from "@/features/profile";

import LanguageSwitcherDropdown from "./language-switcher.button";
import BalanceIndicator from "./balance-indicator.button";
import SavedItemsButton from "./saved-items.button";
import CartComponent from "./cart";

const TopHeader = () => {
  const t = useTranslations("Header");

  return (
    <header
      className="bg-[#301118] text-white shadow-sm relative z-[1001] overflow-visible flex items-center"
      style={{ minHeight: "52px", scrollbarWidth: "none" }}
    >
      <div
        className="max-w-[1320px] mx-auto px-3 sm:px-4 md:px-8 lg:px-16 w-full"
        style={{ overflow: "visible" }}
      >
        <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
          {/* Left section: Welcome Text */}
          <div className="hidden lg:block truncate">
            <p className="m-0 text-white/90 text-sm font-medium truncate">
              {t("welcomeText")}
            </p>
          </div>

          {/* Right section: Actions (Language, Wallet, Saved Items, Cart, Notification, Avatar) */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 md:gap-3.5 ml-auto">
            {/* Language Switcher */}
            <LanguageSwitcherDropdown />

            {/* Wallet Balance Indicator */}
            <BalanceIndicator />

            {/* Saved Items (Wishlist) */}
            <SavedItemsButton />

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
