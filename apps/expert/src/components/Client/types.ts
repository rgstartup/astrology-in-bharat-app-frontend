export interface Client {
    id: string;
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
    terminatedBy?: string;
}

export type SortKey = "lastConsultation.date" | "payment" | null;

export interface SortConfig {
    key: SortKey;
    direction: "ascending" | "descending";
}


