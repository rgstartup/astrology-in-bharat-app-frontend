import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PendingAttachment } from "../types";

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
    <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 mb-2 w-fit max-w-sm">
      {pendingAttachment.type === "image" ? (
        <img
          src={pendingAttachment.url}
          alt="Pending upload"
          className="size-8 rounded-lg object-cover border border-orange-200 shrink-0"
        />
      ) : (
        <div className="size-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
          <FileText className="size-4" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span className="text-xs font-semibold text-orange-950 truncate block">
          {pendingAttachment.name}
        </span>
        <span className="text-[10px] text-orange-600 font-medium">
          {uploading ? `Uploading ${uploadProgress ?? 0}%` : "Ready to send"}
        </span>
        {uploading ? (
          <div
            role="progressbar"
            aria-valuenow={uploadProgress ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Attachment upload progress"
            className="mt-1 h-1 w-full overflow-hidden rounded-full bg-orange-200"
          >
            <div
              className="h-full rounded-full bg-orange-600 transition-[width]"
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
        className="size-6 p-0 rounded-full text-orange-700 hover:bg-orange-200/60"
      >
        <X className="size-3.5" />
        <span className="sr-only">Remove attachment</span>
      </Button>
    </div>
  );
}
