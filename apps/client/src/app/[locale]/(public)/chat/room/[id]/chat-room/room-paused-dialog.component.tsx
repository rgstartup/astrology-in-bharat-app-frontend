"use client";

import { useEffect, useRef, useState } from "react";
import { WalletRechargeModal } from "@/features/dashboard/wallet";
import type { ChatPausedPayload } from "@/realtime/types/chat";

interface RoomPausedDialogProps {
  paused: ChatPausedPayload | null;
  onResume: () => void;
  onExit: () => void;
}

const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Balance-exhaustion pause overlay. Shows the consumed balance, offers wallet
 * recharge to resume, and ends the chat on any dismiss without a recharge.
 */
export default function RoomPausedDialog({ paused, onResume, onExit }: RoomPausedDialogProps) {
  const [now, setNow] = useState(() => Date.now());
  const rechargedRef = useRef(false);
  const deadlineRef = useRef(0);

  useEffect(() => {
    if (!paused) {
      rechargedRef.current = false;
      return;
    }
    rechargedRef.current = false;
    const expiresSec =
      typeof paused.pauseExpiresInSec === "number" && !isNaN(paused.pauseExpiresInSec)
        ? paused.pauseExpiresInSec
        : 300;
    const baseTime = paused.timestamp ? new Date(paused.timestamp).getTime() : Date.now();
    const validBaseTime = isNaN(baseTime) ? Date.now() : baseTime;
    deadlineRef.current = validBaseTime + expiresSec * 1000;
  }, [paused]);

  useEffect(() => {
    if (!paused) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [paused]);

  if (!paused) return null;

  const rawWait = Math.floor((deadlineRef.current - now) / 1000);
  const waitLeft = isNaN(rawWait) || rawWait < 0 ? 0 : rawWait;
  const consumed = Number(paused.consumedAmount) || 0;

  const handleOpenChange = (open: boolean) => {
    if (!open && !rechargedRef.current) {
      onExit();
    }
  };

  const banner = (
    <div className="flex flex-col gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-amber-900">
          {consumed > 0 ? `Used: ₹${consumed.toFixed(2)}` : "Free trial completed"}
        </span>
        <span className="font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full text-[11px]">
          Hold: {pad(Math.floor(waitLeft / 60))}:{pad(waitLeft % 60)}
        </span>
      </div>
      <p className="text-[11px] text-amber-800 leading-snug">
        Select a recharge pack below to resume your consultation immediately before the hold window expires.
      </p>
    </div>
  );

  return (
    <WalletRechargeModal
      isOpen={Boolean(paused)}
      onOpenChange={handleOpenChange}
      title="Balance Exhausted"
      subtitle="Your consultation is paused. Recharge to resume immediately."
      banner={banner}
      defaultAmount={100}
      onSuccess={() => {
        rechargedRef.current = true;
        onResume();
      }}
    />
  );
}
