import type { Meta, StoryObj } from "@repo/storybook";
import type { IExpert } from "@repo/lib";
import { ExpertIdentity } from "./expert-identity.component";

const fixtureExpert = {
  id: 1,
  name: "Acharya Vedant Sharma",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  professions: [
    {
      is_primary: true,
      profession: {
        id: 101,
        title: "Vedic Astrologer",
      },
    },
  ],
} as unknown as IExpert;

const meta: Meta<typeof ExpertIdentity> = {
  title: "Chat/Header/ExpertIdentity",
  component: ExpertIdentity,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[360px] bg-white p-4 rounded-xl border border-[#d3cec6]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ExpertIdentity>;

export const Default: Story = {
  args: {
    expertData: fixtureExpert,
    isFree: false,
  },
};

export const WithFreeBadge: Story = {
  args: {
    expertData: fixtureExpert,
    isFree: true,
  },
};

export const WithoutAvatar: Story = {
  args: {
    expertData: {
      ...fixtureExpert,
      avatar: null,
    },
    isFree: false,
  },
};
