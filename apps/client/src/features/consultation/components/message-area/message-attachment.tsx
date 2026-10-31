"use client";

import { FileText, Download, Expand } from "@repo/design/lucide";
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "@repo/design/shadcn";
import { cn } from "@repo/design/cn";

type MessageAttachmentProps = {
  attachmentUrl?: string;
  attachmentType?: string;
  isUser: boolean;
  isOnlyAttachment?: boolean;
  content?: string;
  onPreview: (url: string) => void;
};

const IMAGE_PATTERN = /\.(jpg|jpeg|png|gif|webp|svg|avif)$|images/i;

function isImageAttachment(type?: string, url?: string): boolean {
  if (type === "image") return true;
  if (!url) return false;
  return IMAGE_PATTERN.test(url);
}

function getFilename(url?: string): string {
  if (!url) return "Document attachment";
  try {
    const pathname = new URL(url).pathname;
    const name = pathname.split("/").pop();
    if (name && name.trim()) return decodeURIComponent(name);
  } catch {
    const parts = url.split("/");
    const name = parts[parts.length - 1]?.split("?")[0];
    if (name && name.trim()) return name;
  }
  return "Document attachment";
}

export default function MessageAttachment({
  attachmentUrl,
  attachmentType,
  isUser,
  isOnlyAttachment,
  content,
  onPreview,
}: MessageAttachmentProps) {
  if (!attachmentUrl) return null;

  const trimmed = content?.trim().toLowerCase();
  const hasText = Boolean(
    content &&
      trimmed !== "" &&
      trimmed !== "sent an image" &&
      trimmed !== "sent an attachment",
  );
  const showWholeAttachmentOnly = isOnlyAttachment ?? !hasText;
  const isImage = isImageAttachment(attachmentType, attachmentUrl);

  // Case 1: Attachment only -> render attachment in whole
  if (showWholeAttachmentOnly || !hasText) {
    if (isImage) {
      return (
        <div
          data-slot="message-attachment"
          className={cn(
            "relative max-w-sm overflow-hidden rounded-xl border transition-all",
            isUser
              ? "self-end border-[#111111] bg-[#111111]"
              : "self-start border-[#d3cec6] bg-white",
          )}
        >
          <button
            type="button"
            onClick={() => onPreview(attachmentUrl)}
            className="group relative block w-full cursor-pointer overflow-hidden rounded-xl focus:outline-hidden"
            aria-label="Preview image"
          >
            <img
              src={attachmentUrl}
              alt="attachment"
              className="max-h-80 w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            <span className="absolute right-2 bottom-2 inline-flex items-center justify-center rounded-lg bg-black/60 p-1.5 text-white opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
              <Expand className="size-3.5" />
            </span>
          </button>
        </div>
      );
    }

    return (
      <div
        data-slot="message-attachment"
        className={cn(isUser ? "self-end" : "self-start")}
      >
        <Attachment
          className={cn(
            "max-w-sm overflow-hidden rounded-xl border",
            isUser
              ? "border-[#111111] bg-[#111111] text-white"
              : "border-[#d3cec6] bg-white text-[#111111]",
          )}
        >
          <AttachmentMedia className={isUser ? "bg-white/10 text-white" : "bg-neutral-100 text-[#626260]"}>
            <FileText className="size-4" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle className={cn("font-sans truncate", isUser ? "text-white" : "text-[#111111]")}>
              {getFilename(attachmentUrl)}
            </AttachmentTitle>
            <AttachmentDescription
              className={cn("font-sans text-[11px]", isUser ? "text-white/70" : "text-[#7b7b78]")}
            >
              Document file
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction
              render={<a href={attachmentUrl} target="_blank" rel="noopener noreferrer" />}
              nativeButton={false}
              aria-label="Open document"
              className={cn(
                "rounded-lg hover:underline",
                isUser ? "text-white/80 hover:text-white" : "text-[#626260] hover:text-[#111111]",
              )}
            >
              <Download className="size-3.5" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </div>
    );
  }

  // Case 2: Attachment + Message -> Unified Card (Top: Attachment, Bottom: Message)
  return (
    <div
      data-slot="message-attachment"
      className={cn(
        "w-fit max-w-sm overflow-hidden rounded-xl border font-sans shadow-xs",
        isUser
          ? "self-end border-[#111111] bg-[#111111] text-white"
          : "self-start border-[#d3cec6] bg-white text-[#111111]",
      )}
    >
      {/* Top: Attachment */}
      {isImage ? (
        <div className="p-2 pb-0">
          <button
            type="button"
            onClick={() => onPreview(attachmentUrl)}
            className={cn(
              "group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg focus:outline-hidden",
              isUser ? "bg-white/5" : "bg-neutral-100",
            )}
            aria-label="Preview image"
          >
            <img
              src={attachmentUrl}
              alt="attachment"
              className="max-h-60 w-full object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            <span className="absolute right-2 bottom-2 inline-flex items-center justify-center rounded-lg bg-black/60 p-1.5 text-white opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
              <Expand className="size-3.5" />
            </span>
          </button>
        </div>
      ) : (
        <div className="border-b border-inherit/20 p-2">
          <Attachment
            className={cn(
              "w-full border-0 shadow-none",
              isUser ? "bg-white/10 text-white" : "bg-neutral-50 text-[#111111]",
            )}
          >
            <AttachmentMedia className={isUser ? "bg-white/10 text-white" : "bg-white text-[#626260]"}>
              <FileText className="size-4" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle className={cn("font-sans text-xs truncate", isUser ? "text-white" : "text-[#111111]")}>
                {getFilename(attachmentUrl)}
              </AttachmentTitle>
              <AttachmentDescription
                className={cn("font-sans text-[10px]", isUser ? "text-white/70" : "text-[#7b7b78]")}
              >
                Document file
              </AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction
                render={<a href={attachmentUrl} target="_blank" rel="noopener noreferrer" />}
                nativeButton={false}
                aria-label="Open document"
                className={cn(
                  "rounded-lg hover:underline",
                  isUser ? "text-white/80 hover:text-white" : "text-[#626260] hover:text-[#111111]",
                )}
              >
                <Download className="size-3.5" />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </div>
      )}

      {/* Bottom: Message */}
      <div className="px-3.5 py-2.5 text-sm leading-relaxed wrap-break-word">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
