"use client";

import { ConsultationTrackerAvatar } from "./consultation-tracker-avatar.component";
import { ConsultationTrackerStatus } from "./consultation-tracker-status.component";
import { ConsultationTrackerElapsed } from "./consultation-tracker-elapsed.component";
import { ConsultationTrackerActions } from "./consultation-tracker-actions.component";

export type ConsultationTrackerCardProps = {
  onReturn: () => void;
};

/**
 * Floating tracker card shown outside the chat room while a consultation
 * is live. White tile on a hairline border with a live/paused pill, a
 * ticking session clock, and a return-to-room action.
 */
export function ConsultationTrackerCard({
  onReturn,
}: ConsultationTrackerCardProps) {
  return (
    <div className="w-[320px] max-w-[calc(100vw-2rem)] rounded-xl border border-[#e3ded6] bg-white p-4 shadow-xl shadow-slate-900/10">
      <div className="flex items-center gap-3">
        <ConsultationTrackerAvatar />
        <div className="min-w-0 flex-1">
          <ConsultationTrackerStatus />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="text-xs font-normal text-slate-500">Session time</span>
        <ConsultationTrackerElapsed />
      </div>
      <ConsultationTrackerActions onReturn={onReturn} />
    </div>
  );
}
