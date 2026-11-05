"use client";

import React, { useRef, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  User,
  Heart,
  Package,
  HelpCircle,
  LogOut,
  LogIn,
  ChevronDown,
} from "@repo/design/lucide";

import { useAuth } from "@/store/authStore";
import { PATHS } from "@repo/routes";
import { getProfileImageUrl } from "@/utils/image-utils";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useScrollClose } from "@/hooks/use-scroll-close";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/shadcn";

interface ShopProfileAvatarFallbackProps {
  isAuthenticated: boolean;
  userInitial: string;
}

const ShopProfileAvatarFallback: React.FC<ShopProfileAvatarFallbackProps> = ({
  isAuthenticated,
  userInitial,
}) => {
  if (isAuthenticated && userInitial) {
    return <span className="text-xs font-semibold text-neutral-800">{userInitial}</span>;
  }
  return <User aria-hidden="true" className="size-3.5 text-neutral-600" strokeWidth={2} />;
};

interface ShopProfileTriggerLabelProps {
  isAuthenticated: boolean;
  displayName: string;
}

const ShopProfileTriggerLabel: React.FC<ShopProfileTriggerLabelProps> = ({
  isAuthenticated,
  displayName,
}) => {
  if (!isAuthenticated) {
    return <span className="hidden sm:inline text-xs font-medium text-neutral-600">Sign In</span>;
  }
  return (
    <span
      className="hidden sm:inline max-w-28 truncate text-xs font-semibold text-neutral-900"
      title={displayName}
    >
      {displayName}
    </span>
  );
};

interface ShopProfileUserHeaderProps {
  isAuthenticated: boolean;
  displayName: string;
  contactInfo: string;
  avatarUrl: string;
  userInitial: string;
}

