import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ProductCard } from "../components/product-card.component";
import { ShopProvider } from "../stores/shop.store";
import type { Product, ProductCategory, ProductVariant, ProductMedia, Media } from "@repo/lib";
import { ProductType, ProductGroup, DiscountType, MediaRole, MediaSource } from "@repo/lib";

const PRIMARY_ROLE = MediaRole.THUMBNAIL;

const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "101",
  name: "Authentic 5 Mukhi Rudraksha Mala",
  description:
    "Hand-knotted 108 beads charged with Maha Mrityunjaya mantra for peace, memory, and concentration.",
  type: ProductType.GOODS,
  product_group: ProductGroup.ITEM,
  is_active: true,
  categories: [
    { id: 1, name: "Rudraksha", slug: "rudraksha", created_at: new Date(), updated_at: new Date() },
  ],
  variants: [
    {
      id: 1,
      product_id: "101",
      name: "Standard",
      sku: "RUD-5M-108",
      attributes: {},
      description: null,
      is_default: true,
      is_active: true,
      sort_order: 1,
      created_at: new Date(),
      updated_at: new Date(),
      pricing: [
        { id: 1, variant_id: 1, amount: 649, target_audience: "retail", currency: "INR", is_active: true, status: "active", effective_from: new Date(), effective_to: null, created_at: new Date(), updated_at: new Date() },
      ],
      promotions: [
        { id: 1, name: "Launch Offer", discount_type: DiscountType.PERCENTAGE, discount_value: 50, is_active: true, created_at: new Date() },
      ],
      inventory: { id: 1, variant_id: 1, stock: 100, reserved_stock: 0, available_stock: 100 },
      media: [
        { id: 1, media: { id: 1, url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80", source: MediaSource.EXTERNAL, alt_text: "Rudraksha Mala", mime_type: "image/jpeg", file_name: "rudraksha.jpg",  created_at: new Date(), updated_at: new Date() }, role: PRIMARY_ROLE, sort_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
      ],
    },
  ],
  media: [
    { id: 1, media: { id: 1, url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80", source: MediaSource.EXTERNAL, alt_text: "Rudraksha Mala", mime_type: "image/jpeg", file_name: "rudraksha.jpg",  created_at: new Date(), updated_at: new Date() }, role: PRIMARY_ROLE, sort_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
  ],
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

const mockProduct = createMockProduct();

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
    product: createMockProduct({
      name: "Natural Yellow Sapphire Gemstone",
      categories: [{ id: 2, name: "Gemstones", slug: "gemstones", created_at: new Date(), updated_at: new Date() }],
      variants: [
        {
          id: 2,
          product_id: "102",
          name: "Standard",
          sku: "GEM-YS-1",
          attributes: {},
          description: null,
          is_default: true,
          is_active: true,
          sort_order: 1,
          created_at: new Date(),
          updated_at: new Date(),
          pricing: [
            { id: 2, variant_id: 2, amount: 499, target_audience: "retail", currency: "INR", is_active: true, status: "active", effective_from: new Date(), effective_to: null, created_at: new Date(), updated_at: new Date() },
          ],
          promotions: [
            { id: 2, name: "Sale", discount_type: DiscountType.PERCENTAGE, discount_value: 67, is_active: true, created_at: new Date() },
          ],
          inventory: { id: 2, variant_id: 2, stock: 50, reserved_stock: 0, available_stock: 50 },
          media: [
            { id: 2, media: { id: 2, url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80", source: MediaSource.EXTERNAL, alt_text: "Yellow Sapphire", mime_type: "image/jpeg", file_name: "yellow-sapphire.jpg",  created_at: new Date(), updated_at: new Date() }, role: PRIMARY_ROLE, sort_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
          ],
        },
      ],
      media: [
        { id: 2, media: { id: 2, url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80", source: MediaSource.EXTERNAL, alt_text: "Yellow Sapphire", mime_type: "image/jpeg", file_name: "yellow-sapphire.jpg",  created_at: new Date(), updated_at: new Date() }, role: PRIMARY_ROLE, sort_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
      ],
    }),
  },
};