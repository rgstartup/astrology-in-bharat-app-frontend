"use client";

import React from "react";
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
    <Attachment className={cn("max-w-sm", !isOnlyAttachment && "mb-2")}>
      <AttachmentMedia variant="image">
        <img
          src={attachmentUrl}
          alt="attachment"
          className="w-full max-h-60 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Image Attachment</AttachmentTitle>
        <AttachmentDescription className="text-muted-foreground">
          Tap to preview
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction onClick={() => onPreview(attachmentUrl)} aria-label="Preview image">
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
    <Attachment className={cn("max-w-sm", !isOnlyAttachment && "mb-2")}>
      <AttachmentMedia>
        <FileText />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Document Attachment</AttachmentTitle>
        <AttachmentDescription className="text-muted-foreground">
          Document file
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction
          render={<a href={attachmentUrl} target="_blank" rel="noopener noreferrer" />}
          nativeButton={false}
          aria-label="Open document"
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
  if (!attachmentUrl) return null;

  void isUser;

  const isImage = attachmentType === "image" || IMAGE_PATTERN.test(attachmentUrl);

  if (isImage) {
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
