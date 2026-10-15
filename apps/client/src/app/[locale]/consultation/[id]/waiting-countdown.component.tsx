"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function CountdownText({
  mounted,
  mins,
  secs,
}: {
  mounted: boolean;
  mins: number;
  secs: number;
}) {
  if (!mounted) return <span className="tabular-nums">Auto-expires in --:--</span>;
  return (
    <span className="tabular-nums">
      Auto-expires in {mins}:{secs.toString().padStart(2, "0")}
    </span>
  );
}

/**
 * Ticking request-window countdown. Fires `onExpire` once, ~1s after the
 * deadline passes. The delayed fire is always cancelled on unmount or when
 * `expiresAt` changes, so a banner that unmounts (room went active after a
 * rejoin) can never redirect afterwards (bug-072).
 */
export default function WaitingCountdown({
  expiresAt,
  onExpire,
}: {
  expiresAt: string;
  onExpire: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;
    const calculateSeconds = () => {
      const diff = Math.floor(
        (new Date(expiresAt).getTime() - Date.now()) / 1000,
      );
      if (diff <= 0) {
        setSecondsLeft(0);
        timeout = setTimeout(onExpire, 1000); // Small buffer before showing ended state
        return true; // Finished
      } else {
        setSecondsLeft(diff);
        return false;
      }
    };

    const finished = calculateSeconds();
    if (!finished) {
      interval = setInterval(() => {
        if (calculateSeconds()) {
          if (interval) clearInterval(interval);
        }
      }, 1000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [expiresAt, onExpire]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="flex flex-col items-center gap-1">
      <Badge
        variant="secondary"
        className="border border-[#d3cec6] bg-[#ffffff] font-sans text-[#626260] shadow-none hover:bg-[#ffffff]"
      >
        <Clock className="text-[#626260]" />
        <CountdownText mounted={mounted} mins={mins} secs={secs} />
      </Badge>
    </div>
  );
}
