"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SessionStatusBadgeProps = {
  sessionStatus: string;
  className?: string;
};

/**
 * Status indicator dot. Emits pulse animation for live sessions.
 *
 * @param props - Status string prop.
 * @returns Status dot element.
 */
function StatusDot({ status }: { status: string }) {
  if (status === "active") {
    return (
      <span className="relative flex size-2 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
    );
  }

  if (status === "pending" || status === "waiting") {
    return <span className="size-2 shrink-0 rounded-full bg-amber-500" />;
  }

  if (status === "paused") {
    return <span className="size-2 shrink-0 rounded-full bg-amber-500" />;
  }

  return <span className="size-2 shrink-0 rounded-full bg-[#7b7b78]" />;
}

/**
 * Resolves friendly label for session lifecycle status.
 *
 * @param status - Raw status string.
 * @returns User facing status label.
 */
function getStatusLabel(status: string): string {
  if (status === "active") return "Connected";
  if (status === "pending" || status === "waiting") return "Connecting…";
  if (status === "paused") return "Paused";
  if (status === "completed" || status === "ended") return "Ended";
  return "Connected";
}

/**
 * Session status pill with colored indicator and status text.
 *
 * @param props - Component properties containing sessionStatus and optional className.
 * @returns Status badge component.
 */
export function SessionStatusBadge({ sessionStatus, className }: SessionStatusBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[#d3cec6] bg-[#f5f1ec]/60 px-2.5 py-1 text-xs font-medium text-[#111111]",
        className,
      )}
    >
      <StatusDot status={sessionStatus} />
      <span className="whitespace-nowrap">{getStatusLabel(sessionStatus)}</span>
    </div>
  );
}
