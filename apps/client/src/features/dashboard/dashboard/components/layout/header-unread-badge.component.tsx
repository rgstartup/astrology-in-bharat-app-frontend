"use client";

import React from "react";

export interface HeaderUnreadBadgeProps {
  count: number;
}

/**
 * Derives badge label string with standard 9+ overflow capping.
 *
 * @param count - Numerical unread count.
 * @returns Human-readable count string.
 */
function formatBadgeCount(count: number): string {
  if (count > 9) {
    return "9+";
  }
  return String(count);
}

/**
 * Unread notification badge styled in Intercom charcoal (#111111) with white text.
 * Implements strict OpenWolf Rule 4 (no JSX ternaries, early return on 0).
 *
 * @param props - Component properties.
 * @param props.count - Unread count number.
 * @returns Unread badge element or null if count <= 0.
 */
export function HeaderUnreadBadge({ count }: HeaderUnreadBadgeProps) {
  if (count <= 0) {
    return null;
  }

  const label = formatBadgeCount(count);

  return (
    <span
      aria-hidden="true"
      className="absolute right-1 top-1 flex min-w-4 h-4 items-center justify-center rounded-full bg-[#111111] px-1 font-sans text-[10px] font-bold leading-none text-white ring-2 ring-[#f5f1ec]"
    >
      {label}
    </span>
  );
}
