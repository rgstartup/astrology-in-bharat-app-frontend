import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ShopPaymentMethod } from "../components/checkout/shop-payment-method.component";

const meta: Meta<typeof ShopPaymentMethod> = {
  title: "Features/Shop/ShopPaymentMethod",
  component: ShopPaymentMethod,
  decorators: [
    (Story) => (
      <div className="max-w-md p-6 bg-[#f5f1ec]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShopPaymentMethod>;

export const Default: Story = {
  args: {
    total: 1797,
    onPay: () => alert("Razorpay modal opens (Zero Wallet in Shop)"),
    isProcessing: false,
  },
};

export const Processing: Story = {
  args: {
    total: 1797,
    onPay: () => {},
    isProcessing: true,
  },
};
