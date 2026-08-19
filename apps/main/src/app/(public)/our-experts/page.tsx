export const dynamic = 'force-dynamic';
import React, { Suspense } from "react";
import OurExpert from "@/components/layout/main/ourExpert";
import { ExpertGridSkeleton } from "@/components/features/experts/SkeletonCard";
import ExpertListWrapper from "@/components/features/experts/ExpertListWrapper";
import OurExpertsSeoContent from "./our-experts-seo.component";

function OurExpertsLoading() {
  return (
    <section className="expert-list " style={{ minHeight: '100vh' }}>
      <div className="container">
                <h2 className="title-line color-light">
                  <span className="skeleton skeleton-text" style={{ width: '200px', height: '30px' }}></span>
                </h2>
        <ExpertGridSkeleton count={12} />
      </div>
    </section>
  );
}

const page = ({ searchParams }: { searchParams: any }) => {
  return (
    <>
      <Suspense fallback={<OurExpertsLoading />}>
        <ExpertListWrapper
          searchParams={searchParams}
          layout="grid"
        />
      </Suspense>
      <OurExpertsSeoContent />
    </>
  );
};

export default page;


