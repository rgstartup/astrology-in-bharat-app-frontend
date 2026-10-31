import { MessageSquare } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

/**
 * Empty conversation state: white hairline card on the cream canvas.
 */
export function ChatEmptyState() {
  return (
    <div className="flex h-full items-center justify-center py-12">
      <Empty className="rounded-xl border border-[#d3cec6] bg-white shadow-none">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="rounded-full border border-[#d3cec6] bg-white text-[#626260]"
          >
            <MessageSquare className="size-5" />
          </EmptyMedia>
          <EmptyTitle className="font-sans text-[#111111]">No messages yet</EmptyTitle>
          <EmptyDescription className="font-sans text-[#626260]">
            Messages from your consultation will appear here in real time.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
