import type { ChangeEvent, KeyboardEvent, RefObject } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatAttachmentPreview } from "./chat-attachment-preview.component";
import type { PendingAttachment } from  "../../types";

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

/**
 * Message composer: white hairline shell, cream input well, charcoal send.
 */
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
    <div className="border-t border-[#d3cec6] bg-white p-3 sm:p-4">
      <div className="mx-auto max-w-4xl">
        <ChatAttachmentPreview
          pendingAttachment={pendingAttachment}
          uploadProgress={uploadProgress}
          onRemove={onRemoveAttachment}
        />

        <div className="flex items-end gap-2 rounded-xl border border-[#d3cec6] bg-white p-1.5 transition-all focus-within:border-[#111111]">
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
            className="size-9 shrink-0 rounded-full p-0 text-[#626260] hover:bg-[#f5f1ec] hover:text-[#111111]"
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
            className="max-h-28 min-h-[36px] flex-1 resize-none border-none bg-transparent px-1 py-2 font-sans text-sm leading-relaxed text-[#111111] outline-none placeholder:text-[#7b7b78]"
          />

          <Button
            type="button"
            disabled={!canSend}
            onClick={onSendMessage}
            size="sm"
            className={`size-9 shrink-0 rounded-full p-0 transition-all ${
              canSend
                ? "bg-[#111111] text-white hover:bg-black"
                : "cursor-not-allowed bg-[#ebe7e1] text-[#9c9fa5]"
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
