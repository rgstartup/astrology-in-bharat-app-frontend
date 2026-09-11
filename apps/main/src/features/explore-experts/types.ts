import { Expert } from "@repo/lib";

export type SortOption =
  | "recommended"
  | "rating_desc"
  | "price_asc"
  | "price_desc"
  | "experience_desc"
  | "newest";

export type ConsultationMode = "all" | "chat" | "audio" | "video";

export interface ExploreFilterState {
  searchQuery: string;
  selectedSpecializations: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  minExperience: number;
  languages: string[];
  onlyOnline: boolean;
  serviceType: ConsultationMode;
  sortBy: SortOption;
}

export interface ExploreExpertsProps {
  initialExperts?: Expert[];
  initialPagination?: {
    total: number;
    hasMore: boolean;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  initialError?: string;
}
