"use client";

import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ChatFooter } from "@/features/consultation";
import type { PendingAttachment } from "@/features/consultation";

function ActiveComposerStory() {
  const [inputValue, setInputValue] = useState(
    "What does this week hold for my career?",
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="w-full max-w-3xl bg-[#f5f1ec] p-4">
      <ChatFooter />
    </div>
  );
}

const uploadingAttachment: PendingAttachment = {
  file: new File(["dummy"], "kundali.pdf", { type: "application/pdf" }),
  url: "#",
  type: "document",
  name: "kundali.pdf",
  idempotencyKey: "story-upload-key",
};

function UploadingAttachmentStory() {
  const [inputValue, setInputValue] = useState("Please review my chart.");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="w-full max-w-3xl bg-[#f5f1ec] p-4">
      <ChatFooter />
    </div>
  );
}

function InactiveSessionStory() {
  const [inputValue, setInputValue] = useState("Is the consultation still on?");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="w-full max-w-3xl bg-[#f5f1ec] p-4">
      <ChatFooter />
    </div>
  );
}

const meta: Meta<typeof ChatFooter> = {
  title: "Chat/Room/ChatFooter",
  component: ChatFooter,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ChatFooter>;

export const ActiveComposer: Story = {
  render: () => <ActiveComposerStory />,
};

export const UploadingAttachment: Story = {
  render: () => <UploadingAttachmentStory />,
};

export const InactiveSession: Story = {
  render: () => <InactiveSessionStory />,
};
