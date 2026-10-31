"use client";

import { Timer } from "@repo/design/lucide";
import { useTrackerElapsed } from "../hooks/use-tracker-elapsed";

/**
 * Live-ticking session clock for the tracker card.
 *
 */
export function ConsultationTrackerElapsed() {
  const elapsed = useTrackerElapsed();
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium tabular-nums text-slate-500">
      <Timer className="h-3.5 w-3.5" />
      {elapsed}
    </span>
  );
}
