"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  expertName: string;
  rejected: boolean;
  secondsLeft: number;
  totalSeconds: number;
  onCancel: () => void;
  onClose: () => void;
};

const formatLeft = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
};

/** Minimal waiting / declined modal. Wave dots while waiting, quiet text actions. */
export function ChatWaitingModal({
  open,
  expertName,
  rejected,
  secondsLeft,
  totalSeconds,
  onCancel,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open || !rejected) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [open, rejected, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={rejected ? onClose : undefined} />
      <div className="relative w-full max-w-xs rounded-2xl border border-stone-200 bg-white px-6 py-6 text-center shadow-lg">
        {rejected ? (
          <>
            <p className="text-sm font-semibold text-stone-900">Expert declined</p>
            <p className="mt-1 text-xs text-stone-500">
              {expertName} can&apos;t take your request right now. No charges were applied.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </>
        ) : (
          <>
            <div
              className="flex items-center justify-center gap-1.5 py-1"
              role="status"
              aria-label="Waiting for expert"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{ animationDelay: `${i * 180}ms` }}
                  className="size-2 rounded-full bg-stone-400 animate-bounce motion-reduce:animate-none"
                />
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-900">
              Waiting for {expertName}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Request sent · you&apos;ll enter the room automatically on accept.
            </p>
            <div className="mt-4">
              <div
                className="h-1 overflow-hidden rounded-full bg-stone-100"
                role="progressbar"
                aria-label="Time left for expert to respond"
                aria-valuemin={0}
                aria-valuemax={totalSeconds}
                aria-valuenow={secondsLeft}
              >
                <div
                  className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
                    secondsLeft <= 15 ? "bg-red-500" : "bg-stone-800"
                  }`}
                  style={{
                    width: `${totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="mt-1.5 text-[11px] tabular-nums text-stone-400">
                {formatLeft(secondsLeft)} left
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="mt-4 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Cancel request
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
