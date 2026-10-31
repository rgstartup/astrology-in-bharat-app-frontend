"use client";

import React from "react";
import { ArrowLeft, ShieldCheck } from "@repo/design/lucide";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@repo/design/cn";

type SidebarHeaderProps = {
  router: ReturnType<typeof useRouter>;
  className?: string;
};

/**
 * Top header of the consultation sidebar with breadcrumb navigation and secure badge.
 *
 * @param props - Router instance and optional styling class.
 * @returns Sidebar header element.
 */
export function SidebarHeader({ router, className }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-[#f0ebe3] pb-4",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#7b7b78] transition-colors hover:text-[#111111]"
      >
        <ArrowLeft className="size-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to consultations</span>
      </button>

      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <ShieldCheck className="size-3.5 shrink-0 text-emerald-600" />
        <span>Connected securely</span>
      </div>
    </div>
  );
}
