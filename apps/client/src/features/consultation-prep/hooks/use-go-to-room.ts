"use client";

import { useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@repo/design/shadcn";
import { useTranslations } from "next-intl";
import { type IExpert } from "@repo/lib";
import { useConsultationPrepStore } from "@/features/consultation-prep/stores/consultationPrepStore";

/**
 * Terminal step of a successful request: toast, close the prep modal,
 * and push the room deep link.
 *
 * NOTE: The consultation tracker is NOT set here. It is set by
 * `useRoomTrackerSync` when the consultation becomes ACTIVE (expert accepted),
 * not at initiation. This prevents the tracker from showing a running timer
 * while the room still shows "waiting for expert".
 *
 * @param expert - Accepted expert profile (for future use if needed).
 */
export function useGoToRoom(expert: Partial<IExpert> | null) {
  const router = useRouter();
  const t = useTranslations("Chat.page");

  const goToRoom = useCallback(
    (
      targetExpertId: string | number,
      sessionId: number,
      consultationId: number,
    ) => {
      toast.success(t("toastConnecting"));
      useConsultationPrepStore.getState().closeConsultationPrep();

      // Room mode + session resolve server-side (history session mode + live
      // state). Never carry `?mode=` / `?sessionId=` — stale after continue,
      // spoofable, and ignored.
      router.push(`/consultation/${consultationId}?expertId=${targetExpertId}`);

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(`chat:pending:${consultationId}`);
      }
    },
    [router, t, expert],
  );

  return goToRoom;
}
