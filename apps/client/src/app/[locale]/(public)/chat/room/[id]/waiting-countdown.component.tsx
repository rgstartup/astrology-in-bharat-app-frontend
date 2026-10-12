"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    const calculateSeconds = () => {
      const diff = Math.floor(
        (new Date(expiresAt).getTime() - Date.now()) / 1000,
      );
      if (diff <= 0) {
        setSecondsLeft(0);
        setTimeout(onExpire, 1000); // Small buffer before showing ended state
        return true; // Finished
      } else {
        setSecondsLeft(diff);
        return false;
      }
    };

    const finished = calculateSeconds();
    if (finished) return;

    const interval = setInterval(() => {
      if (calculateSeconds()) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="flex flex-col items-center gap-1">
      <Badge variant="secondary">
        <Clock />
        <span className="tabular-nums">
          Auto-Expires in {mounted ? `${mins}:${secs.toString().padStart(2, "0")}` : "--:--"}
        </span>
      </Badge>
    </div>
  );
}
