import { MessageSquare, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export function LiveChat() {
  return (
    <Card className="w-full border-slate-200 shadow-xs">
      <CardContent className="p-8">
        <Empty>
          <EmptyMedia variant="icon">
            <MessageSquare className="size-5 text-orange-600" />
          </EmptyMedia>
          <EmptyTitle>Live Consultation Station</EmptyTitle>
          <EmptyDescription>
            Incoming chat requests from clients will pop up automatically. Accept requests to enter real-time consultation rooms.
          </EmptyDescription>
          <div className="pt-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-slate-700">
              <Sparkles className="size-3.5 text-orange-600" />
              Realtime Active
            </Button>
          </div>
        </Empty>
      </CardContent>
    </Card>
  );
}

export default LiveChat;
