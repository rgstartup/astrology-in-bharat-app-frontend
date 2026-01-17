import React, { Suspense } from "react";
import OurAstrologer from "@/components/layout/main/ourAstrologer";
import { AstrologerGridSkeleton } from "@/components/features/astrologers/SkeletonCard";

function OurAstrologersLoading() {
  return (
    <section className="astrologer-list back-img" style={{ minHeight: '100vh' }}>
      <div className="container">
        <h2 className="title-line color-light">
          <span>Our Astrologers</span>
        </h2>
        <AstrologerGridSkeleton count={12} />
      </div>
    </section>
  );
}

const page = () => {
  return (
    <Suspense fallback={<OurAstrologersLoading />}>
      <OurAstrologer />
    </Suspense>
  );
};

export default page;
