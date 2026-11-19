import { getRecentAppointments } from "@/features/dashboard/api/server";
import { UpcomingAppointmentsClient } from "@/features/dashboard/components/UpcomingAppointmentsClient";

export default async function RecentAppointmentsPage() {
  const result = await getRecentAppointments();
  const initialData = result.ok ? result.data : [];
  return <UpcomingAppointmentsClient initialData={initialData} />;
}
