export interface EarningsData {
    date: string;
    earnings: number;
}

export interface CommissionData {
    name: string;
    value: number;
}

export interface PayoutHistory {
    date: string;
    amount: string;
    status: "Processed" | "Pending";
}

export type TimeRange =
    | "lastWeek"
    | "thisWeek"
    | "lastMonth"
    | "thisMonth"
    | "lastYear"
    | "thisYear";
