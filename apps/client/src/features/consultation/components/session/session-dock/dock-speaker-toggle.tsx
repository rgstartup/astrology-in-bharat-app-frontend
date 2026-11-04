import { Volume2, VolumeX } from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";

/**
 * Speaker toggle bound to the RTC session state.
 *
 * @param props - Speaker muted flag and toggle handler.
 * @returns Speaker toggle element.
 */
export function DockSpeakerToggle({
  speakerMuted,
  onToggle,
}: {
  speakerMuted: boolean;
  onToggle: () => void;
}) {
  if (speakerMuted) {
    return (
      <Button
        size="icon"
        aria-label="Turn speaker on"
        aria-pressed="true"
        onClick={onToggle}
        className="size-9 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
      >
        <VolumeX className="size-4" />
      </Button>
    );
  }
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label="Turn speaker off"
      aria-pressed="false"
      onClick={onToggle}
      className="size-9 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
    >
      <Volume2 className="size-4" />
    </Button>
  );
}
