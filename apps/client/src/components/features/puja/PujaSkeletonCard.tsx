import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export const PujaSkeletonCard = () => {
    return (
        <div className="bg-white w-full h-full flex flex-col rounded-4xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden animate-pulse min-w-0">
            {/* Image Section */}
            <div className="relative h-44 sm:h-48 bg-gray-100 shrink-0">
                <div className="absolute top-3 left-3 flex gap-1.5">
                    <Skeleton width={40} height={16} className="rounded-md" />
                    <Skeleton width={40} height={16} className="rounded-md" />
                </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col grow">
                {/* Header: Name + Like */}
                <div className="flex justify-between items-start gap-2 mb-2">
                    <Skeleton width="70%" height={24} className="rounded-md" />
                    <Skeleton width={32} height={20} className="rounded-md" />
                </div>

                {/* Expert Info & Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton width={80} height={12} className="rounded-md" />
                    </div>
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    <Skeleton width={30} height={12} className="rounded-md" />
                </div>

                {/* Description */}
                <div className="space-y-2 mb-4">
                    <Skeleton width="100%" height={12} className="rounded-md" />
                    <Skeleton width="80%" height={12} className="rounded-md" />
                </div>

                {/* Footer: Price + Action */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                        <Skeleton width={40} height={8} className="mb-1 rounded-md" />
                        <Skeleton width={60} height={20} className="rounded-md" />
                    </div>
                    <Skeleton width={80} height={32} className="rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export const PujaGridSkeleton = ({ count = 3 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="w-full">
                    <PujaSkeletonCard />
                </div>
            ))}
        </div>
    );
};
