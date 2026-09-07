import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export const SkeletonCard = () => {
    return (
        <div className="bg-white w-full h-full flex flex-col rounded-xl shadow-sm border border-[#daa23e]/20 p-4 text-center animate-pulse min-w-0">
            {/* Image Section */}
            <div className="relative flex justify-center pt-4 mb-4">
                <div className="absolute top-0 left-0">
                    <Skeleton variant="circular" width={36} height={36} />
                </div>
                <div className="absolute top-0 right-0">
                    <Skeleton width={60} height={20} className="rounded-full" />
                </div>
                <Skeleton variant="circular" width={120} height={120} />
            </div>

            {/* Ratings */}
            <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} width={16} height={16} />)}
                <Skeleton width={40} height={16} className="ml-2" />
            </div>

            {/* Name & Tags */}
            <div className="flex flex-col items-center gap-2 mb-4">
                <Skeleton width="70%" height={24} />
                <div className="flex gap-1">
                    <Skeleton width={60} height={20} className="rounded-full" />
                    <Skeleton width={60} height={20} className="rounded-full" />
                </div>
            </div>

            {/* Experience & Language */}
            <div className="flex flex-col items-center gap-3 mb-6">
                <Skeleton width="60%" height={16} />
                <Skeleton width="50%" height={16} />
            </div>

            {/* Buttons */}
            <div className="mt-auto space-y-2">
                <div className="flex gap-2">
                    <Skeleton width="100%" height={40} className="rounded-full" />
                    <Skeleton width="100%" height={40} className="rounded-full" />
                </div>
                <Skeleton width="100%" height={40} className="rounded-full" />
            </div>
        </div>
    );
};

export const ExpertGridSkeleton = ({ count = 8 }: { count?: number }) => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="w-full">
                    <SkeletonCard />
                </div>
            ))}
        </div>
    );
};


