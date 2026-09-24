"use client";

import React, { createContext, useContext, useEffect } from "react";
import type { Client } from "@repo/lib";
import { useAuthStore } from "@/store/useAuthStore";

interface ProfileContextType {
  profile: Client | null;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
});

export function ProfileProvider({
  initialProfile,
  children,
}: {
  initialProfile: Client | null;
  children: React.ReactNode;
}) {
  const { updateUser } = useAuthStore();

  // Sync initial server-fetched profile to the auth store
  useEffect(() => {
    if (initialProfile) {
      updateUser(initialProfile);
    }
  }, [initialProfile, updateUser]);

  return (
    <ProfileContext.Provider value={{ profile: initialProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
