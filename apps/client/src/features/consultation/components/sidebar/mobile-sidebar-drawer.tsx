"use client";

import React from "react";
import type { IExpert } from "@repo/lib";
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
import { EndConsultationAction } from "./end-consultation-action";
import { ContinueConsultationSection } from "./continue-consultation-section";
import { useRoomIdentity } from "../../providers/room-lifecycle.provider";
import { useRoomSession } from "../../providers/room-lifecycle.provider";
import { useRoomActions } from "../../providers/room-lifecycle.provider";
import { useSwitchToVoiceContext } from "../../providers/switch-to-voice.provider";
import { formatTime } from "../../utils/format-time";

/**
 * Mobile drawer for the consultation sidebar, expanding from left sheet on viewports < 768px.
 *
 * @param props - Drawer open state and toggle handler.
 * @returns Slide-over drawer element.
 */
export function MobileSidebarDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { expertData, roomConsultationId } = useRoomIdentity();
  const { elapsedTime, timeLeft, isSessionEnded } = useRoomSession();
  const { handleEndChat } = useRoomActions();
  const { handleUpgrade } = useSwitchToVoiceContext();

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
          <SidebarHeader router={require("@/i18n/navigation").useRouter()} />

          <ExpertProfileSection expertData={expertData} />

          <ConsultationModeSection />

          <SessionTimersSection
            formatTime={formatTime}
            elapsedTime={elapsedTime}
            timeLeft={timeLeft}
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
                onUpgrade={handleUpgrade}
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
