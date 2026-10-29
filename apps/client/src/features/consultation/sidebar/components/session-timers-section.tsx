"use client";

import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRoomRevision } from "@/features/consultation/room/hooks/use-room-revision";

type SessionTimersSectionProps = {
  formatTime: (time: number) => string;
  elapsedTime: number;
  timeLeft: number;
  isWarning?: boolean;
  className?: string;
};

/**
 * Checks if remaining time has crossed the urgent threshold.
 *
 * @param timeLeft - Remaining seconds.
 * @param isWarning - Explicit warning flag.
 * @returns Urgency boolean.
 */
function isLowTimeRemaining(timeLeft: number, isWarning: boolean): boolean {
  if (isWarning) return true;
  if (timeLeft > 0 && timeLeft <= 60) return true;
  return false;
}

/**
 * Renders remaining time display value with urgent warning styling when low.
 *
 * @param props - Low time flag and formatted time text.
 * @returns Time string element.
 */
function RemainingTimeValue({ isLowTime, value }: { isLowTime: boolean; value: string }) {
  if (isLowTime) {
    return <span className="font-mono text-xl font-bold tabular-nums text-red-600">{value}</span>;
  }
  return <span className="font-mono text-xl font-bold tabular-nums text-[#111111]">{value}</span>;
}

/**
 * Visual session timers section grouping elapsed time and remaining time.
 *
 * @param props - Elapsed and remaining seconds, clock formatter, and warning flag.
 * @returns Grouped session timers element.
 */
export function SessionTimersSection({
  formatTime,
  elapsedTime,
  timeLeft,
  isWarning = false,
  className,
}: SessionTimersSectionProps) {
  const elapsedText = formatTime(elapsedTime);
  const remainingText = formatTime(timeLeft);
  const isLowTime = isLowTimeRemaining(timeLeft, isWarning);
  // Lifecycle verdicts (accept/start/resume) remount the timers fresh.
  const revision = useRoomRevision();

  return (
    <div
      key={revision}
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-[#d3cec6] bg-white p-3.5 shadow-xs",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#626260]">
        <Clock className="size-3.5 text-[#7b7b78]" />
        <span>SESSION TIMING</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7b7b78]">
            ELAPSED TIME
          </span>
          <span className="font-mono text-xl font-bold tabular-nums text-[#111111]">
            {elapsedText}
          </span>
        </div>

        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7b7b78]">
            REMAINING TIME
          </span>
          <RemainingTimeValue isLowTime={isLowTime} value={remainingText} />
        </div>
      </div>
    </div>
  );
}
