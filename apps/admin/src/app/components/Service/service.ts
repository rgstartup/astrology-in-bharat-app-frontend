export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  price: number;
  discountedPrice: number;
  status: "active" | "inactive";
  bookings: number;
  rating: number;
  popularity: "high" | "medium" | "low";
}



