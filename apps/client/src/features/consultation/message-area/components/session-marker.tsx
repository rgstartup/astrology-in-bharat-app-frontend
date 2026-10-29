"use client";

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { MessageCircle, Phone, RefreshCw, Video } from "lucide-react";

type SessionBadgeProps = {
  label: string;
  startedAt?: string;
};

function formatStartedAt(startedAt?: string): string | null {
  if (!startedAt) return null;
  const d = new Date(startedAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TimeSuffix({ time }: { time: string | null }) {
  if (!time) return null;
  return <span className="font-normal normal-case">· {time}</span>;
}

function badgeIcon(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("video")) return Video;
  if (lower.includes("audio")) return Phone;
  if (lower.includes("chat")) return MessageCircle;
  return RefreshCw;
}

export default function SessionBadge({ label, startedAt }: SessionBadgeProps) {
  const time = formatStartedAt(startedAt);
  const Icon = badgeIcon(label);
  return (
    <Marker variant="separator" className="bg-[#f5f1ec] py-2">
      <MarkerIcon>
        <Icon className="h-3 w-3" />
      </MarkerIcon>
      <MarkerContent>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d3cec6] bg-[#ffffff] px-2.5 py-0.5 font-sans text-[10px] font-medium normal-case text-[#626260] shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
          {label}
          <TimeSuffix time={time} />
        </span>
      </MarkerContent>
    </Marker>
  );
}