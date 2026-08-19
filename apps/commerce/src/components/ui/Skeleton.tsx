import SkeletonLoader from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { cn } from "@/lib/utils/cn";

/**
 * 🎨 Premium Skeleton Component
 * Powered by react-loading-skeleton
 */
export function Skeleton({ className, height, width, circle, ...props }: any) {
  return (
    <SkeletonLoader 
      containerClassName={cn("block", className)} 
      className="block h-full w-full"
      height={height}
      width={width}
      circle={circle}
      baseColor="#f3f4f6"
      highlightColor="#e5e7eb"
      {...props} 
    />
  );
}

/**
 * 📊 Skeleton for Dashboard Stats Grid
 */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-14 w-14 rounded-2xl" />
          </div>
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

/**
 * 📋 Skeleton for Data Tables (Orders, Products)
 */
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="p-8 space-y-6">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 🏠 Full Dashboard Home Skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <StatsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 h-[400px]">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 h-[400px]">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 💰 Earnings Page Skeleton
 */
export function EarningsSkeleton() {
  return (
    <div className="space-y-10">
      <StatsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <TableSkeleton rows={6} />
        </div>
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-80">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-80">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ⚙️ Settings/Profile Skeleton
 */
export function SettingsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-12 w-40 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-8">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 gap-8">
              <Skeleton className="h-48 rounded-[2rem]" />
              <Skeleton className="h-48 rounded-[2rem]" />
            </div>
            <div className="space-y-6">
               {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 rounded-2xl" />)}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 h-[600px]">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
