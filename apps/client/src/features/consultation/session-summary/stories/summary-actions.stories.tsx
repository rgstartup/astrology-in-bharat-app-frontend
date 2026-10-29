import type { Meta, StoryObj } from "@repo/storybook";
import { SummaryActions } from "@/features/consultation/session-summary";

const router = { push: (_path: string) => undefined };

const meta: Meta<typeof SummaryActions> = {
  title: "Chat/SessionSummary/SummaryActions",
  component: SummaryActions,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SummaryActions>;

export const Completed: Story = {
  args: {
    isDarkMode: false,
    router,
    onClose: () => undefined,
  },
};

export const Expired: Story = {
  args: {
    status: "expired",
    isDarkMode: false,
    router,
  },
};

export const Terminated: Story = {
  args: {
    status: "terminated",
    isDarkMode: false,
    router,
  },
};
