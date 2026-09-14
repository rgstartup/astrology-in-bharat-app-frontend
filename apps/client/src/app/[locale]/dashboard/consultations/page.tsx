"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { Card, Button, Skeleton } from "@/features/dashboard";
import { api } from "@/actions";
import { MessageSquare, Calendar, Clock, ArrowRight, UserCheck } from "lucide-react";

export default function MyConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchConsultations = async () => {
      setIsLoading(true);
      const [res, err] = await api.get<any>("/consultations/history");
      if (!isMounted) return;

      if (!err && res) {
        const data = res?.data ?? res;
        setConsultations(Array.isArray(data) ? data : []);
      } else {
        setConsultations([]);
      }
      setIsLoading(false);
    };

    fetchConsultations();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit">
            My Consultations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track your ongoing and past astrological consultations and advice
          </p>
        </div>

        <Link href={PATHS.DASHBOARD_EXPERTS} className="no-underline">
          <Button variant="default" size="sm" className="font-bold">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            <span>Consult an Expert</span>
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5 border-orange-100 bg-white space-y-2">
              <Skeleton className="h-5 w-48 bg-orange-100" />
              <Skeleton className="h-4 w-32 bg-orange-100" />
            </Card>
          ))}
        </div>
      ) : !consultations || consultations.length === 0 ? (
        <Card className="p-12 text-center border-orange-200/80 bg-white">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#ff6b00] flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-outfit mb-1">
            No Consultations Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
            You haven't consulted an expert yet. Connect with our verified astrologers for personalized Vedic guidance.
          </p>
          <Link href={PATHS.DASHBOARD_EXPERTS} className="no-underline">
            <Button variant="default" className="font-bold">
              <span>Find an Astrologer</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {consultations.map((c: any) => {
            const expertName =
              c.expert?.user?.name || c.expert?.name || c.expert_name || "Astrology Expert";
            const type = c.type || "Chat Consultation";
            const date = c.created_at
              ? new Date(c.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Recent";

            return (
              <Card
                key={c.id}
                className="p-5 border-orange-100 bg-white hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-outfit">
                      {expertName}
                    </h4>
                    <p className="text-xs text-slate-500">{type}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{date}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/chat?session_id=${c.id}`}
                  className="no-underline shrink-0"
                >
                  <Button variant="outline" size="sm" className="font-bold">
                    <span>View Conversation</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
