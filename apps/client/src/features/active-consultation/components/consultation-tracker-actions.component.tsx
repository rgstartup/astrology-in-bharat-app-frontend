"use client";

import { ArrowRight } from "lucide-react";

type TrackerActionsProps = {
  onReturn: () => void;
};

/**
 * Return-to-room action for the tracker card. The label stays mode-neutral
 * ("session" covers chat, voice, and video); ending a session stays
 * inside the room itself — the tracker only routes the client back.
 *
 * @param onReturn - Navigates back to the consultation room.
 */
export function ConsultationTrackerActions({ onReturn }: TrackerActionsProps) {
  return (
    <button
      type="button"
      onClick={onReturn}
      className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-900 text-sm font-semibold text-white transition-colors hover:bg-black"
    >
      Return to session
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
