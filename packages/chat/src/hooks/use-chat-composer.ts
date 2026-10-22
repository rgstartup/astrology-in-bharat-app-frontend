"use client";

import { useEffect, useRef, useState } from "react";
import { useChatAttachments, type UseChatAttachmentsOptions } from "./use-chat-attachments";

export interface ChatComposerTransports<TMessage> {
  /** Room + identity guard (consultation id and user present). */
  canSend: () => boolean;
  /** Text-only send over the live transport. */
  sendText: (text: string) => Promise<unknown>;
  /** Typing relay; callee debounces the stop signal. */
  sendTyping: (isTyping: boolean) => void;
  /** Insert a reconciled attachment message into the room list. */
  onAttachmentSent: (message: TMessage) => void;
  /** Raw failure; the host formats it (toast/i18n lives in-app). */
  onError: (error: unknown) => void;
}

export type UseChatComposerOptions<TMessage> = ChatComposerTransports<TMessage> &
  Omit<UseChatAttachmentsOptions<TMessage>, "onError">;

const TYPING_STOP_MS = 1500;

/**
 * New-flow composer: input value, staged file, send/typing handlers.
 * Text-only sends go over the live transport; sends with a file go over
 * HTTP in a single call (text + file + idempotency key) and reconcile from
 * the response. Every handler is guard-first. Legacy socket flows stay in
 * the apps until the old stack is retired — this hook models new-flow only.
 */
export function useChatComposer<TMessage>(options: UseChatComposerOptions<TMessage>) {
  const {
    canSend,
    sendText,
    sendTyping,
    onAttachmentSent,
    onError,
    validateFile,
    uploadFile,
    createIdempotencyKey,
  } = options;
  const [inputValue, setInputValue] = useState("");
  const attachments = useChatAttachments<TMessage>({
    validateFile,
    uploadFile,
    createIdempotencyKey,
    onError,
  });
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    },
    [],
  );

  const handleInputTyping = (): void => {
    if (!canSend()) return;
    sendTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTyping(false), TYPING_STOP_MS);
  };

  const handleSendMessage = async (): Promise<void> => {
    const text = inputValue.trim();
    if (!text && !attachments.pendingAttachment) return;
    if (!canSend() || attachments.uploading) return;

    if (!attachments.pendingAttachment) {
      try {
        await sendText(text);
      } catch (error) {
        onError(error);
        return;
      }
      setInputValue("");
      return;
    }

    const message = await attachments.uploadStaged(text);
    if (!message) return;
    onAttachmentSent(message);
    setInputValue("");
  };

  const stageFile = (file: File): boolean => {
    if (!canSend()) return false;
    return attachments.stageFile(file);
  };

  return {
    inputValue,
    setInputValue,
    pendingAttachment: attachments.pendingAttachment,
    removePendingAttachment: attachments.removePending,
    uploading: attachments.uploading,
    uploadProgress: attachments.uploadProgress,
    fileInputRef: attachments.fileInputRef,
    handleSendMessage,
    handleInputTyping,
    stageFile,
  };
}
