"use client";

import type { Product, ProductMedia, Media, ProductPromotion } from "@repo/lib";
import {
  ProductType,
  ProductGroup,
  DiscountType,
  MediaRole,
  MediaSource,
} from "@repo/lib";
import { getProductImageUrl } from "@/utils/image-utils";

export function getProductPrice(product: Product): number {
  const variant = product.variants?.[0];
  const pricing = variant?.pricing?.[0];
  return pricing ? Number(pricing.amount) : 0;
}

export function getProductOriginalPrice(product: Product): number {
  const variant = product.variants?.[0];
  if (!variant) return 0;
  const promotions = variant.promotions || [];
  const promo = promotions[0];
  if (!promo) return getProductPrice(product);
  const price = getProductPrice(product);
  const discount = Number(promo.discount_value) || 0;
  if (promo.discount_type === DiscountType.PERCENTAGE) {
    return Math.round(price / (1 - discount / 100));
  }
  return price + discount;
}

export function getProductImage(product: Product): string {
  const primaryMedia = product.media?.find(
    (m) => m.role === MediaRole.THUMBNAIL && m.media?.url,
  );
  if (primaryMedia?.media?.url) return primaryMedia.media.url;

  const firstMedia = product.media?.[0];
  if (firstMedia?.media?.url) return firstMedia.media.url;

  return getProductImageUrl(product as any);
}

export function getProductImages(product: Product): string[] {
  return (
    product.media?.filter((m) => m.media?.url).map((m) => m.media!.url) || []
  );
}

export function getProductCategory(product: Product): string {
  return product.categories?.[0]?.name || "Vedic Item";
}

export function getProductVariantName(product: Product): string {
  return product.variants?.[0]?.name || "Default";
}

export function getProductSku(product: Product): string {
  return product.variants?.[0]?.sku || String(product.id);
}

export function isProductActive(product: Product): boolean {
  return (
    product.is_active !== false && product.variants?.[0]?.is_active !== false
  );
}

export function createMinimalProduct(data: {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  image?: string;
  category?: string;
}): Product {
  const price = Number(data.price) || 0;
  const originalPrice = data.originalPrice ? Number(data.originalPrice) : price;
  const discountValue =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const createMedia = (url: string, altText: string): Media => ({
    id: 1,
    url,
    source: MediaSource.EXTERNAL,
    alt_text: altText,
    mime_type: "image/jpeg",
    file_name: "product.jpg",
    created_at: new Date(),
    updated_at: new Date(),
  });

  const createProductMedia = (media: Media): ProductMedia => ({
    id: 1,
    media,
    role: MediaRole.THUMBNAIL,
    sort_order: 1,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const variantPromotions: ProductPromotion[] =
    discountValue > 0
      ? [
          {
            id: 1,
            name: "Sale",
            discount_type: DiscountType.PERCENTAGE,
            discount_value: discountValue,
            is_active: true,
            created_at: new Date(),
          },
        ]
      : [];

  const variantMedia =
    data.imageUrl || data.image
      ? [
          createProductMedia(
            createMedia(data.imageUrl || data.image!, data.name),
          ),
        ]
      : [];

  return {
    id: data.id,
    name: data.name,
    description: data.description || null,
    type: ProductType.GOODS,
    product_group: ProductGroup.ITEM,
    is_active: true,
    categories: data.category
      ? [
          {
            id: 1,
            name: data.category,
            slug: data.category.toLowerCase(),
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]
      : [],
    variants: [
      {
        id: 1,
        product_id: data.id,
        name: "Standard",
        sku: `SKU-${data.id}`,
        attributes: {},
        description: null,
        is_default: true,
        is_active: true,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
        pricing: [
          {
            id: 1,
            variant_id: 1,
            amount: price,
            target_audience: "retail",
            currency: "INR",
            is_active: true,
            status: "active",
            effective_from: new Date(),
            effective_to: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        promotions: variantPromotions,
        inventory: {
          id: 1,
          variant_id: 1,
          stock: 100,
          reserved_stock: 0,
          available_stock: 100,
        },
        media: variantMedia,
      },
    ],
    media: variantMedia,
    created_at: new Date(),
    updated_at: new Date(),
  };
}
