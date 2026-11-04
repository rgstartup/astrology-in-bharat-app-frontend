"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@repo/design/shadcn";
import { SidebarHeader } from "./sidebar-header";
import { ExpertProfileSection } from "./expert-profile-section";
import { ConsultationModeSection } from "./consultation-mode-section";
import { SessionTimersSection } from "./session-timers-section";
import { UpgradeConsultationSection } from "./upgrade-consultation-section";
import { EndConsultationAction } from "../dialog/end-consultation-action.dialog";
import { ContinueConsultationSection } from "./continue-consultation-section";
import { useRoomIdentity } from "../../providers/room-lifecycle";
import { useRoomSession } from "../../providers/room-lifecycle";
import { useVoiceContext } from "../../providers/voice.provider";
import { formatTime } from "../../utils/format-time";

export type MobileSidebarDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Mobile drawer for the consultation sidebar, expanding from left sheet on viewports < 768px.
 *
 * @param props - Drawer open state and toggle handler.
 * @returns Slide-over drawer element.
 */
export function MobileSidebarDrawer({
  open,
  onOpenChange,
}: MobileSidebarDrawerProps) {
  const { expertData, roomConsultationId } = useRoomIdentity();
  const { elapsedTime, timeLeft, isSessionEnded } = useRoomSession();
  const voice = useVoiceContext();

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
          <SidebarHeader />

          <ExpertProfileSection expertData={expertData} />

          <ConsultationModeSection />

          <SessionTimersSection
            formatTime={formatTime}
            elapsedTime={elapsedTime}
            timeLeft={timeLeft ?? 0}
          />

          {isSessionEnded ? (
            <ContinueConsultationSection
              expertData={expertData}
              consultationId={roomConsultationId}
            />
          ) : (
            <>
              <UpgradeConsultationSection
                expertData={expertData}
                onUpgrade={voice.handleUpgrade}
              />

              <div className="pt-4 border-t border-[#f0ebe3]">
                <EndConsultationAction />
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
