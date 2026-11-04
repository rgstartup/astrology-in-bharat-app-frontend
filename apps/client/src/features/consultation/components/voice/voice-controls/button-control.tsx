import { Button } from "@repo/design/shadcn";

/**
 * Circular 48px control button with pressed-state styling.
 *
 * @param props - Pressed flag, label, click handler, and icon node.
 * @returns Control button element.
 */
export function ControlButton({
  pressed,
  label,
  onToggle,
  children,
}: {
  pressed: boolean;
  label: string;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  if (pressed) {
    return (
      <Button
        size="icon"
        aria-label={label}
        aria-pressed="true"
        onClick={onToggle}
        className="size-12 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
      >
        {children}
      </Button>
    );
  }
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label={label}
      aria-pressed="false"
      onClick={onToggle}
      className="size-12 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
    >
      {children}
    </Button>
  );
}
