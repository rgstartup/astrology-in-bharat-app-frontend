"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import type { IExpert } from "@repo/lib";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  EndSessionButton,
  ExpertIdentity,
  HeaderActions,
  SessionTimer,
} from "./header";

type HeaderProps = {
  router: ReturnType<typeof useRouter>;
  expertData: IExpert;
  isFree: boolean;
  sessionStatus: string;
  formatTime: (time: number) => string;
  elapsedTime: number;
  timeLeft: number;
  handleEndChat: (force?: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isWarning?: boolean;
};

type ActiveSessionRowProps = {
  sessionStatus: string;
  isFree: boolean;
  formatTime: (time: number) => string;
  elapsedTime: number;
  timeLeft: number;
  mounted: boolean;
  isWarning?: boolean;
  handleEndChat: (force?: boolean) => void;
};

function ActiveSessionRow({
  sessionStatus,
  isFree,
  formatTime,
  elapsedTime,
  timeLeft,
  mounted,
  isWarning = false,
  handleEndChat,
}: ActiveSessionRowProps) {
  if (sessionStatus !== "active") return null;

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-t border-primary-foreground/10 bg-black/10 px-3 py-1.5 md:hidden">
        <SessionTimer
          isFree={isFree}
          formatTime={formatTime}
          elapsedTime={elapsedTime}
          timeLeft={timeLeft}
          mounted={mounted}
          isWarning={isWarning}
          className="flex-1"
        />
        <EndSessionButton handleEndChat={handleEndChat} />
      </div>
      <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-5 md:flex">
        <SessionTimer
          isFree={isFree}
          formatTime={formatTime}
          elapsedTime={elapsedTime}
          timeLeft={timeLeft}
          mounted={mounted}
          isWarning={isWarning}
        />
        <EndSessionButton handleEndChat={handleEndChat} />
      </div>
    </>
  );
}

export default function Header({
  router,
  expertData,
  isFree,
  sessionStatus,
  formatTime,
  elapsedTime,
  timeLeft,
  handleEndChat,
  isDarkMode,
  setIsDarkMode,
  isWarning = false,
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!expertData) return null;

  return (
    <header className="sticky top-0 z-20 w-full shrink-0 border-b border-border bg-primary shadow-lg">
      <div className="flex items-center justify-between px-2 py-1.5 md:px-8">
        <div className="flex items-center gap-1.5 md:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 text-primary-foreground hover:bg-black/10 hover:text-primary-foreground"
            onClick={() => router.back()}
          >
            <ChevronLeft data-icon="inline-start" />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Back</span>
          </Button>
          <Separator orientation="vertical" className="h-6 bg-primary-foreground/20" />
          <ExpertIdentity expertData={expertData} isFree={isFree} sessionStatus={sessionStatus} />
        </div>
        <HeaderActions router={router} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>
      <ActiveSessionRow
        sessionStatus={sessionStatus}
        isFree={isFree}
        formatTime={formatTime}
        elapsedTime={elapsedTime}
        timeLeft={timeLeft}
        mounted={mounted}
        isWarning={isWarning}
        handleEndChat={handleEndChat}
      />
    </header>
  );
}
