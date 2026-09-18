import React from "react";
import { fetchExpertProducts } from "@/actions/expert-products";
import { ExpertRemediesSectionProps } from "./types";
import { ExpertRemediesClient } from "./ExpertRemediesClient";
import { ProductGroup } from "@repo/lib";

export default async function ExpertRemediesSection({
  expertId,
  expertName = "Consultant",
  initialProducts,
  initialTab = "reports",
}: ExpertRemediesSectionProps) {
  try {
    let reportProducts = initialProducts;

    // If initialProducts was not passed, load only reports (product_group: ProductGroup.REPORT, limit: 10)
    if (!reportProducts) {
      reportProducts = await fetchExpertProducts({
        expert_id: expertId,
        product_group: ProductGroup.REPORT,
        is_active: true,
        limit: 10,
        sort_by: "created_at",
        order: "DESC",
      });
    }

    return (
      <ExpertRemediesClient
        expertId={expertId}
        expertName={expertName}
        initialProducts={reportProducts}
        initialTab={initialTab}
      />
    );
  } catch (error) {
    console.error("Failed to load initial expert reports from /expert/products:", error);
    return (
      <ExpertRemediesClient
        expertId={expertId}
        expertName={expertName}
        initialProducts={[]}
        initialTab={initialTab}
      />
    );
  }
}

