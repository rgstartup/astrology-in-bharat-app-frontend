"use client";

import { useConsultationRoomStore } from "@/features/consultation/stores/consultation-room.store";

function PausedStatusPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Paused
    </span>
  );
}

function LiveStatusPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
      </span>
      Live now
    </span>
  );
}

/**
 * Live/paused presence pill for the tracker card.
 * Reads paused state from the global consultation room store.
 */
export function ConsultationTrackerStatus() {
  const paused = useConsultationRoomStore((s) => s.paused);
  if (paused) return <PausedStatusPill />;
  return <LiveStatusPill />;
}
