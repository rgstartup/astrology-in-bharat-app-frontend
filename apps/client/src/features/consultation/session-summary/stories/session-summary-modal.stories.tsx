import { useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { SessionSummaryModal } from "@/features/consultation/session-summary";
import type { BillingSummary } from "@/features/consultation/session-summary";
import type { SessionThankYouExpert } from "@/features/consultation/session-summary";

type StorySummary = BillingSummary & {
  reason?: string;
  message?: string;
};

type ModalStoryProps = {
  summary: StorySummary;
  freeMinutes?: number;
  expertData?: SessionThankYouExpert;
};

const router = { push: (_path: string) => undefined };

const defaultExpert: SessionThankYouExpert = {
  id: 7,
  name: "Pt. Radheshyam Shastri",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  profession: "Vedic Astrologer & Vastu Expert",
  rating: 4.9,
};

function ModalStory({
  summary,
  freeMinutes = 0,
  expertData = defaultExpert,
}: ModalStoryProps) {
  const [open, setOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!open) {
    return (
      <div className="flex flex-col items-center gap-3 p-8 text-center">
        <p className="text-sm text-[#626260]">Modal closed.</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl bg-[#111111] px-4 py-2 text-xs font-medium text-white hover:bg-black"
        >
          Re-open Modal
        </button>
      </div>
    );
  }

  return (
    <SessionSummaryModal
      showModal={open}
      onClose={() => setOpen(false)}
      isDarkMode={false}
      sessionSummary={summary}
      freeMinutes={freeMinutes}
      reviewRating={rating}
      setReviewRating={setRating}
      reviewComment={comment}
      setReviewComment={setComment}
      reviewSubmitted={submitted}
      setReviewSubmitted={setSubmitted}
      sessionId="session-chat-9482-in"
      expertData={expertData}
      router={router}
    />
  );
}

const meta: Meta<typeof SessionSummaryModal> = {
  title: "Chat/SessionSummary/Modal",
  component: SessionSummaryModal,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof SessionSummaryModal>;

export const Completed: Story = {
  render: () => (
    <ModalStory
      summary={{
        durationMins: 12.5,
        pricePerMinute: 21,
        totalCost: 210,
        remainingBalance: 340,
      }}
    />
  ),
};

export const FreeMinutes: Story = {
  render: () => (
    <ModalStory
      summary={{
        durationMins: 5,
        pricePerMinute: 21,
        totalCost: 0,
        remainingBalance: 340,
        isFree: true,
        freeMinutes: 5,
      }}
      freeMinutes={5}
    />
  ),
};

export const LowBalance: Story = {
  render: () => (
    <ModalStory
      summary={{
        reason: "insufficient_balance",
        durationMins: 8.25,
        pricePerMinute: 21,
        totalCost: 168,
        remainingBalance: 4,
      }}
    />
  ),
};

export const Expired: Story = {
  render: () => <ModalStory summary={{ status: "expired" }} />,
};

export const Terminated: Story = {
  render: () => (
    <ModalStory
      summary={{ status: "terminated", reason: "Policy violation flagged on consultation record." }}
    />
  ),
};
