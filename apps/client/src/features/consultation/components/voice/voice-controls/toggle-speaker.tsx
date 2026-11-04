import { Volume2, VolumeX } from "@repo/design/lucide";
import { ControlButton } from "./button-control";

/**
 * Speaker toggle bound to the RTC session state.
 *
 * @param props - Speaker muted flag and toggle handler.
 * @returns Speaker toggle element.
 */
export function SpeakerToggle({
  speakerMuted,
  onToggleSpeaker,
}: {
  speakerMuted: boolean;
  onToggleSpeaker: () => void;
}) {
  if (speakerMuted) {
    return (
      <ControlButton pressed label="Turn speaker on" onToggle={onToggleSpeaker}>
        <VolumeX className="size-5" />
      </ControlButton>
    );
  }
  return (
    <ControlButton
      pressed={false}
      label="Turn speaker off"
      onToggle={onToggleSpeaker}
    >
      <Volume2 className="size-5" />
    </ControlButton>
  );
}
