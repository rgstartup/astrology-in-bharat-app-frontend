"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import type { IExpert } from "@repo/lib";
import { BackAffordance } from "./back-affordance";
import { EndSessionButton } from "./end-session-button";
import { ExpertIdentity } from "./expert-identity";
import { SessionMetrics } from "./session-metrics";

export type HeaderProps = {
  router: ReturnType<typeof useRouter>;
  expertData: IExpert;
  isFree: boolean;
  sessionStatus?: string;
  formatTime: (time: number) => string;
  elapsedTime: number;
  timeLeft: number;
  handleEndChat: (force?: boolean) => void;
  isWarning?: boolean;
  rate?: number;
};

/**
 * Header component for chat room consultation.
 * Renders back affordance and compact card housing expert identity,
 * the two session timing metrics alongside, and end session action.
 *
 * @param props - HeaderProps
 * @returns Header JSX layout.
 */
export default function Header({
  router,
  expertData,
  isFree,
  formatTime,
  elapsedTime,
  timeLeft,
  handleEndChat,
  isWarning = false,
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!expertData) return null;

  return (
    <header className="sticky top-0 z-20 w-full shrink-0 bg-[#f5f1ec] px-3 pt-3 pb-2 md:px-6 md:pt-4 md:pb-3">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2">
        <BackAffordance router={router} />

        <div className="flex flex-col gap-3 rounded-xl border border-[#d3cec6] bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:rounded-2xl md:px-5 md:py-3.5">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <ExpertIdentity
              expertData={expertData}
              isFree={isFree}
              className="min-w-0 flex-1"
            />
            <div className="flex shrink-0 items-center sm:hidden">
              <EndSessionButton handleEndChat={handleEndChat} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#f0ebe3] pt-2.5 sm:border-0 sm:pt-0 sm:gap-4 md:gap-6">
            <SessionMetrics
              isFree={isFree}
              formatTime={formatTime}
              elapsedTime={elapsedTime}
              timeLeft={timeLeft}
              mounted={mounted}
              isWarning={isWarning}
            />
            <div className="hidden shrink-0 items-center sm:flex">
              <EndSessionButton handleEndChat={handleEndChat} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
