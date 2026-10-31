"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MessageSquare, ArrowRight } from "@repo/design/lucide";
import { useDashboardOverview } from "../hooks/useDashboardOverview";

export interface ActiveConsultationCardProps {
  session?: any;
}

/**
 * Banner for a live consultation session. Renders nothing when
 * no session is active; otherwise links back into the chat.
 */
export function ActiveConsultationCard({
  session,
}: ActiveConsultationCardProps = {}) {
  const { activeConsultation: hookSession } = useDashboardOverview();
  const activeConsultation = session !== undefined ? session : hookSession;

  if (!activeConsultation) {
    return null;
  }

  const expertName =
    activeConsultation.expert?.user?.name ||
    activeConsultation.expert_name ||
    "Astrology expert";
  const sessionUrl = `/chat?session_id=${activeConsultation.id || activeConsultation._id}`;

  return (
    <Card className="mb-6 sm:mb-8 animate-in fade-in duration-300">
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0bdf50] opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0bdf50] border-2 border-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1.5 font-sans text-[11px] font-medium text-[#111111] bg-white px-2 py-0.5 rounded-full border border-[#d3cec6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0bdf50]" />
                <span>Session in progress</span>
              </span>
            </div>
            <h3 className="font-sans text-base sm:text-lg font-medium tracking-tight text-[#111111]">
              Active consultation with {expertName}
            </h3>
            <p className="font-sans text-xs text-[#626260]">
              Your consultation is currently active. Rejoin the live chat to continue receiving Vedic guidance.
            </p>
          </div>
        </div>

        <Link href={sessionUrl} className="no-underline shrink-0">
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
          >
            <span>Resume chat session</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ActiveConsultationCard;
