"use client";

import React from "react";
import {
  getChatAttachmentError,
  sendChatAttachment,
  toChatMessageFromAttachment,
} from "@/api/chat-attachments.api";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage, uuidv7 } from "@repo/lib";
import { useChatComposer } from "@repo/chat";
import type { PendingAttachment } from "@repo/chat";
import type { IAuthUser } from "@/store/authStore";
import type { ChatMessage } from "@/lib/types";
import type { SendChatMessageAck } from "@/realtime/types/chat";
import type { SendChatMessageInput } from "@/realtime/topics/chat";

export type { PendingAttachment };

type ComposerDeps = {
  roomConsultationId: number | null;
  user: IAuthUser | null;
  sessionId: string | null;
  sendLiveMessage: (
    input: Omit<SendChatMessageInput, "consultationId">,
  ) => Promise<SendChatMessageAck>;
  sendLiveTyping: (isTyping?: boolean) => void;
  onAttachmentSent: (message: ChatMessage) => void;
};

/**
 * Client room composer: thin transport adapter over the shared
 * `useChatComposer` (input state, typing debounce, staged-attachment
 * upload). Copy stays user-facing here; the flow lives in `@repo/chat`.
 */
export const useRoomComposer = ({
  roomConsultationId,
  user,
  sessionId,
  sendLiveMessage,
  sendLiveTyping,
  onAttachmentSent,
}: ComposerDeps) => {
  const composer = useChatComposer<ChatMessage>({
    canSend: () => roomConsultationId !== null && user !== null,
    sendText: (text) => sendLiveMessage({ content: text }),
    sendTyping: (isTyping) => {
      if (roomConsultationId !== null && user !== null) sendLiveTyping(isTyping);
    },
    onAttachmentSent,
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to send. Please try again.");
    },
    validateFile: (file) => getChatAttachmentError(file),
    uploadFile: async (file, text, idempotencyKey, onProgress) => {
      if (roomConsultationId === null) return { ok: false as const };
      const res = await sendChatAttachment(
        file,
        roomConsultationId,
        text,
        idempotencyKey,
        ({ percent }) => onProgress(percent ?? 0),
      );
      if (!res.ok) return { ok: false as const, error: res.error };
      return { ok: true as const, message: toChatMessageFromAttachment(res.data) };
    },
    createIdempotencyKey: () => uuidv7(),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = "";
    if (!file || !sessionId || !user || !roomConsultationId) return;
    composer.stageFile(file);
  };

  return {
    inputValue: composer.inputValue,
    setInputValue: composer.setInputValue,
    pendingAttachment: composer.pendingAttachment,
    removePendingAttachment: composer.removePendingAttachment,
    uploading: composer.uploading,
    uploadProgress: composer.uploadProgress,
    fileInputRef: composer.fileInputRef,
    handleSendMessage: composer.handleSendMessage,
    handleInputTyping: composer.handleInputTyping,
    handleFileUpload,
  };
};
