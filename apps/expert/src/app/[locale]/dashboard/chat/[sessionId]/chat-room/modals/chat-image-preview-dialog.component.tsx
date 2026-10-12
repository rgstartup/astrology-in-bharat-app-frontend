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

export function ChatImagePreviewDialog({
  previewImageUrl,
  onClose,
}: ChatImagePreviewDialogProps) {
  const isOpen = Boolean(previewImageUrl);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-3 bg-slate-950/90 border-slate-800 text-white flex flex-col items-center">
        <DialogHeader className="sr-only">
          <DialogTitle>Image Preview</DialogTitle>
          <DialogDescription>Attachment image enlarged view</DialogDescription>
        </DialogHeader>
        {previewImageUrl && (
          <img
            src={previewImageUrl}
            alt="Enlarged attachment"
            className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
