"use server";

import { cookies } from "next/headers";
import { api, API_ROUTES } from "@/actions";
import { getErrorMessage } from "@repo/lib";
import { OnboardingFormData, OnboardingActionResponse } from "@/lib/types";

export async function saveOnboardingAction(
  data: OnboardingFormData,
): Promise<OnboardingActionResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return {
      error: "Authentication session not found. Please log in.",
    };
  }

  const payload: Record<string, any> = {};

  if (data.full_name?.trim()) {
    payload.full_name = data.full_name.trim();
  }
  if (data.date_of_birth?.trim()) {
    payload.date_of_birth = data.date_of_birth.trim();
  }
  if (data.time_of_birth?.trim()) {
    payload.time_of_birth = data.time_of_birth.trim();
  }
  if (data.gender) {
    payload.gender = data.gender;
  }
  if (data.place_of_birth?.trim()) {
    payload.place_of_birth = data.place_of_birth.trim();
  }
  if (data.avatar?.trim()) {
    payload.avatar = data.avatar.trim();
    payload.profile_picture = data.avatar.trim();
  }
  if (data.languages && data.languages.length > 0) {
    payload.language_preference = data.languages.join(", ");
  }

  const preferencesObj: Record<string, any> = {};
  if (data.consultation_categories && data.consultation_categories.length > 0) {
    preferencesObj.consultation_categories = data.consultation_categories;
  }
  if (data.expert_categories && data.expert_categories.length > 0) {
    preferencesObj.expert_categories = data.expert_categories;
  }
  if (Object.keys(preferencesObj).length > 0) {
    payload.preferences = JSON.stringify(preferencesObj);
  }

  if (
    data.address &&
    (data.address.line1 || data.address.city || data.address.pincode)
  ) {
    payload.addresses = [
      {
        line1: data.address.line1?.trim() || "",
        city: data.address.city?.trim() || "",
        state: data.address.state?.trim() || "",
        pincode: data.address.pincode?.trim() || "",
        country: "India",
        is_primary: true,
      },
    ];
  }

  const [, error] = await api.patch(API_ROUTES.AUTH.CLIENT.ME, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `accessToken=${token}`,
    },
  });

  if (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  return {
    success: true,
    message: "Profile completed successfully!",
  };
}

export async function uploadOnboardingPictureAction(
  formData: FormData,
): Promise<OnboardingActionResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return {
      error: "Authentication session not found. Please log in.",
    };
  }

  const [resData, error] = await api.patch<{
    avatar?: string;
    secure_url?: string;
  }>(API_ROUTES.AUTH.CLIENT.PICTURE, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `accessToken=${token}`,
    },
  });

  if (error || !resData?.avatar) {
    return {
      error: getErrorMessage(error || "Failed to upload picture"),
    };
  }

  return {
    success: true,
    avatar: resData.avatar,
  };
}
