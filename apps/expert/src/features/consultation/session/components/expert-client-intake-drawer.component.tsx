"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Compass,
  FileText,
  MapPin,
  Moon,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ClientIntakeProfile } from  "../types";

interface ExpertClientIntakeDrawerProps {
  client: ClientIntakeProfile;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * Slide-over drawer presenting the client's Vedic astrology intake details,
 * birth chart metadata, and private astrologer notepad during live calls.
 */
export function ExpertClientIntakeDrawer({
  client,
  isOpen,
  onClose,
}: ExpertClientIntakeDrawerProps) {
  const [expertPrivateNote, setExpertPrivateNote] = useState("");

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Client Kundli & Intake Dossier"
      className="absolute inset-y-0 right-0 z-30 flex w-full max-w-sm flex-col border-l border-[#d3cec6] bg-white shadow-2xl transition-transform duration-200 ease-out"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#d3cec6] px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#c13515]" />
          <h3 className="font-sans text-sm font-semibold tracking-tight text-[#111111]">
            Kundli & Intake Dossier
          </h3>
        </div>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Close dossier"
          onClick={onClose}
          className="size-8 rounded-full text-[#626260] hover:bg-[#f5f1ec] hover:text-[#111111]"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Content scroll area */}
      <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm">
        {/* Devotee Info */}
        <div className="flex items-center gap-3 rounded-xl border border-[#d3cec6] bg-[#f5f1ec] p-3.5">
          <Avatar className="size-12 rounded-full border border-[#d3cec6] bg-white">
            <AvatarImage src={client.avatar || undefined} alt={client.name} />
            <AvatarFallback className="bg-white text-xs font-semibold text-[#111111]">
              {client.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-sans font-semibold text-[#111111]">
              {client.name}
            </h4>
            <p className="text-xs text-[#626260]">
              {client.gender ? `${client.gender} · ` : ""}Devotee
            </p>
          </div>
        </div>

        {/* Consultation Topic */}
        {client.topic && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold tracking-wide text-[#7b7b78] uppercase">
              Consultation Intent
            </span>
            <div className="rounded-lg border border-[#d3cec6] bg-white p-3 font-medium text-[#111111]">
              {client.topic}
            </div>
          </div>
        )}

        {/* Vedic Birth Details (Kundli Parameters) */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-wide text-[#7b7b78] uppercase">
            Birth & Astro Parameters
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-[#fbf9f6] p-2.5">
              <Calendar className="size-3.5 text-[#7b7b78]" />
              <div>
                <p className="text-[10px] text-[#7b7b78]">Date</p>
                <p className="font-semibold text-[#111111]">
                  {client.dateOfBirth || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-[#fbf9f6] p-2.5">
              <Clock className="size-3.5 text-[#7b7b78]" />
              <div>
                <p className="text-[10px] text-[#7b7b78]">Time</p>
                <p className="font-semibold text-[#111111]">
                  {client.timeOfBirth || "Not provided"}
                </p>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-[#fbf9f6] p-2.5">
              <MapPin className="size-3.5 text-[#7b7b78]" />
              <div>
                <p className="text-[10px] text-[#7b7b78]">Place</p>
                <p className="font-semibold text-[#111111]">
                  {client.placeOfBirth || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-[#fbf9f6] p-2.5">
              <Moon className="size-3.5 text-[#7b7b78]" />
              <div>
                <p className="text-[10px] text-[#7b7b78]">Rashi (Moon)</p>
                <p className="font-semibold text-[#111111]">
                  {client.rashi || "Calculating..."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-[#fbf9f6] p-2.5">
              <Compass className="size-3.5 text-[#7b7b78]" />
              <div>
                <p className="text-[10px] text-[#7b7b78]">Nakshatra</p>
                <p className="font-semibold text-[#111111]">
                  {client.nakshatra || "Calculating..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Private Astrologer Remedy Notepad */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#7b7b78] uppercase">
              <FileText className="size-3" />
              <span>Remedies & Private Notes</span>
            </span>
            <span className="text-[10px] text-[#7b7b78]">Only you see this</span>
          </div>
          <textarea
            value={expertPrivateNote}
            onChange={(e) => setExpertPrivateNote(e.target.value)}
            placeholder="Jot down gemstone remedies, mantra repetitions, or chart planetary observations during consultation..."
            className="h-28 w-full resize-none rounded-lg border border-[#d3cec6] bg-[#fbf9f6] p-2.5 text-xs text-[#111111] placeholder:text-[#a09c95] focus:border-[#111111] focus:outline-none"
          />
        </div>
      </div>
    </aside>
  );
}
