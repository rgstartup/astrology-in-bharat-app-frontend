"use client";

import React, { useState } from "react";
import axios from "axios";
import {
    Sun, Moon, Zap, MessageCircle, Globe, Compass, Clock, Calendar, MapPin,
    RotateCw, Skull, Ghost, Star, Info, Loader2
} from "lucide-react";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";

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

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const Planet = () => {
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
            setError("Please select a valid location from the search results.");
            setLoading(false);
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_FREE_ASTROLOGY_API_KEY || "YOUR_API_KEY_HERE";
        const url = `${process.env.NEXT_PUBLIC_CALCULATOR_URL || "https://json.freeastrologyapi.com"}/planets`;

        try {
            const response = await axios.post(
                url,
                {
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
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKey,
                    },
                }
            );

            if (response.data && response.data.output) {
                // The output is an array containing an object with numeric keys
                const outputObj = response.data.output[0];
                const formattedData = Object.values(outputObj).filter((item: any) => item && typeof item === 'object' && item.name);
                setPlanetData(formattedData);
            } else {
                setError("Invalid response from API. Please check your details and API key.");
            }
        } catch (err: any) {
            console.error("API Error:", err);
            setError(err.response?.data?.message || "Failed to fetch planet data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to render lucide icons safely in React 19/TS environment
    const renderIcon = (IconComponent: any, props: any = {}) => {
        return <IconComponent {...props} />;
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen py-10 px-4 font-sans">
            <div className="container mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                        Planet Positions <span className="text-[#fd6410]">&</span> Analysis
                    </h1>
                    <div className="h-1 w-24 bg-[#fd6410] mx-auto mb-6 rounded-full"></div>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Unlock cosmic insights with accurate planetary positions. Enter your birth details
                        below to analyze the celestial alignment.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form Side */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 sticky top-24">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-orange-50 p-3 rounded-2xl">
                                    {renderIcon(Calendar, { className: "text-[#fd6410]", size: 24 })}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Birth Details</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">Date</label>
                                        <input
                                            type="number"
                                            name="date"
                                            className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#fd6410] transition-all"
                                            placeholder="DD"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">Month</label>
                                        <input
                                            type="number"
                                            name="month"
                                            className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#fd6410] transition-all"
                                            placeholder="MM"
                                            value={formData.month}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">Year</label>
                                    <input
                                        type="number"
                                        name="year"
                                        className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#fd6410] transition-all"
                                        placeholder="YYYY"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-2 ml-1">Hour</label>
                                        <input
                                            type="number"
                                            name="hours"
                                            className="w-full px-3 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#fd6410] transition-all"
                                            placeholder="HH"
                                            value={formData.hours}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-2 ml-1">Min</label>
                                        <input
                                            type="number"
                                            name="minutes"
                                            className="w-full px-3 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#fd6410] transition-all"
                                            placeholder="MM"
                                            value={formData.minutes}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-2 ml-1">Sec</label>
                                        <input
                                            type="number"
                                            name="seconds"
                                            className="w-full px-3 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#fd6410] transition-all"
                                            placeholder="SS"
                                            value={formData.seconds}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">Location</label>
                                    <LocationAutocomplete
                                        onSelect={handleLocationSelect}
                                        initialValue={locationName}
                                        placeholder="Search city..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">Timezone (GMT)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="timezone"
                                        className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#fd6410] transition-all"
                                        value={formData.timezone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#fd6410] hover:bg-[#e55a0e] text-white rounded-2xl font-bold shadow-[0_10px_20px_rgba(253,100,16,0.3)] transition-all flex items-center justify-center gap-3 group mt-8"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        renderIcon(Loader2, { className: "animate-spin", size: 20 })
                                    ) : (
                                        <>
                                            <span>Get Results</span>
                                            {renderIcon(Compass, { size: 18, className: "group-hover:rotate-45 transition-transform" })}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Results Side */}
                    <div className="w-full lg:w-2/3">
                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-3xl p-6 mb-8 flex items-start gap-4">
                                <div className="bg-red-100 p-2 rounded-xl text-red-600">
                                    {renderIcon(Info, { size: 20 })}
                                </div>
                                <div>
                                    <h3 className="text-red-800 font-bold mb-1">Calculation Error</h3>
                                    <p className="text-red-600 text-sm leading-relaxed">{error}</p>
                                </div>
                            </div>
                        )}

                        {!planetData.length && !loading && !error && (
                            <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
                                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                                    {renderIcon(Compass, { size: 48, className: "text-slate-300" })}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">Begin Your Journey</h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    Fill in your birth details and click 'Get Results' to discover the planetary
                                    alignments influencing your life.
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

                                const meta = PLANET_META[planet.name] || { color: "#fd6410", icon: Compass };
                                const signIndex = parseInt(planet.current_sign || 0);
                                const signName = ZODIAC_SIGNS[signIndex - 1] || "Unknown";

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
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    {renderIcon(RotateCw, { size: 12, className: "animate-spin-slow" })}
                                                    Retrograde
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-xl font-black text-slate-800 mb-1">{planet.name || "Unknown"}</h3>
                                            <p className="font-bold text-lg" style={{ color: meta.color }}>{signName}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-400 font-medium tracking-wide">Normalized</span>
                                                    <span className="text-slate-700 font-bold">{normDegree.toFixed(2)}°</span>
                                                </div>
                                                <div className="h-px bg-slate-100 w-full"></div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-400 font-medium tracking-wide">Full Degree</span>
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
                                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#fd6410]/20 rounded-full blur-3xl group-hover:bg-[#fd6410]/30 transition-colors"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                    <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
                                        {renderIcon(Star, { className: "text-[#fd6410]", size: 32 })}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Celestial Insight</h4>
                                        <p className="text-slate-400 italic">
                                            "Planets are the instruments of fate. By understanding their positions,
                                            we decode the unique vibration of our life's purpose."
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
