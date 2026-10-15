"use client";

import React from "react";
import { Globe, Wallet, Bell } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { HeaderUnreadBadge } from "./header-unread-badge.component";
import { HeaderUserMenu } from "./header-user-menu.component";

export interface HeaderActionsProps {
  userName: string;
  initials: string;
  userSubtitle: string;
  avatarUrl?: string;
  unreadCount: number;
  onLogout: () => Promise<void>;
}

const iconBtnClass =
  "relative inline-flex size-10 shrink-0 items-center justify-center rounded-full font-sans text-[#626260] no-underline transition-colors hover:bg-white hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] motion-reduce:transition-none";

/**
 * Header action controls group:
 * - Explore website link (desktop) as charcoal pill CTA
 * - Wallet quick action button with hairline border (#d3cec6)
 * - Notification bell with charcoal unread badge
 * - User profile dropdown menu
 *
 * @param props - Component properties.
 * @returns Header actions container element.
 */
export function HeaderActions({
  userName,
  initials,
  userSubtitle,
  avatarUrl,
  unreadCount,
  onLogout,
}: HeaderActionsProps) {
  const notificationAriaLabel =
    unreadCount > 0
      ? `Notifications, ${unreadCount} unread`
      : "Notifications";

  return (
    <div className="flex shrink-0 items-center gap-1.5 font-sans sm:gap-2">
      <Link
        href="/"
        className="hidden min-h-10 items-center gap-2 rounded-full bg-[#111111] px-4 font-sans text-xs font-medium text-white no-underline transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] lg:inline-flex"
      >
        <Globe aria-hidden="true" className="size-4 text-white" />
        Explore website
      </Link>

      <Link
        href={PATHS.DASHBOARD.WALLET}
        aria-label="Wallet and credits"
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-[#d3cec6] bg-white px-3.5 font-sans text-xs font-bold text-[#111111] no-underline shadow-none transition-colors duration-150 hover:border-[#111111] hover:bg-[#f5f1ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
      >
        <Wallet aria-hidden="true" className="size-4 text-[#111111]" />
        <span className="hidden sm:inline">Wallet</span>
      </Link>

      <Link
        href={PATHS.DASHBOARD.NOTIFICATIONS}
        className={iconBtnClass}
        aria-label={notificationAriaLabel}
      >
        <Bell aria-hidden="true" className="size-4.5" strokeWidth={1.8} />
        <HeaderUnreadBadge count={unreadCount} />
      </Link>

      <HeaderUserMenu
        userName={userName}
        initials={initials}
        userSubtitle={userSubtitle}
        avatarUrl={avatarUrl}
        onLogout={onLogout}
      />
    </div>
  );
}
