export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  lastConsultation: {
    date: string;
    duration: string;
    type: "call" | "video" | "chat";
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