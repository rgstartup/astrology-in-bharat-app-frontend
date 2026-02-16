"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaHeart as FaH,
  FaUser as FaU,
  FaArrowRight as FaAr,
  FaSpinner as FaSp,
  FaRegCalendarAlt as FaCal,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaHeart = FaH as unknown as React.FC<{ size?: number; className?: string }>;
const FaUser = FaU as unknown as React.FC<{ size?: number; className?: string }>;
const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;
const FaCalendar = FaCal as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

type RelationshipType = "Crush" | "Dating" | "Married";

type TimelineItem = {
  title: string;
  percent: number;
  label: string;
  message: string;
};

type TimelineResult = {
  mood7: TimelineItem;
  bond30: TimelineItem;
  stability180: TimelineItem;
  summary: string;
};

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

const normalizeName = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getLabelAndMessage = (percent: number) => {
  if (percent <= 40) {
    return {
      label: "Low Phase",
      message: "Low phase — avoid misunderstandings, stay calm.",
    };
  }
  if (percent <= 70) {
    return {
      label: "Balanced",
      message: "Balanced — small efforts will improve the connection.",
    };
  }
  return {
    label: "Strong",
    message: "Strong — positive growth and smooth bonding ahead.",
  };
};

const getWeights = (type: RelationshipType) => {
  if (type === "Crush") return { mood: 10, bond: -5, stability: -15 };
  if (type === "Dating") return { mood: 5, bond: 5, stability: 0 };
  return { mood: 0, bond: 10, stability: 15 }; // Married
};

const TimelineCard: React.FC<{
  item: TimelineItem;
  icon?: React.ReactNode;
}> = ({ item, icon }) => {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 border border-orange-100 bg-white shadow-[0_15px_40px_rgba(48,17,24,0.06)] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
        <GiLotus size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="m-0 text-[10px] font-black uppercase tracking-[4px] text-primary">
              Prediction Window
            </p>
            <h3 className="m-0 text-xl font-black text-burgundy">{item.title}</h3>
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
              className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.percent <= 40
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

    const seed = hashSeed(stableKey);

    // Base scores
    let mood7 = (seed + 7) % 101;
    let bond30 = (seed + 30) % 101;
    let stability180 = (seed + 180) % 101;

    // Apply weights
    const w = getWeights(relationshipType);
    mood7 = clamp(mood7 + w.mood, 0, 100);
    bond30 = clamp(bond30 + w.bond, 0, 100);
    stability180 = clamp(stability180 + w.stability, 0, 100);

    // Realism rule
    stability180 = Math.min(stability180, bond30 + 15);

    const moodInfo = getLabelAndMessage(mood7);
    const bondInfo = getLabelAndMessage(bond30);
    const stabilityInfo = getLabelAndMessage(stability180);

    const summary =
      mood7 <= 40 || bond30 <= 40 || stability180 <= 40
        ? "This phase needs patience. Avoid ego clashes and focus on calm communication."
        : mood7 <= 70 || bond30 <= 70 || stability180 <= 70
          ? "A balanced period ahead. Small consistent efforts can make your bond stronger."
          : "Strong growth is visible. Your connection feels smooth, supportive, and positive.";

    setResult({
      mood7: {
        title: "Next 7 Days (Mood)",
        percent: mood7,
        label: moodInfo.label,
        message: moodInfo.message,
      },
      bond30: {
        title: "Next 30 Days (Bond)",
        percent: bond30,
        label: bondInfo.label,
        message: bondInfo.message,
      },
      stability180: {
        title: "Next 6 Months (Stability)",
        percent: stability180,
        label: stabilityInfo.label,
        message: stabilityInfo.message,
      },
      summary,
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] selection:bg-primary/20">
      <style dangerouslySetInnerHTML={{ __html: premiumCardStyles }} />

      {/* Hero */}
      <CalculatorHero
        badgeText="Fun Relationship Prediction"
        titleMain="Future"
        titleAccent="Timeline"
        paragraph="Get a fun prediction for your next 7 days, 30 days, and 6 months based on your names and relationship type."
      />

      {/* Form */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-6">
          <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(48,17,24,0.1)] border-t-4 border-t-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
              <GiLotus size={150} />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-xl md:text-3xl font-black text-burgundy mb-2 tracking-tight">
                Relationship <span className="text-primary">Future</span> Timeline
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"></div>
            </div>

            <form onSubmit={handleCalculate} className="max-w-3xl mx-auto">
              <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white space-y-6">
                {/* Names */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Your Name
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        required
                        style={{ borderRadius: "9999px" }}
                        className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                        placeholder="Type your name..."
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                        <FaUser size={14} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Partner Name
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        required
                        style={{ borderRadius: "9999px" }}
                        className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                        placeholder="Type partner name..."
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                        <FaUser size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Relationship Type */}
                <div>
                  <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                    Relationship Type
                  </label>

                  <div className="mt-2">
                    <select
                      value={relationshipType}
                      onChange={(e) =>
                        setRelationshipType(e.target.value as RelationshipType)
                      }
                      className="w-full bg-white border-2 border-burgundy/5 rounded-2xl px-5 py-4 text-burgundy font-black outline-none focus:border-primary transition-all"
                    >
                      <option value="Crush">Crush</option>
                      <option value="Dating">Dating</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                </div>

                {/* Button */}
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={loading || !canCalculate}
                    style={{ borderRadius: "9999px" }}
                    className="relative group inline-flex items-center gap-3 bg-red-600 text-white px-10 py-4 font-black uppercase tracking-[2px] text-xs hover:bg-red-700 transition-all duration-500 shadow-xl disabled:opacity-50"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <TbCrystalBall size={18} />
                    )}
                    {loading ? "Predicting..." : "Generate Timeline"}
                    <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="w-full h-2 bg-red-500/20 rounded-full blur-lg translate-y-2 opacity-50"></div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Results */}
      <div ref={resultsRef}>
        {result && (
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="container px-6">
              <div className="max-w-5xl mx-auto">
                <div className="glass-card rounded-[3.5rem] p-8 md:p-16 shadow-[0_30px_70px_rgba(48,17,24,0.15)] border border-burgundy/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                    <GiLotus size={300} className="animate-spin-slow" />
                  </div>

                  <div className="relative z-10">
                    <div className="text-center mb-16">
                      <span className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                        Timeline Report
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        Relationship <span className="text-primary">Forecast</span>
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
                      />
                      <TimelineCard
                        item={result.bond30}
                        icon={<FaCalendar size={18} />}
                      />
                      <TimelineCard
                        item={result.stability180}
                        icon={<TbCrystalBall size={18} />}
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
