import { Menu } from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/design/shadcn/dropdown-menu";
import { SessionKind } from "@repo/rtc";

/**
 * Session-mode dropdown on the dock. Lets the user switch to chat or
 * toggle between voice/video from the compact dock strip.
 *
 * @param props - Active kind and switch handlers.
 * @returns Dropdown menu element.
 */
export function SessionModeDropdown({
  kind,
  onSwitchToChat,
  onUpgradeToVideo,
  onSwitchToVoice,
}: {
  kind: SessionKind;
  onSwitchToChat?: () => void;
  onUpgradeToVideo?: () => void;
  onSwitchToVoice?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          size="icon"
          variant="outline"
          aria-label="Session options"
          className="size-9 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
        >
          <Menu className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={onSwitchToChat} disabled={!onSwitchToChat}>
          Switch to chat
        </DropdownMenuItem>
        {kind === "voice" ? (
          <DropdownMenuItem
            onSelect={onUpgradeToVideo}
            disabled={!onUpgradeToVideo}
          >
            Upgrade to video
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onSelect={onSwitchToVoice}
            disabled={!onSwitchToVoice}
          >
            Switch to voice
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
