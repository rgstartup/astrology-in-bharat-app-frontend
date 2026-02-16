export interface Review {
  id: number;
  user: string;
  astrologer: string;
  rating: number;
  comment: string;
  date: string;
  status: "approved" | "pending" | "flagged";
  avatar: string;
}



