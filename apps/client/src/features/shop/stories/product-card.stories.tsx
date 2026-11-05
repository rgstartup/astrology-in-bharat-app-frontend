import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ProductCard } from "../components/product-card.component";
import { ShopProvider } from "../stores/shop.store";
import type { ShopProduct } from "../types/shop.types";

const mockProduct: ShopProduct = {
  id: "101",
  name: "Authentic 5 Mukhi Rudraksha Mala",
  description:
    "Hand-knotted 108 beads charged with Maha Mrityunjaya mantra for peace, memory, and concentration.",
  price: 899,
  sale_price: 649,
  original_price: 1299,
  category: "Rudraksha",
  avgRating: 4.9,
  image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80",
};

const meta: Meta<typeof ProductCard> = {
  title: "Features/Shop/ProductCard",
  component: ProductCard,
  decorators: [
    (Story) => (
      <ShopProvider>
        <div className="max-w-xs p-4 bg-[#f5f1ec]">
          <Story />
        </div>
      </ShopProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const Discounted: Story = {
  args: {
    product: {
      ...mockProduct,
      sale_price: 499,
      original_price: 1499,
      name: "Natural Yellow Sapphire Gemstone",
      category: "Gemstones",
    },
  },
};
