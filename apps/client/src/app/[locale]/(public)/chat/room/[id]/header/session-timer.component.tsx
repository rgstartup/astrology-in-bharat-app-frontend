"use client";

import { Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type SessionTimerProps = {
  isFree: boolean;
  formatTime: (time: number) => string;
  elapsedTime: number;
  timeLeft: number;
  mounted: boolean;
  isWarning?: boolean;
  className?: string;
};

function getRemainingCaption(isFree: boolean): string {
  if (isFree) return "Free Time";
  return "Time Left";
}

export function SessionTimer({
  isFree,
  formatTime,
  elapsedTime,
  timeLeft,
  mounted,
  isWarning = false,
  className,
}: SessionTimerProps) {
  const elapsedLabel = mounted ? formatTime(elapsedTime) : "--:--";
  const remainingLabel = mounted ? formatTime(timeLeft) : "--:--";

  const isLowTime = isWarning || (timeLeft > 0 && timeLeft <= 60);
  const isCritical = isLowTime && timeLeft > 0 && timeLeft <= 10;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-[8px] font-black uppercase leading-none tracking-widest text-primary-foreground/70">
          Elapsed
        </span>
        <span className="text-sm font-black leading-tight tabular-nums text-primary-foreground">
          {elapsedLabel}
        </span>
      </div>
      <Separator orientation="vertical" className="h-8 bg-primary-foreground/20" />
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1 shadow-inner transition-colors duration-300",
          isCritical
            ? "animate-pulse border-red-500 bg-red-950/70 shadow-red-500/30"
            : isLowTime
              ? "border-red-500/60 bg-red-950/40"
              : "border-primary-foreground/20 bg-black/20",
        )}
      >
        <Clock
          className={cn(
            "size-3.5 shrink-0 transition-colors",
            isLowTime ? "text-red-400" : "text-primary-foreground/80",
          )}
        />
        <div className="flex flex-col items-start">
          <span
            className={cn(
              "text-[7px] font-black uppercase leading-none tracking-widest transition-colors",
              isLowTime ? "text-red-300" : "text-primary-foreground/70",
            )}
          >
            {getRemainingCaption(isFree)}
          </span>
          <span
            className={cn(
              "text-sm font-black leading-tight tabular-nums transition-colors",
              isLowTime ? "text-red-400 font-extrabold" : "text-primary-foreground",
            )}
          >
            {remainingLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
