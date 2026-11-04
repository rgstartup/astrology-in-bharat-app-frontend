import { Video, VideoOff } from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";

/**
 * Camera toggle bound to the RTC session state.
 *
 * @param props - Camera enabled flag and toggle handler.
 * @returns Camera toggle element.
 */
export function DockCameraToggle({
  cameraEnabled,
  onToggle,
}: {
  cameraEnabled: boolean;
  onToggle: () => void;
}) {
  if (!cameraEnabled) {
    return (
      <Button
        size="icon"
        aria-label="Turn camera on"
        aria-pressed="true"
        onClick={onToggle}
        className="size-9 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
      >
        <VideoOff className="size-4" />
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
      className="size-9 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
    >
      <Video className="size-4" />
    </Button>
  );
}
