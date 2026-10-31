"use client";

import React from "react";
import { Lock } from "@repo/design/lucide";
import { cn } from "@repo/design/cn";
import type { ChatMessage } from "@/lib/types";

type VoiceTranscriptStripProps = {
  messages: ChatMessage[];
  onExpandChat: () => void;
  /** Upgrade keeps saved chat; direct opens chat for sharing details. Defaults to upgrade. */
  entry?: "upgrade" | "direct";
  className?: string;
};

/**
 * Single preview line showing the most recent chat message.
 *
 * @param props - Message to preview.
 * @returns Preview line element.
 */
function TranscriptPreview({ message }: { message: ChatMessage }) {
  const author = message.senderType === "expert" ? "Expert" : "You";
  return (
    <p className="truncate text-[13px] text-[#626260]">
      <span className="font-medium text-[#111111]">{author}: </span>
      {message.content}
    </p>
  );
}

/**
 * Empty transcript placeholder when no messages exist yet.
 *
 * @param props - Entry path for tailored copy.
 * @returns Empty transcript element.
 */
function EmptyTranscript({ entry }: { entry: "upgrade" | "direct" }) {
  if (entry === "direct") {
    return (
      <p className="text-[13px] text-[#7b7b78]">
        Send birth details, photos, or questions here while you talk.
      </p>
    );
  }
  return <p className="text-[13px] text-[#7b7b78]">No messages yet. Your chat starts here.</p>;
}

/**
 * Transcript preview content with waterfall branch for empty state.
 *
 * @param props - Messages list and entry path.
 * @returns Transcript body element.
 */
function TranscriptBody({
  messages,
  entry,
}: {
  messages: ChatMessage[];
  entry: "upgrade" | "direct";
}) {
  const last = messages[messages.length - 1];
  if (!last) return <EmptyTranscript entry={entry} />;
  return <TranscriptPreview message={last} />;
}

/**
 * Strip header line tailored to the entry path.
 *
 * @param props - Entry path.
 * @returns Header element.
 */
function StripHeader({ entry }: { entry: "upgrade" | "direct" }) {
  if (entry === "direct") {
    return <span>Chat is open for sharing details.</span>;
  }
  return <span>Chat paused and saved. Tap to review.</span>;
}

/**
 * Collapsed chat-continuity strip pinned under the voice stage.
 * Reassures the user the chat history survives the switch to voice.
 *
 * @param props - Recent messages and expand handler.
 * @returns Transcript strip element.
 */
export function VoiceTranscriptStrip({
  messages,
  onExpandChat,
  entry = "upgrade",
  className,
}: VoiceTranscriptStripProps) {
  return (
    <div className={cn("px-4 pb-3 md:px-8", className)}>
      <button
        type="button"
        onClick={onExpandChat}
        className="mx-auto flex w-full max-w-2xl flex-col gap-1 rounded-xl border border-[#d3cec6] bg-white p-3 text-left shadow-none transition-colors hover:bg-[#f5f1ec]"
        aria-label="View chat history"
      >
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#7b7b78]">
          <Lock className="size-3" />
          <StripHeader entry={entry} />
        </span>
        <TranscriptBody messages={messages} entry={entry} />
      </button>
    </div>
  );
}
