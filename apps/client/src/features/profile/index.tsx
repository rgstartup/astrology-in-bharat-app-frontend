"use client";

import React from "react";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UserProfileDropdown = () => {
  const { user, isAuthenticated, logout, balance, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const handleLogout = async () => {
    const redirectUrl = await logout(pathname);
    router.push(redirectUrl);
  };

  const userDisplayName = user?.name?.trim() || "User";
  const userIdentifier = user?.email || user?.phone || "Verified Account";
  const userInitial = userDisplayName.charAt(0).toUpperCase() || "U";
  const avatarUrl = user ? getProfileImageUrl(user.avatar, user.name) : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1.5 focus:outline-none select-none cursor-pointer group"
        aria-label="User Profile and Account Menu"
      >
        {isAuthenticated ? (
          <div className="relative flex items-center gap-1.5">
            <Avatar className="size-8 sm:size-8.5 ring-2 ring-orange/80 group-hover:ring-orange shadow-xs transition-all duration-200">
              <AvatarImage src={avatarUrl} alt={userDisplayName} />
              <AvatarFallback className="bg-orange/20 text-orange font-bold text-xs">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="size-3.5 text-white/80 group-hover:text-white transition-transform duration-200 group-data-open:rotate-180" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 size-8 sm:size-8.5 rounded-full bg-white/10 hover:bg-white/20 text-white justify-center border border-white/15 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs">
            <User className="size-4 text-white" />
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 sm:w-80 p-0 rounded-2xl bg-white text-gray-900 shadow-2xl border border-gray-100 overflow-hidden z-[1100]"
      >
        {isAuthenticated ? (
          /* ================= Authenticated Menu ================= */
          <div>
            {/* Header User Banner */}
            <div className="bg-gradient-to-r from-[#301118] to-[#4a1924] text-white p-3.5 sm:p-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-11 ring-2 ring-orange/70 shadow-sm shrink-0">
                  <AvatarImage src={avatarUrl} alt={userDisplayName} />
                  <AvatarFallback className="bg-orange text-white font-bold text-sm">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-white truncate leading-tight">
                      {userDisplayName}
                    </p>
                    <ShieldCheck className="size-3.5 text-amber-400 shrink-0" />
                  </div>
                  <p className="text-xs text-white/70 truncate mt-0.5 leading-tight">
                    {userIdentifier}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <Badge
                      variant="saffron"
                      className="px-1.5 py-0 text-[10px] font-semibold bg-orange/20 text-orange-200 border-orange/30"
                    >
                      Member
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Quick Bar */}
            <div className="bg-amber-500/10 px-3.5 py-2.5 border-b border-amber-200/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                <Wallet className="size-3.5 text-amber-600" />
                <span>Wallet Balance:</span>
                <span className="font-bold text-amber-700">
                  ₹{balance?.toLocaleString() ?? 0}
                </span>
              </div>
              <Link
                href={`${PATHS.PROFILE}?tab=wallet`}
                className="text-xs font-semibold text-orange hover:text-orange/80 hover:underline"
              >
                Manage
              </Link>
            </div>

            {/* Menu Items */}
            <div className="p-1.5">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => router.push(PATHS.PROFILE)}
                  className="px-2.5 py-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <div className="size-7 rounded-full bg-orange/10 text-orange flex items-center justify-center shrink-0">
                    <User className="size-3.5" />
                  </div>
                  <span>{t("myProfile")}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push(`${PATHS.PROFILE}?tab=wallet`)}
                  className="px-2.5 py-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <div className="size-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Wallet className="size-3.5" />
                  </div>
                  <span className="flex-1">{t("myWallet")}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 font-semibold border-amber-300 text-amber-800"
                  >
                    ₹{formatCompactNumber(balance ?? 0)}
                  </Badge>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push(`${PATHS.PROFILE}?tab=orders`)}
                  className="px-2.5 py-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Package className="size-3.5" />
                  </div>
                  <span>My Consultations & Orders</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push(`${PATHS.PROFILE}?tab=wishlist`)}
                  className="px-2.5 py-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <div className="size-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Heart className="size-3.5" />
                  </div>
                  <span>Saved Items</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push(PATHS.SETTINGS)}
                  className="px-2.5 py-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <div className="size-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    <Settings className="size-3.5" />
                  </div>
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push(PATHS.HELP)}
                  className="px-2.5 py-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <div className="size-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="size-3.5" />
                  </div>
                  <span>Help & Support</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5" />

              <DropdownMenuItem
                onClick={handleLogout}
                variant="destructive"
                className="px-2.5 py-2 cursor-pointer rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 text-sm font-semibold"
              >
                <div className="size-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <LogOut className="size-3.5" />
                </div>
                <span>{loading ? "Logging out..." : t("logout")}</span>
              </DropdownMenuItem>
            </div>
          </div>
        ) : (
          /* ================= Guest Menu (Not Logged In) ================= */
          <div>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#301118] to-[#4a1924] text-white p-3.5 sm:p-4">
              <div className="flex items-start gap-2.5">
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                  <Sparkles className="size-4 text-amber-300" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white leading-tight">
                    Welcome to Astrology in Bharat
                  </p>
                  <p className="text-xs text-white/70 mt-1 leading-normal">
                    Sign in to consult verified astrologers, track bookings, and
                    manage your wallet.
                  </p>
                </div>
              </div>
            </div>

            {/* Sign In / Register Action CTAs */}
            <div className="p-3 bg-gray-50/80 border-b border-gray-100 space-y-2">
              <Button
                onClick={() =>
                  router.push(
                    `${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(pathname)}`,
                  )
                }
                className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold h-9 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="size-4" />
                <span>{t("signIn")}</span>
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `${PATHS.REGISTER}?callbackUrl=${encodeURIComponent(pathname)}`,
                  )
                }
                className="w-full border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-semibold h-9 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="size-4" />
                <span>{t("register")}</span>
              </Button>
            </div>

            {/* Quick Links for Guest */}
            <div className="p-1.5">
              <DropdownMenuLabel className="px-2.5 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Quick Services
              </DropdownMenuLabel>

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(
                        PATHS.DASHBOARD_ORDERS,
                      )}`,
                    )
                  }
                  className="px-2.5 py-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Package className="size-3.5" />
                  </div>
                  <span>Track Bookings & Orders</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(
                        `${PATHS.PROFILE}?tab=wishlist`,
                      )}`,
                    )
                  }
                  className="px-2.5 py-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <div className="size-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Heart className="size-3.5" />
                  </div>
                  <span>Saved Items / Wishlist</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `${PATHS.SIGN_IN}?callbackUrl=${encodeURIComponent(
                        `${PATHS.PROFILE}?tab=wallet`,
                      )}`,
                    )
                  }
                  className="px-2.5 py-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <div className="size-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Wallet className="size-3.5" />
                  </div>
                  <span>Wallet & Recharge</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push(PATHS.HELP)}
                  className="px-2.5 py-2 cursor-pointer rounded-lg hover:bg-gray-100 flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <div className="size-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="size-3.5" />
                  </div>
                  <span>Help & Support</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
