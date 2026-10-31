"use client";

import React from "react";
import { ChevronRight } from "@repo/design/lucide";
import { Link } from "@/i18n/navigation";
import { cn } from "@repo/design/cn";
import type { NavItem } from "../../data/navigation.data";

export interface SidebarNavItemProps {
  item: NavItem;
  active: boolean;
  onClose?: () => void;
}

/**
 * Intercom charcoal active indicator pill positioned on the leading edge.
 * Follows OpenWolf Rule 4 (early return, no JSX ternaries).
 *
 * @param props.active - Whether the current link represents active page.
 * @returns Indicator element or null.
 */
function ActiveIndicator({ active }: { active: boolean }) {
  if (!active) {
    return null;
  }
  return (
    <span
      aria-hidden="true"
      className="absolute left-1.5 h-4 w-1 rounded-full bg-[#111111]"
    />
  );
}

/**
 * Trailing chevron displayed for active navigation items.
 * Follows OpenWolf Rule 4 (early return, no JSX ternaries).
 *
 * @param props.active - Whether the current link is active.
 * @returns Chevron element or null.
 */
function TrailingChevron({ active }: { active: boolean }) {
  if (!active) {
    return null;
  }
  return (
    <ChevronRight
      aria-hidden="true"
      className="size-4 shrink-0 text-[#111111]"
    />
  );
}

/**
 * Individual sidebar navigation row conforming to pure Intercom specification:
 * - 12px radius (rounded-xl) with font-sans
 * - Active state: white (#ffffff) background with hairline (#d3cec6) border
 * - Deep charcoal ink (#111111) active typography with bold weight
 * - Charcoal (#111111) indicator pill and icon accent on active state
 * - Muted ink (#626260) for inactive links with white hover and charcoal text
 *
 * @param props - Component properties.
 * @param props.item - Navigation item configuration.
 * @param props.active - Whether this route matches current pathname.
 * @param props.onClose - Optional callback for dismissing mobile sheet.
 * @returns Navigation link element.
 */
export function SidebarNavItem({
  item,
  active,
  onClose,
}: SidebarNavItemProps) {
  const Icon = item.icon;

  const baseStyle =
    "group relative flex shrink-0 min-h-10 items-center gap-3 rounded-xl border px-3 py-2 font-sans text-sm leading-5 no-underline transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] motion-reduce:transition-none";

  const stateStyle = active
    ? "border-[#d3cec6] bg-white pl-4.5 font-bold text-[#111111]"
    : "border-transparent font-semibold text-[#626260] hover:border-[#d3cec6] hover:bg-white hover:text-[#111111]";

  const iconStyle = active
    ? "text-[#111111]"
    : "text-[#626260] group-hover:text-[#111111]";

  return (
    <Link
      href={item.href}
      onClick={onClose}
      aria-current={active ? "page" : undefined}
      className={cn(baseStyle, stateStyle)}
    >
      <ActiveIndicator active={active} />
      <Icon
        aria-hidden="true"
        className={cn("size-[18px] shrink-0 transition-colors", iconStyle)}
        strokeWidth={active ? 2.2 : 1.8}
      />
      <span className="flex-1 truncate">{item.name}</span>
      <TrailingChevron active={active} />
    </Link>
  );
}
