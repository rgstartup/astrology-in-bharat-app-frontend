import React from "react";
import ExpertDetailsClient from "@/components/features/experts/ExpertDetailsClient";
import { apiV2, API_ROUTES } from "@/actions";
import { IExpert } from "@repo/lib";

export default async function ProfileSlot({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await apiV2.get<IExpert>(API_ROUTES.EXPERTS.ACCOUNT.replace(":id", id));

  if (!result.ok) {
    console.log(result.error.message);
    throw new Error(result.error?.message || "Failed to fetch consultant account details");
  }

  const expertData = result.data;
  if (!expertData) {
    throw new Error(`Consultant with ID "${id}" was not found or is currently inactive.`);
  }

  return <ExpertDetailsClient expert={expertData} />;
}
