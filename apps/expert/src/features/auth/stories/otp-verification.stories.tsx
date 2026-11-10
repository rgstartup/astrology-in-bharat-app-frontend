import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { OtpVerification } from "../components/OtpVerification";

const meta: Meta<typeof OtpVerification> = {
  title: "Features/Auth/OtpVerification",
  component: OtpVerification,
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
  args: {
    email: "acharya.sharma@example.com",
    onBack: () => console.log("Back clicked"),
    onResend: async () => console.log("Resend requested"),
    onVerify: async (otp: string) => console.log("Verify submitted:", otp),
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof OtpVerification>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    errorMessage: "Invalid or expired verification code. Please request a new one.",
  },
};

export const MobileContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-[390px] min-h-[640px] bg-white rounded-[32px] border-8 border-stone-800 shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
        <div className="w-24 h-4 bg-stone-800 rounded-full mx-auto mb-4" />
        <div className="mt-4 flex-1">
          <Story />
        </div>
        <div className="w-32 h-1 bg-stone-300 rounded-full mx-auto mt-4" />
      </div>
    ),
  ],
};
