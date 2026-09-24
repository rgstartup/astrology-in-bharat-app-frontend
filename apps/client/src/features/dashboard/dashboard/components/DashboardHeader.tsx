"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotification } from "@/store/useNotificationStore";
import {
  Menu,
  Compass,
  Bell,
  Wallet,
  ChevronDown,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Sparkles,
  Globe,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ASTROLOGY_SUB_LINKS,
  MAIN_SERVICES_NAV,
  ACCOUNT_NAV_ITEMS,
} from "../data/navigation.data";

const navigation = [
  ...ASTROLOGY_SUB_LINKS,
  ...MAIN_SERVICES_NAV,
  ...ACCOUNT_NAV_ITEMS,
];
const accountLinks = [
  {
    href: PATHS.DASHBOARD.ASTROLOGY,
    label: "My astrology hub",
    icon: Sparkles,
  },
  { href: PATHS.DASHBOARD.PROFILE, label: "My profile", icon: User },
  { href: PATHS.DASHBOARD.SETTINGS, label: "Preferences", icon: Settings },
  { href: "/", label: "Visit main website", icon: Globe },
];
const iconLink =
  "inline-flex size-11 sm:size-10 shrink-0 items-center justify-center rounded-full text-slate-800 no-underline transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none";

export const DashboardHeader: React.FC = () => {
  const pathname = usePathname().replace(/\/$/, "");
  const { user, logout } = useAuthStore();
  const { unread_count } = useNotification();

  const isOverview = pathname === PATHS.DASHBOARD.ROOT;

  const pageName =
    navigation.find(
      ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
    )?.name ??
    (pathname.startsWith(PATHS.DASHBOARD.ASTROLOGY)
      ? "My astrology"
      : "Your dashboard");

  const userName =
    user?.name?.trim() ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "Client";

  const initials = userName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const unread = Number(unread_count) || 0;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="flex h-full items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8 bg-amber-500/25 border-b border-amber-800">
      <div className="flex min-w-0 items-center gap-2">
        <SheetTrigger
          aria-label="Open navigation"
          className={`${iconLink} md:hidden`}
        >
          <Menu aria-hidden="true" className="size-5" />
        </SheetTrigger>
        <span
          aria-hidden="true"
          className="mr-1 hidden size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 md:flex"
        >
          <Compass className="size-5" strokeWidth={1.7} />
        </span>
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex min-w-0 items-center gap-2 text-sm">
            <li
              className={
                isOverview
                  ? "font-outfit text-base font-semibold leading-6 tracking-tight text-slate-800 sm:text-lg"
                  : "hidden sm:block"
              }
            >
              {isOverview ? (
                <span aria-current="page">Overview</span>
              ) : (
                <Link
                  href={PATHS.DASHBOARD.ROOT}
                  className="inline-flex min-h-11 sm:min-h-10 items-center rounded-full text-sm font-normal leading-5 text-muted-foreground no-underline hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  Overview
                </Link>
              )}
            </li>
            {!isOverview && (
              <>
                <li
                  aria-hidden="true"
                  className="hidden text-muted-foreground sm:block"
                >
                  <ChevronRight className="size-4" />
                </li>
                <li
                  aria-current="page"
                  className="truncate font-outfit text-base font-semibold leading-6 tracking-tight text-slate-800 sm:text-lg"
                >
                  {pageName}
                </li>
              </>
            )}
          </ol>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Link
          href="/"
          className="hidden min-h-11 sm:min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-slate-800 no-underline transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-ring lg:inline-flex"
        >
          <Globe aria-hidden="true" className="size-4" /> Explore website
        </Link>
        <Link
          href={PATHS.DASHBOARD.WALLET}
          aria-label="Wallet and credits"
          className="inline-flex min-h-11 sm:min-h-10 min-w-11 sm:min-w-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-3"
        >
          <Wallet aria-hidden="true" className="size-[18px]" />
          <span className="hidden sm:inline">Wallet</span>
        </Link>
        <Link
          href={PATHS.DASHBOARD.NOTIFICATIONS}
          className={`relative ${iconLink}`}
          aria-label={
            unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
          }
        >
          <Bell aria-hidden="true" className="size-5" strokeWidth={1.7} />
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-slate-700 px-1 text-[10px] font-semibold leading-4 text-primary-foreground ring-2 ring-background"
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Account menu for ${userName}`}
            className="ml-1 flex min-h-11 sm:min-h-10 items-center gap-2 rounded-full bg-background p-1 text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-2 sm:pr-2.5"
          >
            <Avatar className="size-8">
              <AvatarFallback className="absolute inset-0">
                {initials}
              </AvatarFallback>
              {user?.avatar_media?.url && (
                <AvatarImage
                  src={user.avatar_media.url}
                  alt=""
                  className="relative"
                />
              )}
            </Avatar>
            <span className="hidden max-w-28 text-left xl:block">
              <span className="block truncate text-sm font-semibold leading-5">
                {userName}
              </span>
              <span className="block text-xs font-normal leading-4 text-muted-foreground">
                My account
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className="hidden size-4 text-muted-foreground sm:block"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={12}
            className="w-64 p-2 motion-reduce:animate-none"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-3">
                <span className="block truncate text-sm font-semibold leading-5 text-foreground">
                  {userName}
                </span>
                <span className="mt-1 block truncate text-xs font-normal leading-4">
                  {user?.phone || user?.email || "Your personal space"}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {accountLinks.map(({ href, label, icon: Icon }) => (
                <DropdownMenuItem
                  key={href}
                  render={<Link href={href} />}
                  className="min-h-11 sm:min-h-10 gap-3 px-3 no-underline"
                >
                  <Icon aria-hidden="true" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={handleLogout}
                className="min-h-11 sm:min-h-10 gap-3 px-3"
              >
                <LogOut aria-hidden="true" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
