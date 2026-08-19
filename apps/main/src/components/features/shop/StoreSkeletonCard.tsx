import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export const StoreSkeletonCard = () => {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col h-full animate-pulse min-w-0">
            {/* Main Shop Header Image Placeholder */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton width={32} height={16} className="rounded-full" />
                </div>
                <div className="absolute top-4 right-4 z-10">
                    <Skeleton width={60} height={28} className="rounded-xl" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex flex-col justify-end p-6">
                    <Skeleton width="60%" height={24} className="mb-2" />
                    <Skeleton width="40%" height={12} />
                </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton width={40} height={10} />
                        <div className="flex gap-2">
                            <Skeleton width={40} height={16} className="rounded-full" />
                            <Skeleton width={50} height={16} className="rounded-lg" />
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Skeleton variant="circular" width={16} height={16} />
                        <div className="space-y-2 w-full">
                            <Skeleton width="100%" height={10} />
                            <Skeleton width="60%" height={10} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Skeleton variant="circular" width={16} height={16} />
                        <Skeleton width="50%" height={10} />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton width={80} height={10} />
                        <Skeleton width={14} height={14} className="rounded-sm" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton width="31%" height={64} className="rounded-xl" />
                        <Skeleton width="31%" height={64} className="rounded-xl" />
                        <Skeleton width="31%" height={64} className="rounded-xl" />
                    </div>
                </div>

                <div className="mt-auto pt-4">
                    <Skeleton width="100%" height={48} className="rounded-2xl" />
                </div>
            </div>
        </div>
    );
};
