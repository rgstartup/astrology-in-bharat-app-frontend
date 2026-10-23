"use client";

import React from "react";
import { useRouter } from "@/i18n/navigation";
import type { IExpert } from "@repo/lib";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./sidebar-header.component";
import { ExpertProfileSection } from "./expert-profile-section.component";
import { ConsultationModeSection } from "./consultation-mode-section.component";
import { SessionTimersSection } from "./session-timers-section.component";
import { UpgradeConsultationSection } from "./upgrade-consultation-section.component";
import { EndConsultationAction } from "./end-consultation-action.component";
import { ContinueConsultationSection } from "./continue-consultation-section.component";

export type ConsultationSidebarProps = {
  expertData: IExpert;
  sessionStatus?: string;
  formatTime: (time: number) => string;
  elapsedTime: number;
  timeLeft: number;
  handleEndChat: (force?: boolean) => void;
  isWarning?: boolean;
  onUpgrade?: (mode: "voice" | "video") => void;
  isSessionEnded?: boolean;
  consultationId: number | null;
  className?: string;
};

/**
 * 25% (280-320px) persistent desktop sidebar for expert details, consultation controls,
 * grouped session timers, mode upgrade actions, and end consultation button.
 *
 * @param props - ConsultationSidebarProps
 * @returns Desktop sidebar element.
 */
export function ConsultationSidebar({
  expertData,
  formatTime,
  elapsedTime,
  timeLeft,
  handleEndChat,
  isWarning = false,
  onUpgrade,
  isSessionEnded = false,
  consultationId,
  className,
}: ConsultationSidebarProps) {
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
          <UpgradeConsultationSection expertData={expertData} onUpgrade={onUpgrade} />

          <div className="mt-auto pt-4 border-t border-[#f0ebe3]">
            <EndConsultationAction handleEndChat={handleEndChat} />
          </div>
        </>
      )}
    </aside>
  );
}
