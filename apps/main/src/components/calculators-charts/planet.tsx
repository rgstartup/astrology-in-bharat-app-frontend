"use client";

import React, { useState } from "react";
import {
    Sun, Moon, Zap, MessageCircle, Globe, Compass, Clock, Calendar, MapPin,
    RotateCw, Skull, Ghost, Star, Info, Loader2
} from "lucide-react";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import PlanetForm from "./PlanetForm.component";
import { useLanguageStore } from "@repo/store";
import { planetTranslations } from "@/lib/translations/calculators/planet";
import { getErrorMessage } from "@repo/lib";
import CalculatorHero from "./common/hero";

// Planet Color and Icon Mapping
const PLANET_META: Record<string, { color: string; icon: any }> = {
    "Sun": { color: "#FFD700", icon: Sun },
    "Moon": { color: "#94a3b8", icon: Moon },
    "Mars": { color: "#ef4444", icon: Zap },
    "Mercury": { color: "#06b6d4", icon: MessageCircle },
    "Jupiter": { color: "#f59e0b", icon: Globe },
    "Venus": { color: "#f472b6", icon: Star },
    "Saturn": { color: "#6366f1", icon: Compass },
    "Rahu": { color: "#475569", icon: Ghost },
    "Ketu": { color: "#334155", icon: Skull },
    "Ascendant": { color: "#b45309", icon: MapPin },
};

