import React from "react";
import ExpertDetailsClient from "@/components/features/experts/ExpertDetailsClient";
import { api, API_ROUTES } from "@/actions";
import { Expert, getErrorMessage } from "@repo/lib";

export default async function ProfileSlot({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [result, astroError] = await api.get<Expert>(
    `${API_ROUTES.EXPERT.ACCOUNT.replace(":id", id)}`,
  );

  if (astroError || !result) {
    throw new Error(
      getErrorMessage(astroError) ||
        astroError?.message ||
        "Failed to fetch consultant account details",
    );
  }

  const expertData = result;
  if (!expertData || !expertData.id) {
    throw new Error(
      `Consultant with ID "${id}" was not found or is currently inactive.`,
    );
  }

  return <ExpertDetailsClient expert={expertData} />;
}
