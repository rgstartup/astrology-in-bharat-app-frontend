import React from "react";
import { fetchExpertProducts } from "@/actions/expert-products";
import { ExpertRemediesSectionProps, RemedyItem } from "./types";
import { ExpertRemediesClient } from "./ExpertRemediesClient";
import { ProductGroup, ProductType, ExpertProductRelationType } from "@repo/lib";
import { getProductImageUrl } from "@/utils/image-utils";

export default async function ExpertRemediesSection({
  expertId,
  expertName,
  expert,
}: ExpertRemediesSectionProps) {
  try {
    const rawItems: RemedyItem[] = [];
    const existingIds = new Set<string>();

    const appendItem = (item: any) => {
      if (!item) return;
      const product = item.product || item;
      const id = String(product.id || item.id || "");
      if (!id || existingIds.has(id)) return;
      existingIds.add(id);

      const group = (product.product_group || item.product_group || ProductGroup.ITEM) as ProductGroup;
      const price = Number(
        product.price ??
          product.variants?.[0]?.pricing?.[0]?.amount ??
          0,
      );
      const originalPrice = Number(product.original_price ?? 0);
      const discountPercent =
        product.percentage_off ||
        (originalPrice > price && price > 0
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : undefined);

      // Contextual CTA Text & Link based on product group
      let ctaText = "View";
      let ctaLink = `/shop/${product.id || item.id}`;

      if (group === ProductGroup.REPORT) {
        ctaText = "Get Report";
      } else if (group === ProductGroup.RITUAL) {
        ctaText = "Book Puja";
        ctaLink = `/astrology/online-puja/${product.id || item.id}`;
      } else if (group === ProductGroup.ITEM) {
        ctaText = "Order Now";
      } else if (group === ProductGroup.BOOK) {
        ctaText = "Buy Book";
      } else if (group === ProductGroup.SESSION) {
        ctaText = "Book Session";
        ctaLink = `/consultants/${expertId}`;
      }

      rawItems.push({
        id: product.id || item.id,
        name: product.name || "Astrological Remedy",
        slug: product.slug,
        categoryName:
          product.category?.name ||
          product.category?.toString() ||
          (group === ProductGroup.REPORT
            ? "Astrology Report"
            : group === ProductGroup.RITUAL
              ? "Puja & Ritual"
              : group === ProductGroup.BOOK
                ? "Sacred Text"
                : group === ProductGroup.SESSION
                  ? "Specialized Consultation"
                  : "Mala & Gemstone"),
        description: product.description || product.short_description || "",
        shortDescription: product.short_description || undefined,
        productGroup: group,
        productType: product.type || ProductType.PHYSICAL,
        price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        discountPercent,
        rating: Number(product.rating || product.ratings || 4.9),
        reviewCount: Number(product.review_count || product.reviews_count || 10),
        imageUrl: getProductImageUrl(product),
        relationType: item.relation_type || ExpertProductRelationType.PROVIDER,
        inStock: product.is_active !== false,
        ctaText,
        ctaLink,
      });
    };

    // 1. Process expert_products if present on expert profile response
    if (Array.isArray(expert?.expert_products)) {
      expert.expert_products.forEach(appendItem);
    }

    // 2. Fetch products for this expert exclusively from `/expert/products`
    const expertProductsList = await fetchExpertProducts({
      expert_id: expertId,
      is_active: true,
      limit: 50,
      sort_by: "created_at",
      order: "DESC",
    });

    if (Array.isArray(expertProductsList)) {
      expertProductsList.forEach(appendItem);
    }

    return (
      <ExpertRemediesClient
        expertId={expertId}
        expertName={expertName}
        initialProducts={rawItems}
      />
    );
  } catch (error) {
    console.error("Failed to load expert remedies from /expert/products:", error);
    return (
      <ExpertRemediesClient
        expertId={expertId}
        expertName={expertName}
        initialProducts={[]}
      />
    );
  }
}
