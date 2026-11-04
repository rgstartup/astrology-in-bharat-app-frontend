import { ChevronDown, ChevronUp } from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";
import { SessionKind } from "@repo/rtc";

/**
 * Expand toggle for the addon panel.
 *
 * @param props - Expanded flag, toggle handler, and session kind.
 * @returns Expand button element.
 */
export function ExpandToggle({
  expanded,
  onToggle,
  kind,
}: {
  expanded: boolean;
  onToggle?: () => void;
  kind: SessionKind;
}) {
  if (!onToggle) return null;
  if (expanded) {
    return (
      <Button
        size="icon"
        variant="ghost"
        aria-label={
          kind === "voice" ? "Collapse voice panel" : "Collapse video panel"
        }
        onClick={onToggle}
        className="size-9 shrink-0 rounded-full text-[#111111] hover:bg-[#f5f1ec]"
      >
        <ChevronUp className="size-4" />
      </Button>
    );
  }
  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label={
        kind === "voice" ? "Expand voice panel" : "Expand video panel"
      }
      onClick={onToggle}
      className="size-9 shrink-0 rounded-full text-[#111111] hover:bg-[#f5f1ec]"
    >
      <ChevronDown className="size-4" />
    </Button>
  );
}
