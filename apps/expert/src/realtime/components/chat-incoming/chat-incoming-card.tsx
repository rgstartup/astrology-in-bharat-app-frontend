"use client";

import React, { useEffect, useState } from "react";
import { Clock, MessageSquare, Phone, Video, X, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { ChatIncomingPayload } from "@/realtime/types/chat";
import type { ExpertSessionKind } from "@/features/consultation/session";

/** Fallback when the payload carries no explicit expiry (backend default). */
export const CHAT_REQUEST_TTL_SEC = 120;

export interface ChatIncomingCardProps {
  request: ChatIncomingPayload;
  ttlSec?: number;
  onAccept?: (consultationId: number, sessionId: number | null) => Promise<void> | void;
  onReject?: (consultationId: number) => Promise<void> | void;
  onExpire?: (consultationId: number) => void;
  onOpenModal?: (consultationId: number) => void;
}

/**
 * Mode icon displayed in the incoming request card header.
 */
function IncomingModeIcon({ mode }: { mode: ExpertSessionKind }) {
  if (mode === "video") {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-xs">
        <Video className="size-4" />
      </div>
    );
  }

  if (mode === "voice") {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
        <Phone className="size-4" />
      </div>
    );
  }

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shadow-xs">
      <MessageSquare className="size-4" />
    </div>
  );
}

/**
 * Mode tag badge string.
 */
function getModeTagLabel(mode: ExpertSessionKind): string {
  if (mode === "video") return "Video Call";
  if (mode === "voice") return "Voice Call";
  return "Chat Request";
}

/**
 * Compact floating incoming request notification popup.
 *
 * Appears upon client join request across chat, voice, and video.
 * Displays minor devotee details and countdown. Clicking the card
 * opens the full ExpertCallWaitingModal to review details and accept/reject.
 */
export function ChatIncomingCard({
  request,
  ttlSec = CHAT_REQUEST_TTL_SEC,
  onReject,
  onExpire,
  onOpenModal,
}: ChatIncomingCardProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const resolvedMode: ExpertSessionKind =
    request.mode ?? (request.token || request.channelName ? "voice" : "chat");

  const expiresAt = new Date(request.timestamp).getTime() + ttlSec * 1000;
  const remainingSec = Math.max(0, Math.round((expiresAt - now) / 1000));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (remainingSec <= 0) {
      onExpire?.(request.consultationId);
      return;
    }
    const timer = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(timer);
  }, [remainingSec, request.consultationId, onExpire]);

  const urgent = remainingSec <= 15;
  const progress = Math.min(100, (remainingSec / ttlSec) * 100);

  const clientDisplayName =
    request.clientName ?? `Devotee #${request.clientId}`;
  const clientInitials = clientDisplayName.slice(0, 2).toUpperCase();
  const modeTag = getModeTagLabel(resolvedMode);

  let mountedClass = "translate-y-4 opacity-0";
  if (mounted) {
    mountedClass = "translate-y-0 opacity-100";
  }

  let urgentBadgeClass = "bg-slate-100 text-slate-700";
  let progressColorClass = "bg-orange-500";
  if (urgent) {
    urgentBadgeClass = "bg-red-50 text-red-700 border-red-200 animate-pulse";
    progressColorClass = "bg-red-500";
  }

  const handleCardClick = () => {
    onOpenModal?.(request.consultationId);
  };

  const handleQuickDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReject?.(request.consultationId);
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Incoming ${modeTag} from ${clientDisplayName}`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={cn(
        "group relative w-84 cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-2xl active:scale-[0.99] motion-reduce:transition-none",
        mountedClass,
      )}
    >
      {/* Top Row: Mode icon, Client snapshot, Countdown & Quick Dismiss */}
      <div className="flex items-start gap-3">
        <IncomingModeIcon mode={resolvedMode} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              {modeTag}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[10px] font-medium text-slate-400">
              #{request.consultationId}
            </span>
          </div>

          <h4 className="truncate text-xs font-bold text-slate-900">
            {clientDisplayName}
          </h4>

          {request.topic && (
            <p className="mt-0.5 truncate text-[11px] text-slate-500">
              {request.topic}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleQuickDecline}
            aria-label="Decline request"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="size-3.5" />
          </button>

          <Badge
            variant="secondary"
            className={cn("h-5 px-1.5 text-[10px] font-semibold gap-1", urgentBadgeClass)}
            aria-label={`${remainingSec} seconds left`}
          >
            <Clock className="size-2.5" />
            <span>{remainingSec}s</span>
          </Badge>
        </div>
      </div>

      {/* Action Prompt Strip */}
      <div className="mt-2.5 flex items-center justify-between border-t border-slate-100/80 pt-2 text-[11px]">
        <span className="font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
          Click to review & accept
        </span>
        <span className="flex items-center text-xs font-semibold text-orange-600 group-hover:translate-x-0.5 transition-transform">
          <span>Open</span>
          <ChevronRight className="size-3.5" />
        </span>
      </div>

      {/* Expiry progress bar */}
      <div
        className="absolute bottom-0 inset-x-0 h-1 overflow-hidden bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={ttlSec}
        aria-valuenow={remainingSec}
        aria-label="Time left to respond"
      >
        <div
          className={cn("h-full transition-[width] duration-1000", progressColorClass)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </Card>
  );
}

export default ChatIncomingCard;
