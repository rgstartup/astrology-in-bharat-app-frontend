"use client";

import React, { useState, useMemo } from "react";
import { ChatVerdictWatcher } from "../chat/chat-verdict-watcher";
import { ConsultationSidebar } from "../sidebar/consultation-sidebar";
import { ChatColumnHeader } from "../chat/chat-column-header";
import SessionSummaryModal from "../session-summary/session-summary-modal";

import RoomPendingBanner from "./room-pending-banner";
import RoomBody from "./room-body";
import MainArea from "../root/main-area";
import { formatTime } from "../../utils/format-time";

import { useRoomLifecycle } from "../../providers/room-lifecycle.provider";
import { useRoomChat } from "../../providers/room-chat.provider";
import { useSwitchToVoiceContext } from "../../providers/switch-to-voice.provider";
import { useDirectVoiceContext } from "../../providers/direct-voice.provider";

/**
 * Root UI orchestrator for consultation room.
 * Composes header, main chat area, sidebar, and summary modal from providers.
 */
export function RoomContentRoot() {
  const {
    roomConsultationId,
    expertData,
    user,
    router,
    sessionId,
    sessionStatus,
    showModal,
    setShowModal,
    handleEndChat,
    pendingExpiresAt,
    elapsedTime,
    displayElapsedTime,
    displayTimeLeft,
    isSessionEnded,
    chatRate,
    sessionSummary,
    decision,
    isWarning,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    reviewSubmitted,
    setReviewSubmitted,
    voiceLive,
    voiceConnecting,
  } = useRoomLifecycle();

  const { messages, timeline, typingStatus, composer } = useRoomChat();
  const { voice, displayVoiceRate, handleUpgrade } = useSwitchToVoiceContext();
  const { showVoiceStage, dockProps } = useDirectVoiceContext();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const upgradeConfig = useMemo(() => {
    if (!showVoiceStage) return null;
    return {
      phase: voice.voicePhase,
      muted: voice.muted,
      onToggleMute: () => void voice.toggleMic(),
      speakerMuted: voice.speakerMuted,
      onToggleSpeaker: () => void voice.toggleSpeaker(),
      onEndVoice: () => void voice.endVoice(),
      onCancelRequest: () => void voice.cancelVoice(),
    };
  }, [showVoiceStage, voice]);

  const sidebarProps = useMemo(
    () => ({
      expertData,
      sessionStatus,
      formatTime,
      elapsedTime: displayElapsedTime,
      timeLeft: displayTimeLeft,
      handleEndChat,
      isWarning,
      onUpgrade: handleUpgrade,
      isSessionEnded,
      consultationId: roomConsultationId,
    }),
    [
      expertData,
      sessionStatus,
      displayElapsedTime,
      displayTimeLeft,
      handleEndChat,
      isWarning,
      handleUpgrade,
      isSessionEnded,
      roomConsultationId,
    ],
  );

  return (
    <div className="font-sans fixed inset-0 z-50 flex overflow-hidden bg-[#f5f1ec] text-[#111111]">
      <RoomPendingBanner
        sessionStatus={sessionStatus}
        expiresAt={pendingExpiresAt}
      />
      <ChatVerdictWatcher
        consultationId={roomConsultationId}
        decision={decision}
      />

      {/* 75% Main Chat Area */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
        <ChatColumnHeader
          router={router}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          handleEndChat={handleEndChat}
          isSessionEnded={isSessionEnded}
        />

        <MainArea
          expertData={expertData}
          banner={{
            visible: !isSessionEnded && voice.voiceActive && voice.minimized,
            elapsedText: formatTime(elapsedTime),
            onReturn: voice.returnToVoice,
          }}
          stage={{
            elapsedText: formatTime(elapsedTime),
            chatRate,
            voiceRate: displayVoiceRate,
            messages,
            onBackToChat: voice.backToChat,
            onExpandChat: voice.backToChat,
          }}
          upgrade={upgradeConfig}
          drawer={{
            open: mobileSidebarOpen,
            onOpenChange: setMobileSidebarOpen,
            router,
            ...sidebarProps,
          }}
        >
          <RoomBody
            sessionStatus={sessionStatus}
            sessionSummary={sessionSummary}
            messages={messages}
            timeline={timeline}
            expertData={expertData}
            typingStatus={typingStatus}
            user={user}
            pendingAttachment={composer.pendingAttachment}
            removePendingAttachment={composer.removePendingAttachment}
            handleFileUpload={composer.handleFileUpload}
            fileInputRef={composer.fileInputRef}
            uploading={composer.uploading}
            uploadProgress={composer.uploadProgress}
            inputValue={composer.inputValue}
            setInputValue={composer.setInputValue}
            handleSendMessage={composer.handleSendMessage}
            handleInputTyping={composer.handleInputTyping}
            dock={dockProps}
            voiceDisabled={voice.voiceActive || showVoiceStage || !voiceLive}
            voiceConnecting={voiceConnecting}
          />
        </MainArea>
      </div>

      {/* 25% (280-320px) Desktop sidebar, parallel to the main column */}
      <ConsultationSidebar {...sidebarProps} />

      <SessionSummaryModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        sessionSummary={sessionSummary}
        freeMinutes={0}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        reviewSubmitted={reviewSubmitted}
        setReviewSubmitted={setReviewSubmitted}
        sessionId={sessionId}
        expertData={expertData}
        router={router}
      />
    </div>
  );
}
