"use client";

import { useState, useMemo, useRef } from "react";
import { useLanguageStore } from "@repo/store";
import { dahejTranslations } from "@/lib/translations/calculators/dahej";
import { ResultData, JewelrySet } from "@/lib/types";
import { cars, jewelrySets, landProperties } from "./constants";
import {
    normalizeName,
    hashSeed,
    formatIndianCurrency,
    getJobTier,
    calculateAge,
    getMessageByDahej,
} from "./helpers";

export const useDahejCalculator = () => {
    const { lang, toggleLang } = useLanguageStore();
    const t = dahejTranslations[lang as keyof typeof dahejTranslations] || dahejTranslations.en;

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

    const calculate = async () => {
        if (!canCalculate) return;

        setLoading(true);
        setResult(null);

        await new Promise((r) => setTimeout(r, 800));

        const nameHash = hashSeed(normalizeName(fullName));
        const jobHash = hashSeed(job.toLowerCase());
        const dobHash = hashSeed(dob);

        let baseDahej = 300000 + (nameHash % 29700000);
        const jobTier = getJobTier(job);
        baseDahej *= (0.5 + (jobTier * 0.5));

        const age = calculateAge(dob);
        let ageFactor = 1;
        if (age >= 25 && age <= 30) ageFactor = 1.5;
        else if (age < 22 || age > 35) ageFactor = 0.8;
        baseDahej *= ageFactor;

        const salaryNum = parseFloat(salary);
        baseDahej *= Math.max(0.3, 1000000 / (salaryNum + 1000000));
        baseDahej *= (0.8 + (dobHash % 40) / 100);
        baseDahej = Math.max(300000, Math.min(30000000, baseDahej));

        const carIndex = (nameHash + jobHash) % t.cars.length;
        const jewelryIndex = (dobHash + jobHash) % t.jewelrySets.length;
        const landIndex = (nameHash + dobHash) % t.landProperties.length;

        const selectedCar = t.cars[carIndex] || cars[carIndex] || "";
        const baseJewelry = (jewelrySets[jewelryIndex] || jewelrySets[0])!;
        const transJewelry = t.jewelrySets[jewelryIndex];
        const selectedJewelry: JewelrySet = {
            ...baseJewelry,
            name: transJewelry?.name || baseJewelry.name,
            items: [...(transJewelry?.items || baseJewelry.items)],
            icon: baseJewelry.icon,
        };
        const selectedLand = t.landProperties[landIndex] || landProperties[landIndex] || "";

        let itemTier = lang === "hi" ? "मानक" : "Standard";
        if (baseDahej >= 5000000 && baseDahej < 15000000) itemTier = lang === "hi" ? "प्रीमियम" : "Premium";
        else if (baseDahej >= 15000000) itemTier = lang === "hi" ? "लग्जरी" : "Luxury";

        const messageKey = getMessageByDahej(baseDahej);

        setResult({
            dahej: Math.round(baseDahej),
            formattedDahej: formatIndianCurrency(baseDahej, lang === "hi" ? { lakh: "लाख", cr: "करोड़" } : { lakh: "Lakh", cr: "Cr" }),
            age,
            jobTier,
            itemTier,
            breakdown: {
                name: 20 + (nameHash % 30),
                job: 25 + (jobTier * 10),
                age: Math.max(10, Math.min(40, 50 - Math.abs(age - 28) * 2)),
                salary: Math.max(5, Math.min(30, salaryNum / 100000)),
            },
            includedItems: {
                car: selectedCar,
                jewelry: selectedJewelry,
                land: selectedLand,
            },
            message: t.messages[messageKey],
        });

        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);

        setLoading(false);
    };

    return {
        lang, toggleLang, t, fullName, setFullName, job, setJob, dob, setDob,
        salary, setSalary, loading, result, resultsRef, canCalculate, calculate
    };
};
