export interface CustomService {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface TeamMember {
  name: string;
  role: string;
  exp: string;
  avatar: string;
  specialty: string;
}

export interface ExpertProfile {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  name?: string;
  image?: string;
  specialization: string;
  expertise?: string;
  experience_in_years: number;
  experience?: number;
  languages: string[];
  price: number;
  rating: number;
  ratings?: number;
  is_available: boolean;
  is_online?: boolean;
  video?: string;
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;
  report_price?: number;
  horoscope_price?: number;
  total_likes?: number;
  bio?: string;
  about?: string;
  detailed_experience?: any[];
  gallery?: string[];
  videos?: string[];
  custom_services?: CustomService[] | string;
}

// Component Props & State Types
export interface ExpertFilterState {
  language: string;
  minPrice: number;
  maxPrice: number;
  addressState: string;
  serviceType: string;
  minRating: number;
  onlyOnline: boolean;
  sortBy: string;
}

export interface ExpertFilterModalProps {
  show: boolean;
  onHide: () => void;
  localFilter: ExpertFilterState;
  setLocalFilter: (filter: ExpertFilterState) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

export interface ExpertSortModalProps {
  show: boolean;
  onHide: () => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  applySort: () => void;
}

export interface ExpertListHeaderProps {
  title?: string;
  hasActiveFilters: boolean;
  onOpenFilter: () => void;
  onOpenSort: () => void;
}

export interface ExpertListWrapperProps {
  searchParams: Record<string, string | string[] | undefined>;
  layout?: "slider" | "grid";
  title?: string;
}

export interface ExpertSectionProps {
  team: TeamMember[];
}

export interface ExpertCardProps {
  expertData: ExpertProfile;
  cardClassName?: string;
}

export const expertSpecializations = [
  "Numerology",
  "Vedic",
  "Zodiac Compatibility",
  "Astrocartography",
  "Lunar Node Analysis",
  "Love Problem Solution",
  "Marriage Problem",
  "Divorce Problem Solution",
  "Breakup Problem Solution",
  "Get Your Ex Love Back",
  "Family Problem Solution",
  "Dispute Solution",
  "Childless Couple Solution",
];
