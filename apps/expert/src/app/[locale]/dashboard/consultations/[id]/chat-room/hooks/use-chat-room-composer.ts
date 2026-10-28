"use client";

import { useState, useRef, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import api from "@/actions/api";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getChatAttachmentError,
  sendChatAttachment,
  toChatMessageFromAttachment,
} from "@/api/chat-attachments.api";
import { getErrorMessage, uuidv7 } from "@repo/lib";
import type { ChatMessage, PendingAttachment } from "../types";

interface UseChatRoomComposerProps {
  sessionId: string;
  newFlowId: number | null;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  sendLiveMessage: (payload: { content: string; attachmentUrl?: string; attachmentType?: string }) => Promise<unknown>;
  sendLiveTyping: (isTyping: boolean) => void;
}

export function useChatRoomComposer({
  sessionId,
  newFlowId,
  setMessages,
  sendLiveMessage,
  sendLiveTyping,
}: UseChatRoomComposerProps) {
  const { user } = useAuthStore();
  const [inputValue, setInputValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputTyping = () => {
    if (!sessionId || !user) return;
    if (newFlowId != null) {
      sendLiveTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => sendLiveTyping(false), 1500);
    }
  };

  const removePendingAttachment = () => {
    setPendingAttachment((prev) => {
      // revokeObjectURL is a no-op for non-blob URLs, so legacy remote
      // stages are safe to pass through here too.
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !pendingAttachment) || !sessionId || !user) return;

    // New flow with a locally staged file: single HTTP call carrying the
    // text + file + idempotency key. The server persists message + media +
    // link in one transaction and emits `chat:message` to the room — no
    // socket send needed. Failures keep the staged file so a retry reuses
    // the same idempotency key and replays instead of duplicating.
    if (pendingAttachment?.file && newFlowId != null) {
      if (uploading) return;
      const staged = pendingAttachment;
      const stagedFile = staged.file;
      if (!stagedFile) return;
      setUploading(true);
      setUploadProgress(0);
      const res = await sendChatAttachment(
        stagedFile,
        newFlowId,
        inputValue.trim(),
        staged.idempotencyKey ?? uuidv7(),
        ({ percent }) => setUploadProgress(percent ?? 0),
      );
      setUploading(false);
      setUploadProgress(null);

      if (!res.ok) {
        toast.error(getErrorMessage(res.error) || "Failed to send attachment. Tap send to retry.");
        return;
      }

      const message = toChatMessageFromAttachment(res.data, String(newFlowId));
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );
      setInputValue("");
      removePendingAttachment();
      return;
    }

    const textContent =
      inputValue.trim() ||
      (pendingAttachment?.type === "image" ? "Sent an image" : "Sent an attachment");

    if (newFlowId != null) {
      sendLiveMessage({
        content: textContent,
        ...(pendingAttachment
          ? {
              attachmentUrl: pendingAttachment.url,
              attachmentType: pendingAttachment.type,
            }
          : {}),
      }).catch(() => toast.error("Failed to send message. Please try again."));
      setInputValue("");
      removePendingAttachment();
      return;
    }

    setInputValue("");
    removePendingAttachment();
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId || !user) return;

    // New flow: validate against the backend allowlist and stage locally —
    // the file goes up with the send in a single HTTP call.
    if (newFlowId != null) {
      if (e.target) e.target.value = "";
      const validationError = getChatAttachmentError(file);
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
    }
  };

  return {
    inputValue,
    setInputValue,
    uploading,
    uploadProgress,
    pendingAttachment,
    setPendingAttachment,
    removePendingAttachment,
    fileInputRef,
    handleInputTyping,
    handleSendMessage,
    handleFileUpload,
  };
}
