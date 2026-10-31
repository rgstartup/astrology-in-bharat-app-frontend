"use client";

import React from "react";
import { ArrowLeft } from "@repo/design/lucide";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@repo/design/cn";

type BackAffordanceProps = {
  router: ReturnType<typeof useRouter>;
  className?: string;
};

/**
 * Back navigation affordance linking back to consultations or previous page.
 *
 * @param props - Component properties containing router and optional class name.
 * @returns Clickable back navigation affordance.
 */
export function BackAffordance({ router, className }: BackAffordanceProps) {
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        "group inline-flex items-center gap-1.5 text-xs font-medium text-[#626260] transition-colors hover:text-[#111111] md:text-sm",
        className,
      )}
    >
      <ArrowLeft className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
      <span>Back to consultations</span>
    </button>
  );
}
