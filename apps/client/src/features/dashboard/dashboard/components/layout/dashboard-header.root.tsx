"use client";

import React from "react";
import { Menu } from "@repo/design/lucide";
import { usePathname } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { useAuthStore } from "@/store/authStore";
import { useNotification } from "@/store/notificationStore";
import { SheetTrigger } from "@repo/design/shadcn";
import { HeaderBreadcrumb } from "./header-breadcrumb.component";
import { HeaderActions } from "./header-actions.component";
import {
  ASTROLOGY_SUB_LINKS,
  MAIN_SERVICES_NAV,
  ACCOUNT_NAV_ITEMS,
} from "../../data/navigation.data";

const allNavigation = [
  ...ASTROLOGY_SUB_LINKS,
  ...MAIN_SERVICES_NAV,
  ...ACCOUNT_NAV_ITEMS,
];

/**
 * Derives current page human-readable title from pathname.
 *
 * @param pathname - Current URL pathname.
 * @returns Matched navigation name or sensible fallback.
 */
function resolvePageTitle(pathname: string): string {
  const matched = allNavigation.find(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
  );
  if (matched) {
    return matched.name;
  }
  if (pathname.startsWith(PATHS.DASHBOARD.ASTROLOGY)) {
    return "My astrology";
  }
  return "Your dashboard";
}

/**
 * Derives user display name with fallback hierarchy.
 *
 * @param user - User store object.
 * @returns Resolved name string.
 */
function resolveDisplayName(
  user: { name?: string | null; first_name?: string | null; last_name?: string | null } | null | undefined,
): string {
  if (user?.name?.trim()) {
    return user.name.trim();
  }
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  if (fullName) {
    return fullName;
  }
  return "Client";
}

/**
 * Derives user avatar fallback initials.
 *
 * @param name - Display name.
 * @returns 1-2 character uppercase initials.
 */
function resolveInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/**
 * Header root orchestrator component for the client dashboard.
 * Styled with Intercom high-contrast tokens:
 * - Cream canvas container (#f5f1ec) with hairline border (#d3cec6)
 * - Mobile sheet drawer trigger
 * - Breadcrumb path tracker
 * - Action controls with wallet balance and unread notification badge
 *
 * @returns Dashboard header element.
 */
export function DashboardHeader() {
  const pathname = usePathname().replace(/\/$/, "");
  const { user, logout } = useAuthStore();
  const { unread_count } = useNotification();

  const isOverview = pathname === PATHS.DASHBOARD.ROOT;
  const pageName = resolvePageTitle(pathname);
  const userName = resolveDisplayName(user);
  const initials = resolveInitials(userName);
  const userSubtitle = user?.phone || user?.email || "Personal sanctuary";
  const unreadCount = Number(unread_count) || 0;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="flex h-full items-center justify-between gap-3 bg-[#f5f1ec] px-4 font-sans sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <SheetTrigger
          aria-label="Open navigation"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full font-sans text-[#626260] transition-colors hover:bg-white hover:text-[#111111] md:hidden focus-visible:outline-2 focus-visible:outline-[#111111]"
        >
          <Menu aria-hidden="true" className="size-5" />
        </SheetTrigger>
        <HeaderBreadcrumb isOverview={isOverview} pageName={pageName} />
      </div>

      <HeaderActions
        userName={userName}
        initials={initials}
        userSubtitle={userSubtitle}
        avatarUrl={user?.avatar_media?.url}
        unreadCount={unreadCount}
        onLogout={handleLogout}
      />
    </div>
  );
}
