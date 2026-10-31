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

function ConsumedLabel({ consumed }: { consumed: number }) {
  if (consumed > 0) return <span className="font-sans font-semibold text-[#111111]">{`Used: ₹${consumed.toFixed(2)}`}</span>;
  return <span className="font-sans font-semibold text-[#111111]">Free trial completed</span>;
}

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
    <div className="flex flex-col gap-2 rounded-xl border border-[#d3cec6] bg-[#ffffff] p-3 shadow-none">
      <div className="flex items-center justify-between text-xs">
        <ConsumedLabel consumed={consumed} />
        <span className="rounded-full border border-[#c41c1c]/40 bg-[#ffffff] px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums text-[#c41c1c]">
          Hold: {pad(Math.floor(waitLeft / 60))}:{pad(waitLeft % 60)}
        </span>
      </div>
      <p className="font-sans text-[11px] leading-snug text-[#626260]">
        Select a recharge pack below to resume your consultation immediately before the hold window expires.
      </p>
    </div>
  );

  return (
    <WalletRechargeModal
      isOpen={Boolean(paused)}
      onOpenChange={handleOpenChange}
      title="Balance exhausted"
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
