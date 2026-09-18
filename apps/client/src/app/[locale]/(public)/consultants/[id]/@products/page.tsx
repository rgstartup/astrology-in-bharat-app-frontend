import React from "react";
import ExpertProductsSection from "@/components/features/experts/ExpertProductsSection";
import { fetchExpertProducts } from "@/actions/expert-products";
import { ProductGroup } from "@repo/lib";

export default async function ProductsSlot({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Initial render loads only reports (product_group: ProductGroup.REPORT, limit: 10)
  const reportProducts = await fetchExpertProducts({
    expert_id: id,
    product_group: ProductGroup.REPORT,
    is_active: true,
    limit: 10,
    sort_by: "created_at",
    order: "DESC",
  });

  return (
    <ExpertProductsSection
      expertId={id}
      initialProducts={reportProducts}
      initialTab="reports"
    />
  );
}
