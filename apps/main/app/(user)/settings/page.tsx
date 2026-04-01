import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { api as http } from "@/lib/api";
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

// ─── Server Component — fetches profile data before render ───────────────────
export default async function ClientSettingsPage() {
  let initialData: ProfileData;

  try {
    // cookies() makes this request dynamic (no caching) — always fresh data
    cookies(); // opt into dynamic rendering

    const [data, err] = await http.get<any>("/client/profile");
    
    if (err) {
      if (err.status === 401 || err.status === 403) {
        redirect(PATHS.SIGN_IN);
      }
      initialData = {
        full_name: "",
        email: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        preferences: "",
        language_preference: "",
        addresses: [DEFAULT_ADDRESS],
      };
    } else {
      const profile = data?.data || data || {};
      initialData = {
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
  } catch (err: any) {
    // 401 or network error → redirect to sign in
    if (err?.status === 401 || err?.status === 403) {
      redirect(PATHS.SIGN_IN);
    }
    // For other errors, show empty form (user can still fill manually)
    initialData = {
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

  return <SettingsForm initialData={initialData} />;
}

