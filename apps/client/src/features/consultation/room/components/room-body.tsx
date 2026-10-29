"use client";

import React from "react";
import type { RefObject } from "react";
import type { IAuthUser } from "@/store/authStore";
import type { ChatMessage, ChatSession } from "@/lib/types";
import type { IExpert } from "@repo/lib";
import { MessageArea } from "@/features/consultation/message-area";
import type { TimelineItem } from "@/features/consultation/message-area/types/timeline";
import ChatFooter from "@/features/consultation/root/components/chat-footer";
// import Sidebar from "@/features/consultation/sidebar";
import RoomSecureStrip from "./room-secure-strip";
import { useRoomRevision } from "../hooks/use-room-revision";
import type { PendingAttachment } from "../hooks/use-room-composer";
import { SessionDock, type SessionDockProps } from "@/features/consultation/session";

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
}: RoomBodyProps) {
  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#f5f1ec]">
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#f5f1ec]">
        <RoomSecureStrip sessionStatus={sessionStatus} />

        <RoomSessionDock dock={dock} />

        <MessageArea
          sessionStatus={sessionStatus}
          sessionSummary={sessionSummary}
          messages={messages}
          timeline={timeline}
          expertData={expertData}
          typingStatus={typingStatus}
          user={user}
        />

        <ChatFooter
          sessionStatus={sessionStatus}
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
