import { MessageSquare } from "lucide-react";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export function ChatEmptyState() {
  return (
    <div className="flex h-full items-center justify-center py-12">
      <Empty>
        <EmptyMedia variant="icon">
          <MessageSquare className="size-5 text-slate-400" />
        </EmptyMedia>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>
          Messages from your consultation will appear here in real time.
        </EmptyDescription>
      </Empty>
    </div>
  );
}
