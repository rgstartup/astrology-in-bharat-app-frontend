import React from "react";
import { Skeleton, Card } from "@/features/dashboard";

export default function DashboardProfileLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Card className="p-6 bg-white border-slate-200 space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </Card>
    </div>
  );
}
