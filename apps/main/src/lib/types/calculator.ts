import React from "react";

// Dahej / Dowry Calculator
export interface JewelrySet {
    name: string;
    items: string[];
    icon: React.ReactNode;
}

export interface ResultData {
    dahej: number;
    formattedDahej: string;
    age: number;
    jobTier: number;
    itemTier: string;
    breakdown: {
        name: number;
        job: number;
        age: number;
        salary: number;
    };
    includedItems: {
        car: string;
        jewelry: JewelrySet;
        land: string;
    };
    message: string;
}

export interface DahejFormProps {
    t: any;
    fullName: string;
    setFullName: (val: string) => void;
    job: string;
    setJob: (val: string) => void;
    dob: string;
    setDob: (val: string) => void;
    salary: string;
    setSalary: (val: string) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
}

export interface DahejHeroProps {
    lang: string;
    toggleLang: () => void;
    t: any;
}

export interface DahejResultProps {
    result: ResultData;
    t: any;
}

export interface ProgressBarProps {
    label: string;
    value: number;
    max?: number;
}

export interface IncludedItemCardProps {
    icon: React.ReactNode;
    title: string;
    items: string[];
    description?: string;
}

// Breakup Patchup Calculator
export interface BreakupPatchupResult {
    patchup: number;
    breakup: number;
    advice: string;
}

export interface BreakupPatchupFormProps {
    yourName: string;
    setYourName: (val: string) => void;
    partnerName: string;
    setPartnerName: (val: string) => void;
    yourAge: string;
    setYourAge: (val: string) => void;
    partnerAge: string;
    setPartnerAge: (val: string) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
    t?: any;
    fontStyle?: React.CSSProperties;
}

// Life Path Calculator
export type LifePathNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33;

export interface LifePathResult {
    lifePath: LifePathNumber;
    title: string;
    message: string;
}

export interface LifePathFormProps {
    dob: string;
    setDob: (val: string) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
    t?: any;
    fontStyle?: React.CSSProperties;
}

// Love Compatibility Calculator
export interface LoveCompatibilityResult {
    love: number;
    trust: number;
    romance: number;
    communication: number;
    message: string;
}

export interface LoveCompatibilityFormProps {
    maleName: string;
    setMaleName: (val: string) => void;
    femaleName: string;
    setFemaleName: (val: string) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
    t?: any;
    fontStyle?: React.CSSProperties;
}

// Common Calculator UI Props
export interface CalculatorProgressBarProps {
    label: string;
    value: number;
}

export type CalculatorHeroProps = {
    title: string;
    subtitle: string;
    icon: React.ElementType;
};

// Zodiac Compatibility Calculator
export type ElementType = "Fire" | "Earth" | "Air" | "Water";

export type ZodiacSign =
    | "Aries"
    | "Taurus"
    | "Gemini"
    | "Cancer"
    | "Leo"
    | "Virgo"
    | "Libra"
    | "Scorpio"
    | "Sagittarius"
    | "Capricorn"
    | "Aquarius"
    | "Pisces";

export interface CompatibilityResult {
    percentage: number;
    category: string;
    message: string;
    trust: number;
    romance: number;
    communication: number;
    strengths: string[];
    challenges: string[];
    yourElement: ElementType;
    partnerElement: ElementType;
}

export interface ZodiacCompatibilityResultProps {
    result: CompatibilityResult;
    yourSign: ZodiacSign;
    partnerSign: ZodiacSign;
}

export interface ZodiacCompatibilityFormProps {
    yourSign: ZodiacSign;
    partnerSign: ZodiacSign;
    loading: boolean;
    setYourSign: (sign: ZodiacSign) => void;
    setPartnerSign: (sign: ZodiacSign) => void;
    handleSwap: () => void;
    handleCalculate: (e: React.FormEvent) => void;
}

// Soulmate Name Initials
export type SoulmateResult = {
    initials: string[];
    luckyMonth: string;
};

export interface SoulmateNameInitialsFormProps {
    name: string;
    setName: (val: string) => void;
    dob: string;
    setDob: (val: string) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
    t?: any;
    fontStyle?: React.CSSProperties;
}

