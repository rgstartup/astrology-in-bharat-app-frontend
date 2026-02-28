"use client";
import React, { useMemo, useRef, useState } from "react";
import {
    FaUser,
    FaArrowRight,
    FaStar,
    FaBalanceScale,
    FaSpinner,
    FaBriefcase,
    FaBirthdayCake,
    FaMoneyBillWave,
    FaCar,
    FaGem,
    FaHome,
} from "react-icons/fa";
import { TbCrystalBall } from "react-icons/tb";
import {
    GiStarShuriken,
    GiSparkles,
    GiGoldBar,
    GiDiamonds,
} from "react-icons/gi";

import { ResultData } from "./types";
import {
    premiumStyles,
    cars,
    jewelrySets,
    landProperties,
} from "./constants";
import {
    normalizeName,
    hashSeed,
    formatIndianCurrency,
    getJobTier,
    calculateAge,
    getMessageByDahej,
} from "./helpers";
import { ProgressBar } from "./ProgressBar";
import { IncludedItemCard } from "./IncludedItemCard";

const DahejCalculatorPage = () => {
    const [fullName, setFullName] = useState("");
    const [job, setJob] = useState("");
    const [dob, setDob] = useState("");
    const [salary, setSalary] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResultData | null>(null);

    const resultsRef = useRef<HTMLDivElement>(null);

    const canCalculate = useMemo(() => {
        return normalizeName(fullName).length > 0 &&
            job.trim().length > 0 &&
            dob &&
            salary &&
            !isNaN(parseFloat(salary));
    }, [fullName, job, dob, salary]);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canCalculate) return;

        setLoading(true);
        setResult(null);

        await new Promise((r) => setTimeout(r, 800));

        const nameHash = hashSeed(normalizeName(fullName));
        const jobHash = hashSeed(job.toLowerCase());
        const dobHash = hashSeed(dob);

        // Calculate base dahej
        let baseDahej = 300000 + (nameHash % 29700000);

        const jobTier = getJobTier(job);
        const jobMultiplier = 0.5 + (jobTier * 0.5);
        baseDahej *= jobMultiplier;

        const age = calculateAge(dob);
        let ageFactor = 1;
        if (age >= 25 && age <= 30) ageFactor = 1.5;
        else if (age < 22 || age > 35) ageFactor = 0.8;
        baseDahej *= ageFactor;

        const salaryNum = parseFloat(salary);
        let salaryFactor = Math.max(0.3, 1000000 / (salaryNum + 1000000));
        baseDahej *= salaryFactor;

        const randomFactor = 0.8 + (dobHash % 40) / 100;
        baseDahej *= randomFactor;

        baseDahej = Math.max(300000, Math.min(30000000, baseDahej));

        // Calculate breakdown
        const nameContribution = 20 + (nameHash % 30);
        const jobContribution = 25 + (jobTier * 10);
        const ageContribution = Math.max(10, Math.min(40, 50 - Math.abs(age - 28) * 2));
        const salaryContribution = Math.max(5, Math.min(30, salaryNum / 100000));

        // Select items based on hash
        const carIndex = (nameHash + jobHash) % cars.length;
        const jewelryIndex = (dobHash + jobHash) % jewelrySets.length;
        const landIndex = (nameHash + dobHash) % landProperties.length;

        const selectedCar = cars[carIndex];
        const selectedJewelry = jewelrySets[jewelryIndex];
        const selectedLand = landProperties[landIndex];

        // Determine item tier based on dahej amount
        let itemTier = "Standard";
        if (baseDahej >= 5000000 && baseDahej < 15000000) itemTier = "Premium";
        else if (baseDahej >= 15000000) itemTier = "Luxury";

        const message = getMessageByDahej(baseDahej);

        setResult({
            dahej: Math.round(baseDahej),
            formattedDahej: formatIndianCurrency(baseDahej),
            age,
            jobTier,
            itemTier,
            breakdown: {
                name: nameContribution,
                job: jobContribution,
                age: ageContribution,
                salary: salaryContribution,
            },
            includedItems: {
                car: selectedCar,
                jewelry: selectedJewelry,
                land: selectedLand,
            },
            message,
        });

        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#fffaf7] selection:bg-[#d4af37]/20 uppercase">
            <style dangerouslySetInnerHTML={{ __html: premiumStyles }} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#301118] via-[#4a1c26] to-[#301118] text-white overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#d4af37] opacity-[0.05] rounded-full blur-[100px] animate-pulse-soft"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary opacity-[0.03] rounded-full blur-[100px] animate-pulse-soft"></div>

                    <div className="absolute top-[18%] right-[10%] opacity-10 animate-float">
                        <GiGoldBar size={180} className="text-white" />
                    </div>
                    <div className="absolute bottom-[15%] left-[8%] opacity-5 animate-spin-slow">
                        <GiDiamonds size={250} className="text-white font-thin" />
                    </div>
                    <div
                        className="absolute top-[45%] left-[15%] opacity-10 animate-float"
                        style={{ animationDelay: "2s" }}
                    >
                        <GiStarShuriken size={80} className="text-[#d4af37]" />
                    </div>
                </div>

                <div className="container relative z-10 px-6">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <span className="inline-block bg-[#d4af37] text-[#301118] px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[4px] mb-8">
                            Premium Dahej Estimation
                        </span>

                        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-none overflow-visible py-2">
                            Dahej{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37]">
                                Calculator
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-orange-100/60 leading-relaxed font-light italic mb-12">
                            A complete estimation including car, jewelry, and land properties. For entertainment purposes only!
                        </p>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="container px-6">
                    <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(48,17,24,0.1)] border-t-4 border-t-[#d4af37]/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
                            <GiGoldBar size={150} />
                        </div>

                        <div className="text-center mb-10">
                            <h2 className="text-xl md:text-3xl font-black text-[#301118] mb-2 tracking-tight">
                                Enter Details for <span className="text-[#d4af37] underline decoration-[#d4af37]/30 decoration-2 underline-offset-4">Complete Estimation</span>
                            </h2>
                            <p className="text-sm text-[#301118]/50 italic mt-2">
                                *This calculator is purely for entertainment and fun. All results are randomly generated.
                            </p>
                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2"></div>
                        </div>

                        <form onSubmit={handleCalculate} className="max-w-3xl mx-auto">
                            <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-[#301118]/5 relative overflow-hidden bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                style={{ borderRadius: "9999px" }}
                                                className="w-full bg-[#fdf8f2] border-2 border-[#301118]/5 px-5 py-3.5 text-[#301118] font-bold focus:border-[#d4af37] outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                                                placeholder="Enter full name..."
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#301118]/30">
                                                <FaUser size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profession */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1">
                                            Profession
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                style={{ borderRadius: "9999px" }}
                                                className="w-full bg-[#fdf8f2] border-2 border-[#301118]/5 px-5 py-3.5 text-[#301118] font-bold focus:border-[#d4af37] outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                                                placeholder="e.g., Engineer, Doctor, Teacher"
                                                value={job}
                                                onChange={(e) => setJob(e.target.value)}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#301118]/30">
                                                <FaBriefcase size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1">
                                            Date of Birth
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                required
                                                style={{ borderRadius: "9999px" }}
                                                className="w-full bg-[#fdf8f2] border-2 border-[#301118]/5 px-5 py-3.5 text-[#301118] font-bold focus:border-[#d4af37] outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#301118]/30">
                                                <FaBirthdayCake size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Annual Salary */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#301118]/60 uppercase tracking-widest pl-1">
                                            Annual Salary (₹)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="10000"
                                                style={{ borderRadius: "9999px" }}
                                                className="w-full bg-[#fdf8f2] border-2 border-[#301118]/5 px-5 py-3.5 text-[#301118] font-bold focus:border-[#d4af37] outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                                                placeholder="e.g., 800000"
                                                value={salary}
                                                onChange={(e) => setSalary(e.target.value)}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#301118]/30">
                                                <FaMoneyBillWave size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-10">
                                    <button
                                        type="submit"
                                        disabled={loading || !canCalculate}
                                        style={{ borderRadius: "9999px" }}
                                        className="relative group inline-flex items-center gap-3 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#301118] px-10 py-4 font-black uppercase tracking-[2px] text-xs hover:opacity-90 transition-all duration-500 shadow-xl disabled:opacity-50"
                                    >
                                        {loading ? <FaSpinner className="animate-spin" /> : <TbCrystalBall size={18} />}
                                        {loading ? "Calculating..." : "Estimate Dahej"}
                                        <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <p className="text-xs text-[#301118]/40 mt-3 italic">
                                        Note: Results are randomly generated for entertainment
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-center">
                                <div className="w-full h-2 bg-[#d4af37]/20 rounded-full blur-lg translate-y-2 opacity-50"></div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Result Section */}
            <div ref={resultsRef}>
                {result && (
                    <section className="py-24 bg-white relative overflow-hidden">
                        <div className="container px-6">
                            <div className="max-w-6xl mx-auto">
                                <div className="glass-card rounded-[3.5rem] p-8 md:p-16 shadow-[0_30px_70px_rgba(48,17,24,0.15)] border border-[#301118]/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] animate-spin-slow pointer-events-none">
                                        <GiGoldBar size={300} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="text-center mb-16">
                                            <span className="inline-block bg-[#d4af37]/10 text-[#d4af37] px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                                                Complete Estimation Results
                                            </span>

                                            <h2 className="text-4xl md:text-6xl font-black text-[#301118] mb-6 tracking-tight">
                                                Your <span className="text-[#d4af37]">Dahej Package</span>
                                            </h2>
                                            <p className="text-lg text-[#301118]/60 mb-4">
                                                Tier: <span className="font-black text-[#d4af37]">{result.itemTier}</span> Package
                                            </p>
                                            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-16"></div>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            {/* Main Amount Display */}
                                            <div className="relative mb-16">
                                                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-yellow-50 relative group">
                                                    <div className="absolute inset-0 rounded-full border-8 border-[#d4af37] border-t-transparent animate-spin-slow opacity-20"></div>
                                                    <div className="text-center">
                                                        <span className="block text-4xl md:text-6xl font-black text-[#301118] leading-none group-hover:scale-110 transition-transform duration-500">
                                                            {result.formattedDahej}
                                                        </span>
                                                        <span className="text-[12px] font-black uppercase tracking-[4px] text-[#d4af37] mt-4 block">
                                                            Total Estimated Value
                                                        </span>
                                                    </div>
                                                    <GiDiamonds className="absolute -top-4 -right-4 text-[#d4af37] text-5xl animate-bounce shadow-xl" />
                                                </div>
                                            </div>

                                            {/* Message */}
                                            <div className="max-w-2xl text-center mb-14">
                                                <div className="bg-[#301118] text-white p-10 rounded-[3rem] shadow-2xl relative">
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] p-4 rounded-2xl shadow-lg">
                                                        <GiSparkles size={28} />
                                                    </div>
                                                    <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                                                        "{result.message}"
                                                    </p>
                                                    <p className="text-sm text-orange-100/60 mt-4 italic">
                                                        Age: {result.age} years | Profession Tier: {result.jobTier}/4
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Included Items Section */}
                                            {result && result.includedItems && (
                                                <div className="w-full mb-16">
                                                    <div className="text-center mb-12">
                                                        <h3 className="text-3xl font-black text-[#301118] mb-4 tracking-tight">
                                                            What's Included
                                                        </h3>
                                                        <p className="text-[#301118]/60 max-w-2xl mx-auto">
                                                            Your estimated dahej package includes the following premium items:
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                                        {/* Car */}
                                                        <IncludedItemCard
                                                            icon={<FaCar size={28} className="text-[#d4af37]" />}
                                                            title="Car"
                                                            items={[result.includedItems.car]}
                                                            description="Premium vehicle for comfortable transportation"
                                                        />

                                                        {/* Jewelry */}
                                                        <IncludedItemCard
                                                            icon={<FaGem size={28} className="text-[#d4af37]" />}
                                                            title={result.includedItems.jewelry.name}
                                                            items={result.includedItems.jewelry.items}
                                                            description="Exclusive jewelry set for special occasions"
                                                        />

                                                        {/* Land */}
                                                        <IncludedItemCard
                                                            icon={<FaHome size={28} className="text-[#d4af37]" />}
                                                            title="Land Property"
                                                            items={[result.includedItems.land]}
                                                            description="Prime real estate for future development"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Breakdown */}
                                            <div className="w-full max-w-3xl bg-[#fffcf6] rounded-[3rem] p-8 md:p-12 border border-yellow-100">
                                                <div className="flex items-center justify-between mb-10">
                                                    <h4 className="text-xl font-black text-[#301118] tracking-tight m-0">
                                                        Estimation Factors
                                                    </h4>
                                                    <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-yellow-50 flex items-center gap-2">
                                                        <FaStar className="text-[#d4af37]" size={14} />
                                                        <span className="text-xs font-black text-[#d4af37] uppercase tracking-widest">
                                                            Contribution Weight
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-8">
                                                    <ProgressBar label="Name Influence" value={result.breakdown.name} max={50} />
                                                    <ProgressBar label="Profession Impact" value={result.breakdown.job} max={50} />
                                                    <ProgressBar label="Age Factor" value={result.breakdown.age} max={50} />
                                                    <ProgressBar label="Salary Consideration" value={result.breakdown.salary} max={50} />
                                                </div>

                                                <div className="mt-10 flex items-start gap-4 bg-white rounded-2xl p-6 border border-yellow-50 shadow-sm">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                                                        <FaBalanceScale size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="m-0 text-sm font-black text-[#301118]">
                                                            Remember!
                                                        </p>
                                                        <p className="m-0 text-sm text-gray-500 italic leading-relaxed">
                                                            True partnerships are built on love, respect, and mutual understanding—not material possessions. This calculator is for entertainment only.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Disclaimer */}
                                            <div className="mt-12 p-6 bg-red-50 border border-red-100 rounded-2xl max-w-2xl">
                                                <p className="text-sm text-red-600 text-center italic">
                                                    ⚠️ <strong>Important Disclaimer:</strong> This calculator is purely for entertainment purposes.
                                                    Dowry (Dahej) is illegal in India under the Dowry Prohibition Act, 1961.
                                                    We strongly discourage the practice of dowry and promote equality in partnerships.
                                                </p>
                                            </div>
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

export default DahejCalculatorPage;