const Planet = () => {
    const { lang, toggleLang } = useLanguageStore();
    const t = planetTranslations[lang as keyof typeof planetTranslations] || planetTranslations.en;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
        seconds: 0,
        latitude: "",
        longitude: "",
        timezone: 5.5,
    });

    const [locationName, setLocationName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [planetData, setPlanetData] = useState<any[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationSelect = (loc: { name: string; lat: string; lon: string }) => {
        setLocationName(loc.name);
        setFormData({
            ...formData,
            latitude: loc.lat,
            longitude: loc.lon,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setPlanetData([]);

        // Validate coordinates
        const lat = parseFloat(formData.latitude);
        const lon = parseFloat(formData.longitude);

        if (isNaN(lat) || isNaN(lon)) {
            setError(t.results.invalidLocationResponse);
            setLoading(false);
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_FREE_ASTROLOGY_API_KEY || "YOUR_API_KEY_HERE";
        const url = `${process.env.NEXT_PUBLIC_CALCULATOR_URL || "https://json.freeastrologyapi.com"}/planets`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                },
                body: JSON.stringify({
                    year: parseInt(formData.year.toString()),
                    month: parseInt(formData.month.toString()),
                    date: parseInt(formData.date.toString()),
                    hours: parseInt(formData.hours.toString()),
                    minutes: parseInt(formData.minutes.toString()),
                    seconds: parseInt(formData.seconds.toString()),
                    latitude: lat,
                    longitude: lon,
                    timezone: parseFloat(formData.timezone.toString()),
                    settings: {
                        observation_point: "topocentric",
                        ayanamsha: "lahiri",
                    },
                }),
            });

            const resData = await res.json();
            if (resData && resData.output) {
                const outputObj = resData.output[0];
                const formattedData = Object.values(outputObj).filter((item: any) => item && typeof item === 'object' && item.name);
                setPlanetData(formattedData);
            } else {
                setError(t.results.invalidApiResponse);
            }
        } catch (err: any) {
            console.error("API Error:", err);
            setError(getErrorMessage(err) || t.results.defaultApiError);
        } finally {
            setLoading(false);
        }
    };

    // Helper to render lucide icons safely in React 19/TS environment
    const renderIcon = (IconComponent: any, props: any = {}) => {
        return <IconComponent {...props} />;
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-10 font-sans relative">
            <CalculatorHero
                 badgeText={(t.hero as any).badge || "PLANET CALCULATOR"}
                 titleMain={t.hero.titlePart1}
                 titleAccent={`${t.hero.titlePart2} ${t.hero.titlePart3 || ''}`}
                 paragraph={t.hero.paragraph}
            />
            <div className="max-w-[1320px] mx-auto mt-8 px-4">

                <div className="flex flex-col lg:flex-row gap-8">
                    <PlanetForm
                        formData={formData}
                        handleChange={handleChange}
                        handleLocationSelect={handleLocationSelect}
                        locationName={locationName}
                        loading={loading}
                        handleSubmit={handleSubmit}
                        renderIcon={renderIcon}
                        t={t.form}
                        fontStyle={fontStyle}
                    />

                    {/* Results Side */}
                    <div className="w-full lg:w-2/3">
                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-3xl p-6 mb-8 flex items-start gap-4">
                                <div className="bg-red-100 p-2 rounded-xl text-red-600">
                                    {renderIcon(Info, { size: 20 })}
                                </div>
                                <div>
                                    <h3 className="text-red-800 font-bold mb-1" style={fontStyle}>{t.results.errorTitle}</h3>
                                    <p className="text-red-600 text-sm leading-relaxed" style={fontStyle}>{error}</p>
                                </div>
                            </div>
                        )}

                        {!planetData.length && !loading && !error && (
                            <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
                                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                                    {renderIcon(Compass, { size: 48, className: "text-slate-300" })}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3" style={fontStyle}>{t.results.emptyStateTitle}</h3>
                                <p className="text-slate-500 max-w-md mx-auto" style={fontStyle}>
                                    {t.results.emptyStateDesc}
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                                            <div className="w-20 h-6 bg-slate-100 rounded-full"></div>
                                        </div>
                                        <div className="w-2/3 h-6 bg-slate-100 rounded-lg mb-2"></div>
                                        <div className="w-1/2 h-4 bg-slate-100 rounded-lg mb-6"></div>
                                        <div className="space-y-3">
                                            <div className="w-full h-12 bg-slate-50 rounded-xl"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {planetData.map((planet: any, index: number) => {
                                if (!planet || typeof planet !== 'object') return null;

                                const meta = PLANET_META[planet.name] || { color: "#f25e0a", icon: Compass };
                                const signIndex = parseInt(planet.current_sign || 0);
                                const signName = t.zodiacs[signIndex - 1] || t.planets["Unknown"];
                                const translatedPlanetName = (t.planets as any)[planet.name] || planet.name;

                                // Defensive value extraction
                                const normDegree = typeof planet.normDegree === 'number' ? planet.normDegree : 0;
                                const fullDegree = typeof planet.fullDegree === 'number' ? planet.fullDegree : 0;

                                return (
                                    <div
                                        key={(planet.name || 'planet') + index}
                                        className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all hover:-translate-y-1 duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div
                                                className="p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500 shadow-sm"
                                                style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                                            >
                                                {renderIcon(meta.icon, { size: 28 })}
                                            </div>
                                            {planet.isRetro === "true" && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider" style={fontStyle}>
                                                    {renderIcon(RotateCw, { size: 12, className: "animate-spin-slow" })}
                                                    {t.results.retrograde}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-xl font-black text-slate-800 mb-1" style={fontStyle}>{translatedPlanetName}</h3>
                                            <p className="font-bold text-lg" style={{ color: meta.color, ...fontStyle }}>{signName}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-400 font-medium tracking-wide" style={fontStyle}>{t.results.normalized}</span>
                                                    <span className="text-slate-700 font-bold">{normDegree.toFixed(2)}°</span>
                                                </div>
                                                <div className="h-px bg-slate-100 w-full"></div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-400 font-medium tracking-wide" style={fontStyle}>{t.results.fullDegree}</span>
                                                    <span className="text-slate-700 font-bold truncate max-w-[120px] ml-2 text-right">
                                                        {fullDegree.toFixed(2)}°
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {planetData.length > 0 && (
                            <div className="mt-10 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                    <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
                                        {renderIcon(Star, { className: "text-primary", size: 32 })}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1" style={fontStyle}>{t.results.insightTitle}</h4>
                                        <p className="text-slate-400 italic" style={fontStyle}>
                                            {t.results.insightDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` }} />
        </div>
    );
};

export default Planet;



