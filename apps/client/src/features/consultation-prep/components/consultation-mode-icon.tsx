"use client";

import React from "react";
import { MessageSquare, Phone, Video } from "@repo/design/lucide";
import type { ConsultationMode } from "@/features/consultation-prep/stores/consultationPrepStore";
import { cn } from "@repo/design/cn";

export interface ConsultationModeIconProps {
  mode: ConsultationMode;
  className?: string;
}

/**
 * Renders the dedicated Lucide icon corresponding to the consultation mode.
 *
 * @param props - Component properties containing mode and optional className.
 * @returns Mode icon element.
 */
export function ConsultationModeIcon({
  mode,
  className,
}: ConsultationModeIconProps) {
  if (mode === "voice") {
    return <Phone className={cn("shrink-0", className)} aria-hidden="true" />;
  }
  if (mode === "video") {
    return <Video className={cn("shrink-0", className)} aria-hidden="true" />;
  }
  return (
    <MessageSquare className={cn("shrink-0", className)} aria-hidden="true" />
  );
}

/**
 * Returns human-readable sentence-case label for the consultation mode.
 *
 * @param mode - Consultation mode ('chat' | 'voice' | 'video').
 * @returns Human-readable display label.
 */
export function getConsultationModeLabel(mode: ConsultationMode): string {
  if (mode === "voice") return "Voice Call";
  if (mode === "video") return "Video Call";
  return "Live Chat";
}

export interface ConsultationModeBadgeProps {
  mode: ConsultationMode;
  className?: string;
}

/**
 * Pill badge displaying consultation mode icon and formatted label.
 *
 * @param props - Component properties.
 * @returns Mode badge element.
 */
export function ConsultationModeBadge({
  mode,
  className,
}: ConsultationModeBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-xs",
        className,
      )}
    >
      <ConsultationModeIcon mode={mode} className="w-3.5 h-3.5" />
      <span>{getConsultationModeLabel(mode)}</span>
    </div>
  );
}
