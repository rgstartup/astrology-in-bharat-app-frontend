export interface EarningsItem {
    date: string;
    earnings: number;
}

export interface CommissionItem {
    name: string;
    value: number;
}

export interface PayoutItem {
    date: string;
    amount: string;
    status: "Processed" | "Pending" | "Cancelled"; // Assuming Cancelled is a possibility based on typical status, inferred "Processed" | "Pending" from file
}

export type TimeRange =
    | "lastWeek"
    | "thisWeek"
    | "lastMonth"
    | "thisMonth"
    | "lastYear"
    | "thisYear";
