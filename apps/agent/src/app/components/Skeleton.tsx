"use client";
import { cn } from "@/lib/cn";

interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-shimmer rounded-md",
                className
            )}
        />
    );
};

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Banner Skeleton */}
            <div className="h-64 w-full rounded-3xl animate-shimmer" />

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-4 w-24 rounded animate-shimmer" />
                                <div className="h-8 w-16 rounded animate-shimmer" />
                            </div>
                            <div className="h-12 w-12 rounded-xl animate-shimmer" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Bottom Skeleton */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <div className="h-4 w-32 rounded animate-shimmer mb-6" />
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-14 w-full rounded-xl animate-shimmer" />
                    ))}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <div className="h-4 w-32 rounded animate-shimmer mb-6" />
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-14 w-full rounded-xl animate-shimmer" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ProfileSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="h-32 animate-shimmer rounded-none" />
                <div className="px-10 pb-10 -mt-12">
                    <div className="flex items-end justify-between mb-6">
                        <div className="w-24 h-24 rounded-full border-8 border-white animate-shimmer" />
                        <div className="h-10 w-32 rounded-2xl animate-shimmer" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-8 w-48 rounded animate-shimmer" />
                        <div className="h-4 w-32 rounded animate-shimmer" />
                    </div>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 rounded-3xl animate-shimmer" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 h-80 bg-white rounded-[2rem] border border-gray-100 p-8 space-y-6">
                    <div className="h-6 w-32 rounded animate-shimmer" />
                    <div className="grid grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 w-20 rounded animate-shimmer" />
                                <div className="h-12 w-full rounded-2xl animate-shimmer" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 h-80 bg-white rounded-[2rem] border border-gray-100 p-8 space-y-4">
                    <div className="h-6 w-32 rounded animate-shimmer mb-6" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 w-full rounded-2xl animate-shimmer" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export const RegistrationSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="h-6 w-48 rounded animate-shimmer" />
                <div className="h-4 w-64 rounded animate-shimmer" />
            </div>

            {/* Tabs Skeleton */}
            <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 rounded-2xl animate-shimmer" />
                ))}
            </div>

            {/* Form Card Skeleton */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="h-12 w-full animate-shimmer rounded-none" />
                <div className="p-6 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-2">
                            <div className="h-3 w-20 rounded animate-shimmer" />
                            <div className="h-10 w-full rounded-xl animate-shimmer" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-20 rounded animate-shimmer" />
                            <div className="h-10 w-full rounded-xl animate-shimmer" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-20 rounded animate-shimmer" />
                            <div className="h-10 w-full rounded-xl animate-shimmer" />
                        </div>
                    </div>
                    <div className="h-20 w-full rounded-xl animate-shimmer" />
                    <div className="h-12 w-full rounded-xl animate-shimmer" />
                </div>
            </div>
        </div>
    );
};

export const ListingsSkeleton = () => {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-500">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 h-52 flex flex-col gap-4 overflow-hidden relative">
                    <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl animate-shimmer" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 rounded animate-shimmer" />
                            <div className="h-3 w-20 rounded animate-shimmer" />
                        </div>
                    </div>
                    <div className="space-y-3 mt-2">
                        <div className="h-3 w-full rounded animate-shimmer" />
                        <div className="h-3 w-3/4 rounded animate-shimmer" />
                        <div className="h-3 w-1/2 rounded animate-shimmer" />
                    </div>
                    <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between">
                        <div className="h-3 w-20 rounded animate-shimmer" />
                        <div className="h-3 w-12 rounded animate-shimmer" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const CommissionSkeleton = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-3 w-20 rounded animate-shimmer" />
                                <div className="h-8 w-16 rounded animate-shimmer" />
                            </div>
                            <div className="h-10 w-10 rounded-xl animate-shimmer" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <div className="h-4 w-32 rounded animate-shimmer" />
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => <div key={i} className="h-8 w-16 rounded-lg animate-shimmer" />)}
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                            <div className="space-y-2">
                                <div className="h-4 w-40 rounded animate-shimmer" />
                                <div className="h-3 w-24 rounded animate-shimmer" />
                            </div>
                            <div className="flex gap-4">
                                <div className="h-8 w-20 rounded-full animate-shimmer" />
                                <div className="h-8 w-24 rounded-full animate-shimmer" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const PayoutSkeleton = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-3 w-20 rounded animate-shimmer" />
                                <div className="h-6 w-16 rounded animate-shimmer" />
                            </div>
                            <div className="h-10 w-10 rounded-xl animate-shimmer" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Banner Skeleton */}
            <div className="h-32 w-full rounded-3xl animate-shimmer" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Skeleton */}
                <div className="lg:col-span-1 h-96 bg-white rounded-3xl border border-gray-100 p-8 space-y-6">
                    <div className="h-6 w-32 rounded animate-shimmer" />
                    <div className="space-y-4">
                        <div className="h-14 w-full rounded-2xl animate-shimmer" />
                        <div className="h-24 w-full rounded-2xl animate-shimmer" />
                        <div className="h-14 w-full rounded-2xl animate-shimmer" />
                    </div>
                </div>

                {/* History Skeleton */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 space-y-6">
                    <div className="h-6 w-32 rounded animate-shimmer" />
                    <div className="space-y-4 mt-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center justify-between py-6 border-b border-gray-50 last:border-0">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-xl animate-shimmer" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-40 rounded animate-shimmer" />
                                        <div className="h-3 w-24 rounded animate-shimmer" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-6 w-20 rounded animate-shimmer ml-auto" />
                                    <div className="h-3 w-32 rounded animate-shimmer" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const WalletSkeleton = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="h-8 w-48 rounded animate-shimmer" />
                <div className="h-4 w-64 rounded animate-shimmer" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-white rounded-[1.5rem] border border-gray-100 p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="space-y-3">
                                <div className="h-3 w-24 rounded animate-shimmer" />
                                <div className="h-10 w-20 rounded animate-shimmer" />
                                <div className="h-3 w-16 rounded animate-shimmer" />
                            </div>
                            <div className="h-12 w-12 rounded-xl animate-shimmer" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Withdraw Section Skeleton */}
            <div className="h-64 w-full bg-white rounded-[1.5rem] border border-gray-100 p-10 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl animate-shimmer" />
                    <div className="space-y-2">
                        <div className="h-5 w-32 rounded animate-shimmer" />
                        <div className="h-4 w-64 rounded animate-shimmer" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div className="h-20 rounded-2xl animate-shimmer" />
                    <div className="h-20 rounded-2xl animate-shimmer" />
                    <div className="h-20 rounded-2xl animate-shimmer" />
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-8">
                <div className="h-6 w-48 rounded animate-shimmer mb-8" />
                <div className="space-y-6">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-xl animate-shimmer" />
                                <div className="space-y-2">
                                    <div className="h-4 w-40 rounded animate-shimmer" />
                                    <div className="h-3 w-24 rounded animate-shimmer" />
                                </div>
                            </div>
                            <div className="h-8 w-24 rounded-full animate-shimmer" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
