"use client";

import React, { useState } from "react";
import { CheckCircle2, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  ClientIntakeProfile,
  ConsultationSummaryReport,
  ExpertConsultationMetrics,
  ExpertSessionPhase,
} from "./types";
import { formatDuration } from "./types";
import { ExpertVoiceHero } from "./expert-voice-hero.component";
import { ExpertVoiceControls } from "./expert-voice-controls.component";
import { ExpertClientIntakeDrawer } from "./expert-client-intake-drawer.component";

export interface ExpertVoiceStageProps {
  client: ClientIntakeProfile;
  phase: ExpertSessionPhase;
  metrics: ExpertConsultationMetrics;
  isClientSpeaking?: boolean;
  muted?: boolean;
  onToggleMute?: () => void;
  speakerMuted?: boolean;
  onToggleSpeaker?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onEndCall: () => void;
  onSwitchToChat?: () => void;
  onReturnToDashboard?: () => void;
  summaryReport?: ConsultationSummaryReport | null;
  className?: string;
}

/**
 * Top security strip for expert consultation.
 */
function ExpertSecureStrip() {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-[#d3cec6] bg-white px-4 py-2 text-xs">
      <span className="size-2 rounded-full bg-[#0bdf50]" />
      <ShieldCheck className="size-3.5 text-[#626260]" />
      <span className="font-medium text-[#626260]">
        Voice encrypted · Live consultation ledger active
      </span>
    </div>
  );
}

/**
 * Summary panel shown to the astrologer when the consultation ends.
 */
function ExpertSessionEndedPanel({
  metrics,
  client,
  summaryReport,
  onReturnToDashboard,
  onSwitchToChat,
}: {
  metrics: ExpertConsultationMetrics;
  client: ClientIntakeProfile;
  summaryReport?: ConsultationSummaryReport | null;
  onReturnToDashboard?: () => void;
  onSwitchToChat?: () => void;
}) {
  const duration = summaryReport?.durationSeconds ?? metrics.elapsedSeconds;
  const gross =
    summaryReport?.grossEarned ??
    Math.round((duration / 60) * metrics.ratePerMinute);
  const fee = summaryReport?.platformFee ?? Math.round(gross * 0.15);
  const net = summaryReport?.netPayout ?? gross - fee;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-200">
        <CheckCircle2 className="size-7" />
      </div>

      <h3 className="font-sans text-xl font-bold text-[#111111]">
        Consultation Completed
      </h3>
      <p className="mt-1 text-sm text-[#626260]">
        Session with {client.name} has concluded successfully.
      </p>

      {/* Financial Breakdown Card */}
      <div className="my-6 w-full max-w-sm rounded-2xl border border-[#d3cec6] bg-white p-5 shadow-xs text-left space-y-3">
        <div className="flex justify-between items-center text-xs text-[#7b7b78]">
          <span>Duration</span>
          <span className="font-mono font-semibold text-[#111111]">
            {formatDuration(duration)}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#7b7b78]">
          <span>Billing Rate</span>
          <span className="font-semibold text-[#111111]">
            ₹{metrics.ratePerMinute}/min
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#7b7b78]">
          <span>Gross Earnings</span>
          <span className="font-semibold text-[#111111]">₹{gross}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#7b7b78]">
          <span>Platform Fee (15%)</span>
          <span className="text-[#c13515]">- ₹{fee}</span>
        </div>
        <div className="border-t border-[#d3cec6] pt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-[#111111]">Net Payout</span>
          <span className="text-base font-extrabold text-emerald-600">
            ₹{net}
          </span>
        </div>
      </div>

      {/* Return Actions */}
      <div className="flex items-center gap-3">
        {onSwitchToChat && (
          <Button
            variant="outline"
            onClick={onSwitchToChat}
            className="h-11 rounded-full border-[#d3cec6] bg-white px-6 text-sm font-medium text-[#111111] hover:bg-[#f5f1ec]"
          >
            Review Chat History
          </Button>
        )}
        <Button
          onClick={onReturnToDashboard}
          className="h-11 rounded-full bg-[#111111] px-7 text-sm font-medium text-white hover:bg-black shadow-sm"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}

/**
 * Expert Voice Consultation Stage.
 * Renders the full voice interface matching the warm stone/sand design language,
 * with Devotee orb, earnings metrics, kundli drawer, and RTC controls.
 */
export function ExpertVoiceStage(props: ExpertVoiceStageProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function toggleDrawer() {
    setIsDrawerOpen((prev) => !prev);
  }

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec] font-sans text-[#111111]",
        props.className
      )}
    >
      <ExpertSecureStrip />

      {/* Main Stage Body */}
      {props.phase === "ended" ? (
        <ExpertSessionEndedPanel
          metrics={props.metrics}
          client={props.client}
          summaryReport={props.summaryReport}
          onReturnToDashboard={props.onReturnToDashboard}
          onSwitchToChat={props.onSwitchToChat}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <ExpertVoiceHero
            client={props.client}
            phase={props.phase}
            metrics={props.metrics}
            isClientSpeaking={props.isClientSpeaking}
          />

          <ExpertVoiceControls
            phase={props.phase}
            muted={props.muted}
            onToggleMute={props.onToggleMute}
            speakerMuted={props.speakerMuted}
            onToggleSpeaker={props.onToggleSpeaker}
            isDrawerOpen={isDrawerOpen}
            onToggleDrawer={toggleDrawer}
            onAccept={props.onAccept}
            onDecline={props.onDecline}
            onEndCall={props.onEndCall}
            onSwitchToChat={props.onSwitchToChat}
          />
        </div>
      )}

      {/* Kundli & Intake Dossier Slide-over Drawer */}
      <ExpertClientIntakeDrawer
        client={props.client}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
