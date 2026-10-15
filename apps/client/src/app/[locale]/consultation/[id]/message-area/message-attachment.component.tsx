"use client";

import { FileText, Download, Expand } from "lucide-react";
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "@/components/ui/attachment";
import { cn } from "@/lib/utils";

type MessageAttachmentProps = {
  attachmentUrl?: string;
  attachmentType?: string;
  isUser: boolean;
  isOnlyAttachment: boolean;
  onPreview: (url: string) => void;
};

const IMAGE_PATTERN = /\.(jpg|jpeg|png|gif|webp)$|images/i;

function attachmentFrameClass(isOnlyAttachment: boolean): string {
  if (isOnlyAttachment)
    return "max-w-sm overflow-hidden rounded-xl border border-[#d3cec6] bg-[#ffffff]";
  return "mb-2 max-w-sm overflow-hidden rounded-xl border border-[#d3cec6] bg-[#ffffff]";
}

function ImageAttachment({
  attachmentUrl,
  isOnlyAttachment,
  onPreview,
}: {
  attachmentUrl: string;
  isOnlyAttachment: boolean;
  onPreview: (url: string) => void;
}) {
  return (
    <Attachment className={cn(attachmentFrameClass(isOnlyAttachment))}>
      <AttachmentMedia variant="image" className="bg-[#ffffff]">
        <img
          src={attachmentUrl}
          alt="attachment"
          className="max-h-60 w-full rounded-t-xl object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle className="font-sans text-[#111111]">Image attachment</AttachmentTitle>
        <AttachmentDescription className="font-sans text-[11px] text-[#7b7b78]">
          Tap to preview
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction
          onClick={() => onPreview(attachmentUrl)}
          aria-label="Preview image"
          className="rounded-lg text-[#626260] hover:text-[#111111] hover:underline"
        >
          <Expand />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}

function DocumentAttachment({
  attachmentUrl,
  isOnlyAttachment,
}: {
  attachmentUrl: string;
  isOnlyAttachment: boolean;
}) {
  return (
    <Attachment className={cn(attachmentFrameClass(isOnlyAttachment))}>
      <AttachmentMedia className="bg-[#ffffff] text-[#626260]">
        <FileText />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle className="font-sans text-[#111111]">Document attachment</AttachmentTitle>
        <AttachmentDescription className="font-sans text-[11px] text-[#7b7b78]">
          Document file
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction
          render={<a href={attachmentUrl} target="_blank" rel="noopener noreferrer" />}
          nativeButton={false}
          aria-label="Open document"
          className="rounded-lg text-[#626260] hover:text-[#111111] hover:underline"
        >
          <Download />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}

/** Waterfall: no attachment → image → document. One branch, one return. */
export default function MessageAttachment({
  attachmentUrl,
  attachmentType,
  isUser,
  isOnlyAttachment,
  onPreview,
}: MessageAttachmentProps) {
  void isUser;
  if (!attachmentUrl) return null;

  if (attachmentType === "image") {
    return (
      <ImageAttachment
        attachmentUrl={attachmentUrl}
        isOnlyAttachment={isOnlyAttachment}
        onPreview={onPreview}
      />
    );
  }

  if (IMAGE_PATTERN.test(attachmentUrl)) {
    return (
      <ImageAttachment
        attachmentUrl={attachmentUrl}
        isOnlyAttachment={isOnlyAttachment}
        onPreview={onPreview}
      />
    );
  }

  return <DocumentAttachment attachmentUrl={attachmentUrl} isOnlyAttachment={isOnlyAttachment} />;
}
