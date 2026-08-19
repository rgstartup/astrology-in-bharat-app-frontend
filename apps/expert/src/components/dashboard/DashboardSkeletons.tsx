import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton for the Top Stats Cards
 */
export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for the Activity Feed
 */
export const ActivitySkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-2">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for Tables (Recent Appointments)
 */
export const TableSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-9 w-56 rounded-lg" />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-100">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-20" />)}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-4 gap-4 py-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for Charts/Graphs
 */
export const ChartSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[400px] flex flex-col">
      <div className="flex justify-between mb-8">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
      <div className="flex-1 flex items-end gap-4 pb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
          <Skeleton 
            key={i} 
            className="flex-1 rounded-t-lg" 
            style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }} 
          />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-3 w-12" />)}
      </div>
    </div>
  );
};

/**
 * Skeleton for Consultation History (Strips)
 */
export const HistorySkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for Consultation Ratings
 */
export const RatingSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
      <div className="flex justify-between mb-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="space-y-3 flex flex-col items-center">
          <Skeleton className="h-16 w-20" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex-1 w-full space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 flex-1 rounded-full" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Service Pricing Page
 */
export const PricingSkeleton = () => {
  return (
    <div className="p-4 sm:p-8 min-h-screen max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="max-w-3xl mx-auto text-center mb-12 flex flex-col items-center space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-12 w-48 rounded-full mt-4" />
      </div>

      {/* Grid Section Skeleton */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-6 rounded-lg" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>
              <div className="flex gap-2 pt-4">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Top Insights (Users/Services)
 */
export const InsightsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2].map(i => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(j => (
              <div key={j} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for Wallet Page
 */
export const WalletSkeleton = () => {
  return (
    <div className="p-4 sm:p-8 min-h-screen max-w-7xl mx-auto space-y-8">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 flex justify-between items-start">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Withdrawal UI Skeleton */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 space-y-6">
        <Skeleton className="h-7 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
        <Skeleton className="h-14 w-full md:w-48 rounded-2xl md:ml-auto" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Notification Items
 */
export const NotificationSkeleton = () => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-3 w-12" />
          <div className="h-px flex-1 bg-gray-100/50"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-3 w-12" />
          <div className="h-px flex-1 bg-gray-100/50"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Profile Management
 */
export const ProfileSkeleton = () => {
  return (
    <div className="p-4 sm:p-8 min-h-screen max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Grid of Section Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 space-y-6 shadow-sm">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-20 w-full rounded-xl" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
