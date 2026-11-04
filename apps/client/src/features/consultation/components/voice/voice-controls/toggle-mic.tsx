import { Mic, MicOff } from "@repo/design/lucide";
import { ControlButton } from "./button-control";

/**
 * Microphone toggle bound to the RTC session state.
 *
 * @param props - Muted flag and toggle handler.
 * @returns Mic toggle element.
 */
export function MicToggle({
  muted,
  onToggleMute,
}: {
  muted: boolean;
  onToggleMute: () => void;
}) {
  if (muted) {
    return (
      <ControlButton pressed label="Unmute microphone" onToggle={onToggleMute}>
        <MicOff className="size-5" />
      </ControlButton>
    );
  }
  return (
    <ControlButton
      pressed={false}
      label="Mute microphone"
      onToggle={onToggleMute}
    >
      <Mic className="size-5" />
    </ControlButton>
  );
}
