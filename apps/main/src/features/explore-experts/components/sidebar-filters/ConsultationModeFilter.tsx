"use client";

import React from "react";
import { Sparkles, MessageSquare, Phone, Video } from "lucide-react";
import { ConsultationMode } from "../../types";
import { useExploreExpertsContext } from "../../context/ExploreExpertsContext";

const MODES = [
  { id: "all", label: "All Modes", icon: Sparkles },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "audio", label: "Audio Call", icon: Phone },
  { id: "video", label: "Video Call", icon: Video },
] as const;

export function ConsultationModeFilter() {
  const { filters, setServiceType } = useExploreExpertsContext();

  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-3">
        Consultation Type
      </label>
      <div className="grid grid-cols-2 gap-2">
        {MODES.map(({ id, label, icon: Icon }) => {
          const active = filters.serviceType === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setServiceType(id as ConsultationMode)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                active
                  ? "bg-orange text-white border-orange shadow-md shadow-orange/30 font-extrabold"
                  : "bg-gray-50/80 border-gray-200 text-gray-700 hover:border-orange/40 hover:text-orange"
              }`}
            >
              <Icon className="size-3" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
