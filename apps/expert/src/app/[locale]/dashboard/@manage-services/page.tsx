import { getExpertProfile } from "@/features/dashboard/api/server";
import { ManageConsultationsClient } from "@/components/dashboard/ManageConsultationsClient";

export default async function ManageServicesPage() {
  const result = await getExpertProfile();
  const initialProfile = result.ok ? result.data : null;
  return <ManageConsultationsClient initialProfile={initialProfile} />;
}
