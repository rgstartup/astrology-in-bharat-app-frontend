import React, { Suspense } from "react";
import ExpertDetailsClient from "@/components/features/experts/ExpertDetailsClient";
import ExpertProductsSection from "@/components/features/experts/ExpertProductsSection";
import ExpertSeoContent from "./expert-seo-content.component";
import { api } from "@/actions";
import { Expert, getErrorMessage } from "@repo/lib";
import { Loading } from "@repo/ui";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [result, astroError] = await api.get<Expert>(`/expert/account/${id}`, {
    cache: "no-store",
  });

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

  const expertName = expertData.name || "Consultant";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Primary Expert Details */}
      <ExpertDetailsClient expert={expertData} />

      {/* Recommended Products & Remedies */}
      <Suspense
        fallback={
          <div className="py-16 flex justify-center bg-white">
            <Loading size="md" text="Loading Remedies & Products..." />
          </div>
        }
      >
        <ExpertProductsSection
          expertId={String(expertData.id)}
          expertName={expertName}
          expert={expertData}
        />
      </Suspense>

      {/* Informative SEO Content */}
      <ExpertSeoContent expertName={expertName} />
    </main>
  );
}
