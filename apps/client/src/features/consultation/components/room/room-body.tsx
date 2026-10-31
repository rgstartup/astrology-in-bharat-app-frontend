"use client";

import React from "react";
import type { RefObject } from "react";
import type { IAuthUser } from "@/store/authStore";
import type { ChatMessage, ChatSession } from "@/lib/types";
import type { IExpert } from "@repo/lib";
import MessageArea from "../message-area/message-area";
import type { TimelineItem } from "@repo/chat";
import ChatFooter from "../chat/chat-footer";
import { cn } from "@repo/design/cn";
import RoomSecureStrip from "./room-secure-strip";
import { useRoomRevision } from "../../hooks/use-room-revision";
import type { PendingAttachment } from "@repo/chat";
import { SessionDock, type SessionDockProps } from "../session/session-dock";

type RoomBodyProps = {
  sessionStatus: string;
  sessionSummary: ChatSession | null;
  messages: ChatMessage[];
  timeline: TimelineItem[];
  expertData: IExpert;
  typingStatus: { senderName: string; isTyping: boolean } | null;
  user: IAuthUser | null;
  pendingAttachment: PendingAttachment | null;
  removePendingAttachment: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  uploading: boolean;
  uploadProgress: number | null;
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSendMessage: () => void;
  handleInputTyping: () => void;
  /** Active session dock controls and status, or null when chat-only. */
  dock?: SessionDockProps | null;
  /** When true, disables the composer (voice/video session active). */
  voiceDisabled?: boolean;
  /** When true, blurs the message area (RTC connecting/setup phase only). */
  voiceConnecting?: boolean;
};

/**
 * Pinned session dock strip mounted above the message area.
 * Renders only when an active voice/video session exists.
 *
 * @param props - Session dock properties or null.
 * @returns Dock element or null.
 */
function RoomSessionDock({ dock }: { dock?: SessionDockProps | null }) {
  const revision = useRoomRevision();
  if (!dock) return null;
  return (
    <SessionDock
      key={revision}
      kind={dock.kind}
      phase={dock.phase}
      elapsedText={dock.elapsedText}
      rate={dock.rate}
      muted={dock.muted}
      onToggleMute={dock.onToggleMute}
      speakerMuted={dock.speakerMuted}
      onToggleSpeaker={dock.onToggleSpeaker}
      expanded={dock.expanded}
      onToggleExpand={dock.onToggleExpand}
      onEnd={dock.onEnd}
      onCancelRequest={dock.onCancelRequest}
    />
  );
}

/** Main column (secure strip + messages + composer) beside the sidebar. */
export default function RoomBody({
  sessionStatus,
  sessionSummary,
  messages,
  timeline,
  expertData,
  typingStatus,
  user,
  pendingAttachment,
  removePendingAttachment,
  handleFileUpload,
  fileInputRef,
  uploading,
  uploadProgress,
  inputValue,
  setInputValue,
  handleSendMessage,
  handleInputTyping,
  dock,
  voiceDisabled = false,
  voiceConnecting = false,
}: RoomBodyProps) {
  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#f5f1ec]">
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#f5f1ec]">
        <RoomSecureStrip sessionStatus={sessionStatus} />

        <RoomSessionDock dock={dock} />

        <div
          className={cn(
            "relative flex min-h-0 flex-1 flex-col overflow-hidden",
            voiceConnecting && "blur-sm",
          )}
        >
          <MessageArea
            sessionStatus={sessionStatus}
            sessionSummary={sessionSummary}
            messages={messages}
            timeline={timeline}
            expertData={expertData}
            typingStatus={typingStatus}
            user={user}
          />
        </div>

        <ChatFooter
          sessionStatus={sessionStatus}
          disabled={voiceDisabled}
          pendingAttachment={pendingAttachment}
          removePendingAttachment={removePendingAttachment}
          handleFileUpload={handleFileUpload}
          fileInputRef={fileInputRef}
          uploading={uploading}
          uploadProgress={uploadProgress}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleInputTyping={handleInputTyping}
        />
      </div>

      {/* <Sidebar expertData={expertData} /> */}
    </div>
  );
}
