"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MessageSquare, ArrowRight, Radio } from "lucide-react";
import { useDashboardOverview } from "../hooks/useDashboardOverview";

export interface ActiveConsultationCardProps {
  session?: any;
}

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
    "Astrology Expert";
  const sessionUrl = `/chat?session_id=${activeConsultation.id || activeConsultation._id}`;

  return (
    <Card className="mb-6 sm:mb-8 border-2 border-[#ff6b00] bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-white shadow-md animate-in fade-in duration-300">
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-[#ff6b00] text-white flex items-center justify-center shadow-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>Session in Progress</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-outfit">
              Active Consultation with {expertName}
            </h3>
            <p className="text-xs text-slate-600">
              Your consultation is currently active. Rejoin the live chat to continue receiving Vedic guidance.
            </p>
          </div>
        </div>

        <Link href={sessionUrl} className="no-underline shrink-0">
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto font-bold shadow-md shadow-[#ff6b00]/25"
          >
            <span>Resume Chat Session</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ActiveConsultationCard;
