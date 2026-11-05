import { Expert } from "@repo/lib";

export interface ExpertProfileCardProps {
  expert: Expert;
  isAvailable?: boolean;
  isBusy?: boolean;
  onChatClick: () => void;
  onCallClick: () => void;
  onVideoCallClick: () => void;
  onVideoClick: (url: string) => void;
}

export interface ProfileHeroBannerProps {
  expertId: string | number;
  name: string;
  avatar: string;
  primaryProfession: string;
  isOnline: boolean;
  currentBusy: boolean;
  videoUrl?: string | null;
  onVideoClick: (url: string) => void;
}

export interface ProfileStatsStripProps {
  expYears: number;
  ratingValue: string;
  currentLikesFormatted: string;
}

export interface ConsultationActionsProps {
  chatPrice: number;
  callPrice: number;
  videoCallPrice: number;
  onChatClick: () => void;
  onCallClick: () => void;
  onVideoCallClick: () => void;
}

export interface ExpertiseOverviewProps {
  specializations: string[];
  consultFormatted: string;
  languagesList: string;
}

export interface TrustFooterProps {
  reportPrice?: number;
  horoscopePrice?: number;
}
