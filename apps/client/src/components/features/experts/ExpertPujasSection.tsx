import React from "react";
import { api, API_ROUTES } from "@/actions";
import { PujaCard } from "@/components/features/puja/PujaCard";
import { Sparkles } from "lucide-react";

export interface ExpertPujasSectionProps {
  expertId: string;
  expertName: string;
}

export default async function ExpertPujasSection({
  expertId,
  expertName,
}: ExpertPujasSectionProps) {
  try {
    const pujaData = await api.get<any>(API_ROUTES.EXPERT.GET_ALL_PUJAS || "/expert/pujas/all", {
      cache: "no-store",
    });
    if (!Array.isArray(pujaData)) return null;

    const expertPujas = pujaData.filter(
      (p: any) => String(p.expert_id || p.expertId) === String(expertId),
    );
    if (expertPujas.length === 0) return null;

    return (
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="size-3.5" />
              <span>Vedic Ceremonies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Sacred Pujas by {expertName}
            </h2>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Book a personalized Vedic puja conducted with authentic rituals and sacred mantras.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertPujas.map((puja: any) => (
              <PujaCard key={puja.id} puja={puja} />
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Failed to load expert pujas:", error);
    return null;
  }
}
