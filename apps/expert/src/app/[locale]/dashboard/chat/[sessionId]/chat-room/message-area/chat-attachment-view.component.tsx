import { FileText, Download } from "lucide-react";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";

interface ChatAttachmentViewProps {
  url: string;
  type?: "image" | "document" | string;
  onPreviewImage: (url: string) => void;
}

export function ChatAttachmentView({
  url,
  type,
  onPreviewImage,
}: ChatAttachmentViewProps) {
  const isImage =
    type?.toLowerCase() === "image" ||
    url.match(/\.(jpg|jpeg|png|gif|webp)$|images/i);

  if (isImage) {
    return (
      <button
        type="button"
        onClick={() => onPreviewImage(url)}
        className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 hover:opacity-95 transition-opacity"
      >
        <img
          src={url}
          alt="Attachment preview"
          className="max-h-60 w-auto max-w-xs object-cover rounded-xl"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="no-underline block"
    >
      <Attachment size="sm" className="hover:border-orange-300">
        <AttachmentMedia variant="icon">
          <FileText className="size-4 text-orange-600" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Attached Document</AttachmentTitle>
          <AttachmentDescription>Click to view / download</AttachmentDescription>
        </AttachmentContent>
        <div className="pr-2 text-slate-400">
          <Download className="size-3.5" />
        </div>
      </Attachment>
    </a>
  );
}
