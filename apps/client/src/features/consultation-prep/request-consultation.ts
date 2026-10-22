"use client";

import type { ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { PATHS } from "@repo/routes";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import {
  useConsultationPrepStore,
  type ConsultationMode,
} from "@/store/consultationPrepStore";

export interface RequestConsultationDeps {
  isAuthenticated: boolean;
  pathname: string;
  push: (url: string) => void;
  loginTitle: ReactNode;
  loginActionLabel: ReactNode;
  mode?: ConsultationMode;
}

/**
 * Entry point to request a consultation with an expert.
 * Opens the prep modal in the requested mode when logged in,
 * otherwise stashes the pending expert & mode and shows a login prompt toast.
 *
 * @param expertId - Identifier of the expert.
 * @param deps - Navigation and authentication dependencies.
 * @param mode - Requested consultation mode ('chat' | 'voice' | 'video'). Defaults to 'chat'.
 */
export function requestConsultationPrep(
  expertId: string,
  deps: RequestConsultationDeps,
  mode: ConsultationMode = "chat",
): void {
  const { isAuthenticated, pathname, push, loginTitle, loginActionLabel } =
    deps;
  const effectiveMode = deps.mode ?? mode;

  if (isAuthenticated) {
    useConsultationPrepStore
      .getState()
      .openConsultationPrep(expertId, effectiveMode);
    return;
  }

  useConsultationPrepStore.getState().setPendingExpert(expertId, effectiveMode);
  const returnTo = pathname === "/" ? "/#our-experts" : pathname;
  const id = toast.warning(loginTitle, {
    action: {
      label: loginActionLabel,
      onClick: () => {
        toast.dismiss(id);
        push(withCallbackUrl(PATHS.LOGIN, returnTo));
      },
    },
  });
}
