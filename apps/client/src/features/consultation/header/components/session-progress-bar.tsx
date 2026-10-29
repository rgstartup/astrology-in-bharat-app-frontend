"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SessionProgressBarProps = {
  elapsedTime: number;
  timeLeft: number;
  isWarning?: boolean;
  className?: string;
};

/**
 * Visual fill bar inside the progress track.
 *
 * @param props - Percent value and warning state flag.
 * @returns Styled progress bar fill element.
 */
function ProgressBarFill({
  percent,
  isWarning,
}: {
  percent: number;
  isWarning: boolean;
}) {
  if (isWarning) {
    return (
      <div
        className="h-full rounded-full bg-red-600 transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    );
  }

  return (
    <div
      className="h-full rounded-full bg-[#111111] transition-all duration-300"
      style={{ width: `${percent}%` }}
    />
  );
}

/**
 * Progress bar showing proportion of elapsed time over total session budget.
 *
 * @param props - Timing values, warning condition, and styling class.
 * @returns Progress bar element.
 */
export function SessionProgressBar({
  elapsedTime,
  timeLeft,
  isWarning = false,
  className,
}: SessionProgressBarProps) {
  const total = elapsedTime + timeLeft;
  const percent =
    total > 0
      ? Math.min(100, Math.max(0, Math.round((elapsedTime / total) * 100)))
      : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Consultation session progress"
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-[#f0ebe3]",
        className,
      )}
    >
      <ProgressBarFill percent={percent} isWarning={isWarning} />
    </div>
  );
}
