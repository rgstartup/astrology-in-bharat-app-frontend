"use client";

import React, { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import ConsultationPrepModal from "../modal";
import { useConsultationPrepStore } from "@/features/consultation-prep/stores/consultationPrepStore";
import { useAuthStore } from "@/store/authStore";

/**
 * Checks whether the current pathname is an authentication or onboarding route.
 * Matches `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`, `/onboarding`.
 *
 * @param pathname - Locale-stripped pathname from `usePathname`.
 * @returns True when inside an authentication or onboarding route.
 */
function isAuthRoute(pathname: string): boolean {
  if (!pathname) return false;
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/verify-email" ||
    pathname.startsWith("/verify-email/") ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/forgot-password/") ||
    pathname === "/reset-password" ||
    pathname.startsWith("/reset-password/") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/")
  );
}

/**
 * Root host component mounted in the root layout.
 * Listens to global consultation prep store state and renders the preparation modal
 * with the selected expert and mode. Re-opens pending consultation requests upon login
 * once the user has navigated away from auth routes to their target destination.
 *
 * Rendered on ALL routes — including the consultation room, where the
 * in-room "continue consultation" CTA opens this same global modal.
 *
 * @returns Preparation modal element or null when inactive or on auth routes.
 */
export default function ConsultationPrepHost() {
  const pathname = usePathname();
  const expertId = useConsultationPrepStore((s) => s.expertId);
  const mode = useConsultationPrepStore((s) => s.mode);
  const consultationId = useConsultationPrepStore((s) => s.consultationId);
  const isOpen = useConsultationPrepStore((s) => s.isOpen);
  const setConsultationPrepOpen = useConsultationPrepStore(
    (s) => s.setConsultationPrepOpen,
  );
  const pendingExpertId = useConsultationPrepStore((s) => s.pendingExpertId);
  const pendingMode = useConsultationPrepStore((s) => s.pendingMode);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    // Never auto-open while user is on an auth or onboarding screen
    if (isAuthRoute(pathname)) {
      return;
    }

    if (isAuthenticated && pendingExpertId) {
      useConsultationPrepStore
        .getState()
        .openConsultationPrep(pendingExpertId, pendingMode);
    }
  }, [isAuthenticated, pendingExpertId, pendingMode, pathname]);

  if (isAuthRoute(pathname)) {
    return null;
  }

  if (!expertId) return null;

  return (
    <ConsultationPrepModal
      expertId={expertId}
      mode={mode}
      open={isOpen}
      onOpenChange={setConsultationPrepOpen}
      consultationId={consultationId}
    />
  );
}
