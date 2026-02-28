import React from "react";

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
