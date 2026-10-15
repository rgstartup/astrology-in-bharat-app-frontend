import type { Meta, StoryObj } from "@repo/storybook";
import { SessionMetrics } from "./session-metrics.component";

function formatTime(time: number): string {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  const padded = secs.toString().padStart(2, "0");
  return `${mins}:${padded}`;
}

const meta: Meta<typeof SessionMetrics> = {
  title: "Chat/Header/SessionMetrics",
  component: SessionMetrics,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="bg-white p-4 rounded-xl border border-[#d3cec6]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionMetrics>;

/** The two timing metrics: 12:48 elapsed, 17:12 remaining. */
export const Active: Story = {
  args: {
    isFree: false,
    formatTime,
    elapsedTime: 768, // 12:48
    timeLeft: 1032, // 17:12
    mounted: true,
    isWarning: false,
  },
};

export const LowBalanceWarning: Story = {
  args: {
    isFree: false,
    formatTime,
    elapsedTime: 1200,
    timeLeft: 45,
    mounted: true,
    isWarning: true,
  },
};

export const FreeSession: Story = {
  args: {
    isFree: true,
    formatTime,
    elapsedTime: 180,
    timeLeft: 300,
    mounted: true,
    isWarning: false,
  },
};

export const Unmounted: Story = {
  args: {
    isFree: false,
    formatTime,
    elapsedTime: 768,
    timeLeft: 1032,
    mounted: false,
    isWarning: false,
  },
};
