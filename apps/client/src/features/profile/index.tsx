"use client";

import React, { useRef, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  User,
  Wallet,
  Heart,
  Package,
  Settings,
  HelpCircle,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/store/useAuthStore";
import { PATHS } from "@repo/routes";
import { getProfileImageUrl } from "@/utils/image-utils";
import { formatCompactNumber } from "@repo/ui";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useScrollClose } from "@/hooks/use-scroll-close";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UserProfileDropdown = () => {
  const { user, isAuthenticated, logout, balance, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const [showProfileDropDown, setShowProfileDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = () => setShowProfileDropDown(false);

  useClickOutside(dropdownRef, closeDropdown, showProfileDropDown);
  useScrollClose(closeDropdown, showProfileDropDown);

  const handleNavigate = (path: string) => {
    closeDropdown();
    router.push(path);
  };

  const handleLogout = async () => {
    closeDropdown();
    const redirectUrl = await logout(pathname);
    router.push(redirectUrl);
  };

  const userDisplayName = user?.name?.trim() || "User";
  const userIdentifier = user?.email || user?.phone || "Verified Account";
  const userInitial = userDisplayName.charAt(0).toUpperCase() || "U";
  const avatarUrl = user ? getProfileImageUrl(user.avatar, user.name) : "";

  return (
    <div className="user-profile-dropdown-container relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setShowProfileDropDown((prev) => !prev)}
        className="flex items-center gap-1 sm:gap-1.5 focus:outline-none select-none cursor-pointer group bg-transparent border-0 p-0"
        aria-label="User Profile and Account Menu"
        aria-expanded={showProfileDropDown}
      >
        {isAuthenticated ? (
          <div className="relative flex items-center gap-1 shrink-0">
            <Avatar className="size-7.5 ring-1.5 ring-orange/80 group-hover:ring-orange shadow-xs transition-all duration-200">
              <AvatarImage src={avatarUrl} alt={userDisplayName} />
              <AvatarFallback className="bg-orange/20 text-orange font-bold text-[11px]">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <ChevronDown
              className={`size-3 text-white/80 group-hover:text-white transition-transform duration-200 ${
                showProfileDropDown ? "rotate-180" : ""
              }`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center size-7.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs shrink-0">
            <User className="size-4 text-white" />
          </div>
        )}
      </button>

      {/* Dropdown Popup Menu */}
      {showProfileDropDown && (
        <div className="absolute top-[125%] right-0 w-64 sm:w-72 rounded-xl bg-white text-gray-900 shadow-[0_10px_25px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-[1100] animate-in fade-in-0 zoom-in-95 duration-150 flex flex-col">
          {isAuthenticated ? (
            /* ================= Authenticated Menu ================= */
            <div>
              {/* Header User Banner (Compact) */}
              <div className="bg-gradient-to-r from-[#301118] to-[#4a1924] text-white px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8 sm:size-9 ring-1.5 ring-orange/70 shadow-xs shrink-0">
                    <AvatarImage src={avatarUrl} alt={userDisplayName} />
                    <AvatarFallback className="bg-orange text-white font-bold text-xs">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-xs sm:text-[13px] text-white truncate leading-tight">
                        {userDisplayName}
                      </p>
                      <ShieldCheck className="size-3 text-amber-400 shrink-0" />
                    </div>
                    <p className="text-[11px] text-white/70 truncate leading-tight mt-0.5">
                      {userIdentifier}
                    </p>
                  </div>
                </div>
              </div>

              {/* Wallet Quick Bar (Compact) */}
              <div className="bg-amber-500/10 px-3 py-1.5 border-b border-amber-200/40 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                  <Wallet className="size-3 text-amber-600" />
                  <span>Wallet:</span>
                  <span className="font-bold text-amber-700">
                    ₹{balance?.toLocaleString() ?? 0}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigate(`${PATHS.PROFILE}?tab=wallet`)}
                  className="text-[11px] font-semibold text-orange hover:text-orange/80 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Manage
                </button>
              </div>

              {/* Menu Items (Compact) */}
              <div className="p-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleNavigate(PATHS.PROFILE)}
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-[13px] font-medium text-gray-700 bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-orange/10 text-orange flex items-center justify-center shrink-0">
                    <User className="size-3" />
                  </div>
                  <span>{t("myProfile")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate(`${PATHS.PROFILE}?tab=wallet`)}
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-[13px] font-medium text-gray-700 bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Wallet className="size-3" />
                  </div>
                  <span className="flex-1">{t("myWallet")}</span>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1 py-0 font-semibold border-amber-300 text-amber-800"
                  >
                    ₹{formatCompactNumber(balance ?? 0)}
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate(`${PATHS.PROFILE}?tab=orders`)}
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-[13px] font-medium text-gray-700 bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Package className="size-3" />
                  </div>
                  <span>My Consultations & Orders</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate(`${PATHS.PROFILE}?tab=wishlist`)}
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-[13px] font-medium text-gray-700 bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Heart className="size-3" />
                  </div>
                  <span>Saved Items</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate(PATHS.SETTINGS)}
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-[13px] font-medium text-gray-700 bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    <Settings className="size-3" />
                  </div>
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate(PATHS.HELP)}
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-[13px] font-medium text-gray-700 bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="size-3" />
                  </div>
                  <span>Help & Support</span>
                </button>

                <hr className="my-1 border-gray-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 text-xs sm:text-[13px] font-semibold bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <LogOut className="size-3" />
                  </div>
                  <span>{loading ? "Logging out..." : t("logout")}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= Guest Menu (Not Logged In) ================= */
            <div>
              {/* Welcome Banner (Compact) */}
              <div className="bg-gradient-to-r from-[#301118] to-[#4a1924] text-white px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                    <Sparkles className="size-3 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs sm:text-[13px] text-white leading-tight">
                      Welcome to Astrology in Bharat
                    </p>
                    <p className="text-[10.5px] text-white/70 mt-0.5 leading-tight">
                      Sign in for expert consultations & wallet.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign In / Register Action CTAs (Compact) */}
              <div className="p-2 bg-gray-50/80 border-b border-gray-100 grid grid-cols-2 gap-1.5">
                <Button
                  onClick={() =>
                    handleNavigate(
                      `${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(pathname)}`,
                    )
                  }
                  className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold h-7.5 rounded-lg text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer px-2"
                >
                  <LogIn className="size-3" />
                  <span>{t("signIn")}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    handleNavigate(
                      `${PATHS.REGISTER}?callbackUrl=${encodeURIComponent(pathname)}`,
                    )
                  }
                  className="w-full border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-semibold h-7.5 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer px-2"
                >
                  <UserPlus className="size-3" />
                  <span>{t("register")}</span>
                </Button>
              </div>

              {/* Quick Links for Guest (Compact) */}
              <div className="p-1 space-y-0.5">
                <div className="px-2 py-0.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Quick Services
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate(
                      `${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(
                        PATHS.DASHBOARD_ORDERS,
                      )}`,
                    )
                  }
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-[13px] font-medium text-gray-700 bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Package className="size-3" />
                  </div>
                  <span>Track Bookings & Orders</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate(
                      `${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(
                        `${PATHS.PROFILE}?tab=wishlist`,
                      )}`,
                    )
                  }
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-[13px] font-medium text-gray-700 bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Heart className="size-3" />
                  </div>
                  <span>Saved Items / Wishlist</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate(
                      `${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(
                        `${PATHS.PROFILE}?tab=wallet`,
                      )}`,
                    )
                  }
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-[13px] font-medium text-gray-700 bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Wallet className="size-3" />
                  </div>
                  <span>Wallet & Recharge</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate(PATHS.HELP)}
                  className="w-full px-2 py-1.5 cursor-pointer rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs sm:text-[13px] font-medium text-gray-700 bg-transparent border-0 text-left transition-colors"
                >
                  <div className="size-5.5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="size-3" />
                  </div>
                  <span>Help & Support</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
