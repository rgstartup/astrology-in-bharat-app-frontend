"use client";

import React from "react";
import { useAuth } from "@/store/useAuthStore";
import LanguageSwitcherDropdown from "./language-switcher.button";
import BalanceIndicator from "./balance-indicator.button";
import NotificationComponent from "./notification";
import AuthCTA from "./auth.cta";
import UserProfileDropdown from "./user-profile-dropdown";
import CartComponent from "./cart";
import { useTranslations } from "next-intl";

interface IAuthenticatedHeader {
  isAuthenticated: boolean;
}

const AuthenticatedHeaderActions: React.FC<IAuthenticatedHeader> = ({
  isAuthenticated,
}) => {
  if (!isAuthenticated) return <AuthCTA show={true} />;

  return (
    <div className="flex gap-4 items-center justify-end">
      {/* Cart Icon */}
      <CartComponent />

      {/* Notification Bell */}
      <NotificationComponent />

      {/* User Profile & Dropdown */}
      <UserProfileDropdown />
    </div>
  );
};

const TopHeader = () => {
  const { isAuthenticated } = useAuth();

  const t = useTranslations("Header");

  return (
    <header
      className="bg-[#301118] text-white shadow-sm relative z-[1001] overflow-visible flex items-center"
      style={{ minHeight: "52px", scrollbarWidth: "none" }}
    >
      <div
        className="max-w-[1320px] mx-auto px-2 sm:px-4 md:px-8 lg:px-16 w-full"
        style={{ overflow: "visible" }}
      >
        <div className="flex items-center w-full">
          {/* Left section: Welcome Text */}
          <div className="flex-1 hidden md:block">
            <p className="m-0 text-white text-base font-medium">
              {t("welcomeText")}
            </p>
          </div>

          {/* Right section: Balance + Icons */}
          <div className="ml-auto w-full md:w-auto">
            <div className="flex justify-between md:justify-end items-center gap-1.5 sm:gap-3 md:gap-5 w-full">
              {/* Language Switcher Dropdown */}
              <LanguageSwitcherDropdown />
              <BalanceIndicator />

              <div className="flex gap-1.5 sm:gap-3 md:gap-4 items-center">
                <AuthenticatedHeaderActions isAuthenticated={isAuthenticated} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
