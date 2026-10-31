"use client";

import React from "react";
import { ArrowUpRight, MessageSquareText, Phone, Video } from "@repo/design/lucide";
import { cn } from "@repo/design/cn";

type VoiceSessionSectionProps = {
  voiceRate: number;
  chatRate: number;
  videoRate: number;
  /** Voice shows chat + video targets; video shows chat + voice targets. Defaults to voice. */
  kind?: "voice" | "video";
  onSwitchToChat?: () => void;
  onUpgradeToVideo?: () => void;
  onSwitchToVoice?: () => void;
  className?: string;
};

/**
 * Switch target row button.
 *
 * @param props - Icon, labels, rate, and click handler.
 * @returns Switch row element.
 */
function SwitchRow({
  icon,
  title,
  detail,
  rate,
  onSelect,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  rate: number;
  onSelect?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={label}
      className="group flex items-center justify-between rounded-xl border border-[#d3cec6] bg-white p-3 text-left transition-all hover:border-neutral-400"
    >
      <span className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[#f5f1ec] text-[#111111]">
          {icon}
        </span>
        <span className="flex flex-col">
          <span className="text-xs font-semibold text-[#111111]">{title}</span>
          <span className="text-[11px] text-[#7b7b78]">{detail}</span>
        </span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="rounded-md bg-[#f5f1ec] px-2 py-0.5 text-[11px] font-bold text-[#111111] tabular-nums">
          Rs.{rate}/min
        </span>
        <ArrowUpRight className="size-3.5 text-neutral-400 group-hover:text-neutral-700" />
      </span>
    </button>
  );
}

/**
 * Session title for the active addon kind.
 *
 * @param kind - Active addon.
 * @returns Title string.
 */
function getSessionTitle(kind: "voice" | "video"): string {
  if (kind === "video") return "Video session";
  return "Voice session";
}

/**
 * Billing line for the active addon kind.
 *
 * @param kind - Active addon.
 * @param voiceRate - Voice rate.
 * @param videoRate - Video rate.
 * @returns Billing string.
 */
function getBillingLine(kind: "voice" | "video", voiceRate: number, videoRate: number): string {
  if (kind === "video") return `Billed at Rs.${videoRate} per min from connection.`;
  return `Billed at Rs.${voiceRate} per min from connection.`;
}

/**
 * Switch-target rows for a voice-active room.
 *
 * @param props - Rates and handlers.
 * @returns Voice switch rows element.
 */
function VoiceSwitchRows({
  chatRate,
  videoRate,
  onSwitchToChat,
  onUpgradeToVideo,
}: Pick<
  VoiceSessionSectionProps,
  "chatRate" | "videoRate" | "onSwitchToChat" | "onUpgradeToVideo"
>) {
  return (
    <div className="flex flex-col gap-2">
      <SwitchRow
        icon={<MessageSquareText className="size-4" />}
        title="Switch to chat"
        detail="Continue over text"
        rate={chatRate}
        onSelect={onSwitchToChat}
        label="Switch to chat"
      />
      <SwitchRow
        icon={<Video className="size-4" />}
        title="Upgrade to video"
        detail="Face-to-face conversation"
        rate={videoRate}
        onSelect={onUpgradeToVideo}
        label="Upgrade to video"
      />
    </div>
  );
}

/**
 * Switch-target rows for a video-active room.
 *
 * @param props - Rates and handlers.
 * @returns Video switch rows element.
 */
function VideoSwitchRows({
  chatRate,
  voiceRate,
  onSwitchToChat,
  onSwitchToVoice,
}: Pick<
  VoiceSessionSectionProps,
  "chatRate" | "voiceRate" | "onSwitchToChat" | "onSwitchToVoice"
>) {
  return (
    <div className="flex flex-col gap-2">
      <SwitchRow
        icon={<MessageSquareText className="size-4" />}
        title="Switch to chat"
        detail="Continue over text"
        rate={chatRate}
        onSelect={onSwitchToChat}
        label="Switch to chat"
      />
      <SwitchRow
        icon={<Phone className="size-4" />}
        title="Switch to voice"
        detail="Continue over audio"
        rate={voiceRate}
        onSelect={onSwitchToVoice}
        label="Switch to voice"
      />
    </div>
  );
}

/**
 * Switch rows with waterfall branch on addon kind.
 *
 * @param props - Full section props.
 * @returns Switch rows element.
 */
function SwitchRows(props: VoiceSessionSectionProps) {
  if (props.kind === "video") {
    return (
      <VideoSwitchRows
        chatRate={props.chatRate}
        voiceRate={props.voiceRate}
        onSwitchToChat={props.onSwitchToChat}
        onSwitchToVoice={props.onSwitchToVoice}
      />
    );
  }
  return (
    <VoiceSwitchRows
      chatRate={props.chatRate}
      videoRate={props.videoRate}
      onSwitchToChat={props.onSwitchToChat}
      onUpgradeToVideo={props.onUpgradeToVideo}
    />
  );
}
/**
 * Sidebar addon-session section. Replaces the upgrade block once the room
 * has voice or video attached: shows the live addon mode with rate plus
 * switch targets. Timers and expert card above stay untouched.
 *
 * @param props - Addon kind, rates, and switch handlers.
 * @returns Voice session section element.
 */
export function VoiceSessionSection({
  voiceRate,
  chatRate,
  videoRate,
  kind = "voice",
  onSwitchToChat,
  onUpgradeToVideo,
  onSwitchToVoice,
  className,
}: VoiceSessionSectionProps) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className="flex flex-col gap-1.5 rounded-xl border border-[#d3cec6] bg-white p-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#7b7b78]">Consultation</span>
          <span className="flex items-center gap-1 rounded-full border border-[#d3cec6] bg-white px-2 py-0.5 text-[10px] font-medium text-[#626260]">
            <Phone className="size-2.5 text-neutral-600" />
            Live
          </span>
        </div>
        <h4 className="text-sm font-semibold text-[#111111]">{getSessionTitle(kind)}</h4>
        <p className="text-[11px] text-[#7b7b78]">
          {getBillingLine(kind, voiceRate, videoRate)}
        </p>
      </div>

      <SwitchRows
        voiceRate={voiceRate}
        chatRate={chatRate}
        videoRate={videoRate}
        kind={kind}
        onSwitchToChat={onSwitchToChat}
        onUpgradeToVideo={onUpgradeToVideo}
        onSwitchToVoice={onSwitchToVoice}
      />
    </div>
  );
}
