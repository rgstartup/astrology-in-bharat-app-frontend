export interface ReviewStat {
  stars: number;
  count: number;
}

export interface Review {
  id: string;
  name: string;
  img: string;
  rating: number;
  review: string;
}
export interface ProductReview {
  name: string;
  img: string;
  rating: number;
  text: string;
}

export interface ReviewsProps {
  avgRating: number;
  totalRatings: number;
  reviewStats: ReviewStat[];
}

export interface Store {
    id: string | number;
    name: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    image: string;
    video?: string;
    isTrusted?: boolean;
    popularProducts?: string[];
    rating: number;
    reviewCount: number;
    description: string;
    established: string;
    email: string;
    gallery: string[];
    features: string[];
    operationalHours?: string;
    trustScore?: string | number;
    likesCount?: number;
    productsCount?: number;
    isLiked?: boolean;
    isOnline?: boolean;
}
