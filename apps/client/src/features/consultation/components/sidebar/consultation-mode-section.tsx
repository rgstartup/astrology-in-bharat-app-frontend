"use client";

import React from "react";
import { Lock, MessageSquare } from "@repo/design/lucide";
import { cn } from "@repo/design/cn";

type ConsultationModeSectionProps = {
  className?: string;
};

/**
 * Consultation mode section showing active channel type (chat session) and privacy badge.
 *
 * @param props - Styling overrides.
 * @returns Consultation mode element.
 */
export function ConsultationModeSection({
  className,
}: ConsultationModeSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-xl border border-[#d3cec6] bg-[#fdfbf9] p-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7b7b78]">
          CONSULTATION
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#626260] border border-[#d3cec6]">
          <MessageSquare className="size-2.5 text-neutral-600" />
          Active
        </span>
      </div>

      <h4 className="text-sm font-semibold text-[#111111]">Chat session</h4>

      <p className="flex items-center gap-1 text-[11px] text-[#7b7b78]">
        <Lock className="size-3 text-[#7b7b78]" />
        <span>Secure, private conversation</span>
      </p>
    </div>
  );
}
