"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { Card, CardContent, Button, useDashboardOverview } from "@/features/dashboard";
import { HeartHandshake, Sparkles, ArrowRight, UserCheck } from "lucide-react";

export default function KundliMatchingDashboardPage() {
  const { user, astrologyDetails, hasBirthDetails } = useDashboardOverview();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-orange-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit">
          Kundli Matching (Guna Milan)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Perform Ashtakoot 36-point compatibility matching using your saved astrological profile
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Profile Card */}
        <Card className="p-6 border-orange-200/80 bg-orange-50/40">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="w-5 h-5 text-[#ff6b00]" />
            <h3 className="font-bold text-base text-slate-900 font-outfit">
              Your Saved Details (Partner 1)
            </h3>
          </div>

          <div className="space-y-2 text-xs text-slate-700 mb-4">
            <p>
              <span className="font-semibold text-slate-500">Name:</span>{" "}
              {user?.name || "Client"}
            </p>
            <p>
              <span className="font-semibold text-slate-500">Date of Birth:</span>{" "}
              {astrologyDetails?.birthDate || user?.date_of_birth || "Not set"}
            </p>
            <p>
              <span className="font-semibold text-slate-500">Time:</span>{" "}
              {astrologyDetails?.birthTime || user?.time_of_birth || "Not set"}
            </p>
            <p>
              <span className="font-semibold text-slate-500">Place:</span>{" "}
              {astrologyDetails?.birthPlace || user?.place_of_birth || "Not set"}
            </p>
          </div>

          {!hasBirthDetails && (
            <Link href={PATHS.DASHBOARD_PROFILE} className="no-underline">
              <Button variant="secondary" size="sm" className="font-bold">
                Update Your Birth Details
              </Button>
            </Link>
          )}
        </Card>

        {/* Action Card */}
        <Card className="p-6 border-orange-200/80 bg-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-outfit mb-1">
              Match With A Partner
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Compare your horoscope with your partner's chart across Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi kootas.
            </p>
          </div>

          <Link href={PATHS.KUNDALI_MATCHING} className="no-underline block">
            <Button variant="default" className="w-full justify-center font-bold">
              <span>Launch Kundli Matching Calculator</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
