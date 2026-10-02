import React from "react";
import ExpertSeoContent from "./expert-seo-content.component";
import { apiV2, API_ROUTES } from "@/actions";
import { IExpert } from "@repo/lib";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await apiV2.get<IExpert>(API_ROUTES.EXPERTS.ACCOUNT.replace(":id", id));

  const expertName = result?.data?.name || "Consultant";

  return <ExpertSeoContent expertName={expertName} />;
}
