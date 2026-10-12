"use client";

import type { RefObject } from "react";import type { IAuthUser } from "@/store/authStore";
import type { ChatMessage, ChatSession } from "@/lib/types";
import type { IExpert } from "@repo/lib";
import { cn } from "@/lib/utils";
import MessageArea from "../message-area";
import type { TimelineItem } from "../message-area/timeline";
import ChatFooter from "../chat-footer.component";
import Sidebar from "../sidebar.component";
import RoomSecureStrip from "./room-secure-strip.component";
import type { PendingAttachment } from "./hooks/use-room-composer";

type RoomBodyProps = {
  isDarkMode: boolean;
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
  isDarkMode,
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
    <div className="relative flex flex-1 overflow-hidden">
      <div
        className={cn("relative flex flex-1 flex-col bg-card transition-colors duration-500")}
        style={
          !isDarkMode
            ? {
                backgroundImage: "url('/images/white-background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        <RoomSecureStrip sessionStatus={sessionStatus} isDarkMode={isDarkMode} />

        <MessageArea
          isDarkMode={isDarkMode}
          sessionStatus={sessionStatus}
          sessionSummary={sessionSummary}
          messages={messages}
          timeline={timeline}
          expertData={expertData}
          typingStatus={typingStatus}
          user={user}
        />

        <ChatFooter
          isDarkMode={isDarkMode}
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

      <Sidebar isDarkMode={isDarkMode} expertData={expertData} />
    </div>
  );
}
