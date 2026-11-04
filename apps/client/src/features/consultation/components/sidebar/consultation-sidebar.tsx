"use client";

import React from "react";
import type { IExpert } from "@repo/lib";
import { cn } from "@repo/design/cn";
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

/**
 * 25% (280-320px) persistent desktop sidebar for expert details, consultation controls,
 * grouped session timers, mode upgrade actions, and end consultation button.
 *
 * @returns Desktop sidebar element.
 */
export function ConsultationSidebar({
  className,
}: { className?: string } = {}) {
  const { expertData, roomConsultationId } = useRoomIdentity();
  const { elapsedTime, timeLeft, isSessionEnded } = useRoomSession();
  const voice = useVoiceContext();

  if (!expertData) return null;

  return (
    <aside
      className={cn(
        "hidden w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-[#d3cec6] bg-white p-5 md:flex",
        className,
      )}
    >
      {/* <SidebarHeader router={router} /> */}

      <ExpertProfileSection expertData={expertData} />

      {/* <ConsultationModeSection /> */}

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

          <div className="mt-auto pt-4 border-t border-[#f0ebe3]">
            <EndConsultationAction />
          </div>
        </>
      )}
    </aside>
  );
}
