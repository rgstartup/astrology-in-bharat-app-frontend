"use client";

import type { Meta, StoryObj } from "@repo/storybook";
import { MessageAttachment } from "@/features/consultation/message-area";

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800";
const SAMPLE_DOC = "https://example.com/documents/astrological-chart-report.pdf";

const meta: Meta<typeof MessageAttachment> = {
  title: "Chat/Room/MessageAttachment",
  component: MessageAttachment,
  parameters: {
    layout: "centered",
    backgrounds: { default: "Intercom canvas" },
  },
  decorators: [
    (Story) => (
      <div className="flex w-[420px] flex-col gap-4 bg-[#f5f1ec] p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MessageAttachment>;

/** Incoming: only attachment (shows attachment in whole) */
export const ImageOnlyIncoming: Story = {
  args: {
    attachmentUrl: SAMPLE_IMAGE,
    attachmentType: "image",
    isUser: false,
    isOnlyAttachment: true,
    content: "",
    onPreview: (url: string) => alert(`Previewing: ${url}`),
  },
};

/** Incoming: attachment + message (shows card with top attachment, bottom message) */
export const ImageWithMessageIncoming: Story = {
  args: {
    attachmentUrl: SAMPLE_IMAGE,
    attachmentType: "image",
    isUser: false,
    isOnlyAttachment: false,
    content: "Here is your planetary alignment chart for the upcoming transit.",
    onPreview: (url: string) => alert(`Previewing: ${url}`),
  },
};

/** Outgoing (user): only attachment (shows attachment in whole) */
export const ImageOnlyOutgoing: Story = {
  args: {
    attachmentUrl: SAMPLE_IMAGE,
    attachmentType: "image",
    isUser: true,
    isOnlyAttachment: true,
    content: "",
    onPreview: (url: string) => alert(`Previewing: ${url}`),
  },
};

/** Outgoing (user): attachment + message (shows dark card with top attachment, bottom message) */
export const ImageWithMessageOutgoing: Story = {
  args: {
    attachmentUrl: SAMPLE_IMAGE,
    attachmentType: "image",
    isUser: true,
    isOnlyAttachment: false,
    content: "Please find the picture of my right palm taken in daylight.",
    onPreview: (url: string) => alert(`Previewing: ${url}`),
  },
};

/** Incoming: document attachment only (shows whole document card) */
export const DocumentOnlyIncoming: Story = {
  args: {
    attachmentUrl: SAMPLE_DOC,
    attachmentType: "document",
    isUser: false,
    isOnlyAttachment: true,
    content: "",
    onPreview: (url: string) => alert(`Previewing: ${url}`),
  },
};

/** Incoming: document + message (shows card with top document, bottom message) */
export const DocumentWithMessageIncoming: Story = {
  args: {
    attachmentUrl: SAMPLE_DOC,
    attachmentType: "document",
    isUser: false,
    isOnlyAttachment: false,
    content: "Detailed Kundali report attached for your reference.",
    onPreview: (url: string) => alert(`Previewing: ${url}`),
  },
};

/** Outgoing (user): document + message (shows card with top document, bottom message) */
export const DocumentWithMessageOutgoing: Story = {
  args: {
    attachmentUrl: SAMPLE_DOC,
    attachmentType: "document",
    isUser: true,
    isOnlyAttachment: false,
    content: "Uploaded my previous horoscope records from 2023.",
    onPreview: (url: string) => alert(`Previewing: ${url}`),
  },
};
