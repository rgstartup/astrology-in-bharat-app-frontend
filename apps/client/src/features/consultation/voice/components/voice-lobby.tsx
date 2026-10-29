"use client";

import React from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExpertProfileSection } from "@/features/consultation/sidebar";
import type { IExpert } from "@repo/lib";

type VoiceLobbyProps = {
  expertData: IExpert;
  voiceRate: number;
  onCancel: () => void;
  className?: string;
};

/**
 * Single lobby step row.
 *
 * @param props - Step number and copy.
 * @returns Step row element.
 */
function LobbyStep({ index, title, detail }: { index: number; title: string; detail: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#d3cec6] bg-white text-xs font-semibold text-[#111111]">
        {index}
      </span>
      <span className="flex flex-col">
        <span className="text-[13px] font-medium text-[#111111]">{title}</span>
        <span className="text-xs text-[#7b7b78]">{detail}</span>
      </span>
    </li>
  );
}

/**
 * Voice-first lobby. Shown when the client booked voice directly and the
 * expert has not joined yet. There is no chat history in this entry path,
 * so the lobby sets expectations instead of preserving context.
 *
 * @param props - Expert data, voice rate, and cancel handler.
 * @returns Voice lobby element.
 */
export function VoiceLobby({ expertData, voiceRate, onCancel, className }: VoiceLobbyProps) {
  if (!expertData) return null;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f5f1ec]", className)}>
      <div className="flex items-center justify-center gap-1.5 border-b border-[#d3cec6] bg-white px-4 py-2">
        <span className="size-2 animate-pulse rounded-full bg-[#7b7b78]" />
        <Phone className="size-3 text-[#7b7b78]" />
        <span className="text-xs font-medium text-[#626260]">Voice session booked</span>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-8">
        <div className="rounded-xl border border-[#d3cec6] bg-white p-5 shadow-none">
          <ExpertProfileSection expertData={expertData} />
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="flex items-center gap-1 font-sans text-base font-medium text-[#111111]">
            <span>Waiting for the expert to join</span>
            <span aria-hidden="true" className="flex gap-0.5">
              <span className="size-1 animate-bounce rounded-full bg-[#111111]" />
              <span className="size-1 animate-bounce rounded-full bg-[#111111] [animation-delay:150ms]" />
              <span className="size-1 animate-bounce rounded-full bg-[#111111] [animation-delay:300ms]" />
            </span>
          </p>
          <p className="rounded-full border border-[#d3cec6] bg-white px-3 py-1 text-xs font-semibold text-[#111111] tabular-nums">
            Voice rate Rs.{voiceRate} per min
          </p>
          <p className="text-[13px] text-[#626260]">
            Billing starts only when the expert joins. Nothing is charged while you wait.
          </p>
        </div>

        <div className="rounded-xl border border-[#d3cec6] bg-white p-4 shadow-none">
          <p className="pb-3 text-[13px] font-medium text-[#7b7b78]">What happens next</p>
          <ol className="flex list-none flex-col gap-3 p-0">
            <LobbyStep
              index={1}
              title="Expert joins the call"
              detail="Usually within a minute of booking."
            />
            <LobbyStep
              index={2}
              title="Talk freely"
              detail="Chat stays open for sharing birth details or photos."
            />
            <LobbyStep
              index={3}
              title="Summary and billing"
              detail="Session summary appears when the call ends."
            />
          </ol>
        </div>

        <Button
          variant="outline"
          onClick={onCancel}
          className="h-12 rounded-full border-[#d3cec6] bg-white px-7 text-base font-medium text-[#111111] hover:bg-[#f5f1ec]"
        >
          Cancel session
        </Button>
      </div>
    </div>
  );
}
