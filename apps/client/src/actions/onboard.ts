"use server";

import { api, API_ROUTES, AUTH_COOKIE_NAMES } from "@/actions";
import { getAccessToken } from "@/actions/cookie";
import { getErrorMessage, Media } from "@repo/lib";
import { OnboardingFormData, OnboardingActionResponse } from "@/lib/types";

export async function saveOnboardingAction(
  data: OnboardingFormData,
): Promise<OnboardingActionResponse> {
  const token = await getAccessToken();

  if (!token) {
    return {
      error: "Authentication session not found. Please log in.",
    };
  }

  const payload: Record<string, any> = {};

  if (data.first_name?.trim()) {
    payload.first_name = data.first_name.trim();
  }
  if (data.last_name?.trim()) {
    payload.last_name = data.last_name.trim();
  }
  if (data.full_name?.trim()) {
    payload.full_name = data.full_name.trim();
  } else if (data.first_name?.trim() || data.last_name?.trim()) {
    payload.full_name = [data.first_name?.trim(), data.last_name?.trim()].filter(Boolean).join(" ");
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

  if (data.preferences) {
    payload.preferences = data.preferences;
    if (data.preferences.languages && data.preferences.languages.length > 0) {
      payload.language_preference = data.preferences.languages.join(", ");
    }
  }

  if (data.address && (data.address.line1 || data.address.city || data.address.pincode)) {
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

  const [, error] = await api.patch(API_ROUTES.AUTH.ME, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${token}`,
    },
  });

  if (error) {
    console.log(error);
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
  public_id?: string,
): Promise<OnboardingActionResponse> {
  const token = await getAccessToken();

  if (!token) {
    return {
      error: "Authentication session not found. Please log in.",
    };
  }

  if (public_id) {
    formData.append("public_id", public_id);
  }

  const [resData, error] = await api.patch<{
    avatar?: string;
    avatar_media: Media | null;
  }>(API_ROUTES.AUTH.PICTURE, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${token}`,
    },
  });

  console.log(error);

  if (error || !resData?.avatar) {
    return {
      error: getErrorMessage(error || "Failed to upload picture"),
    };
  }

  return {
    success: true,
    avatar: resData.avatar,
    avatar_media: resData.avatar_media,
  };
}
