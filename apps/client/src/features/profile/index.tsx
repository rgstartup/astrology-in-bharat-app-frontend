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
  ArrowUpRight,
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
  const userInitial = userDisplayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
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
    <div
      className="user-profile-dropdown-container relative"
      ref={dropdownRef}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          closeDropdown();
          dropdownRef.current
            ?.querySelector<HTMLButtonElement>("button")
            ?.focus();
        }
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setShowProfileDropDown((prev) => !prev)}
        className="group inline-flex h-8 items-center gap-1.5 rounded-full border border-white/20 bg-white/5 py-0.5 pl-0.5 pr-2 text-white transition-colors hover:bg-white/10 aria-expanded:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
        aria-label={
          isAuthenticated
            ? `${userDisplayName}, profile and account menu`
            : "Profile and account menu"
        }
        aria-expanded={showProfileDropDown}
      >
        <Avatar className="size-6">
          <AvatarFallback className="absolute inset-0 bg-gray-100 text-brown">
            {isAuthenticated ? (
              userInitial
            ) : (
              <User aria-hidden="true" className="size-4" strokeWidth={1.8} />
            )}
          </AvatarFallback>
          {isAuthenticated && avatarUrl && (
            <AvatarImage src={avatarUrl} alt="" className="relative" />
          )}
        </Avatar>
        {isAuthenticated && (
          <span
            className="hidden max-w-32 truncate text-sm font-medium leading-5 sm:block"
            title={userDisplayName}
          >
            {userDisplayName}
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 text-white/75 transition-transform duration-150 group-aria-expanded:rotate-180 motion-reduce:transition-none"
        />
      </button>

      {/* Dropdown Popup Menu */}
      {showProfileDropDown && (
        <div
          data-lenis-prevent
          className="absolute top-[calc(100%+12px)] right-0 w-80 max-w-[calc(100vw-1.5rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white text-brown shadow-xl shadow-brown/15 border border-gray-200 z-[1100] animate-in fade-in-0 zoom-in-95 duration-150 motion-reduce:animate-none p-2"
        >
          <div className="mb-2 border-b border-gray-200 px-3 pb-4 pt-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback className="absolute inset-0 bg-gray-100 text-brown">
                  {isAuthenticated ? (
                    userInitial
                  ) : (
                    <User aria-hidden="true" className="size-6" />
                  )}
                </AvatarFallback>
                {isAuthenticated && avatarUrl && (
                  <AvatarImage src={avatarUrl} alt="" className="relative" />
                )}
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs font-medium text-saffron-strong">
                  Your personal space
                </p>
                <p className="truncate text-base font-semibold tracking-tight">
                  {isAuthenticated ? userDisplayName : "Welcome to AIB"}
                </p>
                <p className="mt-1 text-xs leading-5 text-brown/65">
                  {isAuthenticated
                    ? "Your guidance, all in one place."
                    : "Begin your astrology journey."}
                </p>
              </div>
            </div>
            <Link
              href={
                isAuthenticated
                  ? PATHS.DASHBOARD.ROOT
                  : withCallbackUrl(PATHS.LOGIN, pathname)
              }
              onClick={closeDropdown}
              className="mt-4 flex min-h-10 items-center justify-between gap-3 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {isAuthenticated ? "Open my dashboard" : "Sign in to get started"}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <p className="px-3 pb-1 pt-1 text-xs font-semibold tracking-wide text-brown/65">
            Account & activity
          </p>
          {/* 1. My Profile */}
          <Link
            href={profileHref}
            onClick={closeDropdown}
            className="w-full min-h-11 px-3 py-2 cursor-pointer rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-sm font-medium text-brown/85 hover:text-brown transition-colors no-underline group"
          >
            <div className="size-8 rounded-full bg-gray-100 text-brown group-hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
              <User className="size-3.5" />
            </div>
            <span>My Profile</span>
          </Link>

          {/* 2. My Orders */}
          <Link
            href={ordersHref}
            onClick={closeDropdown}
            className="w-full min-h-11 px-3 py-2 cursor-pointer rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-sm font-medium text-brown/85 hover:text-brown transition-colors no-underline group"
          >
            <div className="size-8 rounded-full bg-gray-100 text-brown group-hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
              <Package className="size-3.5" />
            </div>
            <span>My Orders</span>
          </Link>

          {/* 3. Wallet */}
          <Link
            href={walletHref}
            onClick={closeDropdown}
            className="w-full min-h-11 px-3 py-2 cursor-pointer rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-sm font-medium text-brown/85 hover:text-brown transition-colors no-underline group"
          >
            <div className="size-8 rounded-full bg-gray-100 text-brown group-hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
              <Wallet className="size-3.5" />
            </div>
            <span className="flex-1">Wallet</span>
            {isAuthenticated && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 font-medium border-gray-200 text-brown bg-gray-50"
              >
                ₹{formatCompactNumber(balance ?? 0)}
              </Badge>
            )}
          </Link>

          {/* 4. Saved Items / Wishlist */}
          <Link
            href={wishlistHref}
            onClick={closeDropdown}
            className="w-full min-h-11 px-3 py-2 cursor-pointer rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-sm font-medium text-brown/85 hover:text-brown transition-colors no-underline group"
          >
            <div className="size-8 rounded-full bg-gray-100 text-brown group-hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
              <Heart className="size-3.5" />
            </div>
            <span>Saved Items / Wishlist</span>
          </Link>

          {/* 5. Support */}
          <Link
            href={PATHS.HELP}
            onClick={closeDropdown}
            className="w-full min-h-11 px-3 py-2 cursor-pointer rounded-xl hover:bg-gray-50 flex items-center gap-2.5 text-sm font-medium text-brown/85 hover:text-brown transition-colors no-underline group"
          >
            <div className="size-8 rounded-full bg-gray-100 text-brown group-hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
              <HelpCircle className="size-3.5" />
            </div>
            <span>Support</span>
          </Link>

          {/* Divider */}
          <hr className="my-2 border-gray-200" />

          {/* Bottom Auth Actions */}
          {!isAuthenticated ? (
            /* Login / Register */
            <Link
              href={withCallbackUrl(PATHS.LOGIN, pathname)}
              onClick={closeDropdown}
              className="w-full min-h-11 px-3 py-2 cursor-pointer rounded-xl hover:bg-gray-50 text-brown/85 hover:text-brown flex items-center gap-2.5 text-sm font-medium transition-colors no-underline group"
            >
              <div className="size-8 rounded-full bg-gray-100 text-brown group-hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
                <LogIn className="size-3.5" />
              </div>
              <span>Login / Register</span>
            </Link>
          ) : (
            /* Logout */
            <button
              type="button"
              onClick={handleLogout}
              className="w-full min-h-11 px-3 py-2 cursor-pointer rounded-xl text-brown/85 hover:bg-red-50 hover:text-red-600 flex items-center gap-2.5 text-sm font-medium bg-transparent border-0 text-left transition-colors group"
            >
              <div className="size-8 rounded-full bg-gray-100 text-brown group-hover:bg-red-100 group-hover:text-red-600 flex items-center justify-center shrink-0 transition-colors">
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
