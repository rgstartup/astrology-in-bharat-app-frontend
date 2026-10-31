"use client";

import React, { useState } from "react";
import {
  Camera,
  FileText,
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  User,
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
  ExpertSessionPhase,
} from  "@/features/consultation/session";
import { formatDuration, getExpertPhaseLabel } from  "@/features/consultation/session";
import { ExpertClientIntakeDrawer } from "@/features/consultation/session/components/expert-client-intake-drawer.component";

export interface ExpertVideoPanelProps {
  client: ClientIntakeProfile;
  phase: ExpertSessionPhase;
  metrics: ExpertConsultationMetrics;
  expertName?: string;
  expertAvatar?: string | null;
  /** Whether expert camera is muted/off */
  cameraOff?: boolean;
  onToggleCamera?: () => void;
  muted?: boolean;
  onToggleMute?: () => void;
  speakerMuted?: boolean;
  onToggleSpeaker?: () => void;
  onEndCall: () => void;
  className?: string;
}

/**
 * Circular 48px button with pressed-state styling for video panel controls.
 */
function VideoControl({
  pressed,
  label,
  onToggle,
  children,
}: {
  pressed: boolean;
  label: string;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  if (pressed) {
    return (
      <Button
        size="icon"
        aria-label={label}
        aria-pressed="true"
        onClick={onToggle}
        className="size-12 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black shadow-xs active:scale-95 transition-all"
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
      className="size-12 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec] shadow-xs active:scale-95 transition-all"
    >
      {children}
    </Button>
  );
}

/**
 * Remote devotee video surface.
 */
function DevoteeVideoSurface({
  client,
  phase,
  metrics,
}: {
  client: ClientIntakeProfile;
  phase: ExpertSessionPhase;
  metrics: ExpertConsultationMetrics;
}) {
  return (
    <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#ebe7e1] sm:h-80 md:h-96">
      {/* Devotee Avatar or Video Stream Placeholder */}
      <div className="flex flex-col items-center gap-2">
        <Avatar className="size-24 rounded-full border-2 border-white bg-white shadow-md">
          <AvatarImage src={client.avatar || undefined} alt={client.name} />
          <AvatarFallback className="bg-[#ebe7e1] text-lg font-bold text-[#111111]">
            {client.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs font-semibold text-[#626260]">
          {phase === "live" ? "Devotee Video Connected" : "Connecting video track..."}
        </span>
      </div>

      {/* Top Left: Devotee Identity Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full border border-[#d3cec6] bg-white/90 px-3 py-1 text-xs font-medium text-[#111111] backdrop-blur-xs">
        <span
          className={cn(
            "size-2 rounded-full",
            phase === "live" ? "bg-[#0bdf50]" : "bg-amber-400 animate-pulse"
          )}
        />
        <span className="font-semibold">{client.name}</span>
        {client.rashi && (
          <span className="text-[#7b7b78] border-l border-[#d3cec6] pl-2 text-[11px]">
            {client.rashi}
          </span>
        )}
      </div>

      {/* Top Right: Status & Rate Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-[#d3cec6] bg-white/90 px-3 py-1 text-xs font-semibold text-[#111111] backdrop-blur-xs">
        <span>₹{metrics.ratePerMinute}/min</span>
      </div>
    </div>
  );
}

/**
 * Inset Picture-In-Picture for Expert's own camera view.
 */
function ExpertPipSurface({
  expertName,
  expertAvatar,
  cameraOff,
}: {
  expertName: string;
  expertAvatar?: string | null;
  cameraOff?: boolean;
}) {
  return (
    <div className="absolute right-4 bottom-18 flex size-24 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-[#111111] text-white shadow-lg sm:size-28">
      {cameraOff ? (
        <div className="flex flex-col items-center gap-1 text-neutral-400">
          <VideoOff className="size-5" />
          <span className="text-[10px] font-medium">Cam off</span>
        </div>
      ) : (
        <div className="relative flex size-full items-center justify-center bg-neutral-800">
          <Avatar className="size-12 rounded-full border border-white/20 bg-neutral-700">
            <AvatarImage src={expertAvatar || undefined} alt={expertName} />
            <AvatarFallback className="text-xs font-bold text-white">
              {expertName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-1 left-2 text-[9px] font-bold tracking-wider text-white/70 uppercase">
            You
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Expert Video Consultation Panel.
 * Designed to provide the astrologer a professional video consultation room
 * with client video viewport, expert PIP, accrued earnings counter,
 * and Kundli dossier accessibility.
 */
export function ExpertVideoPanel({
  client,
  phase,
  metrics,
  expertName = "You (Expert)",
  expertAvatar,
  cameraOff = false,
  onToggleCamera,
  muted = false,
  onToggleMute,
  speakerMuted = false,
  onToggleSpeaker,
  onEndCall,
  className,
}: ExpertVideoPanelProps) {
  const [localMuted, setLocalMuted] = useState(muted);
  const [localCameraOff, setLocalCameraOff] = useState(cameraOff);
  const [localSpeakerMuted, setLocalSpeakerMuted] = useState(speakerMuted);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isMicMuted = onToggleMute ? muted : localMuted;
  const isCamOff = onToggleCamera ? cameraOff : localCameraOff;
  const isSpeakerOff = onToggleSpeaker ? speakerMuted : localSpeakerMuted;

  function handleMuteToggle() {
    if (onToggleMute) onToggleMute();
    else setLocalMuted((prev) => !prev);
  }

  function handleCameraToggle() {
    if (onToggleCamera) onToggleCamera();
    else setLocalCameraOff((prev) => !prev);
  }

  function handleSpeakerToggle() {
    if (onToggleSpeaker) onToggleSpeaker();
    else setLocalSpeakerMuted((prev) => !prev);
  }

  const elapsedText = formatDuration(metrics.elapsedSeconds);
  const accruedEarnings =
    metrics.totalEarned ??
    Math.round((metrics.elapsedSeconds / 60) * metrics.ratePerMinute);

  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] p-3 sm:p-5 font-sans text-[#111111]",
        className
      )}
    >
      {/* Remote Video Surface + PIP */}
      <div className="relative mx-auto w-full max-w-3xl">
        <DevoteeVideoSurface client={client} phase={phase} metrics={metrics} />

        <ExpertPipSurface
          expertName={expertName}
          expertAvatar={expertAvatar}
          cameraOff={isCamOff}
        />

        {/* Video Consultation Status & Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          {/* Left: Elapsed & Earned Counters */}
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xl font-bold text-[#111111] tabular-nums">
              {elapsedText}
            </span>
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 tabular-nums">
              Earned: ₹{accruedEarnings}
            </span>
          </div>

          {/* Right: 48px Hardware Controls + Kundli Drawer + End Call */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mic Toggle */}
            <VideoControl
              pressed={isMicMuted}
              label={isMicMuted ? "Unmute microphone" : "Mute microphone"}
              onToggle={handleMuteToggle}
            >
              {isMicMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
            </VideoControl>

            {/* Camera Toggle */}
            <VideoControl
              pressed={isCamOff}
              label={isCamOff ? "Turn camera on" : "Turn camera off"}
              onToggle={handleCameraToggle}
            >
              {isCamOff ? (
                <VideoOff className="size-5" />
              ) : (
                <Video className="size-5" />
              )}
            </VideoControl>

            {/* Speaker Toggle */}
            <VideoControl
              pressed={isSpeakerOff}
              label={isSpeakerOff ? "Turn audio on" : "Mute audio"}
              onToggle={handleSpeakerToggle}
            >
              {isSpeakerOff ? (
                <VolumeX className="size-5" />
              ) : (
                <Volume2 className="size-5" />
              )}
            </VideoControl>

            {/* Kundli Intake Dossier Toggle */}
            <VideoControl
              pressed={isDrawerOpen}
              label={isDrawerOpen ? "Close Kundli dossier" : "Open Kundli dossier"}
              onToggle={() => setIsDrawerOpen((prev) => !prev)}
            >
              <FileText className="size-5" />
            </VideoControl>

            {/* End Video Button */}
            <Button
              onClick={onEndCall}
              aria-label="End video consultation"
              className="h-12 gap-2 rounded-full bg-red-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95"
            >
              <PhoneOff className="size-4" />
              <span className="hidden sm:inline">End Video</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Kundli Intake Dossier Slide-Over */}
      <ExpertClientIntakeDrawer
        client={client}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
