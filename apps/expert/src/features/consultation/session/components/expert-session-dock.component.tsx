"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type {
  ClientIntakeProfile,
  ExpertConsultationMetrics,
  ExpertSessionKind,
  ExpertSessionPhase,
} from  "../types";
import { formatDuration, getExpertPhaseLabel } from  "../types";

export interface ExpertSessionDockProps {
  client: ClientIntakeProfile;
  kind: ExpertSessionKind;
  phase: ExpertSessionPhase;
  metrics: ExpertConsultationMetrics;
  expanded?: boolean;
  onToggleExpand?: () => void;
  muted?: boolean;
  onToggleMute?: () => void;
  cameraOff?: boolean;
  onToggleCamera?: () => void;
  speakerMuted?: boolean;
  onToggleSpeaker?: () => void;
  onEndCall: () => void;
  className?: string;
}

/**
 * Status dot for expert session dock.
 */
function DockStatusDot({ phase }: { phase: ExpertSessionPhase }) {
  if (phase === "live") {
    return (
      <span aria-label="Consultation live" className="size-2 shrink-0 rounded-full bg-[#0bdf50]" />
    );
  }
  if (phase === "reconnecting") {
    return (
      <span
        aria-label="Reconnecting"
        className="size-2 shrink-0 animate-pulse rounded-full bg-[#c13515]"
      />
    );
  }
  return (
    <span
      aria-label="Connecting"
      className="size-2 shrink-0 animate-pulse rounded-full bg-[#7b7b78]"
    />
  );
}

/**
 * Mode icon helper with zero JSX ternaries.
 */
function DockModeIcon({ kind }: { kind: ExpertSessionKind }) {
  if (kind === "video") return <Video className="size-4" />;
  return <Phone className="size-4" />;
}

/**
 * Mic button icon with zero JSX ternaries.
 */
function MicButtonIcon({ isMuted }: { isMuted: boolean }) {
  if (isMuted) return <MicOff className="size-3.5" />;
  return <Mic className="size-3.5" />;
}

/**
 * Camera button icon with zero JSX ternaries.
 */
function CamButtonIcon({ isCamOff }: { isCamOff: boolean }) {
  if (isCamOff) return <VideoOff className="size-3.5" />;
  return <Video className="size-3.5" />;
}

/**
 * Speaker button icon with zero JSX ternaries.
 */
function SpeakerButtonIcon({ isSpeakerOff }: { isSpeakerOff: boolean }) {
  if (isSpeakerOff) return <VolumeX className="size-3.5" />;
  return <Volume2 className="size-3.5" />;
}

/**
 * Expand toggle button icon with zero JSX ternaries.
 */
function ExpandButtonIcon({ expanded }: { expanded: boolean }) {
  if (expanded) return <ChevronUp className="size-4" />;
  return <ChevronDown className="size-4" />;
}

/**
 * Expert Session Dock.
 * Pinned at the top of the expert chat room or dashboard workspace.
 * Allows the astrologer to consult on voice/video while typing messages,
 * reading horoscope charts, or reviewing past history.
 */
