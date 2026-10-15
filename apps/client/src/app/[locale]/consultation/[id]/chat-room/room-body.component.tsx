"use client";

import React from "react";
import type { RefObject } from "react";
import type { IAuthUser } from "@/store/authStore";
import type { ChatMessage, ChatSession } from "@/lib/types";
import type { IExpert } from "@repo/lib";
import MessageArea from "../message-area";
import type { TimelineItem } from "../message-area/timeline";
import ChatFooter from "../chat-footer.component";
// import Sidebar from "../sidebar.component";
import RoomSecureStrip from "./room-secure-strip.component";
import type { PendingAttachment } from "./hooks/use-room-composer";

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
};

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
}: RoomBodyProps) {
  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#f5f1ec]">
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#f5f1ec]">
        <RoomSecureStrip sessionStatus={sessionStatus} />

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
