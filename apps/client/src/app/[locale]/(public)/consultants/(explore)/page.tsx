import React from "react";
import OurExpertsSeoContent from "./our-experts-seo.component";

export const dynamic = "force-dynamic";

export default async function ExpertsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;

  return (
    <div className="mt-12">
      <OurExpertsSeoContent />
    </div>
  );
}

