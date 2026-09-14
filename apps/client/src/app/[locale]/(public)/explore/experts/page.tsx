import { Suspense } from "react";
import { api } from "@/actions";
import type { PaginatedExpertResponse } from "@repo/lib";
import ExploreExpertsPage from "@/features/explore-experts";

export const dynamic = "force-dynamic";

async function getInitialExperts() {
  try {
    const [response] = await api.get<PaginatedExpertResponse>(
      "/expert/account/list?limit=10&page=1",
    );
    return {
      experts: response?.data || [],
      total: response?.meta?.total ?? response?.data?.length ?? 0,
      hasNextPage: Boolean(response?.meta?.hasNextPage),
    };
  } catch {
    return {
      experts: [],
      total: 0,
      hasNextPage: false,
    };
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await params;
  await searchParams;
  const initialData = await getInitialExperts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF8]" />}>
      <ExploreExpertsPage
        initialExperts={initialData.experts}
        initialTotal={initialData.total}
        initialHasNextPage={initialData.hasNextPage}
      />
    </Suspense>
  );
}
