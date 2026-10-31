"use client";

import { Clock } from "@repo/design/lucide";
import { Separator } from "@repo/design/shadcn";
import { cn } from "@repo/design/cn";

type SessionTimerProps = {
  isFree: boolean;
  formatTime: (time: number) => string;
  elapsedTime: number;
  timeLeft: number;
  mounted: boolean;
  isWarning?: boolean;
  className?: string;
};

type SessionTimerCompactProps = {
  isFree: boolean;
  formatTime: (time: number) => string;
  timeLeft: number;
  mounted: boolean;
  isWarning?: boolean;
  className?: string;
};

function getRemainingCaption(isFree: boolean): string {
  if (isFree) return "Free time";
  return "Time left";
}

function getDisplayLabel(mounted: boolean, formatTime: (time: number) => string, value: number): string {
  if (!mounted) return "--:--";
  return formatTime(value);
}

/**
 * True while the remaining-time pill must render its urgent state
 * (explicit warning flag or sixty seconds or less left on the clock).
 *
 * @param timeLeft remaining seconds from the room timer.
 * @param isWarning explicit low-balance warning from the room.
 * @returns whether the urgent treatment applies.
 */
function isLowTimeRemaining(timeLeft: number, isWarning: boolean): boolean {
  if (isWarning) return true;
  if (timeLeft > 0 && timeLeft <= 60) return true;
  return false;
}

function ElapsedBlock({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="text-xs font-medium leading-none text-[#7b7b78]">
        Elapsed
      </span>
      <span className="text-sm font-semibold leading-tight tabular-nums text-[#111111]">
        {label}
      </span>
    </div>
  );
}

function NormalRemaining({ caption, label }: { caption: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#d3cec6] bg-white px-3 py-1">
      <Clock className="size-3.5 shrink-0 text-[#626260]" />
      <div className="flex flex-col items-start">
        <span className="text-xs font-medium leading-none text-[#7b7b78]">
          {caption}
        </span>
        <span className="text-sm font-semibold leading-tight tabular-nums text-[#111111]">
          {label}
        </span>
      </div>
    </div>
  );
}

function UrgentRemaining({ caption, label }: { caption: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#c41c1c] bg-white px-3 py-1">
      <Clock className="size-3.5 shrink-0 text-[#c41c1c]" />
      <div className="flex flex-col items-start">
        <span className="text-xs font-medium leading-none text-[#c41c1c]">
          {caption}
        </span>
        <span className="text-sm font-semibold leading-tight tabular-nums text-[#c41c1c]">
          {label}
        </span>
      </div>
    </div>
  );
}

function RemainingBlock({
  caption,
  label,
  isLowTime,
}: {
  caption: string;
  label: string;
  isLowTime: boolean;
}) {
  if (isLowTime) return <UrgentRemaining caption={caption} label={label} />;
  return <NormalRemaining caption={caption} label={label} />;
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
  const elapsedLabel = getDisplayLabel(mounted, formatTime, elapsedTime);
  const remainingLabel = getDisplayLabel(mounted, formatTime, timeLeft);

  const isLowTime = isLowTimeRemaining(timeLeft, isWarning);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ElapsedBlock label={elapsedLabel} />
      <Separator orientation="vertical" className="h-8 bg-[#d3cec6]" />
      <RemainingBlock
        caption={getRemainingCaption(isFree)}
        label={remainingLabel}
        isLowTime={isLowTime}
      />
    </div>
  );
}

function CompactNormalPill({ caption, label }: { caption: string; label: string }) {
  return (
    <div
      aria-label={`${caption}: ${label}`}
      className="flex items-center gap-1.5 rounded-full border border-[#d3cec6] bg-white px-2.5 py-1"
    >
      <Clock className="size-3.5 shrink-0 text-[#626260]" />
      <span className="text-sm font-semibold leading-tight tabular-nums text-[#111111]">
        {label}
      </span>
    </div>
  );
}

function CompactUrgentPill({ caption, label }: { caption: string; label: string }) {
  return (
    <div
      aria-label={`${caption}: ${label}`}
      className="flex items-center gap-1.5 rounded-full border border-[#c41c1c] bg-white px-2.5 py-1"
    >
      <Clock className="size-3.5 shrink-0 text-[#c41c1c]" />
      <span className="text-sm font-semibold leading-tight tabular-nums text-[#c41c1c]">
        {label}
      </span>
    </div>
  );
}

/**
 * Compact remaining-time pill for narrow headers. Shows only the countdown
 * (no elapsed block) so the single header row fits small viewports.
 *
 * @param isFree whether the session runs on free minutes (caption only).
 * @param formatTime seconds-to-clock formatter from the room.
 * @param timeLeft remaining seconds from the room timer.
 * @param mounted whether the client has hydrated (guards SSR clock text).
 * @param isWarning explicit low-balance warning from the room.
 * @param className optional layout overrides (e.g. responsive visibility).
 * @returns the remaining-time pill.
 */
export function SessionTimerCompact({
  isFree,
  formatTime,
  timeLeft,
  mounted,
  isWarning = false,
  className,
}: SessionTimerCompactProps) {
  const caption = getRemainingCaption(isFree);
  const label = getDisplayLabel(mounted, formatTime, timeLeft);

  if (isLowTimeRemaining(timeLeft, isWarning))
    return (
      <div className={cn("flex items-center", className)}>
        <CompactUrgentPill caption={caption} label={label} />
      </div>
    );
  return (
    <div className={cn("flex items-center", className)}>
      <CompactNormalPill caption={caption} label={label} />
    </div>
  );
}