export function ExpertSessionDock({
  client,
  kind,
  phase,
  metrics,
  expanded = false,
  onToggleExpand,
  muted = false,
  onToggleMute,
  cameraOff = false,
  onToggleCamera,
  speakerMuted = false,
  onToggleSpeaker,
  onEndCall,
  className,
}: ExpertSessionDockProps) {
  const [localMuted, setLocalMuted] = useState(muted);
  const [localCameraOff, setLocalCameraOff] = useState(cameraOff);
  const [localSpeakerMuted, setLocalSpeakerMuted] = useState(speakerMuted);

  const isMuted = onToggleMute ? muted : localMuted;
  const isCamOff = onToggleCamera ? cameraOff : localCameraOff;
  const isSpeakerOff = onToggleSpeaker ? speakerMuted : localSpeakerMuted;

  function toggleMic() {
    if (onToggleMute) onToggleMute();
    else setLocalMuted((prev) => !prev);
  }

  function toggleCamera() {
    if (onToggleCamera) onToggleCamera();
    else setLocalCameraOff((prev) => !prev);
  }

  function toggleSpeaker() {
    if (onToggleSpeaker) onToggleSpeaker();
    else setLocalSpeakerMuted((prev) => !prev);
  }

  const elapsedText = formatDuration(metrics.elapsedSeconds);
  const accruedEarnings =
    metrics.totalEarned ?? Math.round((metrics.elapsedSeconds / 60) * metrics.ratePerMinute);

  const initials = client.name ? client.name.slice(0, 2).toUpperCase() : "DV";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-2 border-b border-[#d3cec6] bg-white px-3.5 py-2.5 font-sans sm:px-4",
        className,
      )}
    >
      {/* Devotee Info + Mode + Phase */}
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
          <DockModeIcon kind={kind} />
        </span>

        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="size-7 shrink-0 rounded-full border border-[#d3cec6]">
            {client.avatar && <AvatarImage src={client.avatar} alt={client.name} />}
            <AvatarFallback className="bg-[#ebe7e1] text-[10px] font-bold text-[#111111]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <span className="truncate text-xs font-semibold text-[#111111] max-w-[100px] sm:max-w-[140px]">
            {client.name}
          </span>

          <span className="hidden sm:flex items-center gap-1.5">
            <DockStatusDot phase={phase} />
            <span className="text-xs font-medium text-[#626260]">
              {getExpertPhaseLabel(phase, kind)}
            </span>
          </span>

          <span className="font-mono text-xs font-bold text-[#111111] tabular-nums">
            {elapsedText}
          </span>

          <span className="hidden md:inline-flex rounded-md bg-[#f5f1ec] px-2 py-0.5 text-[11px] font-bold text-emerald-800 tabular-nums">
            ₹{accruedEarnings} earned
          </span>
        </div>
      </div>

      {/* Dock Controls Cluster */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Mic Toggle */}
        <Button
          size="icon"
          aria-label={isMuted ? "Unmute mic" : "Mute mic"}
          onClick={toggleMic}
          className={cn(
            "size-8 shrink-0 rounded-full transition-all cursor-pointer",
            isMuted
              ? "bg-[#111111] text-white hover:bg-black"
              : "border border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]",
          )}
        >
          <MicButtonIcon isMuted={isMuted} />
        </Button>

        {/* Camera Toggle (Video Only) */}
        {kind === "video" && (
          <Button
            size="icon"
            aria-label={isCamOff ? "Turn camera on" : "Turn camera off"}
            onClick={toggleCamera}
            className={cn(
              "size-8 shrink-0 rounded-full transition-all cursor-pointer",
              isCamOff
                ? "bg-[#111111] text-white hover:bg-black"
                : "border border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]",
            )}
          >
            <CamButtonIcon isCamOff={isCamOff} />
          </Button>
        )}

        {/* Speaker Toggle */}
        <Button
          size="icon"
          aria-label={isSpeakerOff ? "Turn devotee audio on" : "Mute devotee audio"}
          onClick={toggleSpeaker}
          className={cn(
            "size-8 shrink-0 rounded-full transition-all cursor-pointer",
            isSpeakerOff
              ? "bg-[#111111] text-white hover:bg-black"
              : "border border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]",
          )}
        >
          <SpeakerButtonIcon isSpeakerOff={isSpeakerOff} />
        </Button>

        {/* Expand / Collapse Panel Toggle */}
        {onToggleExpand && (
          <Button
            size="icon"
            variant="ghost"
            aria-label={expanded ? "Collapse stage" : "Expand stage"}
            onClick={onToggleExpand}
            className="size-8 shrink-0 rounded-full text-[#111111] hover:bg-[#f5f1ec] cursor-pointer"
          >
            <ExpandButtonIcon expanded={expanded} />
          </Button>
        )}

        {/* End Call Button */}
        <Button
          size="icon"
          aria-label="End consultation"
          onClick={onEndCall}
          className="size-8 shrink-0 rounded-full bg-red-600 text-white shadow-xs hover:bg-red-700 active:scale-95 cursor-pointer"
        >
          <PhoneOff className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default ExpertSessionDock;
