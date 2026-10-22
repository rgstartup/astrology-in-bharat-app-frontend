"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import { SummaryModal } from "@/components/common/SummaryModal";
import { ChatRoomHeader } from "./header";
import { ChatMessageArea } from "./message-area";
import { ChatComposer } from "./composer";
import { ChatImagePreviewDialog } from "./modals";
import { useChatRoomSession } from "./hooks/use-chat-room-session";
import { useChatRoomComposer } from "./hooks/use-chat-room-composer";
import { useConsultation } from "@/realtime/hooks/use-consultation";
import { useVoiceSession } from "@/realtime/hooks/use-voice-session";
import { useConsultationMedia } from "@/realtime/hooks/use-consultation-media";
import { ExpertSessionDock } from "@/components/consultation";
import type {
  ClientIntakeProfile,
  ExpertConsultationMetrics,
  ExpertSessionKind,
  ExpertSessionPhase,
} from "@/components/consultation/types";
import type { ConsultationMode } from "@/realtime/types/consultation";

interface ChatRoomContentProps {
  sessionId: string;
  newFlowId: number | null;
  mode?: ConsultationMode;
}

export function ChatRoomContent({
  sessionId,
  newFlowId,
  mode: modeProp,
}: ChatRoomContentProps) {
  const { user } = useAuthStore();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Resolve consultation mode: the live state wins, so a client that continues
  // a voice call over chat flips the expert UI to chat as well.
  const { state: consultationState } = useConsultation(newFlowId);
  const mode: ConsultationMode = consultationState?.mode ?? modeProp ?? "chat";
  const isVoiceMode = mode === "voice" || mode === "video";

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
    voiceToken,
  } = useChatRoomSession(sessionId, newFlowId, mode);

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

  const parsedSummaryData = (
    summaryData as {
      split?: { totalAmount: number; platformFee: number; expertShare: number };
    }
  )?.split;

  // Mic gate: verified in waiting modal prior to room entrance
  const [micConfirmed, setMicConfirmed] = useState(true);

  // Bilateral media readiness: local side reports ready after local Agora join;
  // peer readiness arrives via consultation:media_ready broadcast.
  const media = useConsultationMedia({
    consultationId: newFlowId,
    actorType: "expert",
  });

  // Voice session: join Agora when entering voice mode with a token, only after
  // the user has confirmed microphone access.
  const voice = useVoiceSession();
  const {
    active: voiceActive,
    busy: voiceBusy,
    join: voiceJoin,
    leave: voiceLeave,
    error: voiceError,
    clearError: voiceClearError,
  } = voice;
  const expertId = user?.id;
  const identity =
    expertId != null && newFlowId != null
      ? `expert_${expertId}_consult_${newFlowId}`
      : null;

  useEffect(() => {
    if (!isVoiceMode) return;
    if (voiceActive || voiceBusy) return;
    if (!identity) return;
    if (!newFlowId) return;
    if (!micConfirmed) return;
    const flowId = newFlowId;
    if (!voiceToken?.token || !voiceToken?.channelName) return;
    void voiceJoin(flowId, identity, voiceToken, () => media.setLocalReady());
  }, [
    isVoiceMode,
    voiceActive,
    voiceBusy,
    voiceJoin,
    identity,
    voiceToken,
    newFlowId,
    micConfirmed,
    media,
  ]);

  useEffect(() => {
    if (voiceError) {
      toast.error(voiceError);
      voiceClearError();
    }
  }, [voiceError, voiceClearError]);

  // Leave the Agora RTC session when the consultation ends, or when the client
  // continues the consultation over chat, so the SDK does not keep running.
  const hasLeftVoiceRef = useRef(false);
  useEffect(() => {
    const shouldLeave = sessionStatus === "completed" || !isVoiceMode;
    if (shouldLeave) {
      if (!hasLeftVoiceRef.current) {
        hasLeftVoiceRef.current = true;
        void voiceLeave().catch(() => undefined);
      }
    } else {
      hasLeftVoiceRef.current = false;
    }
  }, [sessionStatus, isVoiceMode, voiceLeave]);

  const resolvedRatePerMinute = consultationState?.ratePerMinute || 30;
  const dockKind: ExpertSessionKind = mode === "video" ? "video" : "voice";
  const remainingSeconds = timeLeft > 0 ? timeLeft : undefined;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#f5f1ec] font-sans text-[#111111] md:relative md:inset-auto md:z-auto md:h-[calc(100vh-120px)] md:rounded-xl md:border md:border-[#d3cec6] md:bg-white">
      <ChatRoomHeader
        clientName={clientName}
        clientAvatar={clientAvatar}
        sessionStatus={sessionStatus}
        elapsedTime={elapsedTime}
        timeLeft={timeLeft}
        isActivating={isActivating}
        isNewFlow={newFlowId != null}
        onActivate={handleActivate}
        onEndChat={handleEndChat}
      />

      {isVoiceMode && (
        <ExpertSessionDock
          client={{
            name: clientName || "Client",
            avatar: clientAvatar ?? undefined,
          }}
          kind={dockKind}
          phase={(voice.voicePhase ?? "connecting") as ExpertSessionPhase}
          metrics={{
            elapsedSeconds: elapsedTime,
            remainingSeconds,
            ratePerMinute: resolvedRatePerMinute,
          }}
          muted={voice.muted}
          onToggleMute={voice.toggleMic}
          speakerMuted={voice.speakerMuted}
          onToggleSpeaker={voice.toggleSpeaker}
          onEndCall={handleEndChat}
        />
      )}

      {paused && pauseWaitSeconds !== null && (
        <div className="flex items-center justify-center gap-2 border-b border-[#d3cec6] bg-white px-4 py-2 font-sans text-sm text-[#626260]">
          <span>Client balance exhausted — chat paused.</span>
          <span className="font-semibold text-[#111111]">
            Waiting for recharge: {Math.floor(pauseWaitSeconds / 60)}:
            {String(pauseWaitSeconds % 60).padStart(2, "0")}
          </span>
        </div>
      )}

      <ChatMessageArea
        messages={messages}
        sessionStatus={sessionStatus}
        isNewFlow={newFlowId != null}
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
          title={
            isVoiceMode ? "Voice Consultation Ended" : "Chat Consultation Ended"
          }
        />
      )}
    </div>
  );
}
