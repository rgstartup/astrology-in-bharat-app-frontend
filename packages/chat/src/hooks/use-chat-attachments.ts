"use client";

import { useRef, useState } from "react";
import type { PendingAttachment } from "../types";
import { attachmentTypeFromMime } from "../utils/attachments";

export interface AttachmentUploadResult<TMessage> {
  ok: boolean;
  message?: TMessage;
  /** Raw failure; the host formats it (toast/i18n lives in-app). */
  error?: unknown;
}

export interface AttachmentUploader<TMessage> {
  (
    file: File,
    text: string,
    idempotencyKey: string,
    onProgress: (percent: number) => void,
  ): Promise<AttachmentUploadResult<TMessage>>;
}

export interface UseChatAttachmentsOptions<TMessage> {
  /** Backend allowlist check; returns a user-facing error or null. */
  validateFile: (file: File) => string | null;
  uploadFile: AttachmentUploader<TMessage>;
  createIdempotencyKey: () => string;
  onError: (error: unknown) => void;
}

/**
 * Staged-attachment state: pick → validate → stage locally, then upload in
 * one call with the message text + idempotency key. Failures keep the staged
 * file so a retry replays instead of duplicating. UI-agnostic: no toast,
 * no input-element handling — the host wires those around `stageFile`.
 */
export function useChatAttachments<TMessage>(options: UseChatAttachmentsOptions<TMessage>) {
  const { validateFile, uploadFile, createIdempotencyKey, onError } = options;
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stageFile = (file: File): boolean => {
    const validationError = validateFile(file);
    if (validationError) {
      onError(validationError);
      return false;
    }
    setPendingAttachment((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return {
        file,
        url: URL.createObjectURL(file),
        type: attachmentTypeFromMime(file.type),
        name: file.name,
        idempotencyKey: createIdempotencyKey(),
      };
    });
    return true;
  };

  const removePending = (): void => {
    setPendingAttachment((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  };

  const uploadStaged = async (text: string): Promise<TMessage | null> => {
    const staged = pendingAttachment;
    const stagedFile = staged?.file;
    if (!staged || !stagedFile || uploading) return null;
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadFile(
        stagedFile,
        text,
        staged.idempotencyKey ?? createIdempotencyKey(),
        (percent) => setUploadProgress(percent),
      );
      if (!result.ok || !result.message) {
        onError(result.error);
        return null;
      }
      removePending();
      return result.message;
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  return {
    pendingAttachment,
    uploading,
    uploadProgress,
    fileInputRef,
    stageFile,
    removePending,
    uploadStaged,
  };
}
