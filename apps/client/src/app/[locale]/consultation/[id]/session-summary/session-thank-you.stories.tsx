import type { Meta, StoryObj } from "@repo/storybook";
import SessionThankYou, { type SessionThankYouExpert } from "./session-thank-you.component";

const router = { push: (_path: string) => undefined };

const mockExpert: SessionThankYouExpert = {
  id: 7,
  name: "Pt. Radheshyam Shastri",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  profession: "Vedic Astrologer & Vastu Expert",
  rating: 4.9,
};

const meta: Meta<typeof SessionThankYou> = {
  title: "Chat/SessionSummary/ThankYou",
  component: SessionThankYou,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[360px] rounded-2xl border border-[#ece8e1] bg-[#faf8f5] p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionThankYou>;

export const Default: Story = {
  args: {
    sessionId: "session-chat-9482-in",
    expertData: mockExpert,
    router,
  },
};

export const LowBalance: Story = {
  args: {
    reason: "insufficient_balance",
    sessionId: "session-chat-9482-in",
    expertData: mockExpert,
    router,
  },
};

export const Expired: Story = {
  args: {
    status: "expired",
    sessionId: "session-chat-9482-in",
    expertData: mockExpert,
    router,
  },
};

export const Terminated: Story = {
  args: {
    status: "terminated",
    message: "Session ended by administration for compliance verification.",
    sessionId: "session-chat-9482-in",
    expertData: mockExpert,
    router,
  },
};