// Relationship Future Timeline
export type RelationshipType = "Crush" | "Dating" | "Married";

export type TimelineItem = {
    title: string;
    percent: number;
    label: string;
    message: string;
};

export type TimelineResult = {
    mood7: TimelineItem;
    bond30: TimelineItem;
    stability180: TimelineItem;
    summary: string;
};

export interface RelationshipFutureTimelineFormProps {
    yourName: string;
    setYourName: (val: string) => void;
    partnerName: string;
    setPartnerName: (val: string) => void;
    relationshipType: RelationshipType;
    setRelationshipType: (val: RelationshipType) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
    t?: any;
    fontStyle?: React.CSSProperties;
}

// Planet Calculator
export interface PlanetFormProps {
    formData: {
        year: number;
        month: number;
        date: number;
        hours: number;
        minutes: number;
        seconds: number;
        latitude: string;
        longitude: string;
        timezone: number;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleLocationSelect: (loc: { name: string; lat: string; lon: string }) => void;
    locationName: string;
    loading: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    renderIcon: (IconComponent: any, props?: any) => React.ReactNode;
    t?: any;
    fontStyle?: React.CSSProperties;
}

// Name Numerology
export type NameNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22;

export type NameResult = {
    nameNumber: NameNumber;
    vibe: string;
    totalBeforeReduce: number;
};

export interface NameNumerologyFormProps {
    fullName: string;
    setFullName: (val: string) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
    t?: any;
    fontStyle?: React.CSSProperties;
}

// Nakshatra Finder
export type NakshatraResult = {
    name: string;
    nature: string;
    index: number;
};

export interface NakshatraFinderFormProps {
    dob: string;
    setDob: (val: string) => void;
    birthTime: string;
    setBirthTime: (val: string) => void;
    locationName: string;
    setLocationName: (val: string) => void;
    setLatitude: (val: string) => void;
    setLongitude: (val: string) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
    t?: any;
    fontStyle?: React.CSSProperties;
}

// Marriage Age
export type MarriageResult = {
    startAge: number;
    endAge: number;
    bestYear: number;
    hasDob: boolean;
};

export interface MarriageAgeFormProps {
    name: string;
    setName: (val: string) => void;
    dob: string;
    setDob: (val: string) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
    t?: any;
    fontStyle?: React.CSSProperties;
}

// Lucky Vibes
export interface LuckyResult {
    luckyNumber: number;
    luckyColor: string;
    secondaryColor: string;
    luckyDay: string;
    element: string;
    dobNumber: number;
    nameNumber: number;
    message: string;
}

export interface LuckyVibesResultProps {
    result: LuckyResult;
}

export interface LuckyVibesFormProps {
    fullName: string;
    dob: string;
    zodiac: ZodiacSign;
    loading: boolean;
    canCalculate: boolean;
    setFullName: (name: string) => void;
    setDob: (dob: string) => void;
    setZodiac: (zodiac: ZodiacSign) => void;
    handleCalculate: (e: React.FormEvent) => void;
}

// Loyal Partner
export type LoyaltyResult = {
    loyalty: number;
    reason: string;
};

export interface LoyalPartnerFormProps {
    yourName: string;
    setYourName: (val: string) => void;
    partnerName: string;
    setPartnerName: (val: string) => void;
    yourDob: string;
    setYourDob: (val: string) => void;
    partnerDob: string;
    setPartnerDob: (val: string) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
    t?: any;
    fontStyle?: React.CSSProperties;
}

// Flames
export type FlamesLetter = "F" | "L" | "A" | "M" | "E" | "S";

export type FlamesResult = {
    letter: FlamesLetter;
    word: string;
    count: number;
    message: string;
};

export interface FlamesFormProps {
    boyName: string;
    setBoyName: (val: string) => void;
    girlName: string;
    setGirlName: (val: string) => void;
    loading: boolean;
    canCalculate: boolean;
    handleCalculate: (e: React.FormEvent) => void;
    t?: any;
    fontStyle?: React.CSSProperties;
}
