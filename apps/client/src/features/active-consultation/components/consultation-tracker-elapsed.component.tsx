"use client";

import { Timer } from "lucide-react";
import { useTrackerElapsed } from "../hooks/use-tracker-elapsed";

/**
 * Live-ticking session clock for the tracker card.
 *
 * @param startedAt - ISO start timestamp of the consultation.
 */
export function ConsultationTrackerElapsed({ startedAt }: { startedAt: string }) {
  const elapsed = useTrackerElapsed(startedAt);
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium tabular-nums text-slate-500">
      <Timer className="h-3.5 w-3.5" />
      {elapsed}
    </span>
  );
}
