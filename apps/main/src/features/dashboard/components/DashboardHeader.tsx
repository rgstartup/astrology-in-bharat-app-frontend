"use client";

import React, { useState, useEffect } from "react";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthService } from "@/services/auth.service";
import { useNotification } from "@/store/useNotificationStore";
import {
  Menu,
  Bell,
  Wallet,
  ArrowLeft,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sparkles,
  Globe,
} from "lucide-react";
import Image from "next/image";

interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenMobileMenu,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { unread_count } = useNotification();

  const isOverview = pathname === "/dashboard" || pathname === "/dashboard/";

  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadBalance = async () => {
      const [res, err] = await AuthService.fetchBalance();
      if (!err && res && isMounted) {
        const bal = typeof res === "number" ? res : (res as any)?.balance ?? 0;
        setWalletBalance(bal);
      }
    };

    loadBalance();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const userAvatar = user?.avatar || (user as any)?.profile_picture || "/images/aa.webp";
  const userName = user?.name || "Client";

  return (
    <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left Area: Mobile menu button & Contextual Navigation */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-orange-50 md:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* When navigated away from overview, clicking back takes the user back to Overview */}
        {!isOverview && (
          <Link
            href={PATHS.DASHBOARD}
            className="no-underline inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#ff6b00] transition-colors py-1.5 px-2.5 rounded-lg hover:bg-orange-50/80 border border-orange-200/80 bg-white/80 shadow-2xs"
            title="Return to Dashboard Overview"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span>Back to Overview</span>
          </Link>
        )}

        {/* Unambiguous link to visit public website with Globe icon */}
        <Link
          href="/"
          className="no-underline inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#ff6b00] transition-colors py-1.5 px-2.5 rounded-lg hover:bg-orange-50/60"
          title="Visit Astrology in Bharat main website"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Main Website</span>
        </Link>
      </div>

      {/* Right Area: Wallet balance, Notifications & Profile Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Wallet Balance Pill */}
        <Link
          href={PATHS.DASHBOARD_WALLET}
          className="no-underline flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50/70 hover:bg-orange-100 transition-colors text-xs font-bold text-[#301118]"
        >
          <Wallet className="w-3.5 h-3.5 text-[#ff6b00]" />
          <span>
            {walletBalance !== null ? `₹${walletBalance}` : "₹..."}
          </span>
          <span className="text-[10px] text-[#ff6b00] font-black uppercase tracking-wider pl-0.5">
            + Add
          </span>
        </Link>

        {/* Notification Bell */}
        <Link
          href={PATHS.DASHBOARD_NOTIFICATIONS}
          className="relative p-2 rounded-full text-slate-600 hover:text-[#301118] hover:bg-orange-50 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {Number(unread_count) > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#ff6b00] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
              {unread_count > 9 ? "9+" : unread_count}
            </span>
          )}
        </Link>

        {/* User Profile Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-200 bg-orange-50 shrink-0">
              <Image
                src={userAvatar}
                alt={userName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/aa.webp";
                }}
              />
            </div>
            <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate hidden sm:inline-block">
              {userName}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {userDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-orange-100 py-2 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {userName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user?.phone || user?.email || "Astrology Seeker"}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href={PATHS.DASHBOARD_ASTROLOGY}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#ff6b00] no-underline"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#ff6b00]" />
                    <span>My Astrology Hub</span>
                  </Link>

                  <Link
                    href={PATHS.DASHBOARD_PROFILE}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#ff6b00] no-underline"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Vedic Profile Details</span>
                  </Link>

                  <Link
                    href={PATHS.DASHBOARD_SETTINGS}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#ff6b00] no-underline"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preferences</span>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#ff6b00] no-underline"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>Exit to Main Website</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
