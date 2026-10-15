"use client";

import React from "react";
import { PATHS } from "@repo/routes";
import { SidebarNavItem } from "./sidebar-nav-item.component";
import type { NavItem } from "../../data/navigation.data";

export interface SidebarNavGroupProps {
  title: string;
  items: NavItem[];
  pathname: string;
  onClose?: () => void;
}

/**
 * Checks whether a navigation item matches the current active pathname.
 *
 * @param itemHref - The target route href.
 * @param pathname - Current browser pathname.
 * @returns True if route is considered active.
 */
function isItemActive(itemHref: string, pathname: string): boolean {
  if (pathname === itemHref) {
    return true;
  }
  if (itemHref !== PATHS.DASHBOARD.ROOT && pathname.startsWith(`${itemHref}/`)) {
    return true;
  }
  return false;
}

/**
 * Group of sidebar navigation links introduced by a sentence-case Intercom eyebrow.
 * Composes individual SidebarNavItem instances with warm #d3cec6 separators.
 *
 * @param props - Component properties.
 * @param props.title - Group section heading (e.g. "My astrology").
 * @param props.items - List of navigation link configurations.
 * @param props.pathname - Current active pathname.
 * @param props.onClose - Optional drawer dismiss callback.
 * @returns Nav group container element.
 */
export function SidebarNavGroup({
  title,
  items,
  pathname,
  onClose,
}: SidebarNavGroupProps) {
  return (
    <div className="flex shrink-0 flex-col gap-1 border-t border-[#d3cec6] pt-3.5">
      <h2 className="mb-1 px-3 font-sans text-[13px] font-medium normal-case tracking-normal text-[#7b7b78]">
        {title}
      </h2>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            active={isItemActive(item.href, pathname)}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}
