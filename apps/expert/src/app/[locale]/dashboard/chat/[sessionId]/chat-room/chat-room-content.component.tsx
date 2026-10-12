"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { SummaryModal } from "@/components/common/SummaryModal";
import { ChatRoomHeader } from "./header";
import { ChatMessageArea } from "./message-area";
import { ChatComposer } from "./composer";
import { ChatImagePreviewDialog } from "./modals";
import { useChatRoomSession } from "./hooks/use-chat-room-session";
import { useChatRoomComposer } from "./hooks/use-chat-room-composer";

interface ChatRoomContentProps {
  sessionId: string;
  newFlowId: number | null;
}

export function ChatRoomContent({ sessionId, newFlowId }: ChatRoomContentProps) {
  const { user } = useAuthStore();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const {
    messages,
    setMessages,
    sessionStatus,
    timeLeft,
    elapsedTime,
    clientName,
    clientAvatar,
    typingStatus,
    isActivating,
    showSummary,
    summaryData,
    messagesEndRef,
    sendLiveMessage,
    sendLiveTyping,
    handleActivate,
    handleEndChat,
    paused,
    pauseWaitSeconds,
  } = useChatRoomSession(sessionId, newFlowId);

  const {
    inputValue,
    setInputValue,
    uploading,
    uploadProgress,
    pendingAttachment,
    removePendingAttachment,
    fileInputRef,
    handleInputTyping,
    handleSendMessage,
    handleFileUpload,
  } = useChatRoomComposer({
    sessionId,
    newFlowId,
    setMessages,
    sendLiveMessage,
    sendLiveTyping,
  });

  const parsedSummaryData = (summaryData as { split?: { totalAmount: number; platformFee: number; expertShare: number } })?.split;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white md:relative md:inset-auto md:z-auto md:h-[calc(100vh-120px)] md:rounded-2xl md:shadow-xs md:border md:border-slate-200 overflow-hidden font-sans">
      <ChatRoomHeader
        clientName={clientName}
        clientAvatar={clientAvatar}
        sessionStatus={sessionStatus}
        elapsedTime={elapsedTime}
        timeLeft={timeLeft}
        isActivating={isActivating}
        onActivate={handleActivate}
        onEndChat={handleEndChat}
      />

      {paused && pauseWaitSeconds !== null && (
        <div className="flex items-center justify-center gap-2 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          <span>Client balance exhausted — chat paused.</span>
          <span className="font-semibold">
            Waiting for recharge: {Math.floor(pauseWaitSeconds / 60)}:
            {String(pauseWaitSeconds % 60).padStart(2, "0")}
          </span>
        </div>
      )}

      <ChatMessageArea
        messages={messages}
        sessionStatus={sessionStatus}
        clientName={clientName}
        clientAvatar={clientAvatar}
        expertAvatar={user?.profilePic || user?.avatar}
        expertName={user?.name || "Expert"}
        typingStatus={typingStatus}
        messagesEndRef={messagesEndRef}
        onPreviewImage={(url) => setPreviewImageUrl(url)}
      />

      <ChatComposer
        inputValue={inputValue}
        onInputChange={setInputValue}
        onInputTyping={handleInputTyping}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        fileInputRef={fileInputRef}
        uploading={uploading}
        uploadProgress={uploadProgress}
        pendingAttachment={pendingAttachment}
        onRemoveAttachment={removePendingAttachment}
      />

      <ChatImagePreviewDialog
        previewImageUrl={previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
      />

      {showSummary && parsedSummaryData && (
        <SummaryModal
          isOpen={showSummary}
          data={parsedSummaryData}
          title="Chat Consultation Ended"
        />
      )}
    </div>
  );
}
