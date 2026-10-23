"use client";

import React from "react";
import { useRouter } from "@/i18n/navigation";
import type { IExpert } from "@repo/lib";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarHeader } from "./sidebar-header.component";
import { ExpertProfileSection } from "./expert-profile-section.component";
import { ConsultationModeSection } from "./consultation-mode-section.component";
import { SessionTimersSection } from "./session-timers-section.component";
import { UpgradeConsultationSection } from "./upgrade-consultation-section.component";
import { EndConsultationAction } from "./end-consultation-action.component";
import { ContinueConsultationSection } from "./continue-consultation-section.component";

export type MobileSidebarDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expertData: IExpert;
  sessionStatus?: string;
  formatTime: (time: number) => string;
  elapsedTime: number;
  timeLeft: number;
  handleEndChat: (force?: boolean) => void;
  isWarning?: boolean;
  router: ReturnType<typeof useRouter>;
  onUpgrade?: (mode: "voice" | "video") => void;
  isSessionEnded?: boolean;
  consultationId: number | null;
};

/**
 * Mobile drawer for the consultation sidebar, expanding from left sheet on viewports < 768px.
 *
 * @param props - MobileSidebarDrawerProps
 * @returns Slide-over drawer element.
 */
export function MobileSidebarDrawer({
  open,
  onOpenChange,
  expertData,
  formatTime,
  elapsedTime,
  timeLeft,
  handleEndChat,
  isWarning = false,
  router,
  onUpgrade,
  isSessionEnded = false,
  consultationId,
}: MobileSidebarDrawerProps) {
  if (!expertData) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[300px] overflow-y-auto bg-white p-5 sm:w-[340px]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Consultation controls</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <SidebarHeader router={router} />

          <ExpertProfileSection expertData={expertData} />

          <ConsultationModeSection />

          <SessionTimersSection
            formatTime={formatTime}
            elapsedTime={elapsedTime}
            timeLeft={timeLeft}
            isWarning={isWarning}
          />

          {isSessionEnded ? (
            <ContinueConsultationSection
              expertData={expertData}
              consultationId={consultationId}
            />
          ) : (
            <>
              <UpgradeConsultationSection
                expertData={expertData}
                onUpgrade={onUpgrade}
              />

              <div className="pt-4 border-t border-[#f0ebe3]">
                <EndConsultationAction
                  handleEndChat={(force) => {
                    onOpenChange(false);
                    handleEndChat(force);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
