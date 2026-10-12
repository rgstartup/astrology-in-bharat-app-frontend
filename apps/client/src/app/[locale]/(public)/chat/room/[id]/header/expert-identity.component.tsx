"use client";

import { User } from "lucide-react";
import type { IExpert } from "@repo/lib";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ExpertIdentityProps = {
  expertData: IExpert;
  isFree: boolean;
  sessionStatus: string;
  className?: string;
};

function getStatusLabel(status: string): string {
  if (status === "active") return "Live Session";
  if (status === "completed") return "Session Ended";
  return "Waiting";
}

export function ExpertIdentity({
  expertData,
  isFree,
  sessionStatus,
  className,
}: ExpertIdentityProps) {
  if (!expertData) return null;

  return (
    <div className={cn("flex items-center gap-1.5 md:gap-3", className)}>
      <Avatar className="size-8 border-2 border-primary-foreground/20 shadow-sm md:size-10">
        <AvatarImage src={expertData.avatar ?? undefined} alt={expertData.name} />
        <AvatarFallback>
          <User className="size-5" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="flex items-center gap-1.5 text-[11px] font-bold leading-none text-primary-foreground md:text-sm">
          {expertData.name}
          {isFree && (
            <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest">
              Free
            </Badge>
          )}
        </h1>
        <p className="mt-0.5 text-[8px] text-primary-foreground/80">
          {getStatusLabel(sessionStatus)}
        </p>
      </div>
    </div>
  );
}
