import React, { Suspense } from "react";
import { ExploreExpertsProvider } from "@/features/explore-experts/context/ExploreExpertsContext";
import HeaderLoading from "./@header/loading";
import SidebarLoading from "./@sidebar/loading";
import CardsLoading from "./@cards/loading";

export const dynamic = "force-dynamic";

export default function ExpertsLayout({
  children,
  header,
  sidebar,
  cards,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  sidebar: React.ReactNode;
  cards: React.ReactNode;
}) {

  return (
    <ExploreExpertsProvider>
      <div className="min-h-screen bg-[#FFFFFF] text-gray-900 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Suspense fallback={<HeaderLoading />}>
            {header}
          </Suspense>
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <aside className="hidden lg:block w-[300px] shrink-0">
              <Suspense fallback={<SidebarLoading />}>
                {sidebar}
              </Suspense>
            </aside>
            <main className="flex-1 w-full min-w-0">
              <Suspense fallback={<CardsLoading />}>
                {cards}
              </Suspense>
            </main>
          </div>
          {children}
        </div>
      </div>
    </ExploreExpertsProvider>
  );
}

