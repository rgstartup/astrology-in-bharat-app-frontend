"use client";

import React, { useRef, useState } from "react";
import {
  getChatAttachmentError,
  sendChatAttachment,
  toChatMessageFromAttachment,
} from "@/api/chat-attachments.api";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage, uuidv7 } from "@repo/lib";
import type { IAuthUser } from "@/store/authStore";
import type { ChatMessage } from "@/lib/types";
import type { SendChatMessageAck } from "@/realtime/types/chat";
import type { SendChatMessageInput } from "@/realtime/topics/chat";

export type PendingAttachment = {
  file: File;
  url: string;
  type: "image" | "document";
  name: string;
  /** Generated at pick time; reused across send retries so retries replay. */
  idempotencyKey: string;
};

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
 * Owns the composer: input value, staged file, send/typing handlers.
 * Text-only sends go over the socket; sends with a file go over HTTP in
 * a single call (text + file + idempotency key) and reconcile from the
 * response — the socket echo dedupes by id. Every handler is guard-first.
 */
export const useRoomComposer = ({
  roomConsultationId,
  user,
  sessionId,
  sendLiveMessage,
  sendLiveTyping,
  onAttachmentSent,
}: ComposerDeps) => {
  const [inputValue, setInputValue] = useState("");
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearPendingAttachment = (attachment: PendingAttachment | null) => {
    if (attachment) URL.revokeObjectURL(attachment.url);
    setPendingAttachment(null);
  };

  const removePendingAttachment = () => {
    setPendingAttachment((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !pendingAttachment) return;
    if (!roomConsultationId || !user || uploading) return;

    if (!pendingAttachment) {
      sendLiveMessage({ content: inputValue.trim() }).catch(() =>
        toast.error("Failed to send message. Please try again."),
      );
      setInputValue("");
      return;
    }

    const staged = pendingAttachment;
    setUploading(true);
    setUploadProgress(0);
    const res = await sendChatAttachment(
      staged.file,
      roomConsultationId,
      inputValue.trim(),
      staged.idempotencyKey,
      ({ percent }) => setUploadProgress(percent ?? 0),
    );
    setUploading(false);
    setUploadProgress(null);

    if (!res.ok) {
      console.error("Attachment send error:", res.error);
      toast.error(getErrorMessage(res.error) || "Failed to send attachment. Tap send to retry.");
      return;
    }

    onAttachmentSent(toChatMessageFromAttachment(res.data));
    setInputValue("");
    clearPendingAttachment(staged);
  };

  const handleInputTyping = () => {
    if (!roomConsultationId || !user) return;
    sendLiveTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendLiveTyping(false), 1500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId || !user) return;
    if (!roomConsultationId) return;

    const validationError = getChatAttachmentError(file);
    if (e.target) e.target.value = "";
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setPendingAttachment((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return {
        file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image") ? "image" : "document",
        name: file.name,
        idempotencyKey: uuidv7(),
      };
    });
  };

  return {
    inputValue,
    setInputValue,
    pendingAttachment,
    removePendingAttachment,
    uploading,
    uploadProgress,
    fileInputRef,
    handleSendMessage,
    handleInputTyping,
    handleFileUpload,
  };
};
