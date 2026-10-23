"use client";

import React, { useState } from "react";
import { MessageCircle, Phone, Video } from "lucide-react";
import type { IExpert } from "@repo/lib";
import { cn } from "@/lib/utils";
import { resolveModePrice } from "@/lib/pricing";
import { ConsultationPrepModal } from "@/features/consultation-prep/components/consultation-prep-modal/consultation-prep-modal.root";
import type { ConsultationMode } from "@/store/consultationPrepStore";

type ContinueConsultationSectionProps = {
  expertData: IExpert;
  consultationId: number | null;
  className?: string;
};

export function ContinueConsultationSection({
  expertData,
  consultationId,
  className,
}: ContinueConsultationSectionProps) {
  const [mode, setMode] = useState<ConsultationMode | null>(null);
  const [open, setOpen] = useState(false);

  const start = (m: ConsultationMode) => {
    setMode(m);
    setOpen(true);
  };

  const rates = {
    chat: resolveModePrice(expertData, "chat") || 25,
    voice: resolveModePrice(expertData, "voice") || 30,
    video: resolveModePrice(expertData, "video") || 50,
  };

  const options: {
    mode: ConsultationMode;
    label: string;
    icon: React.ElementType;
    rate: number;
  }[] = [
    { mode: "chat", label: "Continue via chat", icon: MessageCircle, rate: rates.chat },
    { mode: "voice", label: "Continue via voice", icon: Phone, rate: rates.voice },
    { mode: "video", label: "Continue via video", icon: Video, rate: rates.video },
  ];

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7b7b78]">
          CONTINUE CONSULTATION
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => start(opt.mode)}
              className="group flex items-center justify-between rounded-xl border border-[#d3cec6] bg-white p-3 text-left transition-all hover:border-neutral-400 hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f1ec]">
                  <Icon className="size-4 text-[#111111]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#111111]">
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-[#7b7b78]">
                    New session with {expertData.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-md bg-[#f5f1ec] px-2 py-0.5 text-[11px] font-bold tabular-nums text-[#111111]">
                  ₹{opt.rate}/min
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {mode && (
        <ConsultationPrepModal
          expertId={String(expertData.id)}
          mode={mode}
          open={open}
          onOpenChange={setOpen}
          autoStart
          consultationId={consultationId}
        />
      )}
    </div>
  );
}