import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PendingAttachment } from  "../../types";

interface ChatAttachmentPreviewProps {
  pendingAttachment: PendingAttachment | null;
  /** Non-null while the staged file is uploading; shows percent instead of "Ready to send". */
  uploadProgress?: number | null;
  onRemove: () => void;
}

export function ChatAttachmentPreview({
  pendingAttachment,
  uploadProgress,
  onRemove,
}: ChatAttachmentPreviewProps) {
  if (!pendingAttachment) return null;

  const uploading = uploadProgress != null;

  return (
    <div className="mb-2 flex w-fit max-w-sm items-center gap-2 rounded-xl border border-[#d3cec6] bg-[#f5f1ec] px-3 py-1.5">
      {pendingAttachment.type === "image" ? (
        <img
          src={pendingAttachment.url}
          alt="Pending upload"
          className="size-8 shrink-0 rounded-lg border border-[#d3cec6] object-cover"
        />
      ) : (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#111111] text-white">
          <FileText className="size-4" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span className="block truncate font-sans text-xs font-semibold text-[#111111]">
          {pendingAttachment.name}
        </span>
        <span className="font-sans text-[10px] font-medium text-[#626260]">
          {uploading ? `Uploading ${uploadProgress ?? 0}%` : "Ready to send"}
        </span>
        {uploading ? (
          <div
            role="progressbar"
            aria-valuenow={uploadProgress ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Attachment upload progress"
            className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#d3cec6]/40"
          >
            <div
              className="h-full rounded-full bg-[#111111] transition-[width]"
              style={{ width: `${Math.min(100, Math.max(0, uploadProgress ?? 0))}%` }}
            />
          </div>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={uploading}
        className="size-6 rounded-full p-0 text-[#626260] hover:bg-white hover:text-[#111111]"
      >
        <X className="size-3.5" />
        <span className="sr-only">Remove attachment</span>
      </Button>
    </div>
  );
}
