"use client";

import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/hooks/use-toast";
import {
  ProfileUpdateForm,
  type ProfileFormValues,
} from "@/features/dashboard/profile";
import { updateCurrentUser } from "@/features/dashboard/profile/actions/update-account";
import type { Client } from "@repo/lib";
import { useProfile } from "./ProfileContext";

export default function DashboardProfilePage() {
  const { profile } = useProfile();
  const { updateUser } = useAuthStore();

  const defaultValues: ProfileFormValues = {
    first_name: profile?.first_name || "",
    last_name: profile?.last_name ?? "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    gender: profile?.gender || "male",
    date_of_birth: (profile?.date_of_birth || "").split("T")[0] || "",
    time_of_birth: profile?.time_of_birth || "",
    place_of_birth: profile?.place_of_birth || "",
  };

  const handleSave = async (values: ProfileFormValues) => {
    const payload: Partial<Client> = {
      first_name: values.first_name,
      last_name: values.last_name || null,
      phone: values.phone || undefined,
      gender: values.gender,
      date_of_birth: values.date_of_birth || null,
      time_of_birth: values.time_of_birth || null,
      place_of_birth: values.place_of_birth || null,
    };

    const [, err] = await updateCurrentUser(payload);

    if (err) {
      toast.error(err.message || "Failed to update profile. Please try again.");
    } else {
      toast.success("Profile saved!");
      updateUser({
        first_name: values.first_name,
        last_name: values.last_name || null,
        phone: values.phone,
        gender: values.gender,
        date_of_birth: values.date_of_birth || null,
        time_of_birth: values.time_of_birth || null,
        place_of_birth: values.place_of_birth || null,
      } as Client);
    }
  };

  const currentAvatarUrl =
    profile?.avatar_media?.url || profile?.avatar || "";

  return (
    <ProfileUpdateForm
      defaultValues={defaultValues}
      onSubmit={handleSave}
      avatarUrl={currentAvatarUrl}
      onAvatarChange={(newAvatar) => {
        updateUser({
          avatar: newAvatar,
          avatar_media: { url: newAvatar } as any,
        } as Client);
      }}
    />
  );
}
