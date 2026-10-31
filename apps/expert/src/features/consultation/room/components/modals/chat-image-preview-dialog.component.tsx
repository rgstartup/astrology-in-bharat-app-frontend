import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChatImagePreviewDialogProps {
  previewImageUrl: string | null;
  onClose: () => void;
}

/**
 * Attachment image lightbox: white hairline dialog on the cream canvas.
 */
export function ChatImagePreviewDialog({
  previewImageUrl,
  onClose,
}: ChatImagePreviewDialogProps) {
  const isOpen = Boolean(previewImageUrl);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-w-3xl flex-col items-center rounded-xl border border-[#d3cec6] bg-white p-4">
        <DialogHeader className="sr-only">
          <DialogTitle>Image Preview</DialogTitle>
          <DialogDescription>Attachment image enlarged view</DialogDescription>
        </DialogHeader>
        {previewImageUrl && (
          <img
            src={previewImageUrl}
            alt="Enlarged attachment"
            className="max-h-[80vh] w-auto max-w-full rounded-xl border border-[#d3cec6] bg-white object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
