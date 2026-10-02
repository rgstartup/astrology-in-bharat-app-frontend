import React from "react";
import ExpertSeoContent from "./expert-seo-content.component";
import { api } from "@/actions";
import { Expert } from "@repo/lib";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let expertName = "Consultant";

  try {
    const [result] = await api.get<Expert>(`/experts/${id}`);
    if (result?.name) {
      expertName = result.name;
    }
  } catch {
    // fallback gracefully if already fetched in profile slot
  }

  return <ExpertSeoContent expertName={expertName} />;
}
