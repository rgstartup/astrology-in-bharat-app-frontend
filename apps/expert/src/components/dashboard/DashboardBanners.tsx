"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Banknote, UserRoundPlus } from "lucide-react";
import { getOnboardingStatus } from "@/features/onboarding/api";
import type { OnboardingStatus } from "@/features/onboarding/types";

interface DashboardBannersProps {
  className?: string;
}

export const DashboardBanners: React.FC<DashboardBannersProps> = ({
  className = "",
}) => {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getOnboardingStatus().then((result) => {
      if (!cancelled && result.ok && result.data) setStatus(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!status) return null;

  return (
    <div className={className}>
      {!status.onboarding_completed && (
        <Link
          href="/onboarding"
          className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-amber-500 bg-white px-4 py-3 transition-colors hover:bg-amber-50/50"
        >
          <span className="flex items-center gap-3">
            <UserRoundPlus className="size-5 shrink-0 text-amber-600" aria-hidden />
            <span className="text-sm text-[#111111]">
              <span className="font-semibold">Finish setting up your profile.</span>{" "}
              <span className="text-[#626260]">
                Add your profession, specializations and photo.
              </span>
            </span>
          </span>
          <span className="shrink-0 text-sm font-medium text-[#111111]">
            Continue →
          </span>
        </Link>
      )}
      {status.onboarding_completed && !status.bank_linked && (
        <Link
          href="/dashboard/wallet"
          className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-[#d3cec6] bg-white px-4 py-3 transition-colors hover:bg-[#f5f1ec]"
        >
          <span className="flex items-center gap-3">
            <Banknote className="size-5 shrink-0 text-[#626260]" aria-hidden />
            <span className="text-sm text-[#111111]">
              <span className="font-semibold">Link your bank account</span>{" "}
              <span className="text-[#626260]">
                to receive payouts from consultations.
              </span>
            </span>
          </span>
          <span className="shrink-0 text-sm font-medium text-[#111111]">
            Set up →
          </span>
        </Link>
      )}
    </div>
  );
};

export default DashboardBanners;
