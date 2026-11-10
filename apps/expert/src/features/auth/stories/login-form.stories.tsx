import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { LoginForm } from "../components/LoginForm";

const meta: Meta<typeof LoginForm> = {
  title: "Features/Auth/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[420px] mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
  args: {},
};

export const MobileContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-[390px] min-h-[700px] bg-white rounded-[32px] border-8 border-stone-800 shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
        <div className="w-24 h-4 bg-stone-800 rounded-full mx-auto mb-4" />
        <div className="mt-2 flex-1">
          <Story />
        </div>
        <div className="w-32 h-1 bg-stone-300 rounded-full mx-auto mt-4" />
      </div>
    ),
  ],
};

export const SubmittingState: Story = {
  render: () => (
    <div className="w-full max-w-[420px] mx-auto p-4 pointer-events-none opacity-90">
      <LoginForm onLoadingChange={() => {}} />
    </div>
  ),
};
