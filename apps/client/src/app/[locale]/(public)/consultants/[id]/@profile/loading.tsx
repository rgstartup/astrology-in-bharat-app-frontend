"use client";

import React from "react";

// ─── Skeleton Helper ──────────────────────────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

// ─── Left Identity Card Skeleton ──────────────────────────────────────
const ProfileLeftCardSkeleton = () => (
  <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 overflow-hidden border border-slate-200/60 bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs animate-pulse">
    {/* Avatar & Identity Banner */}
    <div className="flex flex-col items-center text-center pt-2">
      <div className="relative mb-3">
        <div className="size-20 sm:size-24 rounded-full bg-slate-200 p-1" />
        <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-slate-300" />
      </div>

      <div className="h-5 w-36 bg-slate-200 rounded-md mb-2" />
      <div className="h-3.5 w-24 bg-slate-100 rounded-md mb-3" />

      <div className="h-4 w-28 bg-emerald-50 rounded-full border border-emerald-100" />
    </div>

    {/* Number-First Stats Strip (Experience, Rating, Likes) */}
    <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="h-4 w-10 bg-slate-200 rounded" />
          <div className="h-2.5 w-12 bg-slate-100 rounded" />
        </div>
      ))}
    </div>

    {/* Mobile Action Buttons (Visible only on small screens) */}
    <div className="grid grid-cols-3 gap-2 lg:hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 bg-slate-100 rounded-xl" />
      ))}
    </div>
  </div>
);

// ─── Right Expertise & Consultation Actions Skeleton ──────────────────
const ProfileRightCardSkeleton = () => (
  <div className="flex-1 min-w-0 overflow-hidden border border-slate-200/60 bg-white rounded-2xl p-5 sm:p-6 lg:p-7 flex flex-col justify-between gap-5 shadow-2xs animate-pulse">
    {/* Top: Expertise Specializations & Languages */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-4 w-24 bg-slate-100 rounded-full" />
      </div>

      {/* Specialization Tags */}
      <div className="flex flex-wrap gap-2">
        {["Vedic Astrology", "Kundli Analysis", "Numerology", "Vastu", "Prashna"].map(
          (tag, i) => (
            <div
              key={i}
              className="h-6 w-24 bg-slate-100 rounded-full border border-slate-200/60"
            />
          ),
        )}
      </div>

      {/* Languages Strip */}
      <div className="h-4 w-48 bg-slate-100 rounded" />
    </div>

    {/* Mid: 3-Column Consultation Actions Grid (Chat, Call, Video Call) */}
    <div className="hidden lg:grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col items-center gap-2 text-center"
        >
          <div className="size-8 rounded-lg bg-slate-200" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-3 w-16 bg-slate-100 rounded" />
          <div className="h-8 w-full bg-slate-200 rounded-lg mt-1" />
        </div>
      ))}
    </div>

    {/* Bottom: Trust & Verified Guarantees */}
    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
      <div className="h-3.5 w-44 bg-slate-100 rounded" />
      <div className="h-3.5 w-36 bg-slate-100 rounded" />
    </div>
  </div>
);

// ─── Content Section (About, Experience, Reviews tabs) Skeleton ────────
const ContentSectionSkeleton = () => (
  <div className="w-full bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 lg:p-8 shadow-2xs animate-pulse">
    {/* Tabs Navigation Header */}
    <div className="flex items-center gap-6 border-b border-slate-100 pb-3 mb-6">
      {["About Consultant", "Experience & Credentials", "Client Reviews (0)", "Photo Gallery", "Videos"].map(
        (tab, i) => (
          <div
            key={i}
            className={`h-4 rounded ${i === 0 ? "w-28 bg-orange/30" : "w-24 bg-slate-200"}`}
          />
        ),
      )}
    </div>

    {/* Bio & Overview Paragraphs */}
    <div className="space-y-3 mb-6 max-w-4xl">
      <div className="h-3.5 w-full bg-slate-100 rounded" />
      <div className="h-3.5 w-11/12 bg-slate-100 rounded" />
      <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
      <div className="h-3.5 w-3/4 bg-slate-100 rounded" />
    </div>

    {/* Highlight Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start gap-3"
        >
          <div className="size-8 rounded-lg bg-slate-200 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-24 bg-slate-200 rounded" />
            <div className="h-2.5 w-36 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Profile Slot Loading Component ───────────────────────────────
export default function ProfileLoading() {
  return (
    <div className="bg-slate-50/70 pb-8">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pt-6">
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Top Profile Card Skeleton (Left Avatar + Right Consultation Grid) */}
          <div className="w-full flex flex-col lg:flex-row items-stretch gap-5 lg:gap-6">
            <ProfileLeftCardSkeleton />
            <ProfileRightCardSkeleton />
          </div>

          {/* Bottom Rich Content Section Skeleton */}
          <ContentSectionSkeleton />
        </div>
      </div>
    </div>
  );
}
