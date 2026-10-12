import type { ChangeEvent, KeyboardEvent, RefObject } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatAttachmentPreview } from "./chat-attachment-preview.component";
import type { PendingAttachment } from "../types";

interface ChatComposerProps {
  inputValue: string;
  onInputChange: (val: string) => void;
  onInputTyping: () => void;
  onSendMessage: () => void;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  uploading: boolean;
  uploadProgress: number | null;
  pendingAttachment: PendingAttachment | null;
  onRemoveAttachment: () => void;
}

export function ChatComposer({
  inputValue,
  onInputChange,
  onInputTyping,
  onSendMessage,
  onFileUpload,
  fileInputRef,
  uploading,
  uploadProgress,
  pendingAttachment,
  onRemoveAttachment,
}: ChatComposerProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const canSend = Boolean(inputValue.trim() || pendingAttachment) && !uploading;

  return (
    <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto">
        <ChatAttachmentPreview
          pendingAttachment={pendingAttachment}
          uploadProgress={uploadProgress}
          onRemove={onRemoveAttachment}
        />

        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileUpload}
            accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={uploading}
            isLoading={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="size-9 p-0 rounded-xl text-slate-500 hover:text-orange-600 hover:bg-orange-50 shrink-0"
          >
            <Paperclip className="size-4" />
            <span className="sr-only">Attach file</span>
          </Button>

          <textarea
            rows={1}
            value={inputValue}
            placeholder="Type your message..."
            onChange={(e) => {
              onInputChange(e.target.value);
              onInputTyping();
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 resize-none min-h-[36px] max-h-28 py-2 px-1 leading-relaxed"
          />

          <Button
            type="button"
            disabled={!canSend}
            onClick={onSendMessage}
            size="sm"
            className={`size-9 p-0 rounded-xl shrink-0 transition-all ${
              canSend
                ? "bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            <Send className="size-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
