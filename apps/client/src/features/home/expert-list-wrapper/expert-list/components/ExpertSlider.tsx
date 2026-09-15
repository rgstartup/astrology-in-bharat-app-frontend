"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ExploreExpertCard } from "@/features/explore-experts/components/ExploreExpertCard";
import { useExpertListStore } from "@/store/useExpertListStore";

function ExpertCardSkeleton() {
  return (
    <div className="h-[430px] rounded-3xl bg-white/5 border border-white/10 p-4 animate-pulse flex flex-col justify-between">
      <div>
        <div className="h-20 bg-white/10 rounded-2xl mb-4" />
        <div className="size-16 rounded-2xl bg-white/15 -mt-10 ml-4 border-4 border-[#301118]" />
        <div className="h-5 bg-white/15 rounded-md w-3/4 mt-4" />
        <div className="h-3 bg-white/10 rounded-md w-full mt-2" />
        <div className="h-3 bg-white/10 rounded-md w-2/3 mt-1" />
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-16 bg-white/10 rounded-full" />
          <div className="h-6 w-16 bg-white/10 rounded-full" />
        </div>
      </div>
      <div className="pt-4 border-t border-white/10 flex gap-2">
        <div className="h-10 flex-1 bg-white/15 rounded-xl" />
        <div className="h-10 flex-1 bg-white/15 rounded-xl" />
        <div className="h-10 flex-1 bg-white/15 rounded-xl" />
      </div>
    </div>
  );
}

const ExpertSlider = () => {
  const { experts, loading } = useExpertListStore();

  return (
    <div className="relative mt-4 px-1 sm:px-2 md:px-6">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4 py-2">
          {loading || experts.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem
                  key={`skeleton-${i}`}
                  className="pl-3 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ExpertCardSkeleton />
                </CarouselItem>
              ))
            : experts.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-3 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="h-full">
                    <ExploreExpertCard expert={item} />
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>

        {/* Floating Navigation Controls */}
        <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 bg-white/95 hover:bg-white text-gray-900 border border-gray-200 shadow-2xl size-11" />
        <CarouselNext className="hidden md:flex -right-4 lg:-right-6 bg-white/95 hover:bg-white text-gray-900 border border-gray-200 shadow-2xl size-11" />
      </Carousel>
    </div>
  );
};

export default ExpertSlider;

