import type { Meta, StoryObj } from "@repo/storybook";
import { SessionStatusBadge } from "@/features/consultation/header";

const meta: Meta<typeof SessionStatusBadge> = {
  title: "Chat/Header/SessionStatusBadge",
  component: SessionStatusBadge,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="bg-white p-4 rounded-lg border border-[#d3cec6]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionStatusBadge>;

export const Connected: Story = {
  args: {
    sessionStatus: "active",
  },
};

export const Connecting: Story = {
  args: {
    sessionStatus: "pending",
  },
};

export const Paused: Story = {
  args: {
    sessionStatus: "paused",
  },
};

export const Ended: Story = {
  args: {
    sessionStatus: "completed",
  },
};
