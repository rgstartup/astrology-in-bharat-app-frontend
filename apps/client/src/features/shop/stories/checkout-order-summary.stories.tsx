import React, { useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ShopOrderSummary } from "../components/checkout/shop-order-summary.component";

const meta: Meta<typeof ShopOrderSummary> = {
  title: "Features/Shop/ShopOrderSummary",
  component: ShopOrderSummary,
  decorators: [
    (Story) => (
      <div className="max-w-md p-6 bg-[#f5f1ec]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShopOrderSummary>;

export const Default: Story = {
  render: () => {
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

    return (
      <ShopOrderSummary
        subtotal={1948}
        shipping={0}
        platformFee={49}
        discount={appliedCoupon ? 200 : 0}
        total={appliedCoupon ? 1797 : 1997}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        appliedCoupon={appliedCoupon}
        isApplying={false}
        onApplyCoupon={() => setAppliedCoupon({ code: couponCode || "VEDIC200" })}
        onRemoveCoupon={() => setAppliedCoupon(null)}
        itemCount={2}
      />
    );
  },
};
