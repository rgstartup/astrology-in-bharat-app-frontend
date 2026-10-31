"use client";

import React from "react";
import { cn } from "@repo/design/cn";

type SessionMetricsProps = {
  isFree: boolean;
  formatTime: (time: number) => string;
  elapsedTime: number;
  timeLeft: number;
  mounted: boolean;
  isWarning?: boolean;
  className?: string;
};

/**
 * Guard against SSR hydration mismatches when rendering clock strings.
 *
 * @param mounted - Client hydration state.
 * @param formatTime - Clock formatter function.
 * @param seconds - Number of seconds to format.
 * @returns Clock display text.
 */
function getClockDisplay(
  mounted: boolean,
  formatTime: (time: number) => string,
  seconds: number,
): string {
  if (!mounted) return "--:--";
  return formatTime(seconds);
}

/**
 * Determines whether time remaining has crossed the warning threshold.
 *
 * @param timeLeft - Remaining seconds.
 * @param isWarning - Explicit warning flag from consultation room.
 * @returns True when low on time.
 */
function isLowTimeRemaining(timeLeft: number, isWarning: boolean): boolean {
  if (isWarning) return true;
  if (timeLeft > 0 && timeLeft <= 60) return true;
  return false;
}

/**
 * Formatted container block for an individual metric item.
 *
 * @param props - Label and child content.
 * @returns Metric container element.
 */
function MetricCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start leading-none">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7b7b78] md:text-[11px]">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/**
 * Time remaining value display: renders urgent red when balance is low.
 *
 * @param props - State indicating urgency and formatted value string.
 * @returns Value element.
 */
function TimeRemainingValue({
  isLowTime,
  value,
}: {
  isLowTime: boolean;
  value: string;
}) {
  if (isLowTime) {
    return (
      <span className="text-sm font-semibold tabular-nums text-red-600 md:text-base">
        {value}
      </span>
    );
  }
  return (
    <span className="text-sm font-semibold tabular-nums text-[#111111] md:text-base">
      {value}
    </span>
  );
}

/**
 * Resolves the label for the time remaining metric cell.
 *
 * @param isFree - Free promotion indicator.
 * @returns Label string.
 */
function getRemainingLabel(isFree: boolean): string {
  if (isFree) return "FREE TIME REMAINING";
  return "TIME REMAINING";
}

/**
 * Session metrics block displaying the two timing metrics (session time & time remaining)
 * positioned alongside in the header top section.
 *
 * @param props - Timing numbers, free flag, and styling overrides.
 * @returns Session metrics flex element.
 */
export function SessionMetrics({
  isFree,
  formatTime,
  elapsedTime,
  timeLeft,
  mounted,
  isWarning = false,
  className,
}: SessionMetricsProps) {
  const elapsedText = getClockDisplay(mounted, formatTime, elapsedTime);
  const remainingText = getClockDisplay(mounted, formatTime, timeLeft);
  const isLowTime = isLowTimeRemaining(timeLeft, isWarning);
  const remainingLabel = getRemainingLabel(isFree);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-4 sm:gap-6",
        className,
      )}
    >
      <MetricCell label="SESSION TIME">
        <span className="text-sm font-semibold tabular-nums text-[#111111] md:text-base">
          {elapsedText}
        </span>
      </MetricCell>

      <div className="h-7 w-px shrink-0 bg-[#d3cec6]" aria-hidden="true" />

      <MetricCell label={remainingLabel}>
        <TimeRemainingValue isLowTime={isLowTime} value={remainingText} />
      </MetricCell>
    </div>
  );
}
