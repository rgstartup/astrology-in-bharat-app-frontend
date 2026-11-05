import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ProductGrid } from "../components/product-grid.component";
import { ShopProvider } from "../stores/shop.store";
import type { ShopProduct } from "../types/shop.types";

const mockProducts: ShopProduct[] = [
  {
    id: "101",
    name: "5 Mukhi Rudraksha Mala",
    description: "Original 108 beads energized with sacred rituals.",
    price: 899,
    sale_price: 649,
    original_price: 1299,
    category: "Rudraksha",
    avgRating: 4.9,
    image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "102",
    name: "Yellow Sapphire (Pukhraj)",
    description: "Certified natural gemstone for Jupiter energy.",
    price: 3499,
    sale_price: 2999,
    original_price: 4500,
    category: "Gemstones",
    avgRating: 4.8,
    image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "103",
    name: "Sampoorna Sri Yantra",
    description: "Gold plated copper plate with sacred geometric carvings.",
    price: 1299,
    sale_price: 999,
    original_price: 1800,
    category: "Yantras",
    avgRating: 5.0,
    image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "104",
    name: "Pure Brass Puja Thali Set",
    description: "Handcrafted 7-piece set for daily rituals and aarti.",
    price: 1599,
    sale_price: 1299,
    original_price: 2100,
    category: "Puja Items",
    avgRating: 4.7,
    image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80",
  },
];

const meta: Meta<typeof ProductGrid> = {
  title: "Features/Shop/ProductGrid",
  component: ProductGrid,
  decorators: [
    (Story) => (
      <ShopProvider>
        <div className="max-w-6xl p-6 bg-[#f5f1ec] min-h-screen">
          <Story />
        </div>
      </ShopProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductGrid>;

export const Default: Story = {
  args: {
    products: mockProducts,
  },
};
