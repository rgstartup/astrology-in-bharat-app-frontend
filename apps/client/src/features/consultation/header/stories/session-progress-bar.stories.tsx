import type { Meta, StoryObj } from "@repo/storybook";
import { SessionProgressBar } from "@/features/consultation/header";

const meta: Meta<typeof SessionProgressBar> = {
  title: "Chat/Header/SessionProgressBar",
  component: SessionProgressBar,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[420px] bg-white p-4 rounded-xl border border-[#d3cec6]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionProgressBar>;

/** 12:48 elapsed of 30:00 (~42% progress). */
export const DesignReference: Story = {
  args: {
    elapsedTime: 768,
    timeLeft: 1032,
    isWarning: false,
  },
};

export const JustStarted: Story = {
  args: {
    elapsedTime: 0,
    timeLeft: 1800,
    isWarning: false,
  },
};

export const UrgentWarning: Story = {
  args: {
    elapsedTime: 1740,
    timeLeft: 60,
    isWarning: true,
  },
};

export const SessionCompleted: Story = {
  args: {
    elapsedTime: 1800,
    timeLeft: 0,
    isWarning: false,
  },
};
