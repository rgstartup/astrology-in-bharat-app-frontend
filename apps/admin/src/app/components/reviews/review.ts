export interface Review {
  id: string;
  user: string;
  expert: string;
  rating: number;
  comment: string;
  date: string;
  status: "approved" | "pending" | "flagged";
  avatar: string;
  sessionId?: string;
}



