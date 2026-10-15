"use client";

import type { ChangeEvent, RefObject } from "react";
import { FileText, Paperclip, Send, X } from "lucide-react";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { PendingAttachment } from "./chat-room/hooks/use-room-composer";

type ChatFooterProps = {
  sessionStatus: string;
  pendingAttachment: PendingAttachment | null;
  removePendingAttachment: () => void;
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  uploading: boolean;
  uploadProgress: number | null;
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSendMessage: () => void;
  handleInputTyping?: () => void;
};

type ComposerProps = Omit<ChatFooterProps, "sessionStatus"> & {
  disabled: boolean;
};

function SendButtonIcon({ uploading }: { uploading: boolean }) {
  if (uploading) return <Spinner />;
  return <Send />;
}

function UploadProgress({ uploadProgress }: { uploadProgress: number | null }) {
  if (uploadProgress === null) return null;
  const clamped = Math.min(100, Math.max(0, uploadProgress));
  return (
    <>
      <AttachmentDescription>Uploading {uploadProgress}%</AttachmentDescription>
      <div
        role="progressbar"
        aria-valuenow={uploadProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Attachment upload progress"
        className="h-1 w-full overflow-hidden rounded-full bg-[#d3cec6]/40"
      >
        <div
          className="h-full rounded-full bg-[#111111] transition-[width]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </>
  );
}

function StagedPreview({
  pendingAttachment,
  uploading,
  uploadProgress,
  removePendingAttachment,
  disabled,
}: Pick<
  ComposerProps,
  "pendingAttachment" | "uploading" | "uploadProgress" | "removePendingAttachment" | "disabled"
>) {
  if (!pendingAttachment) return null;
  let attachmentState: "uploading" | "done" = "done";
  if (uploading) attachmentState = "uploading";
  return (
    <Attachment state={attachmentState} className="border-[#d3cec6] bg-[#ffffff] shadow-none">
      <AttachmentMedia>
        <FileText className="text-[#111111]" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle className="text-[#111111]">{pendingAttachment.name}</AttachmentTitle>
        <UploadProgress uploadProgress={uploadProgress} />
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction
          onClick={removePendingAttachment}
          disabled={disabled}
          aria-label="Remove attachment"
        >
          <X />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}

function Composer({
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
  disabled,
}: ComposerProps) {
  const canSend = Boolean(inputValue.trim() || pendingAttachment) && !uploading;

  return (
    <div className="flex flex-1 flex-col gap-2 rounded-lg border border-[#d3cec6] bg-[#ffffff] p-1.5 shadow-none focus-within:border-[#111111]">
      <StagedPreview
        pendingAttachment={pendingAttachment}
        uploading={uploading}
        uploadProgress={uploadProgress}
        removePendingAttachment={removePendingAttachment}
        disabled={disabled}
      />
      <div className="flex items-center gap-1.5 md:gap-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                disabled={disabled || uploading}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach file"
                className="text-[#111111] hover:bg-[#f5f1ec] hover:text-[#111111]"
              >
                <Paperclip />
              </Button>
            }
          />
          <TooltipContent>Attach file</TooltipContent>
        </Tooltip>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
          disabled={disabled}
          tabIndex={-1}
        />
        <Textarea
          rows={1}
          value={inputValue}
          disabled={disabled}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleInputTyping?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Consult with intention…"
          className="min-h-9 flex-1 resize-none border-0 bg-transparent font-sans text-[#111111] shadow-none placeholder:text-[#7b7b78] focus-visible:ring-0"
        />
        <span className="hidden whitespace-nowrap font-sans text-[11px] text-[#7b7b78] md:block">
          Shift + Enter for new line
        </span>
        <Button
          size="icon"
          className="size-11 shrink-0 rounded-lg bg-[#111111] text-white hover:bg-[#111111]/90"
          disabled={disabled || !canSend}
          onClick={handleSendMessage}
          aria-label="Send message"
        >
          <SendButtonIcon uploading={uploading} />
        </Button>
      </div>
    </div>
  );
}

function ActiveFooter(props: Omit<ComposerProps, "disabled">) {
  return (
    <footer className="shrink-0 border-t border-[#d3cec6]/60 bg-[#f5f1ec]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3 md:gap-4 md:px-12 md:py-6">
        <Composer {...props} disabled={false} />
      </div>
    </footer>
  );
}

function InactiveFooter(props: Omit<ComposerProps, "disabled">) {
  return (
    <footer className="shrink-0 border-t border-[#d3cec6]/60 bg-[#f5f1ec]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-3 md:px-12 md:py-6">
        <div className="flex items-center gap-2 opacity-70 md:gap-4" aria-disabled="true">
          <Composer {...props} disabled />
        </div>
        <p className="text-center font-sans text-xs text-[#9c9fa5]">
          This session has ended — messaging is disabled.
        </p>
      </div>
    </footer>
  );
}

export default function ChatFooter({ sessionStatus, ...rest }: ChatFooterProps) {
  if (sessionStatus !== "active") return <InactiveFooter {...rest} />;
  return <ActiveFooter {...rest} />;
}
