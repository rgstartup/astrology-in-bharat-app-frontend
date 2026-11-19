import { getRecentAppointments } from "@/features/dashboard/api/server";
import { ActivityFeedClient } from "@/features/dashboard/components/ActivityFeedClient";

export default async function RecentActivityPage() {
  const result = await getRecentAppointments();
  const initialData = result.ok ? result.data : [];
  return <ActivityFeedClient initialData={initialData} />;
}
