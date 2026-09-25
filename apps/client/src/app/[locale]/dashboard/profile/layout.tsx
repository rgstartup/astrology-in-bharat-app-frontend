import React from "react";
import { fetchCurrentUser } from "@/features/dashboard/profile/actions/fetch-account";
import { ProfileProvider } from "./ProfileContext";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile] = await fetchCurrentUser();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page header */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#301118] font-outfit flex items-center gap-2">
            <span>My Profile</span>
            <Badge
              variant="outline"
              className="text-[11px] font-bold border-slate-300 text-slate-600 bg-slate-100"
            >
              Vedic Identity
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage your personal profile and astrological birth information
          </p>
        </div>
      </div> */}

      <ProfileProvider initialProfile={profile}>{children}</ProfileProvider>
    </div>
  );
}
