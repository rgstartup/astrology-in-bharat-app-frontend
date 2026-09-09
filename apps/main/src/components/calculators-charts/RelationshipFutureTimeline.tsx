"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaHeart,
  FaUser,
  FaArrowRight,
  FaSpinner,
  FaRegCalendarAlt as FaCalendar,
} from "react-icons/fa";

import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";

import CalculatorHero from "./common/hero";
import RelationshipFutureTimelineForm from "./RelationshipFutureTimelineForm.component";
import { useLanguageStore } from "@repo/store";
import { relationshipFutureTranslations } from "@/lib/translations/calculators/relationship-future";

import {
  RelationshipType,
  TimelineItem,
  TimelineResult,
} from "@/lib/types/calculator";
import {
  normalizeName,
  calculateRelationshipTimeline,
} from "@/app/calculator/relationship-future-timeline/calculate";

const premiumCardStyles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(48, 17, 24, 0.1);
  }
  .text-burgundy { color: #301118; }
  .bg-burgundy { background-color: #301118; }
  .border-burgundy { border-color: #301118; }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
`;

const TimelineCard: React.FC<{
  item: TimelineItem;
  icon?: React.ReactNode;
  tPredictionWindow?: string;
}> = ({ item, icon, tPredictionWindow }) => {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 border border-orange-100 bg-white shadow-[0_15px_40px_rgba(48,17,24,0.06)] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
        <GiLotus size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="m-0 text-[10px] font-black uppercase tracking-[4px] text-primary">
              {tPredictionWindow}
            </p>
            <h3 className="m-0 text-xl font-black text-burgundy">
              {item.title}
            </h3>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white border-4 border-orange-50 shadow-lg flex items-center justify-center">
              <span className="text-2xl font-black text-burgundy">
                {item.percent}%
              </span>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin-slow opacity-20"></div>
          </div>

          <div className="flex-1">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                item.percent <= 40
                  ? "bg-red-50 text-red-600"
                  : item.percent <= 70
                    ? "bg-orange-50 text-primary"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {item.label}
            </span>

            <p className="m-0 mt-3 text-sm text-gray-500 italic leading-relaxed">
              {item.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RelationshipFutureTimeline: React.FC = () => {
  const { lang, toggleLang } = useLanguageStore();
  const t =
    relationshipFutureTranslations[lang as "en" | "hi"] ||
    relationshipFutureTranslations.en;

  const [yourName, setYourName] = useState<string>("");
  const [partnerName, setPartnerName] = useState<string>("");
  const [relationshipType, setRelationshipType] =
    useState<RelationshipType>("Crush");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TimelineResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const normalized = useMemo(() => {
    return {
      n1: normalizeName(yourName),
      n2: normalizeName(partnerName),
    };
  }, [yourName, partnerName]);

  const canCalculate = useMemo(() => {
    return normalized.n1.length > 0 && normalized.n2.length > 0;
  }, [normalized.n1, normalized.n2]);

  const stableKey = useMemo(() => {
    if (!canCalculate) return "";
    return [normalized.n1, normalized.n2].sort().join("|");
  }, [normalized.n1, normalized.n2, canCalculate]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 700));

    const timelineRes = calculateRelationshipTimeline(
      {
        yourName,
        partnerName,
        relationshipType,
      },
      t.results
    );

    setResult(timelineRes);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] selection:bg-primary/20">
      <style dangerouslySetInnerHTML={{ __html: premiumCardStyles }} />

      {/* Hero */}
      <section className="relative">
        <CalculatorHero
          badgeText={t.hero.badge}
          titleMain={t.hero.titleMain}
          titleAccent={t.hero.titleAccent}
          paragraph={t.hero.paragraph}
        />
      </section>

      <RelationshipFutureTimelineForm
        yourName={yourName}
        setYourName={setYourName}
        partnerName={partnerName}
        setPartnerName={setPartnerName}
        relationshipType={relationshipType}
        setRelationshipType={setRelationshipType}
        loading={loading}
        canCalculate={canCalculate}
        handleCalculate={handleCalculate}
        t={t.form}
      />

      {/* Results */}
      <div ref={resultsRef}>
        {result && (
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="container px-6">
              <div className="max-w-5xl mx-auto">
                <div className="glass-card rounded-[4rem] p-8 md:p-16 shadow-[0_30px_80px_rgba(48,17,24,0.18)] border border-burgundy/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                    <GiLotus size={300} className="animate-spin-slow" />
                  </div>

                  <div className="relative z-10">
                    <div className="text-center mb-16">
                      <span className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                        {t.results.badge}
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        {t.results.title}{" "}
                        <span className="text-primary">
                          {t.results.titleAccent}
                        </span>
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10"></div>

                      <div className="bg-burgundy text-white px-10 py-6 rounded-[3rem] shadow-2xl max-w-3xl mx-auto relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                          <GiSparkles size={28} />
                        </div>
                        <p className="m-0 text-lg md:text-xl font-light italic text-orange-100/90">
                          "{result.summary}"
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                      <TimelineCard
                        item={result.mood7}
                        icon={<FaHeart size={18} />}
                        tPredictionWindow={t.results.predictionWindow}
                      />
                      <TimelineCard
                        item={result.bond30}
                        icon={<FaCalendar size={18} />}
                        tPredictionWindow={t.results.predictionWindow}
                      />
                      <TimelineCard
                        item={result.stability180}
                        icon={<TbCrystalBall size={18} />}
                        tPredictionWindow={t.results.predictionWindow}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default RelationshipFutureTimeline;
