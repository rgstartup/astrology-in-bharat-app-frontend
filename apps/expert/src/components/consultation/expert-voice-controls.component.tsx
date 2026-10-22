"use client";

import React, { useState } from "react";
import {
  FileText,
  MessageSquareText,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExpertSessionPhase } from "./types";

interface ExpertVoiceControlsProps {
  phase: ExpertSessionPhase;
  muted?: boolean;
  onToggleMute?: () => void;
  speakerMuted?: boolean;
  onToggleSpeaker?: () => void;
  isDrawerOpen?: boolean;
  onToggleDrawer?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onEndCall: () => void;
  onSwitchToChat?: () => void;
  className?: string;
}

/**
 * Circular 48px control button with pressed-state styling.
 */
function ControlButton({
  pressed,
  label,
  onToggle,
  variant = "default",
  children,
}: {
  pressed: boolean;
  label: string;
  onToggle: () => void;
  variant?: "default" | "danger" | "success";
  children: React.ReactNode;
}) {
  if (variant === "danger") {
    return (
      <Button
        size="icon"
        aria-label={label}
        onClick={onToggle}
        className="size-12 shrink-0 rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-95 transition-all"
      >
        {children}
      </Button>
    );
  }

  if (variant === "success") {
    return (
      <Button
        size="icon"
        aria-label={label}
        onClick={onToggle}
        className="size-12 shrink-0 rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
      >
        {children}
      </Button>
    );
  }

  if (pressed) {
    return (
      <Button
        size="icon"
        aria-label={label}
        aria-pressed="true"
        onClick={onToggle}
        className="size-12 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black active:scale-95 transition-all"
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      variant="outline"
      aria-label={label}
      aria-pressed="false"
      onClick={onToggle}
      className="size-12 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec] active:scale-95 transition-all"
    >
      {children}
    </Button>
  );
}

/**
 * Controls cluster for Expert Voice Consultation.
 * Aligns all voice controls and the end consultation button in one single line.
 */
export function ExpertVoiceControls({
  phase,
  muted: controlledMuted,
  onToggleMute,
  speakerMuted: controlledSpeakerMuted,
  onToggleSpeaker,
  isDrawerOpen = false,
  onToggleDrawer,
  onAccept,
  onDecline,
  onEndCall,
  onSwitchToChat,
  className,
}: ExpertVoiceControlsProps) {
  const [localMuted, setLocalMuted] = useState(false);
  const [localSpeakerMuted, setLocalSpeakerMuted] = useState(false);

  const isMuted = controlledMuted ?? localMuted;
  const isSpeakerOff = controlledSpeakerMuted ?? localSpeakerMuted;

  function handleMute() {
    if (onToggleMute) onToggleMute();
    else setLocalMuted((prev) => !prev);
  }

  function handleSpeaker() {
    if (onToggleSpeaker) onToggleSpeaker();
    else setLocalSpeakerMuted((prev) => !prev);
  }

  // Incoming Call State: Expert can Accept or Decline
  if (phase === "incoming") {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-6 px-6 py-4",
          className
        )}
      >
        <Button
          onClick={onDecline ?? onEndCall}
          className="h-12 gap-2 rounded-full border border-red-200 bg-red-50 px-6 text-sm font-semibold text-red-700 hover:bg-red-100"
        >
          <PhoneOff className="size-4" />
          <span>Decline</span>
        </Button>

        <Button
          onClick={onAccept ?? onEndCall}
          className="h-12 gap-2 rounded-full bg-emerald-600 px-8 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 active:scale-95"
        >
          <Phone className="size-4 animate-bounce" />
          <span>Accept Consultation</span>
        </Button>
      </div>
    );
  }

  // Live or Connecting State: All controls aligned in one single horizontal line
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-6 py-4",
        className
      )}
    >
      {/* Mic Toggle */}
      <ControlButton
        pressed={isMuted}
        label={isMuted ? "Unmute microphone" : "Mute microphone"}
        onToggle={handleMute}
      >
        {isMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
      </ControlButton>

      {/* Speaker Toggle */}
      <ControlButton
        pressed={isSpeakerOff}
        label={isSpeakerOff ? "Turn devotee audio on" : "Mute devotee audio"}
        onToggle={handleSpeaker}
      >
        {isSpeakerOff ? (
          <VolumeX className="size-5" />
        ) : (
          <Volume2 className="size-5" />
        )}
      </ControlButton>

      {/* Kundli / Intake Dossier Drawer Toggle */}
      {onToggleDrawer && (
        <ControlButton
          pressed={isDrawerOpen}
          label={isDrawerOpen ? "Close Kundli dossier" : "Open Kundli dossier"}
          onToggle={onToggleDrawer}
        >
          <FileText className="size-5" />
        </ControlButton>
      )}

      {/* Switch to Chat & Charts (if provided) */}
      {onSwitchToChat && (
        <Button
          variant="outline"
          onClick={onSwitchToChat}
          className="h-12 gap-2 rounded-full border-[#d3cec6] bg-white px-5 text-sm font-medium text-[#111111] hover:bg-[#f5f1ec] active:scale-95 transition-all"
        >
          <MessageSquareText className="size-4" />
          <span>View Chat</span>
        </Button>
      )}

      {/* End Consultation Button in the same line */}
      <Button
        onClick={onEndCall}
        className="h-12 gap-2 rounded-full bg-red-600 px-7 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95 transition-all"
      >
        <PhoneOff className="size-4" />
        <span>End Consultation</span>
      </Button>
    </div>
  );
}
