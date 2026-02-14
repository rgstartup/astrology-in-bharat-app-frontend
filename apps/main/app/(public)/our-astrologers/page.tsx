import React, { Suspense } from "react";
import OurAstrologer from "@/components/layout/main/ourAstrologer";
import { AstrologerGridSkeleton } from "@/components/features/astrologers/SkeletonCard";
import AstrologerListWrapper from "@/components/features/astrologers/AstrologerListWrapper";

function OurAstrologersLoading() {
  return (
    <section className="astrologer-list " style={{ minHeight: '100vh' }}>
      <div className="container">
        <h2 className="title-line mt-4">
          <span>Our Astrologers</span>
        </h2>
        <AstrologerGridSkeleton count={12} />
      </div>
    </section>
  );
}

const page = ({ searchParams }: { searchParams: any }) => {
  return (
    <Suspense fallback={<OurAstrologersLoading />}>
      <AstrologerListWrapper
        searchParams={searchParams}
        layout="grid"
        title="Our Astrologers"
      />
    </Suspense>
  );
};

export default page;
