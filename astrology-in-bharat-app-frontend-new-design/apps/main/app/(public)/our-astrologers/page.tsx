import React, { Suspense } from "react";
import OurAstrologer from "@/components/layout/main/ourAstrologer";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OurAstrologer />
    </Suspense>
  );
};

export default page;
