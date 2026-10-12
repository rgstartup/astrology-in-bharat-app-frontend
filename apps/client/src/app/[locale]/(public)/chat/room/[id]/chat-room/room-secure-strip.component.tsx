"use client";

import { cn } from "@/lib/utils";
import SessionStateLabel from "./session-state-label.component";

type RoomSecureStripProps = {
  sessionStatus: string;
  isDarkMode: boolean;
};

/** Mobile-only secure-connection strip under the header. */
export default function RoomSecureStrip({ sessionStatus, isDarkMode }: RoomSecureStripProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border px-4 py-2 md:hidden",
        isDarkMode ? "bg-muted" : "bg-secondary",
      )}
    >
      <SessionStateLabel sessionStatus={sessionStatus} isDarkMode={isDarkMode} />
      <div className="flex items-center gap-1.5">
        <div className="size-1.5 animate-pulse rounded-full bg-green-500" />
        <span className="text-[10px] opacity-50">Secure Connection</span>
      </div>
    </div>
  );
}