const ShopProfileUserHeader: React.FC<ShopProfileUserHeaderProps> = ({
  isAuthenticated,
  displayName,
  contactInfo,
  avatarUrl,
  userInitial,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="mb-2 border-b border-[#e8e4de] px-3 pb-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-[#f5f1ec] text-neutral-700 flex items-center justify-center font-semibold text-sm border border-[#e8e4de]">
            <User className="size-5 text-neutral-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-neutral-900">
              Welcome to Astro Shop
            </p>
            <p className="truncate text-xs text-neutral-500">
              Sign in to manage orders & wishlist
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 border-b border-[#e8e4de] px-3 pb-3 pt-2">
      <div className="flex items-center gap-3">
        <Avatar className="size-10 border border-[#e8e4de]">
          <AvatarFallback className="bg-[#f5f1ec] text-neutral-800 font-semibold text-sm">
            {userInitial}
          </AvatarFallback>
          {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} className="relative object-cover" />}
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {displayName}
          </p>
          {contactInfo && (
            <p className="truncate text-xs text-neutral-500">
              {contactInfo}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface ShopProfileAuthActionProps {
  isAuthenticated: boolean;
  loading: boolean;
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
}

const ShopProfileAuthAction: React.FC<ShopProfileAuthActionProps> = ({
  isAuthenticated,
  loading,
  pathname,
  onClose,
  onLogout,
}) => {
  if (!isAuthenticated) {
    return (
      <Link
        href={withCallbackUrl(PATHS.LOGIN, pathname)}
        onClick={onClose}
        className="w-full min-h-10 px-3 py-2 cursor-pointer rounded-xl hover:bg-[#f5f1ec] text-neutral-800 hover:text-neutral-900 flex items-center gap-2.5 text-sm font-medium transition-colors no-underline group"
      >
        <div className="size-7 rounded-full bg-[#f5f1ec] text-neutral-700 group-hover:bg-[#e8e4de] flex items-center justify-center shrink-0 transition-colors">
          <LogIn className="size-3.5" />
        </div>
        <span>Sign In / Register</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      className="w-full min-h-10 px-3 py-2 cursor-pointer rounded-xl text-neutral-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2.5 text-sm font-medium bg-transparent border-0 text-left transition-colors group"
    >
      <div className="size-7 rounded-full bg-[#f5f1ec] text-neutral-700 group-hover:bg-red-100 group-hover:text-red-600 flex items-center justify-center shrink-0 transition-colors">
        <LogOut className="size-3.5" />
      </div>
      <span>{loading ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
};

/**
 * Dedicated auth profile dropdown for Astro Shop.
 * Decoupled from wallet and consultation features.
 * Adheres to Intercom-Airbnb aesthetic (crisp white, cream hovers, hairline borders).
 *
 * @returns {React.ReactElement} Standalone shop user profile dropdown menu.
 */
export const ShopProfileDropdown: React.FC = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = () => setIsOpen(false);

  useClickOutside(dropdownRef, closeDropdown, isOpen);
  useScrollClose(closeDropdown, isOpen);

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
  const contactInfo = user?.email || user?.phone || "";

  return (
    <div
      className="relative"
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
        onClick={() => setIsOpen((prev) => !prev)}
        className="group inline-flex h-10 items-center gap-2 rounded-full border border-[#e8e4de] bg-white px-2.5 py-1 text-neutral-800 transition-colors hover:bg-[#f5f1ec] aria-expanded:bg-[#f5f1ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        aria-label={
          isAuthenticated
            ? `${userDisplayName}, shop profile and account menu`
            : "Shop profile and account menu"
        }
        aria-expanded={isOpen}
      >
        <Avatar className="size-6 border border-[#e8e4de]">
          <AvatarFallback className="bg-[#f5f1ec] text-neutral-800">
            <ShopProfileAvatarFallback
              isAuthenticated={isAuthenticated}
              userInitial={userInitial}
            />
          </AvatarFallback>
          {isAuthenticated && avatarUrl && (
            <AvatarImage src={avatarUrl} alt="" className="relative object-cover" />
          )}
        </Avatar>

        <ShopProfileTriggerLabel
          isAuthenticated={isAuthenticated}
          displayName={userDisplayName}
        />

        <ChevronDown
          aria-hidden="true"
          className="size-3.5 text-neutral-500 transition-transform duration-150 group-aria-expanded:rotate-180"
        />
      </button>

      {/* Dropdown Popup Menu */}
      {isOpen && (
        <div
          data-lenis-prevent
          className="absolute top-[calc(100%+8px)] right-0 w-72 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-xl shadow-neutral-900/10 border border-[#e8e4de] z-[1100] animate-in fade-in-0 zoom-in-95 duration-150 motion-reduce:animate-none p-2"
        >
          {/* User Header */}
          <ShopProfileUserHeader
            isAuthenticated={isAuthenticated}
            displayName={userDisplayName}
            contactInfo={contactInfo}
            avatarUrl={avatarUrl}
            userInitial={userInitial}
          />

          {/* Navigation Links */}
          <div className="flex flex-col gap-0.5">
            {/* My Orders */}
            <Link
              href="/shop/orders"
              onClick={closeDropdown}
              className="w-full min-h-10 px-3 py-2 cursor-pointer rounded-xl hover:bg-[#f5f1ec] flex items-center gap-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors no-underline group"
            >
              <div className="size-7 rounded-full bg-[#f5f1ec] text-neutral-700 group-hover:bg-[#e8e4de] flex items-center justify-center shrink-0 transition-colors">
                <Package className="size-3.5" />
              </div>
              <span>My Orders</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/shop/wishlist"
              onClick={closeDropdown}
              className="w-full min-h-10 px-3 py-2 cursor-pointer rounded-xl hover:bg-[#f5f1ec] flex items-center gap-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors no-underline group"
            >
              <div className="size-7 rounded-full bg-[#f5f1ec] text-neutral-700 group-hover:bg-[#e8e4de] flex items-center justify-center shrink-0 transition-colors">
                <Heart className="size-3.5" />
              </div>
              <span>Saved Items / Wishlist</span>
            </Link>

            {/* Account Settings */}
            <Link
              href={PATHS.PROFILE}
              onClick={closeDropdown}
              className="w-full min-h-10 px-3 py-2 cursor-pointer rounded-xl hover:bg-[#f5f1ec] flex items-center gap-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors no-underline group"
            >
              <div className="size-7 rounded-full bg-[#f5f1ec] text-neutral-700 group-hover:bg-[#e8e4de] flex items-center justify-center shrink-0 transition-colors">
                <User className="size-3.5" />
              </div>
              <span>Account Details</span>
            </Link>

            {/* Support */}
            <Link
              href={PATHS.HELP}
              onClick={closeDropdown}
              className="w-full min-h-10 px-3 py-2 cursor-pointer rounded-xl hover:bg-[#f5f1ec] flex items-center gap-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors no-underline group"
            >
              <div className="size-7 rounded-full bg-[#f5f1ec] text-neutral-700 group-hover:bg-[#e8e4de] flex items-center justify-center shrink-0 transition-colors">
                <HelpCircle className="size-3.5" />
              </div>
              <span>Help & Support</span>
            </Link>
          </div>

          {/* Divider */}
          <hr className="my-1.5 border-[#e8e4de]" />

          {/* Auth Action */}
          <ShopProfileAuthAction
            isAuthenticated={isAuthenticated}
            loading={loading}
            pathname={pathname}
            onClose={closeDropdown}
            onLogout={handleLogout}
          />
        </div>
      )}
    </div>
  );
};
