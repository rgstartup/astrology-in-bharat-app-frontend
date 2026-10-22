import React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaZeroChargeBannerProps = {
  className?: string;
};

/**
 * Reassurance banner confirming no billing occurs while waiting for Agora service or peer connection.
 *
 * @param props - Styling overrides.
 * @returns Zero-charge reassurance pill component.
 */
export function MediaZeroChargeBanner({ className }: MediaZeroChargeBannerProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#d3cec6] bg-white px-3.5 py-1.5 shadow-none",
        className,
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#f5f1ec] text-[#111111]">
        <ShieldCheck className="size-3.5" />
      </span>
      <span className="text-[12px] font-medium text-[#626260]">
        Timer held · No charges until both parties connect
      </span>
    </div>
  );
}
