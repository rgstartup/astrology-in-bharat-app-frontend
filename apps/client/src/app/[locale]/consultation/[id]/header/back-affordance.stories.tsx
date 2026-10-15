import type { Meta, StoryObj } from "@repo/storybook";
import { BackAffordance } from "./back-affordance.component";

const router = {
  back: () => undefined,
  push: () => undefined,
} as any;

const meta: Meta<typeof BackAffordance> = {
  title: "Chat/Header/BackAffordance",
  component: BackAffordance,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="bg-[#f5f1ec] p-6 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BackAffordance>;

export const Default: Story = {
  args: {
    router,
  },
};
