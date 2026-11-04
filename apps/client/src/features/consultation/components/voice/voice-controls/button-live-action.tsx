import { PhoneOff } from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";

/**
 * Live-session actions: end voice only (minimize handled by dock).
 *
 * @param props - End handler.
 * @returns Live actions element.
 */
export function LiveActions({ onEndVoice }: { onEndVoice: () => void }) {
  return (
    <Button
      onClick={onEndVoice}
      className="h-12 gap-2 rounded-full bg-[#111111] px-7 text-base font-medium text-white hover:bg-black"
    >
      <PhoneOff className="size-4" />
      <span>End voice</span>
    </Button>
  );
}
