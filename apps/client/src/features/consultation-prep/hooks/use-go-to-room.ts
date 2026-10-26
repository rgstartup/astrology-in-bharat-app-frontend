"use client";

import { useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { type IExpert } from "@repo/lib";
import { useConsultationPrepStore } from "@/store/consultationPrepStore";
import { useConsultationTrackerStore } from "@/store/consultationTrackerStore";

/**
 * Terminal step of a successful request: toast, close the prep modal, seed
 * the floating tracker, and push the room deep link.
 *
 * @param expert - Accepted expert profile (tracker display fields).
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
      useConsultationTrackerStore.getState().setSession({
        consultationId,
        sessionId,
        expertId: String(targetExpertId),
        expertName: expert?.name ?? `Expert ${targetExpertId}`,
        expertAvatar: expert?.avatar ?? null,
        startedAt: new Date().toISOString(),
        paused: false,
      });

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
