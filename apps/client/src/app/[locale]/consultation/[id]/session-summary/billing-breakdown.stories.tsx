import type { Meta, StoryObj } from "@repo/storybook";
import BillingBreakdown from "./billing-breakdown.component";

const meta: Meta<typeof BillingBreakdown> = {
  title: "Chat/SessionSummary/BillingBreakdown",
  component: BillingBreakdown,
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
type Story = StoryObj<typeof BillingBreakdown>;

export const Paid: Story = {
  args: {
    isDarkMode: false,
    freeMinutes: 0,
    sessionSummary: {
      durationMins: 12.5,
      pricePerMinute: 21,
      totalCost: 210,
      remainingBalance: 340,
    },
  },
};

export const Free: Story = {
  args: {
    isDarkMode: false,
    freeMinutes: 5,
    sessionSummary: {
      durationMins: 5,
      pricePerMinute: 21,
      totalCost: 0,
      remainingBalance: 340,
      isFree: true,
      freeMinutes: 5,
    },
  },
};

export const ZeroDuration: Story = {
  args: {
    isDarkMode: false,
    freeMinutes: 0,
    sessionSummary: {
      durationMins: 0,
      pricePerMinute: 21,
      totalCost: 0,
      remainingBalance: 340,
    },
  },
};
