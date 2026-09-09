"use client";

import React from "react";
import {
  GreetingCard,
  AstrologyIdentityCard,
  TodaysGuidanceCard,
  QuickActions,
  ActiveConsultationCard,
  RecommendedExperts,
  RecentActivity,
  PersonalizedRecs,
  useDashboardOverview,
} from "@/features/dashboard";
import { Loading } from "@repo/ui";

export default function DashboardHomePage() {
  const {
    user,
    authLoading,
    hasBirthDetails,
    astrologyDetails,
    isLoadingAstrology,
    activeConsultation,
  } = useDashboardOverview();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Greeting */}
      <GreetingCard name={user?.name} />

      {/* 2. Top Grid: Astrology Identity Card + Today's Guidance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <AstrologyIdentityCard
            astrologyDetails={astrologyDetails}
            hasBirthDetails={hasBirthDetails}
            isLoading={isLoadingAstrology}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col">
          <TodaysGuidanceCard
            sign={astrologyDetails?.sunSign || astrologyDetails?.moonSign}
          />
        </div>
      </div>

      {/* 3. Active Consultation Banner (or guidance CTA) */}
      <ActiveConsultationCard session={activeConsultation} />

      {/* 4. Quick Actions */}
      <QuickActions />

      {/* 5. Recommended Experts */}
      <RecommendedExperts />

      {/* 6. Recent Activity Timeline */}
      <RecentActivity />

      {/* 7. Personalized Recommendations */}
      <PersonalizedRecs />
    </div>
  );
}
