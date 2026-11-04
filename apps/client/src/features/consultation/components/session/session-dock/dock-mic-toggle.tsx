import { Mic, MicOff } from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";

/**
 * Microphone toggle bound to the RTC session state.
 *
 * @param props - Muted flag and toggle handler.
 * @returns Mic toggle element.
 */
export function DockMicToggle({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) {
  if (muted) {
    return (
      <Button
        size="icon"
        aria-label="Unmute microphone"
        aria-pressed="true"
        onClick={onToggle}
        className="size-9 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
      >
        <MicOff className="size-4" />
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
      className="size-9 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
    >
      <Mic className="size-4" />
    </Button>
  );
}
