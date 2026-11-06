import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ProductGrid } from "../components/product-grid.component";
import { ShopProvider } from "../stores/shop.store";
import type { Product, ProductCategory } from "@repo/lib";
import { ProductType, ProductGroup, DiscountType, MediaRole, MediaSource } from "@repo/lib";

const PRIMARY_ROLE = MediaRole.THUMBNAIL;

const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: String(overrides.id || Date.now()),
  name: overrides.name || "Test Product",
  description: overrides.description || "Test description",
  type: ProductType.GOODS,
  product_group: ProductGroup.ITEM,
  is_active: true,
  categories: overrides.categories || [
    { id: 1, name: "Test Category", slug: "test-category", created_at: new Date(), updated_at: new Date() },
  ],
  variants: overrides.variants || [
    {
      id: 1,
      product_id: String(overrides.id || "1"),
      name: "Standard",
      sku: "TEST-1",
      attributes: {},
      description: null,
      is_default: true,
      is_active: true,
      sort_order: 1,
      created_at: new Date(),
      updated_at: new Date(),
      pricing: [
        { id: 1, variant_id: 1, amount: 1000, target_audience: "retail", currency: "INR", is_active: true, status: "active", effective_from: new Date(), effective_to: null, created_at: new Date(), updated_at: new Date() },
      ],
      promotions: [],
      inventory: { id: 1, variant_id: 1, stock: 100, reserved_stock: 0, available_stock: 100 },
      media: [
        { id: 1, media: { id: 1, url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80", source: MediaSource.EXTERNAL, alt_text: "Test Product", mime_type: "image/jpeg", file_name: "test.jpg",  created_at: new Date(), updated_at: new Date() }, role: PRIMARY_ROLE, sort_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
      ],
    },
  ],
  media: [
    { id: 1, media: { id: 1, url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80", source: MediaSource.EXTERNAL, alt_text: "Test Product", mime_type: "image/jpeg", file_name: "test.jpg",  created_at: new Date(), updated_at: new Date() }, role: PRIMARY_ROLE, sort_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
  ],
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

const mockProducts: Product[] = [
  createMockProduct({
    id: "101",
    name: "5 Mukhi Rudraksha Mala",
    description: "Original 108 beads energized with sacred rituals.",
    categories: [{ id: 1, name: "Rudraksha", slug: "rudraksha", created_at: new Date(), updated_at: new Date() }],
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
  }),
  createMockProduct({
    id: "102",
    name: "Yellow Sapphire (Pukhraj)",
    description: "Certified natural gemstone for Jupiter energy.",
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
          { id: 2, variant_id: 2, amount: 2999, target_audience: "retail", currency: "INR", is_active: true, status: "active", effective_from: new Date(), effective_to: null, created_at: new Date(), updated_at: new Date() },
        ],
        promotions: [
          { id: 2, name: "Sale", discount_type: DiscountType.PERCENTAGE, discount_value: 33, is_active: true, created_at: new Date() },
        ],
        inventory: { id: 2, variant_id: 2, stock: 50, reserved_stock: 0, available_stock: 50 },
        media: [
          { id: 2, media: { id: 2, url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80", source: MediaSource.EXTERNAL, alt_text: "Yellow Sapphire", mime_type: "image/jpeg", file_name: "yellow-sapphire.jpg",  created_at: new Date(), updated_at: new Date() }, role: PRIMARY_ROLE, sort_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
        ],
      },
    ],
  }),
  createMockProduct({
    id: "103",
    name: "Sampoorna Sri Yantra",
    description: "Gold plated copper plate with sacred geometric carvings.",
    categories: [{ id: 3, name: "Yantras", slug: "yantras", created_at: new Date(), updated_at: new Date() }],
    variants: [
      {
        id: 3,
        product_id: "103",
        name: "Standard",
        sku: "YAN-SY-1",
        attributes: {},
        description: null,
        is_default: true,
        is_active: true,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
        pricing: [
          { id: 3, variant_id: 3, amount: 999, target_audience: "retail", currency: "INR", is_active: true, status: "active", effective_from: new Date(), effective_to: null, created_at: new Date(), updated_at: new Date() },
        ],
        promotions: [
          { id: 3, name: "Offer", discount_type: DiscountType.PERCENTAGE, discount_value: 44, is_active: true, created_at: new Date() },
        ],
        inventory: { id: 3, variant_id: 3, stock: 30, reserved_stock: 0, available_stock: 30 },
        media: [
          { id: 3, media: { id: 3, url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80", source: MediaSource.EXTERNAL, alt_text: "Sri Yantra", mime_type: "image/jpeg", file_name: "sri-yantra.jpg",  created_at: new Date(), updated_at: new Date() }, role: PRIMARY_ROLE, sort_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
        ],
      },
    ],
  }),
  createMockProduct({
    id: "104",
    name: "Pure Brass Puja Thali Set",
    description: "Handcrafted 7-piece set for daily rituals and aarti.",
    categories: [{ id: 4, name: "Puja Items", slug: "puja-items", created_at: new Date(), updated_at: new Date() }],
    variants: [
      {
        id: 4,
        product_id: "104",
        name: "Standard",
        sku: "PUJ-THALI-7",
        attributes: {},
        description: null,
        is_default: true,
        is_active: true,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
        pricing: [
          { id: 4, variant_id: 4, amount: 1299, target_audience: "retail", currency: "INR", is_active: true, status: "active", effective_from: new Date(), effective_to: null, created_at: new Date(), updated_at: new Date() },
        ],
        promotions: [
          { id: 4, name: "Discount", discount_type: DiscountType.PERCENTAGE, discount_value: 38, is_active: true, created_at: new Date() },
        ],
        inventory: { id: 4, variant_id: 4, stock: 40, reserved_stock: 0, available_stock: 40 },
        media: [
          { id: 4, media: { id: 4, url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=500&auto=format&fit=crop&q=80", source: MediaSource.EXTERNAL, alt_text: "Puja Thali", mime_type: "image/jpeg", file_name: "puja-thali.jpg",  created_at: new Date(), updated_at: new Date() }, role: PRIMARY_ROLE, sort_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
        ],
      },
    ],
  }),
];

const mockCategories: ProductCategory[] = [
  { id: 1, name: "Rudraksha", slug: "rudraksha", created_at: new Date(), updated_at: new Date() },
  { id: 2, name: "Gemstones", slug: "gemstones", created_at: new Date(), updated_at: new Date() },
  { id: 3, name: "Yantras", slug: "yantras", created_at: new Date(), updated_at: new Date() },
  { id: 4, name: "Puja Items", slug: "puja-items", created_at: new Date(), updated_at: new Date() },
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
    products: {
      success: true,
      data: mockProducts,
      meta: { total: mockProducts.length, page: 1, limit: 20, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    },
    categories: mockCategories,
  },
};