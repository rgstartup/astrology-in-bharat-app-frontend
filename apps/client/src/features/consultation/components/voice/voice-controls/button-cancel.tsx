import { Button } from "@repo/design/shadcn";

/**
 * Cancel action shown while the expert has not answered yet.
 *
 * @param props - Cancel handler.
 * @returns Cancel request element.
 */
export function CancelRequest({ onCancel }: { onCancel: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onCancel}
      className="h-12 rounded-full border-[#d3cec6] bg-white px-7 text-base font-medium text-[#111111] hover:bg-[#f5f1ec]"
    >
      Cancel request
    </Button>
  );
}
