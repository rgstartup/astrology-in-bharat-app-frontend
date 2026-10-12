"use client";

const PrepSkeleton = () => (
  <div className="p-5 space-y-4" aria-busy="true" aria-label="Loading">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded-full bg-slate-100 animate-pulse" />
        <div className="h-3 w-1/2 rounded-full bg-slate-100 animate-pulse" />
        <div className="h-3 w-1/3 rounded-full bg-slate-100 animate-pulse" />
      </div>
      <div className="h-8 w-16 rounded-xl bg-slate-100 animate-pulse shrink-0" />
    </div>
    <div className="h-11 rounded-full bg-slate-100 animate-pulse" />
    <div className="h-12 rounded-full bg-slate-100 animate-pulse" />
  </div>
);

export default PrepSkeleton;
