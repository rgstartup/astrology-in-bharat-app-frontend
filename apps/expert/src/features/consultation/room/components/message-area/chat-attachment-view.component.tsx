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
        className="cursor-pointer overflow-hidden rounded-xl border border-[#d3cec6] transition-opacity hover:opacity-95"
      >
        <img
          src={url}
          alt="Attachment preview"
          className="max-h-60 w-auto max-w-xs rounded-xl object-cover"
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
      <Attachment size="sm" className="border-[#d3cec6] bg-white hover:border-[#111111]">
        <AttachmentMedia variant="icon">
          <FileText className="size-4 text-[#111111]" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle className="font-sans text-[#111111]">Attached document</AttachmentTitle>
          <AttachmentDescription className="font-sans text-[#626260]">Click to view / download</AttachmentDescription>
        </AttachmentContent>
        <div className="pr-2 text-[#7b7b78]">
          <Download className="size-3.5" />
        </div>
      </Attachment>
    </a>
  );
}
