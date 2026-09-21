"use client";

import React, { useRef, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  User,
  Wallet,
  Heart,
  Package,
  HelpCircle,
  LogOut,
  LogIn,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "@/store/useAuthStore";
import { PATHS } from "@repo/routes";
import { getProfileImageUrl } from "@/utils/image-utils";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { formatCompactNumber } from "@repo/ui";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useScrollClose } from "@/hooks/use-scroll-close";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const UserProfileDropdown = () => {
  const { user, isAuthenticated, logout, balance, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [showProfileDropDown, setShowProfileDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = () => setShowProfileDropDown(false);

  useClickOutside(dropdownRef, closeDropdown, showProfileDropDown);
  useScrollClose(closeDropdown, showProfileDropDown);

  const handleLogout = async () => {
    closeDropdown();
    const redirectUrl = await logout(pathname);
    router.push(redirectUrl);
  };

  const userDisplayName = user?.name?.trim() || "User";
  const userInitial = userDisplayName.charAt(0).toUpperCase() || "U";
  const avatarUrl = user ? getProfileImageUrl(user.avatar, user.name) : "";

  // Dynamic URLs based on auth status
  const profileHref = isAuthenticated
    ? PATHS.PROFILE
    : withCallbackUrl(PATHS.LOGIN, PATHS.PROFILE);

  const ordersHref = isAuthenticated
    ? `${PATHS.PROFILE}?tab=orders`
    : withCallbackUrl(PATHS.LOGIN, `${PATHS.PROFILE}?tab=orders`);

  const walletHref = isAuthenticated
    ? `${PATHS.PROFILE}?tab=wallet`
    : withCallbackUrl(PATHS.LOGIN, `${PATHS.PROFILE}?tab=wallet`);

  const wishlistHref = isAuthenticated
    ? `${PATHS.PROFILE}?tab=wishlist`
    : withCallbackUrl(PATHS.LOGIN, `${PATHS.PROFILE}?tab=wishlist`);

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
            <Avatar className="size-8 ring-1.5 ring-orange/80 group-hover:ring-orange shadow-xs transition-all duration-200">
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
          <div className="flex items-center justify-center size-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs shrink-0">
            <User className="size-4 text-white" />
          </div>
        )}
      </button>

      {/* Dropdown Popup Menu */}
      {showProfileDropDown && (
        <div className="absolute top-[125%] right-0 w-56 sm:w-60 rounded-xl bg-white text-gray-900 shadow-[0_10px_25px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-[1100] animate-in fade-in-0 zoom-in-95 duration-150 p-1.5 space-y-0.5">
          {/* 1. My Profile */}
          <Link
            href={profileHref}
            onClick={closeDropdown}
            className="w-full px-2.5 py-2 cursor-pointer rounded-lg hover:bg-[#301118]/5 flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-gray-700 hover:text-[#301118] transition-colors no-underline group"
          >
            <div className="size-6 rounded-md bg-[#301118]/10 text-[#301118] group-hover:bg-[#301118]/15 flex items-center justify-center shrink-0 transition-colors">
              <User className="size-3.5" />
            </div>
            <span>My Profile</span>
          </Link>

          {/* 2. My Orders */}
          <Link
            href={ordersHref}
            onClick={closeDropdown}
            className="w-full px-2.5 py-2 cursor-pointer rounded-lg hover:bg-[#301118]/5 flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-gray-700 hover:text-[#301118] transition-colors no-underline group"
          >
            <div className="size-6 rounded-md bg-[#301118]/10 text-[#301118] group-hover:bg-[#301118]/15 flex items-center justify-center shrink-0 transition-colors">
              <Package className="size-3.5" />
            </div>
            <span>My Orders</span>
          </Link>

          {/* 3. Wallet */}
          <Link
            href={walletHref}
            onClick={closeDropdown}
            className="w-full px-2.5 py-2 cursor-pointer rounded-lg hover:bg-[#301118]/5 flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-gray-700 hover:text-[#301118] transition-colors no-underline group"
          >
            <div className="size-6 rounded-md bg-[#301118]/10 text-[#301118] group-hover:bg-[#301118]/15 flex items-center justify-center shrink-0 transition-colors">
              <Wallet className="size-3.5" />
            </div>
            <span className="flex-1">Wallet</span>
            {isAuthenticated && (
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 font-medium border-[#301118]/20 text-[#301118] bg-[#301118]/5"
              >
                ₹{formatCompactNumber(balance ?? 0)}
              </Badge>
            )}
          </Link>

          {/* 4. Saved Items / Wishlist */}
          <Link
            href={wishlistHref}
            onClick={closeDropdown}
            className="w-full px-2.5 py-2 cursor-pointer rounded-lg hover:bg-[#301118]/5 flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-gray-700 hover:text-[#301118] transition-colors no-underline group"
          >
            <div className="size-6 rounded-md bg-[#301118]/10 text-[#301118] group-hover:bg-[#301118]/15 flex items-center justify-center shrink-0 transition-colors">
              <Heart className="size-3.5" />
            </div>
            <span>Saved Items / Wishlist</span>
          </Link>

          {/* 5. Support */}
          <Link
            href={PATHS.HELP}
            onClick={closeDropdown}
            className="w-full px-2.5 py-2 cursor-pointer rounded-lg hover:bg-[#301118]/5 flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-gray-700 hover:text-[#301118] transition-colors no-underline group"
          >
            <div className="size-6 rounded-md bg-[#301118]/10 text-[#301118] group-hover:bg-[#301118]/15 flex items-center justify-center shrink-0 transition-colors">
              <HelpCircle className="size-3.5" />
            </div>
            <span>Support</span>
          </Link>

          {/* Divider */}
          <hr className="my-1 border-gray-100" />

          {/* Bottom Auth Actions */}
          {!isAuthenticated ? (
            /* Login / Register */
            <Link
              href={withCallbackUrl(PATHS.LOGIN, pathname)}
              onClick={closeDropdown}
              className="w-full px-2.5 py-2 cursor-pointer rounded-lg hover:bg-[#301118]/5 text-gray-700 hover:text-[#301118] flex items-center gap-2.5 text-xs sm:text-[13px] font-medium transition-colors no-underline group"
            >
              <div className="size-6 rounded-md bg-[#301118]/10 text-[#301118] group-hover:bg-[#301118]/15 flex items-center justify-center shrink-0 transition-colors">
                <LogIn className="size-3.5" />
              </div>
              <span>Login / Register</span>
            </Link>
          ) : (
            /* Logout */
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-2.5 py-2 cursor-pointer rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2.5 text-xs sm:text-[13px] font-medium bg-transparent border-0 text-left transition-colors group"
            >
              <div className="size-6 rounded-md bg-[#301118]/10 text-[#301118] group-hover:bg-red-100 group-hover:text-red-600 flex items-center justify-center shrink-0 transition-colors">
                <LogOut className="size-3.5" />
              </div>
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;

