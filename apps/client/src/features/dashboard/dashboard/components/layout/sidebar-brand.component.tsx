"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@repo/ui";
import { PATHS } from "@repo/routes";
import { Link } from "@/i18n/navigation";

export interface SidebarBrandProps {
  onClose?: () => void;
}

/**
 * Dedicated close button rendered only when mobile drawer onClose is provided.
 * Follows OpenWolf Rule 4 (no JSX ternaries, early returns).
 *
 * @param props.onClose - Optional callback invoked when the user requests closing the drawer.
 * @returns Close button element or null when onClose is omitted.
 */
function BrandCloseButton({ onClose }: { onClose?: () => void }) {
  if (!onClose) {
    return null;
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      className="size-9 shrink-0 cursor-pointer rounded-lg text-[#626260] hover:bg-white hover:text-[#111111]"
      aria-label="Close navigation"
    >
      <X aria-hidden="true" className="size-5" />
    </Button>
  );
}

/**
 * Sidebar brand header displaying platform identity and mobile close control.
 * Styled with pure Intercom tokens (#111111 ink, #626260 subtext, #d3cec6 border, #f5f1ec canvas).
 *
 * @param props - Component properties.
 * @param props.onClose - Optional callback for mobile drawer dismissal.
 * @returns Brand header element.
 */
export function SidebarBrand({ onClose }: SidebarBrandProps) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-[#d3cec6] bg-[#f5f1ec] px-5">
      <Link
        href={PATHS.DASHBOARD.ROOT}
        onClick={onClose}
        className="flex min-w-0 items-center gap-2.5 rounded-lg no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
      >
        <Image
          src="/images/Expert.png"
          alt="Astrology in Bharat"
          width={32}
          height={32}
          className="shrink-0 object-contain drop-shadow-xs"
          priority
        />
        <div className="min-w-0">
          <span className="block font-sans text-sm font-bold tracking-tight text-[#111111]">
            Astrology in Bharat
          </span>
          <span className="block text-[11px] font-semibold text-[#626260]">
            Personal sanctuary
          </span>
        </div>
      </Link>
      <BrandCloseButton onClose={onClose} />
    </div>
  );
}
