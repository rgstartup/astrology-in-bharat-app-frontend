import { Suspense } from "react";
import { api } from "@/actions";
import type { PaginatedExpertResponse } from "@repo/lib";
import ExploreExpertsPage from "@/features/explore-experts";
import OurExpertsSeoContent from "./our-experts-seo.component";

export const dynamic = "force-dynamic";

async function getInitialExperts() {
  try {
    const [response] = await api.get<PaginatedExpertResponse>(
      "/expert/account/list?limit=18&page=1",
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

const page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  await searchParams;
  const initialData = await getInitialExperts();

  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-[#FFFDF8]" />}>
        <ExploreExpertsPage
          initialExperts={initialData.experts}
          initialTotal={initialData.total}
          initialHasNextPage={initialData.hasNextPage}
        />
      </Suspense>
      {/* <OurExpertsSeoContent /> */}
    </>
  );
};

export default page;
