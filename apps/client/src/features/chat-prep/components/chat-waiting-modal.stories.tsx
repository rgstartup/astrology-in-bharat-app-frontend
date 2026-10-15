import { useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ChatWaitingModal } from "./chat-waiting-modal.component";

type StoryProps = {
  expertName: string;
  expertAvatar?: string;
  rejected?: boolean;
  timedOut?: boolean;
};

function WaitingModalDemo({
  expertName,
  expertAvatar,
  rejected = false,
  timedOut = false,
}: StoryProps) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-sm font-medium text-slate-500">Modal dismissed.</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black transition-all cursor-pointer"
        >
          Re-open Modal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[420px] flex items-center justify-center bg-slate-100/60 p-4">
      <ChatWaitingModal
        open={open}
        expertName={expertName}
        expertAvatar={expertAvatar}
        rejected={rejected}
        timedOut={timedOut}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

const meta: Meta<typeof ChatWaitingModal> = {
  title: "Chat / ChatWaitingModal",
  component: ChatWaitingModal,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ChatWaitingModal>;

export const ActiveWaiting: Story = {
  render: () => (
    <WaitingModalDemo
      expertName="Pt. Radheshyam Shastri"
      expertAvatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    />
  ),
};

export const ActiveWaitingWithoutAvatar: Story = {
  render: () => (
    <WaitingModalDemo
      expertName="Acharya Devrat"
    />
  ),
};

export const ExpertDeclined: Story = {
  render: () => (
    <WaitingModalDemo
      expertName="Pt. Radheshyam Shastri"
      expertAvatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      rejected={true}
    />
  ),
};

export const RequestTimedOut: Story = {
  render: () => (
    <WaitingModalDemo
      expertName="Dr. Meenakshi Sharma"
      expertAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      timedOut={true}
    />
  ),
};
