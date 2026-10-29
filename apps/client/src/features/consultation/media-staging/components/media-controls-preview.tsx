import React from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MediaKind } from "../types/media-connection-types";

type MediaControlsPreviewProps = {
  kind: MediaKind;
  isMuted?: boolean;
  isCameraOff?: boolean;
  onToggleMute?: () => void;
  onToggleCamera?: () => void;
  onCancel: () => void;
  className?: string;
};

/**
 * Microphone mute button with early-return pressed states.
 *
 * @param props - Muted flag and toggle handler.
 * @returns Microphone toggle element.
 */
function MicButton({
  isMuted,
  onToggle,
}: {
  isMuted?: boolean;
  onToggle?: () => void;
}) {
  if (isMuted) {
    return (
      <Button
        size="icon"
        aria-label="Unmute microphone"
        aria-pressed="true"
        onClick={onToggle}
        className="size-12 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
      >
        <MicOff className="size-5" />
      </Button>
    );
  }
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label="Mute microphone"
      aria-pressed="false"
      onClick={onToggle}
      className="size-12 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
    >
      <Mic className="size-5" />
    </Button>
  );
}

/**
 * Camera toggle button for video mode with early-return pressed states.
 *
 * @param props - Camera-off flag and toggle handler.
 * @returns Camera toggle element.
 */
function CameraButton({
  isCameraOff,
  onToggle,
}: {
  isCameraOff?: boolean;
  onToggle?: () => void;
}) {
  if (isCameraOff) {
    return (
      <Button
        size="icon"
        aria-label="Turn camera on"
        aria-pressed="true"
        onClick={onToggle}
        className="size-12 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
      >
        <VideoOff className="size-5" />
      </Button>
    );
  }
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label="Turn camera off"
      aria-pressed="false"
      onClick={onToggle}
      className="size-12 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
    >
      <Video className="size-5" />
    </Button>
  );
}

/**
 * Camera slot rendered only when staging a video session.
 *
 * @param props - Media kind, camera-off state, toggle handler.
 * @returns Camera button or null.
 */
function CameraSlot({
  kind,
  isCameraOff,
  onToggleCamera,
}: {
  kind: MediaKind;
  isCameraOff?: boolean;
  onToggleCamera?: () => void;
}) {
  if (kind === "video") {
    return <CameraButton isCameraOff={isCameraOff} onToggle={onToggleCamera} />;
  }
  return null;
}

/**
 * Pre-call device control bar allowing client to set initial audio/video states and abort.
 *
 * @param props - Media kind, mute/camera states, cancel handler, styling.
 * @returns Pre-call control cluster element.
 */
export function MediaControlsPreview({
  kind,
  isMuted = false,
  isCameraOff = false,
  onToggleMute,
  onToggleCamera,
  onCancel,
  className,
}: MediaControlsPreviewProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <MicButton isMuted={isMuted} onToggle={onToggleMute} />
      <CameraSlot
        kind={kind}
        isCameraOff={isCameraOff}
        onToggleCamera={onToggleCamera}
      />
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="h-12 rounded-full border-[#d3cec6] bg-white px-6 text-sm font-medium text-[#111111] hover:bg-[#f5f1ec]"
      >
        Cancel session
      </Button>
    </div>
  );
}
