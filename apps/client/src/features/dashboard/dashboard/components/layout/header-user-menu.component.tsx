"use client";

import React from "react";
import { ChevronDown, User, Settings, LogOut, Sparkles, Globe } from "@repo/design/lucide";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/shadcn";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@repo/design/shadcn";

export interface HeaderUserMenuProps {
  userName: string;
  initials: string;
  userSubtitle: string;
  avatarUrl?: string;
  onLogout: () => Promise<void>;
}

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

/**
 * Avatar image sub-component with early return for null URL.
 * Follows OpenWolf Rule 4 (zero JSX ternaries).
 *
 * @param props.url - Optional avatar media URL.
 * @returns AvatarImage component or null.
 */
function UserAvatarImage({ url }: { url?: string }) {
  if (!url) {
    return null;
  }
  return <AvatarImage src={url} alt="" className="relative object-cover" />;
}

/**
 * User account profile dropdown menu for dashboard header.
 * Styled with Intercom charcoal ink (#111111) and crisp #d3cec6 hairline borders
 * on a cream canvas (#f5f1ec) with white popover surfaces.
 *
 * @param props - Component properties.
 * @param props.userName - User's display name.
 * @param props.initials - Capitalized initials for avatar fallback.
 * @param props.userSubtitle - Secondary identifier (e.g. phone/email).
 * @param props.avatarUrl - Optional avatar image URL.
 * @param props.onLogout - Async logout handler.
 * @returns Dropdown menu element.
 */
export function HeaderUserMenu({
  userName,
  initials,
  userSubtitle,
  avatarUrl,
  onLogout,
}: HeaderUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${userName}`}
        className="flex min-h-10 items-center gap-2 rounded-full p-1 font-sans text-[#111111] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] sm:gap-2.5 sm:pr-2.5"
      >
        <Avatar className="size-8 ring-1 ring-[#d3cec6]">
          <AvatarFallback className="bg-[#f5f1ec] font-sans text-xs font-bold text-[#111111]">
            {initials}
          </AvatarFallback>
          <UserAvatarImage url={avatarUrl} />
        </Avatar>
        <span className="hidden max-w-28 text-left font-sans xl:block">
          <span className="block truncate font-sans text-xs font-bold leading-4 text-[#111111]">
            {userName}
          </span>
          <span className="block font-sans text-[11px] font-medium leading-3 text-[#7b7b78]">
            My account
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="hidden size-4 text-[#7b7b78] sm:block"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-xl border border-[#d3cec6] bg-white p-1.5 font-sans shadow-none motion-reduce:animate-none"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-2.5 font-sans">
            <span className="block truncate font-sans text-xs font-bold leading-4 text-[#111111]">
              {userName}
            </span>
            <span className="mt-0.5 block truncate font-sans text-[11px] font-medium text-[#7b7b78]">
              {userSubtitle}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#d3cec6]" />
          {accountLinks.map(({ href, label, icon: Icon }) => (
            <DropdownMenuItem
              key={href}
              render={<Link href={href} />}
              className="min-h-9 gap-2.5 rounded-md px-2.5 font-sans text-xs font-semibold text-[#111111] hover:bg-[#f5f1ec] no-underline"
            >
              <Icon aria-hidden="true" className="size-4 text-[#7b7b78]" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[#d3cec6]" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={onLogout}
            className="min-h-9 gap-2.5 rounded-md px-2.5 font-sans text-xs font-semibold"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
