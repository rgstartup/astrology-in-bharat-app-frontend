"use client";

import React from "react";
import { AlertCircle, Phone, RefreshCw, User, Video } from "@repo/design/lucide";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/shadcn";
import { Button } from "@repo/design/shadcn";
import { cn } from "@repo/design/cn";
import type {
  MediaConnectionStep,
  MediaKind,
} from "../../types/media-connection-types";
import {
  getMediaStepSubtitle,
  getMediaStepTitle,
} from "../../types/media-connection-types";
import { MediaConnectionBadge } from "./media-connection-badge";
import { MediaZeroChargeBanner } from "./media-zero-charge-banner";
import { MediaControlsPreview } from "./media-controls-preview";

export type MediaConnectionStageProps = {
  kind: MediaKind;
  step: MediaConnectionStep;
  expertName: string;
  expertAvatar?: string | null;
  rate: number;
  onCancel: () => void;
  onRetry?: () => void;
  isMicMuted?: boolean;
  isCameraOff?: boolean;
  onToggleMic?: () => void;
  onToggleCamera?: () => void;
  className?: string;
};

/**
 * Top security strip confirming media channel encryption.
 *
 * @param props - Media kind.
 * @returns Header security strip element.
 */
function MediaSecureStrip({ kind }: { kind: MediaKind }) {
  if (kind === "video") {
    return (
      <div className="flex items-center justify-center gap-1.5 border-b border-[#d3cec6] bg-white px-4 py-2">
        <span className="size-2 animate-pulse rounded-full bg-[#0bdf50]" />
        <Video className="size-3 text-[#7b7b78]" />
        <span className="text-xs font-medium text-[#626260]">
          Video secured end-to-end
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-1.5 border-b border-[#d3cec6] bg-white px-4 py-2">
      <span className="size-2 animate-pulse rounded-full bg-[#0bdf50]" />
      <Phone className="size-3 text-[#7b7b78]" />
      <span className="text-xs font-medium text-[#626260]">
        Voice secured end-to-end
      </span>
    </div>
  );
}

/**
 * Pulsing ripple rings rendered behind the avatar while connecting to Agora.
 *
 * @returns Animated radar wave decoration element.
 */
function ConnectingRadarWaves() {
  return (
    <span aria-hidden="true" className="absolute inset-0">
      <span className="absolute inset-0 animate-ping rounded-full bg-[#111111]/5" />
      <span className="absolute -inset-2 animate-pulse rounded-full border border-[#d3cec6]" />
    </span>
  );
}

/**
 * Avatar orb with animated radar waves.
 *
 * @param props - Avatar url and expert name.
 * @returns Avatar orb element.
 */
function ExpertConnectingOrb({
  expertAvatar,
  expertName,
}: {
  expertAvatar?: string | null;
  expertName: string;
}) {
  return (
    <span className="relative flex size-24 items-center justify-center">
      <ConnectingRadarWaves />
      <Avatar className="relative size-24 rounded-full border border-[#d3cec6] bg-white">
        <AvatarImage src={expertAvatar ?? undefined} alt={expertName} />
        <AvatarFallback className="bg-white text-[#626260]">
          <User className="size-10" />
        </AvatarFallback>
      </Avatar>
      <span
        aria-label="Connecting"
        className="absolute -right-1 -bottom-1 size-5 animate-pulse rounded-full border-2 border-white bg-[#d97706]"
      />
    </span>
  );
}

/**
 * Fallback card rendered when the connection handshake times out.
 *
 * @param props - Expert name, cancel handler, retry handler.
 * @returns Timeout error card element.
 */
function TimeoutContent({
  expertName,
  onCancel,
  onRetry,
}: {
  expertName: string;
  onCancel: () => void;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-6 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-full border border-[#d3cec6] bg-white text-[#c13515]">
        <AlertCircle className="size-7" />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="font-sans text-lg font-medium text-[#111111]">
          Unable to establish media connection
        </h3>
        <p className="text-[13px] leading-relaxed text-[#626260]">
          We could not complete the secure media connection with {expertName}.
          Your wallet was not charged.
        </p>
      </div>
      <MediaZeroChargeBanner />
      <div className="mt-3 flex w-full flex-col gap-2.5 sm:flex-row">
        <Button
          type="button"
          onClick={onRetry}
          className="h-11 flex-1 gap-2 rounded-full bg-[#111111] text-sm font-medium text-white hover:bg-black"
        >
          <RefreshCw className="size-4" />
          <span>Retry connection</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-11 flex-1 rounded-full border-[#d3cec6] bg-white text-sm font-medium text-[#111111] hover:bg-[#f5f1ec]"
        >
          Return to chat
        </Button>
      </div>
    </div>
  );
}

/**
 * Local video preview thumbnail placed on the bottom right of the video panel.
 *
 * @param props - Camera-off flag.
 * @returns Local thumbnail element.
 */
function LocalCameraThumbnail({ isCameraOff }: { isCameraOff?: boolean }) {
  if (isCameraOff) {
    return (
      <div className="absolute right-3 bottom-3 flex size-24 flex-col items-center justify-center rounded-xl border border-white bg-[#222220] text-white shadow-md">
        <User className="size-6 text-[#7b7b78]" />
        <span className="mt-1 text-[10px] text-[#7b7b78]">Camera off</span>
      </div>
    );
  }
  return (
    <div className="absolute right-3 bottom-3 flex size-24 flex-col items-center justify-center rounded-xl border border-white bg-[#111111] text-white shadow-md">
      <User className="size-8" />
      <span className="mt-1 text-[10px] text-[#0bdf50]">Camera ready</span>
    </div>
  );
}

/**
 * Staging surface for video consultations while Agora token and peer are connecting.
 *
 * @param props - Stage properties.
 * @returns Video staging layout element.
 */
function VideoStagingContent(props: MediaConnectionStageProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4 md:px-6">
      <div className="relative flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#ebe7e1] p-6 text-center md:min-h-[360px]">
        <ExpertConnectingOrb
          expertAvatar={props.expertAvatar}
          expertName={props.expertName}
        />
        <p className="mt-3 text-[13px] font-medium text-[#7b7b78]">
          {getMediaStepTitle(props.kind, props.step, props.expertName)}
        </p>
        <h3 className="font-sans text-xl font-medium text-[#111111]">
          {props.expertName}
        </h3>
        <p className="mt-1 max-w-sm text-xs text-[#626260]">
          {getMediaStepSubtitle(props.kind, props.step, props.expertName)}
        </p>
        <div className="mt-4 w-full max-w-sm">
          <MediaConnectionBadge
            kind={props.kind}
            step={props.step}
            expertName={props.expertName}
          />
        </div>
        <LocalCameraThumbnail isCameraOff={props.isCameraOff} />
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xl font-semibold tracking-tight text-[#111111] tabular-nums">
            --:--
          </span>
          <span className="rounded-full border border-[#d3cec6] bg-white px-3 py-1 text-xs font-semibold text-[#111111] tabular-nums">
            Video rate Rs.{props.rate}/min · Timer held
          </span>
        </div>
        <MediaZeroChargeBanner />
        <MediaControlsPreview
          kind={props.kind}
          isMuted={props.isMicMuted}
          isCameraOff={props.isCameraOff}
          onToggleMute={props.onToggleMic}
          onToggleCamera={props.onToggleCamera}
          onCancel={props.onCancel}
        />
      </div>
    </div>
  );
}

/**
 * Staging surface for voice consultations while Agora token and peer are connecting.
 *
 * @param props - Stage properties.
 * @returns Voice staging layout element.
 */
function VoiceStagingContent(props: MediaConnectionStageProps) {
  return (
    <div className="flex flex-col items-center gap-3.5 px-6 pt-8 pb-6 text-center">
      <ExpertConnectingOrb
        expertAvatar={props.expertAvatar}
        expertName={props.expertName}
      />
      <p className="text-[13px] font-medium text-[#7b7b78]">
        {getMediaStepTitle(props.kind, props.step, props.expertName)}
      </p>
      <h2 className="font-sans text-[22px] leading-tight font-medium tracking-[-0.3px] text-[#111111]">
        {props.expertName}
      </h2>
      <p className="font-mono text-3xl font-semibold tracking-tight text-[#111111] tabular-nums">
        --:--
      </p>
      <p className="rounded-full border border-[#d3cec6] bg-white px-3 py-1 text-xs font-semibold text-[#111111] tabular-nums">
        Voice rate Rs.{props.rate} per min · Timer held
      </p>
      <p className="max-w-sm text-[13px] leading-relaxed text-[#626260]">
        {getMediaStepSubtitle(props.kind, props.step, props.expertName)}
      </p>

      <div className="mt-1 w-full max-w-sm">
        <MediaConnectionBadge
          kind={props.kind}
          step={props.step}
          expertName={props.expertName}
        />
      </div>

      <MediaZeroChargeBanner className="mt-1" />

      <div className="mt-3">
        <MediaControlsPreview
          kind={props.kind}
          isMuted={props.isMicMuted}
          onToggleMute={props.onToggleMic}
          onCancel={props.onCancel}
        />
      </div>
    </div>
  );
}

/**
 * Media stage orchestrator displaying the connection waiting experience upon entering
 * the room, while Agora token connects and both parties prepare audio/video.
 *
 * Adheres strictly to:
 * - OpenWolf Rule 4: Zero ternary operators (`? :` banned in JSX). Waterfall early returns.
 * - OpenWolf Rule 5: Built-in component state over redundant React state.
 * - OpenWolf Rule 6: Root orchestrator named `.root.tsx`.
 *
 * @param props - {@link MediaConnectionStageProps}
 * @returns Orchestrated connection waiting stage element.
 */
export function MediaConnectionStage(props: MediaConnectionStageProps) {
  if (props.step === "timeout") {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col bg-[#f5f1ec]",
          props.className,
        )}
      >
        <MediaSecureStrip kind={props.kind} />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <TimeoutContent
            expertName={props.expertName}
            onCancel={props.onCancel}
            onRetry={props.onRetry}
          />
        </div>
      </div>
    );
  }

  if (props.kind === "video") {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col bg-[#f5f1ec]",
          props.className,
        )}
      >
        <MediaSecureStrip kind={props.kind} />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <VideoStagingContent {...props} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col bg-[#f5f1ec]",
        props.className,
      )}
    >
      <MediaSecureStrip kind={props.kind} />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <VoiceStagingContent {...props} />
      </div>
    </div>
  );
}
