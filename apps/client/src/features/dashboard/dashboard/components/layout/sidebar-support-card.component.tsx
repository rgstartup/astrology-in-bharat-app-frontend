"use client";

import React from "react";
import { HelpCircle, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface SidebarSupportCardProps {
  onClose?: () => void;
}

/**
 * Inset support card at the bottom of the sidebar following pure Intercom:
 * - White (#ffffff) card ground with warm hairline border (#d3cec6)
 * - 16px corner radius (rounded-xl) with no shadow
 * - Charcoal ink (#111111) with muted helper text (#626260)
 *
 * @param props - Component properties.
 * @param props.onClose - Optional drawer dismiss callback.
 * @returns Support card element.
 */
export function SidebarSupportCard({ onClose }: SidebarSupportCardProps) {
  return (
    <div className="shrink-0 bg-[#f5f1ec] p-3 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <Link
        href="/support"
        onClick={onClose}
        className="group flex min-h-12 items-center gap-2.5 rounded-xl border border-[#d3cec6] bg-white p-3 font-sans text-[#111111] no-underline transition-all duration-150 hover:border-[#111111] focus-visible:outline-2 focus-visible:outline-[#111111] motion-reduce:transition-none"
      >
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#d3cec6] bg-white text-[#626260] transition-colors group-hover:border-[#111111] group-hover:text-[#111111]"
        >
          <HelpCircle className="size-4" strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <span className="block text-xs leading-4 font-bold text-[#111111]">
            Here to help
          </span>
          <span className="block truncate text-[11px] leading-4 font-medium text-[#626260]">
            Support & guidance
          </span>
        </div>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 text-[#626260] transition-colors group-hover:text-[#111111]"
        />
      </Link>
    </div>
  );
}
