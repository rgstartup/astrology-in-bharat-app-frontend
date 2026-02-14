export interface Client {
    id: number;
    name: string;
    avatar?: string;
    phone: string;
    email: string;
    lastConsultation: {
        date: string;
        duration: string;
        type: string;
    };
    rating: number;
    review: string;
    payment: number;
}

export type SortKey = "lastConsultation.date" | "payment" | null;

export interface SortConfig {
    key: SortKey;
    direction: "ascending" | "descending";
}
