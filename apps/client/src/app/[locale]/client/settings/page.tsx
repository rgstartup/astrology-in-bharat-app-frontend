import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { api as http } from "@/actions";
import SettingsForm, { type ProfileData } from "./SettingsForm";
import { PATHS } from "@repo/routes";

const DEFAULT_ADDRESS = {
  street: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  tag: "",
};

function createEmptyProfile(): ProfileData {
  return {
    full_name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    preferences: "",
    language_preference: "",
    addresses: [DEFAULT_ADDRESS],
  };
}

function parseProfileData(raw: any): ProfileData {
  const profile = raw?.data || raw || {};
  return {
    full_name: profile.user?.name || "",
    email: profile.user?.email || "",
    date_of_birth: profile.date_of_birth || "",
    gender: profile.gender || "",
    phone: profile.phone || "",
    preferences: profile.preferences || "",
    language_preference: profile.language_preference || "",
    addresses: profile.addresses?.length ? profile.addresses : [DEFAULT_ADDRESS],
  };
}

async function fetchInitialProfile(): Promise<ProfileData> {
  try {
    cookies();
    const [data, err] = await http.get<any>("/client/profile");
    if (err) {
      if (err.status === 401 || err.status === 403) {
        redirect(PATHS.LOGIN);
      }
      return createEmptyProfile();
    }
    return parseProfileData(data);
  } catch (err: any) {
    if (err?.status === 401 || err?.status === 403) {
      redirect(PATHS.LOGIN);
    }
    return createEmptyProfile();
  }
}

export default async function ClientSettingsPage() {
  const initialData = await fetchInitialProfile();
  return <SettingsForm initialData={initialData} />;
}
