import type { Meta, StoryObj } from "@repo/storybook";
import { EndSessionButton } from "./end-session-button.component";

const meta: Meta<typeof EndSessionButton> = {
  title: "Chat/Header/EndSessionButton",
  component: EndSessionButton,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="bg-white p-6 rounded-xl border border-[#d3cec6]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EndSessionButton>;

export const Default: Story = {
  args: {
    handleEndChat: (_force?: boolean) => undefined,
  },
};
