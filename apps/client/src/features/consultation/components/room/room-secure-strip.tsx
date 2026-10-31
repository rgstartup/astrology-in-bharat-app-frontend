"use client";

import SessionStateLabel from "../session/session-state-label";

type RoomSecureStripProps = {
  sessionStatus: string;
};

/** Mobile-only secure-connection strip under the header. */
export default function RoomSecureStrip({
  sessionStatus,
}: RoomSecureStripProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-[#d3cec6] bg-[#f5f1ec] px-4 py-2 md:hidden">
      <SessionStateLabel sessionStatus={sessionStatus} />
      <div className="flex items-center gap-1.5">
        <div className="size-1.5 rounded-full bg-[#0bdf50]" />
        <span className="text-xs font-medium text-[#7b7b78]">
          Secure connection
        </span>
      </div>
    </div>
  );
}
