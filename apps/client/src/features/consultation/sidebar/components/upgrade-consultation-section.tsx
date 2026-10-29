"use client";

import React, { useState } from "react";
import { ArrowUpRight, Phone, Sparkles, Video } from "lucide-react";
import type { IExpert } from "@repo/lib";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type UpgradeConsultationSectionProps = {
  expertData: IExpert;
  className?: string;
  onUpgrade?: (mode: "voice" | "video") => void;
};

type UpgradeMode = "voice" | "video" | null;

/**
 * Resolves per-minute rates for voice and video channels with safe fallbacks.
 *
 * @param expert - Expert profile data.
 * @returns Rates in INR.
 */
function resolveUpgradeRates(expert: IExpert) {
  const dynamic = expert as Record<string, unknown>;
  const voiceRate =
    expert.pricing?.call_price ??
    (typeof dynamic.call_price === "number" ? dynamic.call_price : 30);
  const videoRate =
    expert.pricing?.video_call_price ??
    (typeof dynamic.video_call_price === "number" ? dynamic.video_call_price : 50);
  const chatRate =
    expert.pricing?.chat_price ??
    (typeof dynamic.chat_price === "number" ? dynamic.chat_price : 25);

  return { voiceRate, videoRate, chatRate };
}

/**
 * Modal title for selected upgrade channel.
 *
 * @param mode - Target mode.
 * @returns Title string.
 */
function getModalTitle(mode: UpgradeMode): string {
  if (mode === "voice") return "Upgrade to voice consultation";
  if (mode === "video") return "Upgrade to video consultation";
  return "Upgrade consultation";
}

/**
 * Modal subtitle for selected upgrade channel.
 *
 * @param mode - Target mode.
 * @returns Subtitle string.
 */
function getModalDescription(mode: UpgradeMode, expertName: string): string {
  if (mode === "voice") {
    return `Switch this chat consultation to an audio phone call with ${expertName}.`;
  }
  if (mode === "video") {
    return `Switch this chat consultation to a face-to-face video session with ${expertName}.`;
  }
  return "Switch consultation channel.";
}

/**
 * Target channel rate display for the modal.
 *
 * @param mode - Target mode.
 * @param rates - Resolved rates.
 * @returns Rate in INR.
 */
function getTargetRate(mode: UpgradeMode, rates: { voiceRate: number; videoRate: number }): number {
  if (mode === "voice") return rates.voiceRate;
  return rates.videoRate;
}

/**
 * Upgrade consultation block offering voice and video mode upgrades with confirmation modal.
 *
 * @param props - Expert data, styling class, and upgrade callback.
 * @returns Upgrade consultation element.
 */
export function UpgradeConsultationSection({
  expertData,
  className,
  onUpgrade,
}: UpgradeConsultationSectionProps) {
  const [selectedMode, setSelectedMode] = useState<UpgradeMode>(null);
  const rates = resolveUpgradeRates(expertData);

  function handleConfirmUpgrade() {
    if (selectedMode && onUpgrade) {
      onUpgrade(selectedMode);
    }
    setSelectedMode(null);
  }

  const isDialogOpen = selectedMode !== null;
  const targetRate = getTargetRate(selectedMode, rates);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7b7b78]">
          <Sparkles className="size-3 text-amber-500" />
          UPGRADE CONSULTATION
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {/* Voice Option */}
        <button
          type="button"
          onClick={() => setSelectedMode("voice")}
          className="group flex items-center justify-between rounded-xl border border-[#d3cec6] bg-white p-3 text-left transition-all hover:border-neutral-400 hover:shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Phone className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#111111] group-hover:text-emerald-700">
                Upgrade to voice
              </span>
              <span className="text-[11px] text-[#7b7b78]">
                Audio conversation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-[#f5f1ec] px-2 py-0.5 text-[11px] font-bold tabular-nums text-[#111111]">
              ₹{rates.voiceRate}/min
            </span>
            <ArrowUpRight className="size-3.5 text-neutral-400 group-hover:text-neutral-700" />
          </div>
        </button>

        {/* Video Option */}
        <button
          type="button"
          onClick={() => setSelectedMode("video")}
          className="group flex items-center justify-between rounded-xl border border-[#d3cec6] bg-white p-3 text-left transition-all hover:border-neutral-400 hover:shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Video className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#111111] group-hover:text-blue-700">
                Upgrade to video
              </span>
              <span className="text-[11px] text-[#7b7b78]">
                Face-to-face conversation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-[#f5f1ec] px-2 py-0.5 text-[11px] font-bold tabular-nums text-[#111111]">
              ₹{rates.videoRate}/min
            </span>
            <ArrowUpRight className="size-3.5 text-neutral-400 group-hover:text-neutral-700" />
          </div>
        </button>
      </div>

      {/* Confirmation Dialog with pricing details */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && setSelectedMode(null)}>
        <DialogContent className="rounded-xl border border-[#d3cec6] bg-white">
          <DialogHeader>
            <DialogTitle className="font-sans text-[#111111]">
              {getModalTitle(selectedMode)}
            </DialogTitle>
            <DialogDescription className="font-sans text-[#626260]">
              {getModalDescription(selectedMode, expertData.name)}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-[#f0ebe3] bg-[#fdfbf9] p-4 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-[#7b7b78]">Current chat rate:</span>
              <span className="font-semibold text-[#111111]">₹{rates.chatRate} / min</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#f0ebe3] py-1.5 font-bold">
              <span className="text-[#111111]">New upgraded rate:</span>
              <span className="text-sm font-bold text-emerald-700">₹{targetRate} / min</span>
            </div>
            <p className="mt-2 text-[11px] text-[#7b7b78]">
              Your session time will continue seamlessly without interruption. The new per-minute rate takes effect upon connection.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              className="rounded-lg text-[#626260] hover:bg-[#f5f1ec] hover:text-[#111111]"
              onClick={() => setSelectedMode(null)}
            >
              Keep in chat
            </Button>
            <Button
              className="rounded-lg bg-[#111111] font-medium text-white hover:bg-[#111111]/90"
              onClick={handleConfirmUpgrade}
            >
              Confirm upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
