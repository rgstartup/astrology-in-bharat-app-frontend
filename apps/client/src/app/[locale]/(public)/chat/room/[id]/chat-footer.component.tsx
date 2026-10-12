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
  isDarkMode: boolean;
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

type ComposerProps = Omit<ChatFooterProps, "isDarkMode" | "sessionStatus"> & {
  disabled: boolean;
};

function Composer({
  pendingAttachment, removePendingAttachment, handleFileUpload, fileInputRef,
  uploading, uploadProgress, inputValue, setInputValue, handleSendMessage, handleInputTyping,
  disabled,
}: ComposerProps) {
  const canSend = Boolean(inputValue.trim() || pendingAttachment) && !uploading;

  return (
    <div className="flex flex-1 flex-col gap-2 rounded-[20px] border-2 border-primary/60 bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
      {pendingAttachment ? (
        <Attachment state={uploading ? "uploading" : "done"}>
          <AttachmentMedia><FileText /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{pendingAttachment.name}</AttachmentTitle>
            {uploadProgress !== null ? (
              <>
                <AttachmentDescription>Uploading {uploadProgress}%</AttachmentDescription>
                <div
                  role="progressbar"
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Attachment upload progress"
                  className="h-1 w-full overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${Math.min(100, Math.max(0, uploadProgress))}%` }}
                  />
                </div>
              </>
            ) : null}
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
      ) : null}
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
          className="min-h-9 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <span className="hidden whitespace-nowrap text-muted-foreground text-[11px] md:block">
          Shift + Enter for new line
        </span>
        <Button
          size="icon"
          className="size-9 md:size-12"
          disabled={disabled || !canSend}
          onClick={handleSendMessage}
          aria-label="Send message"
        >
          {uploading ? <Spinner /> : <Send />}
        </Button>
      </div>
    </div>
  );
}

function ActiveFooter(props: Omit<ComposerProps, "disabled">) {
  return (
    <footer className="border-t border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3 md:gap-4 md:px-12 md:py-6">
        <Composer {...props} disabled={false} />
      </div>
    </footer>
  );
}

function InactiveFooter(props: Omit<ComposerProps, "disabled">) {
  return (
    <footer className="border-t border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-3 md:px-12 md:py-6">
        <div className="flex items-center gap-2 md:gap-4" aria-disabled="true">
          <Composer {...props} disabled />
        </div>
        <p className="text-center text-muted-foreground text-xs">This session has ended — messaging is disabled.</p>
      </div>
    </footer>
  );
}

export default function ChatFooter({ isDarkMode, sessionStatus, ...rest }: ChatFooterProps) {
  void isDarkMode;
  if (sessionStatus !== "active") return <InactiveFooter {...rest} />;
  return <ActiveFooter {...rest} />;
}
