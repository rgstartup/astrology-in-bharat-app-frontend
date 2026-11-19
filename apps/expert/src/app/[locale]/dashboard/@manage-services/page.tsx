import { getExpertProfile } from "@/features/dashboard/api/server";
import { ManageConsultationsClient } from "@/features/dashboard/components/ManageConsultationsClient";

export default async function ManageServicesPage() {
  const result = await getExpertProfile();
  const initialProfile = result.ok ? result.data : null;
  return <ManageConsultationsClient initialProfile={initialProfile} />;
}
