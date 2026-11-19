import { getDashboardStats } from "@/features/dashboard/api/server";
import { StatsClient } from "@/components/dashboard/StatsClient";

export default async function StatsPage() {
  const result = await getDashboardStats("monthly");
  const initialData = result.ok ? result.data : null;
  return <StatsClient initialData={initialData} initialPeriod="monthly" />;
}
