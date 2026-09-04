export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { ExpertGridSkeleton } from "@/components/features/experts/SkeletonCard";
import { ExpertGridList } from "@/features/home/expert-list-wrapper";
import OurExpertsSeoContent from "./our-experts-seo.component";

function OurExpertsLoading() {
  return (
    <section className="expert-list " style={{ minHeight: "100vh" }}>
      <div className="container">
        <h2 className="title-line color-light">
          <span
            className="skeleton skeleton-text"
            style={{ width: "200px", height: "30px" }}
          ></span>
        </h2>
        <ExpertGridSkeleton count={12} />
      </div>
    </section>
  );
}

const page = async ({ searchParams }: { searchParams: any }) => {
  const params = await searchParams;

  return (
    <>
      <Suspense fallback={<OurExpertsLoading />}>
        <ExpertGridList searchParams={params} />
      </Suspense>
      <OurExpertsSeoContent />
    </>
  );
};

export default page;
